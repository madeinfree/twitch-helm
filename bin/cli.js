#! /usr/bin/env node
const open = require('open');
const R = require('ramda');

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
const normalizeLiveStream = require('../src/utils/normalizeLiveStream');
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

/**
 * data
 */
const streamList = require('../src/streamList');

/**
 * initial state
 */
let liveList = EMPTY_ARRAY,
  normalizeListStreamList = EMPTY_ARRAY,
  currentSelectIndex = 0,
  currentShowLiveListSelectIndex = 0,
  currentPage = 1;
let selectMode = GAME_MODE.GAMELIST;
const listLen = R.length(streamList);

/**
 * helper
 */
const createLog = require('../src/helper/createLog');
const showLiveListView = _ => {
  showLiveList({
    liveList: normalizeListStreamList,
    currentShowLiveListSelectIndex,
    currentPage
  });
};
const changeMode = type => {
  selectMode = type;
};
const isGameMode = () => selectMode === GAME_MODE.GAMELIST;
const isLiveMode = () => selectMode === GAME_MODE.LIVELIST;
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
        if (currentSelectIndex + 1 > listLen - 1) {
          currentSelectIndex = 0;
        } else {
          currentSelectIndex = currentSelectIndex + 1;
        }
      } else if (isLiveMode()) {
        let normalizeListStreamListLen = R.length(normalizeListStreamList);
        if (currentShowLiveListSelectIndex + 1 > currentPage * 10 - 1) {
          currentShowLiveListSelectIndex = currentPage * 10;
        } else {
          currentShowLiveListSelectIndex = currentShowLiveListSelectIndex + 1;
        }
      }
      break;
    }
    /**
     * KEY_UP
     */
    case KEY_UP: {
      if (isGameMode()) {
        if (currentSelectIndex - 1 < 0) {
          currentSelectIndex = listLen - 1;
        } else {
          currentSelectIndex = currentSelectIndex - 1;
        }
      } else if (isLiveMode()) {
        let normalizeListStreamListLen = R.length(normalizeListStreamList);
        if (currentShowLiveListSelectIndex - 1 < 0) {
          currentShowLiveListSelectIndex = normalizeListStreamListLen - 1;
        } else {
          currentShowLiveListSelectIndex = currentShowLiveListSelectIndex - 1;
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
          streamList,
          currentSelectIndex
        );
        changeMode(GAME_MODE.LIVELIST);
        liveList = liveStreamResponse;
        normalizeListStreamList = normalizeLiveStream(liveList);
      } else {
        const { url, name } = await fetchLiveStreamUser(
          currentShowLiveListSelectIndex,
          liveList
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
      break;
    }
    /**
     * KEY_N
     */
    case KEY_N: {
      if (isGameMode()) {
        break;
      }
      if (currentPage + 1 > 10) {
        currentPage = 0;
        currentShowLiveListSelectIndex = 0;
      } else {
        currentShowLiveListSelectIndex = currentShowLiveListSelectIndex + 10;
      }
      currentPage = currentPage + 1;
      break;
    }
    /**
     * KEY_P
     */
    case KEY_P: {
      if (isGameMode()) {
        break;
      }
      if (currentPage - 1 < 1) {
        currentPage = 11;
        currentShowLiveListSelectIndex = 90;
      } else {
        currentShowLiveListSelectIndex = currentShowLiveListSelectIndex - 10;
      }
      currentPage = currentPage - 1;
      break;
    }
  }
  /**
   * refresh command line
   */
  if (isGameMode()) {
    show(currentSelectIndex);
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
show(currentSelectIndex);
