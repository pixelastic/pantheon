const { glob, readJson, writeJson } = require('firost');
const _ = require('golgoth/lodash');
const pMap = require('golgoth/pMap');
const path = require('path');
const helper = require('../lib/main');

(async () => {
  const args = process.argv.slice(2);
  const updatedPictures = _.isEmpty(args)
    ? await glob('./src/pictures/*.png')
    : args;

  await pMap(updatedPictures, async (filepath) => {
    const slug = path.basename(filepath, '.png');

    const recordPath = path.resolve('./data', `${slug}.json`);
    const record = await readJson(recordPath);

    record.picture = await helper.picture(slug);
    record.ranking.hasPicture = !!record.picture;

    await writeJson(record, recordPath);
  });
})();
