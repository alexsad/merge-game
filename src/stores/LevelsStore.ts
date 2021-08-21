import create from 'zustand';
import { ILevel } from '../interfaces/i-level';
import { openDB } from 'idb/with-async-ittr.js';

export default create<{
    levels: ILevel[],
    fetchLevels: () => void;
}>(set => ({
    levels: [],
    fetchLevels:async () => {
        const dbPromise = openDB('level-store', 1, {
            upgrade(db) {
              db.createObjectStore('levels');
            },
        });
        const levelPromise = (await dbPromise).getAllKeys('levels');
        const levelFromPromise = await levelPromise;
        const firstLevel = levelFromPromise.length === 0 ? [1]: [];
        set({
            levels: [...levelFromPromise, ...firstLevel].map((value) => ({
                levelNumber: Number(value),
                bestTime: 0,
                data: []
            }))
        });
        (await dbPromise).close();
    }
}));
