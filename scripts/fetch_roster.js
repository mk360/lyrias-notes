const fs = require("fs");

const CHARACTERS = [
  { name: '2B' },
  { name: 'Anila' },
  { name: 'Anre' },
  { name: 'Avatar Belial' },
  { name: 'Beatrix' },
  { name: 'Beelzebub' },
  { name: 'Belial' },
  { name: 'Cagliostro' },
  { name: 'Charlotta' },
  { name: 'Djeeta' },
  { name: 'Djeeta (EX)' },
  { name: 'Eustace' },
  { name: 'Ferry' },
  { name: 'Galleon' },
  { name: 'Gran' },
  { name: 'Gran (EX)' },
  { name: 'Grimnir' },
  { name: 'Ilsa' },
  { name: 'Katalina' },
  { name: 'Ladiva' },
  { name: 'Lancelot' },
  { name: 'Lowain' },
  { name: 'Lucilius' },
  { name: 'Meg' },
  { name: 'Metera' },
  { name: 'Narmaya' },
  { name: 'Narmaya (EX)' },
  { name: 'Nier' },
  { name: 'Percival' },
  { name: 'Sandalphon' },
  { name: 'Seox' },
  { name: 'Siegfried' },
  { name: 'Soriz' },
  { name: 'Vane' },
  { name: 'Vaseraga' },
  { name: 'Versusia' },
  { name: 'Vikala' },
  { name: 'Vira' },
  { name: 'Wilnas' },
  { name: 'Yuel' },
  { name: 'Zeta' },
  { name: 'Zooey'  }
];

(async function fct() {
    for (let { name } of CHARACTERS) {
        const x = await fetch(`https://www.dustloop.com/wiki/index.php?title=Special:CargoExport&tables=MoveData_GBVSR&&fields=name%2C+input%2C+damage%2C+guard%2C+startup%2C+active%2C+recovery%2C+type%2C+onBlock%2C+onHit%2C+onCH%2C+images%2C+hitboxes&where=chara+%3D+%22${encodeURIComponent(name)}%22&order+by=&limit=100&format=json&parse+values=yes`);
        const r = await x.json();
        fs.writeFileSync("../src/data/" + name + ".json", JSON.stringify(r));
    }
})()