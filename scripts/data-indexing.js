const indexing = require('algolia-indexing');
const readJson = require('firost/readJson');
const glob = require('firost/glob');
const consoleError = require('firost/consoleError');
const pMap = require('golgoth/pMap');
const config = require('../src/_scripts/config.js');
const _ = require('golgoth/lodash');

(async function () {
  const credentials = {
    appId: config.credentials.appId,
    apiKey: process.env.ALGOLIA_API_KEY,
    indexName: config.credentials.indexName,
  };
  const settings = {
    searchableAttributes: [
      'name',
      'unordered(description)',
      'unordered(titles)',
      'unordered(domains)',
    ],
    customRanking: [
      'desc(ranking.isMajor)',
      'desc(ranking.hasPicture)',
      'asc(name)',
    ],
    attributesForFaceting: ['alignment', 'domains'],
    attributesToSnippet: ['description:75'],
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
