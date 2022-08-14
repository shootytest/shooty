import { wave_ratings } from "../lib/waves.js";
import { firebase } from "../util/firebase.js";
import { get_account_username } from "../util/localstorage.js";

// hmmm
/* progress: level progress, player unlock progress, other progress stuff... (just some functions) */

export const progress = { };

// checks a level condition (uses firebase!)
// returns a number from 0 to 1 in the callback indicating how complete the condition is
progress.check_condition = function(condition, callback) {

  const user = get_account_username();

  switch (condition.type) {

    case "level":
      const level_key = condition.level;
      const use_key = condition.use || "best";
      if (condition.rating != null) {
        firebase.get(`/scores/${user}/${level_key}/${use_key}/rating`, function(rating) {
          if (rating != null) {
            ratio += (wave_ratings.length - rating) / (wave_ratings.length - condition.rating);
          }
          callback(ratio / total_ratio);
        });
      } else if (condition.rounds != null) {
        firebase.get(`/scores/${user}/${level_key}/${use_key}/rounds`, function(rounds) {
          if (rounds != null) {
            ratio += rounds / condition.rounds;
          }
          callback(ratio / total_ratio);
        });
      } else if (condition.points != null) {
        firebase.get(`/scores/${user}/${level_key}/${use_key}/points`, function(points) {
          if (points != null) {
            ratio += points / condition.points;
          }
          callback(ratio / total_ratio);
        });
      }
      break;

    default:
      console.error("unknown condition type: " + condition.type);
      break;
  }

  return total_ratio <= 0 ? 0 : ratio / total_ratio;
}

// for convenience (returns a list of percentages)
// the callback will called n times (with values "index, ratio")
progress.check_conditions = function(conditions, callback) {
  for (let index = 0; index < conditions.length; index++) {
    progress.check_condition(conditions[index], (ratio) => callback(index, ratio));
  }
}