const fs = require("fs");
const parseNarmayaEX = require("./cleanup_parsers/narmaya_ex");
const parseGranEX = require("./cleanup_parsers/gran_ex");
const dir = fs.readdirSync("../src/data");

const reg = /(<(\/|)[a-z]+( .+?|)>|\n)/g;
const MOVE_STRENGTH_ORDER = ["L", "M", "H", "U", undefined];

const CHARACTER_SPECIFIC_PARSERS = {
    "Narmaya (EX)": parseNarmayaEX,
    "Gran (EX)": parseGranEX,
};

/**
 * 
 * @param {string} move1 
 * @param {string} move2 
 * @returns 
 */
function weakestFirst(move1, move2) {
    const move1Followups = move1.split("~").length;
    const move2Followups = move2.split("~").length;
    const baseMoveFirst = move1Followups - move2Followups;
    if (baseMoveFirst === 0) { // if both moves are specials or rekka starters
        const move1InputStrength = move1.match(/[LMHU]/)?.[0];
        const move2InputStrength = move2.match(/[LMHU]/)?.[0];
        console.log({ move1InputStrength, move2InputStrength });
        if (move2InputStrength && move1InputStrength)
            return MOVE_STRENGTH_ORDER.indexOf(move1InputStrength) - MOVE_STRENGTH_ORDER.indexOf(move2InputStrength);
        return 0;
    } else {
        // put 214H before 214H~632146H
        return baseMoveFirst;
    }
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
        if (move.input === "MH~MH") {
            move.input = "RS~RC";
            move.name = "Raging Strike ~ Raging Chain"
        }
    }
    
    const sortedMoveset = [...moveset].sort((move1, move2) => {
        return weakestFirst(move1.input, move2.input)
    });

    if (cleanedCharacter in CHARACTER_SPECIFIC_PARSERS) {
        const cleanedMoveset = CHARACTER_SPECIFIC_PARSERS[cleanedCharacter](sortedMoveset);
        fs.writeFileSync(`../src/cleaned_data/${character}`, JSON.stringify(cleanedMoveset));
    } else {
        fs.writeFileSync(`../src/cleaned_data/${character}`, JSON.stringify(sortedMoveset));
    }
}
