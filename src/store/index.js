const { createStore } = require('redux');
const streamList = require('../../src/streamList');
const { GAMELIST, LIVELIST } = require('../constant/GAME_MODE');
const { EMPTY_ARRAY } = require('../constant/EMPTY_ARRAY');
const initialState = {
  streamList,
  gameMode: GAMELIST,
  liveList: EMPTY_ARRAY,
  currentGameSelectIndex: 0,
  currentLiveSelectIndex: 0,
  currentPage: 1
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_MODE':
      return Object.assign({}, state, {
        gameMode: action.payload
      });
    case 'CACHE_LIVE_LIST':
      return Object.assign({}, state, {
        liveList: action.payload
      });
    case 'CHANGE_GAME_SELECT_INDEX':
      return Object.assign({}, state, {
        currentGameSelectIndex: action.payload
      });
    case 'CHANGE_LIVE_SELECT_INDEX':
      return Object.assign({}, state, {
        currentLiveSelectIndex: action.payload
      });
    case 'CHANGE_CURRENT_PAGE_INDEX':
      return Object.assign({}, state, {
        currentPage: action.payload
      });
    default:
      return state;
  }
};

module.exports = createStore(reducer);
