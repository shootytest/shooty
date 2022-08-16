import { upgrades } from "../lib/upgrades.js";
import { waves_info, wave_ratings } from "../lib/waves.js";
import { worlds } from "../lib/worlds.js";
import { firebase } from "../util/firebase.js";
import { get_account_username } from "../util/localstorage.js";

// hmmm
/* progress: level progress, player unlock progress, other progress stuff... (just some functions) */

export const progress = { };

progress.user_scores = { };
progress.user_players = { };

// uses firebase!
// replace all "listen" with "get" for less firebase usage or lag?
progress.init = function(world_key) {
  const user = get_account_username();
  const W = worlds[world_key];
  for (const level_key in W.levels) {
    const L = W.levels[level_key];
    if (L == null || L.conditions == null) continue;
    for (const condition of L.conditions) {
      if (condition.type === "player") {

      } else { // condition.type === "level"
        const level_key = condition.level;
        const use_key = condition.use || "best";
        const db_string = `/scores/${user}/${level_key}/${use_key}/`;
        if (progress.user_scores[level_key] == null) progress.user_scores[level_key] = { };
        if (progress.user_scores[level_key][use_key] == null) progress.user_scores[level_key][use_key] = { };
        const entry = progress.user_scores[level_key][use_key];
        if (condition.rating != null) {
          firebase.listen(db_string + "rating", function(rating) {
            entry.rating = rating;
          });
        } else if (condition.rounds != null) {
          firebase.listen(db_string + "rounds", function(rounds) {
            entry.rounds = rounds;
          });
        } else if (condition.points != null) {
          firebase.listen(db_string + "points", function(points) {
            entry.points = points;
          });
        }
      }
    }
  }
}

// checks a level condition
// returns a number from 0 to 1 indicating how complete the condition is
progress.check_condition = function(condition) {

  const scores = progress.user_scores;

  if (condition.type === "player") {
    return 0; // TODO: player condition
  } else { // condition.type === "level"
    const level_key = condition.level;
    const use_key = condition.use || "best";
    if (condition.rating != null) {
      const rating = scores[level_key][use_key].rating;
      if (rating != null) {
        return (wave_ratings.length - rating) / (wave_ratings.length - condition.rating);
      } else {
        return 0;
      }
    } else if (condition.rounds != null) {
      const rounds = scores[level_key][use_key].rounds;
      if (rounds != null) {
        return (rounds + 1) / (condition.rounds + 1);
      } else {
        return 0;
      }
    } else if (condition.points != null) {
      const points = scores[level_key][use_key].points || 0;
      return points / condition.points;
    }
  }

  return 0;
}

// for convenience (returns a list of percentages)
// the callback will called n times (with values "index, ratio")
progress.check_conditions = function(conditions) {
  if (conditions == null) return [];
  const result = [ ];
  for (const condition of conditions) {
    result.push(progress.check_condition(condition));
  }
  return result;
}

// for even more convenience
progress.are_conditions_met = function(conditions) {
  const result = progress.check_conditions(conditions);
  for (const r of result) {
    if (r < 1) return false;
  }
  return true;
}

// helper function for generating level condition text
progress.level_condition_text = function(condition) {
  let result = "";
  if (condition.type === "player") {
    // TODO: player condition
  } else { // condition.type === "level"
    if (condition.rating != null) {
      const rating_name = wave_ratings[condition.rating];
      result = `Get at least a${rating_name.charAt(0).toUpperCase() === 'A' ? "n" : ""} ${rating_name} for`;
    } else if (condition.rounds != null) {
      const round_number = condition.rounds || 0;
      result = `Complete round ${round_number} of`
    } else if (condition.points != null) {
      result = `Get at least ${condition.points || 0} points for`
    }
    result += ` ${waves_info[condition.level].name}`;
    if (condition.use != null) {
      result += ` using ${upgrades[condition.use].name}`;
    }
  }
  return result;
}

// TODO: remove (just for debugging)
window.progress = progress;