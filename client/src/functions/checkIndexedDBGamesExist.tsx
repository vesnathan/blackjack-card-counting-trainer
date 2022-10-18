import { gamesExistIndexDB } from "../storage/indexedDB/functions";

const checkIndexedDBGamesExist = async () => {

  const games = await gamesExistIndexDB();
    console.log("games", games)
    // if the user has a game saved locally, load that.
    if (games.length !== 0 ) {
      return games[0];
    }
    
    // if user hasn't got a saved local game, the prob havent yet joined, show the join form
    else {
      return null;
    }
}
export default checkIndexedDBGamesExist;