const fs = require("fs");
const dir = fs.readdirSync("../src/data");

const reg = /(<(\/|)[a-z]+( .+?|)>|\n)/g;
const MOVE_STRENGTH_ORDER = ["L", "M", "H", "U"]

for (let character of dir) {
    const moveset = JSON.parse(fs.readFileSync(`../src/data/${character}`, "utf-8"));
    
    for (let move of moveset) {
        move.id = `${character.replace(".json", "")}-${move.input}`;
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

    /**
     * 
     * @param {string} move1 
     * @param {string} move2 
     * @returns 
     */
    function weakestFirst(move1, move2) {
        const move1Followups = move1.split("~").length;
        const move2Followups = move2.split("~").length;
        const baseMoveFirst = move2Followups - move1Followups;
        if (baseMoveFirst === 0) { // if both moves are specials or rekka starters
            const move1InputStrength = move1.match(/[LMHU]/)?.[0];
            const move2InputStrength = move2.match(/[LMHU]/)?.[0];
            if (move2InputStrength && move1InputStrength)
                return MOVE_STRENGTH_ORDER.indexOf(move1InputStrength) - MOVE_STRENGTH_ORDER.indexOf(move2InputStrength);
            return 0;
        } else {
            // put 214H before 214H~632146H
            return baseMoveFirst;
        }
    }
    
    
    const newMoveset = moveset.sort((move1, move2) => {
        if (move1.type === "special" && move2.type === "special") {
            return weakestFirst(move1.input, move2.input);
        }
    });

    fs.writeFileSync(`../src/cleaned_data/${character}`, JSON.stringify(moveset));
}

const NARMAYA = require("../src/cleaned_data/Narmaya.json");
const EX_NARMAYA = require("../src/cleaned_data/Narmaya (EX).json");

// find narm's normals and attach them to ex narm

const EX_NARMAYA_NORMALS = NARMAYA.filter((move) => {
    return (
        move.input === "2L[k]" ||
        move.input === "2M[g]" ||
        move.input === "2H[k]" ||
        move.input === "2U[k]" ||
        move.input === "5L[k]" ||
        move.input === "c.M[k]" ||
        move.input === "c.H[g]" ||
        move.input === "f.M[g]" ||
        move.input === "f.H[k]" ||
        move.input === "66L" ||
        move.input === "66M" ||
        move.input === "66H[k]" ||
        move.input === "j.L[k]" ||
        move.input === "j.M[g]" ||
        move.input === "j.H[g]" ||
        move.input === "j.H[k]" ||
        move.input.startsWith("c.XX") ||
        move.type === "other" ||
        move.type === "super"
    );
});

EX_NARMAYA_NORMALS[EX_NARMAYA_NORMALS.findIndex((i) => i.input === "j.H[k]")].input = "j.U";

for (let normal of EX_NARMAYA_NORMALS) {
    normal.input = normal.input.replace(/\[[gk]\]/g, "");
}

EX_NARMAYA.push(...EX_NARMAYA_NORMALS);

fs.writeFileSync("../src/cleaned_data/Narmaya (EX).json", JSON.stringify(EX_NARMAYA));

const GRAN = require("../src/cleaned_data/Gran.json");
const EX_GRAN = require("../src/cleaned_data/Gran (EX).json");

const GRAN_COMMON_MOVES = GRAN.filter((move) => {
    return ["normal", "other", "super"].includes(move.type);
});

EX_GRAN.push(...GRAN_COMMON_MOVES);

fs.writeFileSync("../src/cleaned_data/Gran (EX).json", JSON.stringify(EX_GRAN));

const Djeeta = require("../src/cleaned_data/Djeeta.json")
const EX_Djeeta = require("../src/cleaned_data/Djeeta (EX).json");

const Djeeta_COMMON_MOVES = Djeeta.filter((move) => {
    return ["normal", "other"].includes(move.type);
});

EX_Djeeta.push(...Djeeta_COMMON_MOVES);

fs.writeFileSync("../src/cleaned_data/Djeeta (EX).json", JSON.stringify(EX_Djeeta));
