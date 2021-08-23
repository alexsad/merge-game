import create from 'zustand';
import { ILevel } from '../interfaces/i-level';
import openLevelStore from './idb-level-store';

interface ILevelConfig {
    [key:string]: {
        maxLevel: number,
        increaseFactor: number,
        spaceSize: number
    }
}

const getLevelConfig = (levelNumber: number) => {
    const levelsConfig: ILevelConfig = {
        "easy": {
            maxLevel: 29,
            increaseFactor: 2,
            spaceSize: 4
        },
        "medium": {
            maxLevel: 59,
            increaseFactor: 2,
            spaceSize: 4
        },
        "hard": {
            maxLevel: 89,
            increaseFactor: 1,
            spaceSize: 5
        },
        "very-hard": {
            maxLevel: 159,
            increaseFactor: 1,
            spaceSize: 6
        }
    };

    const selectedLevelName = Object.keys(levelsConfig).find(levelKey => levelNumber <= levelsConfig[levelKey].maxLevel) || 'very-hard';
    const levelConfig = levelsConfig[selectedLevelName];

    return {
        combinations: parseInt(`${(levelNumber * levelConfig.increaseFactor) / 10}`) + 2, 
        spaceSize: levelConfig.spaceSize,
        levelName: selectedLevelName,
    };
}

export {getLevelConfig};

export default create<{
    levels: ILevel[],
    fetchLevels: () => void;
}>(set => ({
    levels: [],
    fetchLevels:async () => {
        const dbPromise = openLevelStore();
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