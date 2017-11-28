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
    '【確認：右方向鍵(->) 或 Enter】   【選擇：上方向鍵(^)、下方向鍵(v)】   【返回：左方向鍵(<-)】   【上一頁/下一頁：鍵盤(p)/鍵盤(n)】   【關閉：Ctrl + c】'
  );
  console.log('\n');
};

module.exports = showBanner;
