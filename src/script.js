const theme = require('norska/theme');
const config = require('./_scripts/config.js');
const lazyloadHelper = require('./_scripts/lazyloadHelper');

(async () => {
  lazyloadHelper.init();
  await theme.init(config);
})();
