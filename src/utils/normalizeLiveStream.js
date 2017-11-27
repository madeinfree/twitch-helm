const R = require('ramda');

const normalizeLiveStream = liveStreamList =>
  R.compose(
    R.map(liveStream => ({
      title: liveStream.title,
      viewer_count: liveStream.viewer_count,
      language: liveStream.language
    })),
    R.path(['data'])
  )(liveStreamList);

module.exports = normalizeLiveStream;
