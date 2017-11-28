const streamList = require('../streamList');
const Table = require('cli-table2');

const showGames = currentSelectIndex => {
  let gameTable = new Table({
    head: ['Game', 'Description'],
    style: {
      head: {
        color: '#fff'
      }
    },
    colWidths: [50, 100]
  });
  streamList.forEach((list, index) => {
    if (currentSelectIndex === index) {
      gameTable.push([`${list.name}`.green, list.description.green]);
    }
    if (currentSelectIndex !== index) {
      gameTable.push([list.name, list.description]);
    }
  });
  console.log(gameTable.toString());
};

module.exports = showGames;
