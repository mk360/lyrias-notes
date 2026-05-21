const fs = require("fs");
const dir = fs.readdirSync("../src/data");

const reg = /(<(\/|)[a-z]+( .+?|)>|\n)/g

for (let item of dir) {
    const moveset = JSON.parse(fs.readFileSync(`../src/data/${item}`, "utf-8"));
    for (let move of moveset) {
        move.id = `${item.replace(".json", "")}-${move.input}`
        for (let property in move) {
            if (Array.isArray(move[property])) {
                for (let i = 0; i < move[property].length; i++) {
                    move[property][i] = move[property][i].replace(reg, "");
                }
            } else {
                move[property] = move[property].replace(reg, "");
            }
        }
    }
    fs.writeFileSync(`../src/cleaned_data/${item}`, JSON.stringify(moveset));
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
