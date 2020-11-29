const indexing = require('algolia-indexing');
const readJson = require('firost/readJson');
const glob = require('firost/glob');
const consoleError = require('firost/consoleError');
const pMap = require('golgoth/lib/pMap');
const config = require('../src/_data/config.js');
const _ = require('golgoth/lib/lodash');

(async function () {
  const credentials = {
    appId: config.algolia.appId,
    apiKey: process.env.ALGOLIA_API_KEY,
    indexName: config.algolia.indexName,
  };
  const settings = {
    searchableAttributes: [
      'name',
      'unordered(description)',
      'unordered(titles)',
      'unordered(domains)',
    ],
    customRanking: ['desc(ranking.hasPicture)'],
    attributesForFaceting: ['alignment', 'domains'],
    attributesToSnippet: ['description'],
  };

  indexing.verbose();
  indexing.config({
    batchMaxSize: 100,
  });

  try {
    const files = await glob('./data/*.json');
    const records = _.flatten(await pMap(files, readJson));
    await indexing.fullAtomic(credentials, records, settings);
  } catch (err) {
    consoleError(err.message);
    process.exit(1);
  }
})();
