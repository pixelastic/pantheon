const lazyloadHelper = require('norska-theme-search/lazyloadHelper');

module.exports = {
  img(item) {
    if (!item.picture) {
      return false;
    }
    const slug = item.slug;
    const originUrl = `https://gamemaster.pixelastic.com/pantheon/pictures/${slug}.png`;
    const options = {
      cloudinary: 'pixelastic-pantheon',
      imoen: item.picture,
      uuid: item.objectID,
    };
    const img = lazyloadHelper.attributes(originUrl, options);

    return img;
  },
  displayDomains(item) {
    return item.domains.join(', ');
  },
};
