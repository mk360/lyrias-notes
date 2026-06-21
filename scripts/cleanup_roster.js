const fs = require("fs");
const dir = fs.readdirSync("../src/data");

const reg = /(<(\/|)[a-z]+( .+?|)>|\n)/g;
const MOVE_STRENGTH_ORDER = ["L", "M", "H", "U", undefined];

/**
 * 
 * @param {string} move1 
 * @param {string} move2 
 * @returns 
 */
function weakestFirst(move1, move2) {
    const move1InputStrength = move1.match(/[LMHU]/)?.[0];
    const move2InputStrength = move2.match(/[LMHU]/)?.[0];
    if (move2InputStrength && move1InputStrength)
        return MOVE_STRENGTH_ORDER.indexOf(move1InputStrength) - MOVE_STRENGTH_ORDER.indexOf(move2InputStrength);
    return 0;
}



function getRekkaDepth(input) {
    return input.split("~").length;
}

for (let character of dir) {
    const cleanedCharacter = character.replace(".json", "");
    const moveset = JSON.parse(fs.readFileSync(`../src/data/${character}`, "utf-8"));
    const segregatedMoveset = {};

    
    for (let move of moveset) {
        move.id = `${cleanedCharacter}-${move.input}`;
        for (let property in move) {
            if (Array.isArray(move[property])) {
                for (let i = 0; i < move[property].length; i++) {
                    move[property][i] = move[property][i].replace(reg, "");
                }
            } else {
                move[property] = move[property].replace(reg, "");
            }
        }

        if (move.input === "MH") move.input = "RS";
        if (move.input === "MH~MH") move.input = "RS~RC";
    }

    const grouped = Object.groupBy(moveset, (move) => {
        if (move.type.includes("special")) {
            const [rootMove] = move.input.split("~");
            const rootMoveInput = rootMove.match(/(.+)([LMHUX])(.*)/);
            if (rootMoveInput) {
                return `${rootMoveInput[1]}${rootMoveInput[3]}`;
            }
            return rootMove;
        }
        return move.type;
    });

    for (let key in grouped) {
        grouped[key] = grouped[key].sort((el1, el2) => {
            const depth1 = getRekkaDepth(el1.input);
            const depth2 = getRekkaDepth(el2.input);
            if (depth2 - depth1) {
                return depth1 - depth2;
            } else {
                return weakestFirst(el1.input, el2.input);
            }
        });
    }
    fs.writeFileSync(`../src/cleaned_data/${character}`, JSON.stringify(grouped));
}
