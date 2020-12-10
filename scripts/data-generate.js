const path = require('path');
const helper = require('../lib/main.js');
const pMap = require('golgoth/pMap');
const writeJson = require('firost/writeJson');

(async () => {
  helper.init();
  const gods = await helper.allNames();
  await pMap(
    gods,
    async (godName, index) => {
      try {
        const record = await helper.record(godName);
        const { slug } = record;
        const filepath = path.resolve(`./data/${slug}.json`);
        await writeJson(record, filepath);
      } catch (err) {
        console.info(err);
        console.info({ index, godName });
        process.exit(0);
      }
    },
    { concurrency: 1 }
  );
})();
