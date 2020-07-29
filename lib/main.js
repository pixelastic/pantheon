const aoinan = require('aoinan');
const path = require('path');
const _ = require('golgoth/lib/lodash');

module.exports = {
  init() {
    aoinan.init({
      server: 'pathfinderwiki.com',
      path: '/mediawiki',
      cacheLocation: path.resolve('./.cache/wiki'),
    });
  },
  async allNames() {
    const majorDeities = await aoinan.category('Major_deities');
    const minorDeities = await aoinan.category('Minor_deities');
    return _.chain(majorDeities)
      .merge(minorDeities)
      .keys()
      .reject((key) => {
        return _.startsWith(key, 'Category:');
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
      // 'followerAlignments', // TODO: Might require to parse HTML
      'edicts',
      'anathema',
      'symbol',
      'symbolPicture',
      'pronunciation',
    ];
    return _.transform(
      keys,
      (result, key) => {
        result[key] = this[key](page);
      },
      {}
    );
  },
  infobox(page) {
    return page.templates('Deity tabbed')[0];
  },
  description(page) {
    const rawDescription = page.sections(0).text();
    const pronunciation = this.pronunciation(page);
    return rawDescription.replace(` (pronounced ${pronunciation})`, '');
  },
  name(page) {
    return page.name;
  },
  slug(page) {
    return _.camelCase(this.name(page));
  },
  titles(page) {
    // Titles are using HTML to separate the entries, so we cannot read the
    // infobox object as HTML is stripped from there. Instead we'll need to
    // parse the raw infobox
    const regexp = /^\| *titles *= (?<titles>.*)$/;
    return _.chain(page.raw)
      .split('\n')
      .find((line) => {
        return line.match(regexp);
      })
      .thru((line) => {
        const { titles } = line.match(regexp).groups;
        return _.chain(titles)
          .split('<br>')
          .map((rawTitle) => {
            // We remove any markup
            return _.replace(
              page.__wtf(rawTitle).text(),
              'Azlanti period: ',
              ''
            );
          })
          .value();
      })
      .value();
  },
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
  symbolPicture(page) {
    const symbolFileName = this.infobox(page).image.replace(/ /g, '_');
    return `https://pathfinderwiki.com/wiki/Special:Redirect/file/${symbolFileName}`;
  },
};
