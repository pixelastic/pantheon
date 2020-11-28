const current = require('../main.js');
const aoinan = require('aoinan');

describe('gods', () => {
  beforeEach(() => {
    current.init('./fixtures');
  });
  describe('name', () => {
    it.each([['Iomedae', 'Iomedae']])('%s: %s', async (input, expected) => {
      expect(current.name(await aoinan.page(input))).toEqual(expected);
    });
  });
  describe('url', () => {
    it.each([['Tiamat', 'https://pathfinderwiki.com/wiki/Tiamat']])(
      '%s: %s',
      async (input, expected) => {
        expect(current.url(input)).toEqual(expected);
      }
    );
  });
  describe('alignment', () => {
    it.each([['Abhoth', 'Chaotic Neutral']])(
      '%s: %s',
      async (input, expected) => {
        expect(current.alignment(await aoinan.page(input))).toEqual(expected);
      }
    );
  });
  describe('titles', () => {
    it.each([
      [
        'Abhoth',
        [
          'The Source of Uncleanness',
          "The Primal Clay of Life's First Lurch",
          'The Unclean God',
        ],
      ],
      ['Haggakal', []],
      ['Iomedae', ['The Inheritor', 'Light of the Sword', 'Lady of Valor']],
    ])('%s', async (input, expected) => {
      expect(current.titles(await aoinan.page(input))).toEqual(expected);
    });
  });
  describe('symbolPicture', () => {
    it.each([['Abhoth', null]])('%s: %s', async (input, expected) => {
      expect(current.symbolPicture(await aoinan.page(input))).toEqual(expected);
    });
  });
});
