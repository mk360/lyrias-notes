const GRAN = require("../../src/cleaned_data/Gran.json");

function parse_GRANEX(initialMoveset) {
    const movesetCopy = [...initialMoveset];
    const GRAN_COMMON_MOVES = GRAN.filter((move) => {
        return ["normal", "other", "super"].includes(move.type);
    });
    
    movesetCopy.push(...GRAN_COMMON_MOVES);

    return movesetCopy;
};

module.exports = parse_GRANEX;
