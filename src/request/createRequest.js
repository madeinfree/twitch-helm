const axios = require('axios').default;
const TWITCH_CLIENT_ID = 'pl3x96lxedtdyvf3cmyai9fu4mod62';

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

module.exports = {
  createRequest,
  createUserRequest,
  createGamesRequest
};
