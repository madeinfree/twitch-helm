require('dotenv').config();
require('colors');
const open = require('open');
const keypress = require('keypress');
const axios = require('axios').default;
const R = require('ramda');

const { TWITCH_CLIENT_ID } = process.env;

const createRequest = axios.create({
  method: 'GET',
  baseURL: 'https://api.twitch.tv/helix',
  headers: {
    'Client-ID': TWITCH_CLIENT_ID
  }
});
const createUserRequest = axios.create({
  method: 'GET',
  baseURL: 'https://api.twitch.tv/kraken',
  headers: {
    Accept: 'application/vnd.twitchtv.v5+json',
    'Client-ID': TWITCH_CLIENT_ID
  }
});
const createGamesRequest = axios.create({
  method: 'GET',
  baseURL: 'https://api.twitch.tv/kraken/games/top',
  headers: {
    'Client-ID': TWITCH_CLIENT_ID
  }
});

const clearTerminal = () => process.stdout.write('\u001B[2J\u001B[0;0f');
clearTerminal();

const streamList = [
  {
    _id: '493057',
    name: "PLAYERUNKNOWN'S BATTLEGROUNDS - 絕地求生"
  },
  {
    _id: '21779',
    name: 'League of Legends - 英雄聯盟'
  },
  {
    _id: '32399',
    name: 'Counter-Strike: Global Offensive - 絕對武力'
  },
  {
    _id: '138585',
    name: 'Hearthstone - 爐石戰記'
  },
  {
    _id: '29595',
    name: 'Dota 2 - 鬥塔 2'
  },
  {
    _id: '18122',
    name: 'World of Warcraft - 魔獸世界'
  },
  {
    _id: '494717',
    name: 'IRL - 生活台'
  }
];
let liveList = [];
let normalizeListStreamList = [];

const listLen = streamList.length;
let currentSelectIndex = 0,
  currentShowLiveListSelectIndex = 0;
/**
 * selectMode
 * 1 => 尋找直播遊戲
 * 2 => 尋找台主
 */
let selectMode = 1;

keypress(process.stdin);

process.stdin.on('keypress', (ch, key) => {
  clearTerminal();
  // console.log('got "keypress"', key);

  if (key && key.name === 'down') {
    if (selectMode === 1) {
      if (currentSelectIndex + 1 > listLen - 1) {
        currentSelectIndex = 0;
      } else {
        currentSelectIndex = currentSelectIndex + 1;
      }
      show();
    } else if (selectMode === 2) {
      let normalizeListStreamListLen = normalizeListStreamList.length;
      if (currentShowLiveListSelectIndex + 1 > normalizeListStreamListLen) {
        currentShowLiveListSelectIndex = 0;
      } else {
        currentShowLiveListSelectIndex = currentShowLiveListSelectIndex + 1;
      }
      showLiveList(normalizeListStreamList);
    }
  }
  if (key && key.name === 'up') {
    if (selectMode === 1) {
      if (currentSelectIndex - 1 < 0) {
        currentSelectIndex = listLen - 1;
      } else {
        currentSelectIndex = currentSelectIndex - 1;
      }
      show();
    } else if (selectMode === 2) {
      let normalizeListStreamListLen = normalizeListStreamList.length;
      if (currentShowLiveListSelectIndex - 1 < 0) {
        currentShowLiveListSelectIndex = normalizeListStreamListLen - 1;
      } else {
        currentShowLiveListSelectIndex = currentShowLiveListSelectIndex - 1;
      }
      showLiveList(normalizeListStreamList);
    }
  }
  if (key && key.name === 'return') {
    if (selectMode === 1) {
      fetchLiveStream().then(liveStreamResponse => {
        /**
         * selectMode 2
         */
        selectMode = 2;
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
