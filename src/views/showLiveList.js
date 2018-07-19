const Table = require('cli-table3');
/**
 * show live list
 * @param {array} liveList
 * @param {number} currentShowLiveListSelectIndex
 * @param {number} currentPage
 */
const showLiveList = ({
  liveList,
  currentShowLiveListSelectIndex,
  currentPage
}) => {
  console.log(
    `| Total page ${Math.ceil(liveList.length / 10)} | Current page ${
      currentPage
    } |`
  );
  let liveTable = new Table({
    head: ['Title', 'Language', 'Viewer Counter'],
    style: {
      head: {
        color: '#fff'
      }
    },
    colWidths: [50, 100]
  });
  liveList.forEach((list, index) => {
    if (index < currentPage * 10 - 10 || index > currentPage * 10 - 1) return;
    if (currentShowLiveListSelectIndex === index) {
      liveTable.push([
        list.title.trim().green,
        list.language.green,
        list.viewer_count.toString().green
      ]);
    } else {
      liveTable.push([list.title.trim(), list.language, list.viewer_count]);
    }
  });
  console.log(liveTable.toString());
};

module.exports = showLiveList;
