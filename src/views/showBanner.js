const CFonts = require('cfonts');

const showBanner = () => {
  CFonts.say('Welcome Twitch Helm', {
    font: 'block',
    align: 'center',
    colors: ['blue'],
    background: 'Black',
    letterSpacing: 1,
    lineHeight: 1,
    space: true,
    maxLength: '0'
  });
  console.log(
    '【Return：key-right(->) or Enter】   【Choose：key-up(^)、key-down(v)】   【Back：key-left(<-)】   【previous/next：key-p/key-n】   【Exit：Ctrl + c】'
  );
  console.log('\n');
};

module.exports = showBanner;
