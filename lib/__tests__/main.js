const current = require('../main.js');
const aoinan = require('aoinan');

describe('pantheon', () => {
  beforeEach(() => {
    current.init('./fixtures');
  });
  describe('name', () => {
    it.each([['Iomedae', 'Iomedae']])('%s: %s', async (input, expected) => {
      expect(current.name(await aoinan.page(input))).toEqual(expected);
    });
  });
  describe('pronunciation', () => {
    it.each([
      ['Iomedae', 'ahy-OH-meh-day'],
      ['Besmara', 'bes-MAR-uh'],
    ])('%s: %s', async (input, expected) => {
      expect(current.pronunciation(await aoinan.page(input))).toEqual(expected);
    });
  });
  describe('description', () => {
    it.each([
      [
        'Iomedae',
        "Iomedae is the goddess of righteous valor, justice, and honor. Having served as Aroden's herald, she inherited many of the Last Azlanti's followers upon his death, and continues to espouse the ideas of honor and righteousness in the defense of good and the battle against evil.",
      ],
    ])('%s', async (input, expected) => {
      expect(current.description(await aoinan.page(input))).toEqual(expected);
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
    it.each([
      ['Abhoth', 'Chaotic Neutral'],
      ['Lissala', 'Lawful Evil'],
      ['Janasini', 'Other'],
    ])('%s: %s', async (input, expected) => {
      expect(current.alignment(await aoinan.page(input))).toEqual(expected);
    });
  });
  describe('domains', () => {
    it.each([
      [
        'Abadar',
        [
          'Cities',
          'Duty',
          'Earth',
          'Law',
          'Nobility',
          'Protection',
          'Travel',
          'Wealth',
        ],
      ],
      ['Iomedae', ['Glory', 'Good', 'Law', 'Sun', 'War']],
      ['Diomazul', ['Destruction', 'Earth', 'Water', 'Zeal']],
      ['Arundhat', ['Healing', 'Magic', 'Nature', 'Protection']],
      [
        'Gruhastha',
        [
          'Animals',
          'Glyph',
          'Good',
          'Knowledge',
          'Law',
          'Nature',
          'Perfection',
          'Travel',
          'Truth',
        ],
      ],
    ])('%s', async (input, expected) => {
      expect(current.domains(await aoinan.page(input))).toEqual(expected);
    });
  });
  describe('worshipers', () => {
    it.each([
      ['Iomedae', ['Knights', 'Paladins', 'Warriors']],
      ['Fumeiyoshi', ['Oni', 'Undead']],
      ['Nocticula', ['Artists', 'Exiles']],
    ])('%s', async (input, expected) => {
      expect(current.worshipers(await aoinan.page(input))).toEqual(expected);
    });
  });
  describe('isMajor', () => {
    it.each([
      ['Iomedae', true], // Inner Sea Region
      ['Daikitsu', true], // Dragon Empires
      ['Achaekek', false], // Misc
    ])('%s: %s', async (input, expected) => {
      expect(current.isMajor(await aoinan.page(input))).toEqual(expected);
    });
  });
  describe('pantheons', () => {
    it.each([
      ['Iomedae', ['Inner Sea Region']],
      ['Lamashtu', ['Dragon Empires', 'Inner Sea Region']],
      ['Irori', ['Dragon Empires', 'Inner Sea Region', 'Vudran']],
    ])('%s: %s', async (input, expected) => {
      expect(current.pantheons(await aoinan.page(input))).toEqual(expected);
    });
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
      [
        'Azathoth',
        [
          'The Daemon Sultan',
          'The Primal Chaos',
          'The Blind Formless Chaos That Lies Behind the Stars',
          'Blind Idiot God',
        ],
      ],
    ])('%s', async (input, expected) => {
      expect(current.titles(await aoinan.page(input))).toEqual(expected);
    });
  });
  describe('remotePicture', () => {
    it.each([
      ['Abhoth', null],
      [
        'Azathoth',
        'https://pathfinderwiki.com/wiki/Special:Redirect/file/Azathoth.jpg',
      ],
      [
        'Sarenrae',
        'https://pathfinderwiki.com/wiki/Special:Redirect/file/Sarenrae_holy_symbol.jpg',
      ],
    ])('%s: %s', async (input, expected) => {
      expect(current.remotePicture(await aoinan.page(input))).toEqual(expected);
    });
  });
});
