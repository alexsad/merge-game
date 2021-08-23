import { openDB } from 'idb/with-async-ittr.js';

const openLevelStore = () => {
    const dbPromise = openDB('level-store', 1, {
        upgrade(db) {
          db.createObjectStore('levels');
        },
    });
    return dbPromise;
}


export default openLevelStore;