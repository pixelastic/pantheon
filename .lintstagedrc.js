const config = require('aberlaas/lib/configs/lintstaged.js');
module.exports = {
  ...config,
  'src/pictures/*.png': ['yarn run data:pictures', 'git add ./data'],
};
