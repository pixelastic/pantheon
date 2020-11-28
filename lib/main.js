const aoinan = require('aoinan');
const path = require('path');
const _ = require('golgoth/lib/lodash');

module.exports = {
  baseUrl: 'https://pathfinderwiki.com/wiki/',
  init(cacheLocation = '.cache') {
    this.cacheLocation = cacheLocation;
    aoinan.init({
      server: 'pathfinderwiki.com',
      path: '/mediawiki',
      cacheLocation: path.resolve(cacheLocation, 'wiki'),
    });
  },
  async allNames() {
    const majorDeities = await aoinan.category('Major_deities');
    const minorDeities = await aoinan.category('Minor_deities');
    const blockList = [
      'Ascended',
      'Azghat',
      'Cloud Sisters',
      'Manasaputra kumara',
    ];
    return _.chain(majorDeities)
      .merge(minorDeities)
      .keys()
      .reject((key) => {
        return _.startsWith(key, 'Category:');
      })
      .reject((key) => {
        return _.includes(blockList, key);
      })
      .sort()
      .uniq()
      .value();
  },
  async record(godName) {
    const page = await aoinan.page(godName);
    const keys = [
      'name',
      'slug',
      'description',
      'titles',
      'alignment',
      'domains',
      'favoredWeapon',
      'worshipers',
      'edicts',
      'anathema',
      'symbol',
      'symbolPicture',
      'pronunciation',
    ];
    const record = _.transform(
      keys,
      (result, key) => {
        result[key] = this[key](page);
      },
      {}
    );
    record.url = this.url(godName);
    return record;
  },
  infobox(page) {
    return page.templates('Deity tabbed')[0] || page.templates('Deity')[0];
  },
  /**
   * Returns the wiki page URL
   * @param {string} pageName Name of the page
   * @returns {string} Page URL
   **/
  url(pageName) {
    const slug = aoinan.slug(pageName);
    return `${this.baseUrl}${slug}`;
  },
  description(page) {
    const rawDescription = page.sections(0).text();
    const pronunciation = this.pronunciation(page);
    return rawDescription.replace(` (pronounced ${pronunciation})`, '');
  },
  /**
   * Returns the god name
   * @param {object} page Aoinan page reference
   * @returns {string} God name
   **/
  name(page) {
    return page.name;
  },
  slug(page) {
    return _.camelCase(this.name(page));
  },
  /**
   * Returns the god alternative titles
   * @param {object} page Aoinan page reference
   * @returns {Array} God titles
   **/
  titles(page) {
    // Titles are using HTML to separate the entries, so we cannot read the
    // infobox object as HTML is stripped from there. Instead we'll need to
    // parse the raw infobox
    const regexp = /^\| *titles *= (?<titles>.*)$/;
    const matchingLine = _.chain(page.raw)
      .split('\n')
      .find((line) => {
        return line.match(regexp);
      })
      .value();

    if (!matchingLine) {
      return [];
    }

    const { titles } = matchingLine.match(regexp).groups;
    return _.chain(titles)
      .split(/<br>|<br \\>/)
      .map((rawTitle) => {
        // We cleanup each title
        return _.chain(page.__wtf(rawTitle).text())
          .replace('Azlanti period: ', '')
          .replace(';', '')
          .upperFirst()
          .value();
      })
      .value();
  },
  /**
   * Returns the alignment of the god
   * @param {object} page Aoinan page reference
   * @returns {string} God alignment
   **/
  alignment(page) {
    return _.startCase(this.infobox(page).alignment);
  },
  domains(page) {
    return _.chain(this.infobox(page).domains)
      .split(',')
      .map((domain) => {
        return _.chain(domain).trim().startCase().value();
      })
      .sort()
      .value();
  },
  favoredWeapon(page) {
    return this.infobox(page).weapon;
  },
  worshipers(page) {
    return _.chain(this.infobox(page).worshipers)
      .split(',')
      .map((worshiper) => {
        return _.chain(worshiper).trim().startCase().value();
      })
      .sort()
      .value();
  },
  edicts(page) {
    return this.infobox(page).edicts;
  },
  anathema(page) {
    return this.infobox(page).anathema;
  },
  symbol(page) {
    return this.infobox(page).symbol;
  },
  pronunciation(page) {
    const rawDescription = page.sections(0).text();
    const regexp = /\(pronounced (?<pronunciation>.*)\)/;
    const matches = rawDescription.match(regexp);
    return _.get(matches, 'groups.pronunciation');
  },
  /**
   * Returns the url of the god symbol
   * @param {object} page Aoinan page reference
   * @returns {string} URL to the god symbol
   **/
  symbolPicture(page) {
    const image = this.infobox(page).image;
    if (!image) {
      return null;
    }
    const symbolFileName = image.replace(/ /g, '_');
    return `https://pathfinderwiki.com/wiki/Special:Redirect/file/${symbolFileName}`;
  },
};
