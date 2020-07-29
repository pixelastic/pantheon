const path = require('path');
const helper = require('../lib/main.js');
const pMap = require('golgoth/lib/pMap');
const writeJson = require('firost/lib/writeJson');

(async () => {
  helper.init();
  const gods = await helper.allNames();
  await pMap(gods, async (godName) => {
    const record = await helper.record(godName);
    const { slug } = record;
    const filepath = path.resolve(`./data/${slug}.json`);
    await writeJson(record, filepath);
  });
})();
