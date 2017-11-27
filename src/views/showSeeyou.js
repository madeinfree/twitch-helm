const CFonts = require('cfonts');

const showSeeyou = () => {
  CFonts.say('See You !', {
    colors: ['green'],
    align: 'center'
  });
};

module.exports = showSeeyou;
