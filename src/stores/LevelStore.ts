import create from 'zustand';
import { ILevel } from '../interfaces/i-level';
import { openDB } from 'idb/with-async-ittr.js';

const makeLevel = (combinations: number) => {
    const colors = [
        String.fromCodePoint(0x1F330), 
        String.fromCodePoint(0x1F33D),
        String.fromCodePoint(0x1F34E), 
        String.fromCodePoint(0x1F347),
        String.fromCodePoint(0x1F348), 
        String.fromCodePoint(0x1F34A), 
        String.fromCodePoint(0x1F34B),
        String.fromCodePoint(0x1F95D),
        String.fromCodePoint(0x1F349),
        String.fromCodePoint(0x1F351),
        String.fromCodePoint(0x1F965),
        String.fromCodePoint(0x1F353),
        String.fromCodePoint(0x1F350),
        String.fromCodePoint(0x1F96D),
        String.fromCodePoint(0x1F34F),
        String.fromCodePoint(0x1F352),
        String.fromCodePoint(0x1F951)
    ];
    const spaceSize = 4;
    const recepientMatrixTMP = new Array(combinations + 2);
    recepientMatrixTMP.fill( new Array(4).fill( '' ));        
    const recepientMatrix =  JSON.parse(JSON.stringify(recepientMatrixTMP));
    const getRandomIntInclusive = (pmin: number, pmax: number) => parseInt( `${(Math.random() * pmax) + pmin}` );

    for(let i = 0; i < combinations; i++){
        const color = colors[i];
        for(let a = 0; a < spaceSize; a++){
            let randomRowIndex = 0;
            let randomCollIndex = 0;
            let spaceFounded = false;        
            while(!spaceFounded){
                randomRowIndex = getRandomIntInclusive(0, combinations);
                randomCollIndex = getRandomIntInclusive(0, spaceSize);
                if(recepientMatrix[randomRowIndex][randomCollIndex] === ''){
                    recepientMatrix[randomRowIndex][randomCollIndex] = color;
                    spaceFounded = true;
                }
            }        
        }

    }
    return recepientMatrix;
}

export default create<{
    level: ILevel,
    setLevel: (level: ILevel) => void;
    fetchLevel: (levelNumber: number) => void;
    moveItens: (rowOrigin: number, rowTarget: number) => void;
    finishLevel: () => void;
    recipientIsComplete: (rowIndex: number) => boolean;
    recipientIsEmpty: (rowIndex: number) => boolean;
}>((set, get) => ({
    recipientIsComplete: (rowIndex: number) => {
        if(rowIndex < 0){
            return false;
        }
        const {level:{data}} = get();
        const firstItem = data[rowIndex][0];
        if(firstItem === ''){
            return false;
        }
        return data[rowIndex].every(value => value === firstItem);
    },
    recipientIsEmpty: (rowIndex: number) => {
        if(rowIndex < 0){
            return false;
        }
        const {level:{data}} = get();
        return data[rowIndex][data[rowIndex].length -1] === '';
    },
    level: {
        levelNumber: 1,
        bestTime: 0,
        data:[],
    },
    setLevel:(plevel: ILevel) => {
        const {level} = get();
        set({
            level: {
                ...level,
                ...plevel
            },
        });
    },
    finishLevel: async () => {
        const {level} = get();

        const dbPromise = openDB('level-store', 1, {
            upgrade(db) {
              db.createObjectStore('levels');
            },
        });

        const levelPromise = (await dbPromise).get('levels', level.levelNumber);
        const levelFromPromise = await levelPromise;

        (await dbPromise).put('levels', {
            ...levelFromPromise,
            ...{
                bestTime: new Date().getTime()
            }
        }, level.levelNumber);

        if(level.levelNumber < 151){
            const nextLevelNumber = level.levelNumber + 1;
            const createdLevelData = {
                levelNumber: nextLevelNumber,
                bestTime:0,
                data: makeLevel(parseInt(`${nextLevelNumber/10}`) + 2)
            };
            (await dbPromise).put('levels', createdLevelData, nextLevelNumber);
        }

        (await dbPromise).close();

    },
    moveItens: (rowOrigin: number, rowTarget: number) => {
        const move = (rowOrigin: number, rowTarget: number, data:string[][]) => {

            // avoiding same origin and target
            if(rowOrigin === rowTarget){
                return false;
            }

            // avoiding empty data
            if(data.length === 0){
                return false;
            }

            const colTarget = data[rowTarget].lastIndexOf('');
            // avoiding full target recipient
            if(colTarget === -1){
                return false;
            }

            const colOrigin = data[rowOrigin].lastIndexOf('') + 1;
            const selectedItem = data[rowOrigin][colOrigin];

            // avoiding empty origin
            if(!selectedItem){
                return false;
            }

            const targetItem = data[rowTarget][colTarget];

            // avoiding target allocated or ...
            if(targetItem !== '' || data[rowTarget].length === colTarget){
                return false;
            }

            // avoiding when previous target item is diferent of selected item
            if(colTarget !== data[rowTarget].length - 1 && data[rowTarget][colTarget + 1] !== selectedItem){
                return false;
            }

            data[rowTarget][colTarget] = selectedItem;
            data[rowOrigin][colOrigin] = '';
            return true;
        }

        const {level} = get();

        // move(rowOrigin, rowTarget, level.data)

        while(move(rowOrigin, rowTarget, level.data)){
            console.log('moving...');
        }
        console.log('cleaning..');

        set({
            level: {...level},
        });

    },
    fetchLevel: async (levelNumber: number) => {
        const dbPromise = openDB('level-store', 1, {
            upgrade(db) {
              db.createObjectStore('levels');
            },
        });

        const levelPromise = (await dbPromise).get('levels', levelNumber);
        const level = await levelPromise;

        if(level){
            set({
                level: {...level},
            });   
        }else{
            const createdLevelData = {
                levelNumber,
                bestTime:0,
                data: makeLevel(parseInt(`${levelNumber/10}`) + 2)
            };
            (await dbPromise).put('levels', createdLevelData, levelNumber);
            set({
                level: {...createdLevelData},
            });
        }
        (await dbPromise).close();
    }
}));