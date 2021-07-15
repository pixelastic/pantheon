const config = require('aberlaas/lib/configs/lintstaged.js');
console.info(config);
module.exports = {
  ...config,
  'src/pictures/*.png': ['yarn run data:pictures', 'git add ./data'],
};
