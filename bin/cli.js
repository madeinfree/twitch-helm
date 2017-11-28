#! /usr/bin/env node
const open = require('open');
const R = require('ramda');

/**
 * redux store
 */
const store = require('../src/store/');
const getState = key => {
  const state = store.getState();
  return state[key];
};

/**
 * Terminal Lib
 */
require('colors');
const keypress = require('keypress');
const CFonts = require('cfonts');
const Table = require('cli-table2');

/**
 * Utils
 */
const clearTerminal = require('../src/utils/clearTerminal');
const {
  fetchLiveStream,
  fetchLiveStreamUser
} = require('../src/request/createFetch');

/**
 * views
 */
const show = require('../src/views/showGames');
const showLiveList = require('../src/views/showLiveList');
const showBanner = require('../src/views/showBanner');
const showSeeyou = require('../src/views/showSeeyou');
const showOpenup = require('../src/views/showOpenup');

/**
 * constant
 */
const GAME_MODE = require('../src/constant/GAME_MODE');
const MAX_PAGE = require('../src/constant/MAX_PAGE');
const EMPTY_ARRAY = require('../src/constant/EMPTY_ARRAY');
const {
  KEY_DOWN,
  KEY_UP,
  KEY_RIGHT,
  KEY_LEFT,
  KEY_N,
  KEY_P,
  KEY_ENTER
} = require('../src/constant/KEY_CODE');
const Null = require('../src/constant/NULL');
const {
  CHANGE_MODE,
  CACHE_LIVE_LIST,
  CHANGE_GAME_SELECT_INDEX,
  CHANGE_LIVE_SELECT_INDEX,
  CHANGE_CURRENT_PAGE_INDEX
} = require('../src/store/constant');

/**
 * initial state
 */
let selectMode = getState('gameMode');
const listLen = R.length(getState('streamList'));

/**
 * helper
 */
const createLog = require('../src/helper/createLog');
const showLiveListView = _ => {
  showLiveList({
    liveList: getState('liveList'),
    currentShowLiveListSelectIndex: getState('currentLiveSelectIndex'),
    currentPage: getState('currentPage')
  });
};
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
const reset = () => {
  changeCurrentPage(1);
  changeLiveSelectIndex(0);
};
const isGameMode = () => getState('gameMode') === GAME_MODE.GAMELIST;
const isLiveMode = () => getState('gameMode') === GAME_MODE.LIVELIST;
const exitProcess = () => process.exit();

/**
 * initial keypress
 */
keypress(process.stdin);

/**
 * start
 */
process.stdin.on('keypress', async (ch, key) => {
  clearTerminal();

  if (key && key.ctrl && key.name === 'c') {
    showSeeyou();
    exitProcess();
  }

  /**
   * always show banner again when event fired.
   */
  showBanner();

  switch (key.name) {
    /**
     * KEY_DOWN
     */
    case KEY_DOWN: {
      if (isGameMode()) {
        if (getState('currentGameSelectIndex') + 1 > listLen - 1) {
          changeGameSelectIndex(0);
        } else {
          changeGameSelectIndex(getState('currentGameSelectIndex') + 1);
        }
      } else if (isLiveMode()) {
        if (getState('currentLiveSelectIndex') >= 99) break;
        if (
          getState('currentLiveSelectindex') + 1 >
          getState('currentPage') * 10 - 1
        ) {
          changeCurrentPage(getState('currentPage') + 1);
          changeLiveSelectIndex(getState('currentPage') * 10 - 10);
        } else {
          changeLiveSelectIndex(getState('currentLiveSelectIndex') + 1);
        }
      }
      break;
    }
    /**
     * KEY_UP
     */
    case KEY_UP: {
      if (isGameMode()) {
        if (getState('currentGameSelectIndex') < 0) {
          changeGameSelectIndex(listLen - 1);
        } else {
          changeGameSelectIndex(getState('currentGameSelectIndex') - 1);
        }
      } else if (isLiveMode()) {
        if (getState('currentLiveSelectIndex') === 0) break;
        if (
          getState('currentLiveSelectIndex') - 1 <
          getState('currentPage') * 10 - 10
        ) {
          changeCurrentPage(getState('currentPage') - 1);
          changeLiveSelectIndex(getState('currentPage') * 10 - 1);
        } else {
          changeLiveSelectIndex(getState('currentLiveSelectIndex') - 1);
        }
      }
      break;
    }
    /**
     * KEY_ENTER & KEY_RIGHT
     */
    case KEY_ENTER:
    case KEY_RIGHT: {
      if (isGameMode()) {
        const liveStreamResponse = await fetchLiveStream(
          getState('streamList'),
          getState('currentGameSelectIndex')
        );
        changeMode(GAME_MODE.LIVELIST);
        cacheLiveList(liveStreamResponse);
      } else {
        const { url, name } = await fetchLiveStreamUser(
          getState('currentLiveSelectIndex'),
          getState('liveList')
        );
        createLog(`打開 ${url} 欣賞「${name}」的技巧吧！`);
        clearTerminal();
        showOpenup();
        exitProcess();
      }
      break;
    }
    /**
     * KEY_LEFT
     */
    case KEY_LEFT: {
      changeMode(GAME_MODE.GAMELIST);
      reset();
      break;
    }
    /**
     * KEY_N
     */
    case KEY_N: {
      if (isGameMode()) {
        break;
      }
      if (getState('currentPage') + 1 > 10) {
        changeCurrentPage(0);
        changeLiveSelectIndex(0);
      } else {
        changeLiveSelectIndex(getState('currentLiveSelectIndex') + 10);
      }
      changeCurrentPage(getState('currentPage') + 1);
      break;
    }
    /**
     * KEY_P
     */
    case KEY_P: {
      if (isGameMode()) {
        break;
      }
      if (getState('currentPage') - 1 < 1) {
        changeCurrentPage(11);
        changeLiveSelectIndex(90);
      } else {
        changeLiveSelectIndex(getState('currentLiveSelectIndex') - 10);
      }
      changeCurrentPage(getState('currentPage') - 1);
      break;
    }
  }
  /**
   * refresh command line
   */
  if (isGameMode()) {
    show(getState('currentGameSelectIndex'));
  }
  if (isLiveMode()) {
    showLiveListView(Null);
  }
});

process.stdin.setRawMode(true);
process.stdin.resume();

/**
 * first open
 */
clearTerminal();
showBanner();
show(getState('currentGameSelectIndex'));
