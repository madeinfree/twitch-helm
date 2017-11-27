#! /usr/bin/env node
require('colors');
const open = require('open');
const keypress = require('keypress');
const R = require('ramda');
const clearTerminal = require('../src/utils/clearTerminal');
const streamList = require('../src/streamList');
const {
  createRequest,
  createUserRequest,
  createGamesRequest
} = require('../src/request/createRequest');

let liveList = [],
  normalizeListStreamList = [];
let currentSelectIndex = 0,
  currentShowLiveListSelectIndex = 0;
const listLen = streamList.length;

/**
 * selectMode
 * 1 => 尋找直播遊戲
 * 2 => 尋找台主
 */
const GAME_MODE = {
  GAMELIST: 1,
  LIVELIST: 2
};
let selectMode = GAME_MODE.GAMELIST;

clearTerminal();

keypress(process.stdin);
process.stdin.on('keypress', (ch, key) => {
  clearTerminal();
  // console.log('got "keypress"', key);

  if (key && key.name === 'down') {
    if (selectMode === GAME_MODE.GAMELIST) {
      if (currentSelectIndex + 1 > listLen - 1) {
        currentSelectIndex = 0;
      } else {
        currentSelectIndex = currentSelectIndex + 1;
      }
      show();
    } else if (selectMode === GAME_MODE.LIVELIST) {
      let normalizeListStreamListLen = normalizeListStreamList.length;
      if (currentShowLiveListSelectIndex + 1 > normalizeListStreamListLen - 1) {
        currentShowLiveListSelectIndex = 0;
      } else {
        currentShowLiveListSelectIndex = currentShowLiveListSelectIndex + 1;
      }
      showLiveList(normalizeListStreamList);
    }
  }
  if (key && key.name === 'up') {
    if (selectMode === GAME_MODE.GAMELIST) {
      if (currentSelectIndex - 1 < 0) {
        currentSelectIndex = listLen - 1;
      } else {
        currentSelectIndex = currentSelectIndex - 1;
      }
      show();
    } else if (selectMode === GAME_MODE.LIVELIST) {
      let normalizeListStreamListLen = normalizeListStreamList.length;
      if (currentShowLiveListSelectIndex - 1 < 0) {
        currentShowLiveListSelectIndex = normalizeListStreamListLen - 1;
      } else {
        currentShowLiveListSelectIndex = currentShowLiveListSelectIndex - 1;
      }
      showLiveList(normalizeListStreamList);
    }
  }
  if (key && (key.name === 'return' || key.name === 'right')) {
    if (selectMode === GAME_MODE.GAMELIST) {
      fetchLiveStream().then(liveStreamResponse => {
        /**
         * selectMode 2
         */
        selectMode = GAME_MODE.LIVELIST;
        liveList = liveStreamResponse;
        normalizeListStreamList = normalizeLiveStream(liveList);
        clearTerminal();
        showLiveList(normalizeListStreamList);
      });
    } else {
      fetchLiveStreamUser(currentShowLiveListSelectIndex).then(
        ({ url, name }) => {
          clearTerminal();
          console.log(`打開 ${url} 欣賞「${name}」的技巧吧！`);
          process.exit();
        }
      );
    }
  }
  if (key && key.name === 'left') {
    selectMode = GAME_MODE.GAMELIST;
    clearTerminal();
    show();
  }
  if (key && key.ctrl && key.name === 'c') {
    process.stdin.pause();
  }
});

process.stdin.setRawMode(true);
process.stdin.resume();

const show = () => {
  streamList.forEach((list, index) => {
    if (currentSelectIndex === index) {
      console.log(`[⌵] ${list.name}`.green);
    } else {
      console.log(list.name);
    }
  });
};
const showLiveList = liveList => {
  liveList.forEach((list, index) => {
    if (currentShowLiveListSelectIndex === index) {
      console.log(
        `[⌵] 標題: ${list.title.trim()} 觀看人數：${list.viewer_count}`.green
      );
    } else {
      console.log(`標題: ${list.title.trim()} 觀看人數：${list.viewer_count}`);
    }
  });
};

const normalizeLiveStream = liveStreamList =>
  R.compose(
    R.map(liveStream => ({
      title: liveStream.title,
      viewer_count: liveStream.viewer_count
    })),
    R.path(['data'])
  )(liveStreamList);

const fetchLiveStream = () => {
  return new Promise((resolve, reject) => {
    createRequest({
      url: `/streams?first=20&language=zh-tw&game_id=${
        streamList[currentSelectIndex]['_id']
      }`
    })
      .then(response => {
        const { data: liveListResponse } = response;
        resolve(liveListResponse);
      })
      .catch(error => {
        reject('TWITCH STREAM CLI:', error);
      });
  });
};
const fetchLiveStreamUser = index => {
  return new Promise((resolve, reject) => {
    const listData = R.path(['data'])(liveList);
    const user = listData[index];
    const user_id = R.path(['user_id'])(user);
    createUserRequest({
      url: `/streams/${user_id}`
    })
      .then(response => {
        const channel_url = R.path(['data', 'stream', 'channel', 'url'])(
          response
        );
        const channel_name = R.path([
          'data',
          'stream',
          'channel',
          'display_name'
        ])(response);
        open(channel_url);
        resolve({
          url: channel_url,
          name: channel_name
        });
      })
      .catch(error => reject('Twitch Stream CLI: ', error));
  });
};

show();
