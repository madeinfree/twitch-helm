const R = require('ramda');
const open = require('open');
const { createRequest, createUserRequest } = require('./createRequest');
/**
 *
 * fetch user live stream from twitch API.
 * @param {array} streamList
 * @param {number} currentSelectIndex
 */
const fetchLiveStream = (
  streamList,
  currentGameSelectIndex,
  { languageParams, limitParams }
) => {
  return new Promise((resolve, reject) => {
    createRequest({
      url: `/streams${limitParams}&game_id=${
        streamList[currentGameSelectIndex]['_id']
      }${languageParams}`
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

const fetchLiveStreamUser = (currentShowLiveListSelectIndex, liveList) => {
  return new Promise((resolve, reject) => {
    const user = liveList[currentShowLiveListSelectIndex];
    const user_id = R.path(['user_id'])(user);
    createUserRequest({
      url: `/streams/${user_id}`
    })
      .then(response => {
        const { url, name, display_name, language } = R.path([
          'data',
          'stream',
          'channel'
        ])(response);
        open(url, () =>
          resolve({
            url,
            name,
            display_name,
            language
          })
        );
      })
      .catch(error => reject('Twitch Stream CLI: ', error));
  });
};

module.exports = {
  fetchLiveStream,
  fetchLiveStreamUser
};
