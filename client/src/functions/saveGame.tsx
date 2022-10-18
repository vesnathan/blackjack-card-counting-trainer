import { saveGameToIndexDB } from "../storage/indexedDB/functions";

const saveGame = async (chipsTotal: number, scoreTotal: number, playerPosition: number, userStreak: number, gameLevel: number, gameRules: Object) => {

  saveGameToIndexDB({chipsTotal, scoreTotal, playerPosition, userStreak, gameLevel, gameRules});

}
export default saveGame;