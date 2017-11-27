const Table = require('cli-table2');
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
  console.log(`| 共 ${liveList.length / 10} 頁 | 當前頁數 ${currentPage} |`);
  let liveTable = new Table({
    head: ['遊戲標題', '語言', '觀看人數'],
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
