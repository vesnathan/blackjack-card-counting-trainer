import { openDB } from 'idb';


// eslint-disable-next-line no-unused-vars
const initGamesDb = async () => {
  try {
    openDB('BJCTTGames', 1, {
      upgrade(db) {
        if (db.objectStoreNames.contains('BJCTTGames')) {
          return;
        }
        db.createObjectStore('BJCTTGames', { keyPath: 'id', autoIncrement: true });
      },
    });
  } catch (err) {
    console.log("ERROR: IDB BJCTTGames NOT CREATED")
  }
}

initGamesDb();