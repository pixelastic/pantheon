const path = require('path');
const helper = require('../lib/main.js');
const pMap = require('golgoth/pMap');
const { writeJson, spinner } = require('firost');

(async () => {
  helper.init();
  const gods = await helper.allNames();
  const progress = spinner(gods.length);
  await pMap(
    gods,
    async (godName, index) => {
      try {
        const record = await helper.record(godName);
        const { slug, name } = record;

        const filepath = path.resolve(`./data/${slug}.json`);
        await writeJson(record, filepath);
        progress.tick(name);
      } catch (err) {
        progress.failure();
        console.info(err);
        console.info({ index, godName });
        process.exit(0);
      }
    },
    { concurrency: 25 }
  );
  progress.success();
})();
