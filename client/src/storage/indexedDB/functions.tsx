import { openDB } from 'idb';

export const getGameByUser = async (username: string) => { 
  const BJCTTGames = await openDB('BJCTTGames',1);
  let cursor = await BJCTTGames.transaction("BJCTTGames").store.openCursor();
  while (cursor) {
    if (cursor.value.game.username === username) {
      return {status: "success", userData: cursor.value }
    }
    cursor = await cursor.continue();
  }
  return null;
}

export const gamesExistIndexDB = async () => { 
  const BJCTTGames = await openDB('BJCTTGames',1);
  const tx = BJCTTGames.transaction("BJCTTGames","readonly");
  const store = tx.objectStore("BJCTTGames");
  const request = store.getAll();
  const result = await request;
  return result;
}

export const saveGameToIndexDB = async (gameObject: Object) => {
  const BJCTTGames = await openDB('BJCTTGames', 1);
  const tx = BJCTTGames.transaction('BJCTTGames', 'readwrite');
  const store = tx.objectStore('BJCTTGames');
  await store.put({id: "game",  game: gameObject});
}