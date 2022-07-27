import { waves_info } from "../lib/waves.js";
import { get_gamesave, get_account_username } from "../util/localstorage.js";

export const gamecheck = { };

gamecheck.level = function() {
  const savestring = get_gamesave();
  if (savestring.length <= 0) return false;
  const o = JSON.parse(savestring);
  return (o != null && o.send != null && !o.send.game_ended && o.player.username == get_account_username()) 
          ? waves_info[o.send.wave_name].name : false;
}