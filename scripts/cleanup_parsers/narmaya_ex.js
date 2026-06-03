const NARMAYA = require("../../src/cleaned_data/Narmaya.json");

function parse_NARMAYA_EX(initialMoveset) {
    const movesetCopy = [...initialMoveset];
    // find narm's normals and attach them to ex narm
    const NARMAYA_EX_NORMALS = NARMAYA.filter((move) => {
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
    }).map((move) => {
        if (move.type.includes("normal")) {
            move.type = "normal";
        }
        return move;
    });

    NARMAYA_EX_NORMALS[NARMAYA_EX_NORMALS.findIndex((i) => i.input === "j.H[k]")].input = "j.U";

    for (let normal of NARMAYA_EX_NORMALS) {
        normal.input = normal.input.replace(/\[[gk]\]/g, "");
    }

    movesetCopy.push(...NARMAYA_EX_NORMALS);

    return movesetCopy;
};

module.exports = parse_NARMAYA_EX;
