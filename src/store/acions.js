const {
  CHANGE_MODE,
  CACHE_LIVE_LIST,
  CHANGE_GAME_SELECT_INDEX,
  CHANGE_LIVE_SELECT_INDEX,
  CHANGE_CURRENT_PAGE_INDEX
} = require('./constant');
const store = require('./index');

const changeMode = type => {
  store.dispatch({
    type: CHANGE_MODE,
    payload: type
  });
};
const cacheLiveList = list => {
  store.dispatch({
    type: CACHE_LIVE_LIST,
    payload: list.data
  });
};
const changeGameSelectIndex = num => {
  store.dispatch({
    type: CHANGE_GAME_SELECT_INDEX,
    payload: num
  });
};
const changeLiveSelectIndex = indexNum => {
  store.dispatch({
    type: CHANGE_LIVE_SELECT_INDEX,
    payload: indexNum
  });
};
const changeCurrentPage = pageNum => {
  store.dispatch({
    type: CHANGE_CURRENT_PAGE_INDEX,
    payload: pageNum
  });
};

module.exports = {
  changeMode,
  cacheLiveList,
  changeGameSelectIndex,
  changeLiveSelectIndex,
  changeCurrentPage
};
