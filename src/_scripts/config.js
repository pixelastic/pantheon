const imageProxy = require('norska/frontend/imageProxy');
const lazyloadHelper = require('./lazyloadHelper');

module.exports = {
  credentials: {
    appId: 'O3F8QXYK6R',
    apiKey: '62e71c961e169577a037176652496736',
    indexName: 'gamemaster_gods',
  },
  hitName: 'god',
  placeholder: 'Search for any name, domain or title',
  // See documentation below for the widgets format
  widgets: [
    {
      title: 'Alignment',
      options: {
        attribute: 'alignment',
      },
    },
  ],
  transforms: {
    img(item) {
      const { slug } = item;
      const { hash, width, height, lqip } = item.picture;

      const baseUrl = 'https://gamemaster.pixelastic.com/gods/pictures/';
      const imageUrl = `${baseUrl}/${slug}.png?v=${hash}`;

      const full = imageProxy(imageUrl, {
        cloudinary: 'pixelastic-pantheon',
      });

      // If we have already downloaded the full version, we skip the placeholder
      // replacement
      const isAlreadyLoaded = lazyloadHelper.isLoaded(item.objectID);
      if (isAlreadyLoaded) {
        return {
          cssClass: '',
          placeholder: full,
          width,
          height,
        };
      }

      // Placeholder is a downscaled base64 version of the original image
      return {
        cssClass: 'lazyload',
        placeholder: lqip,
        full,
        width,
        height,
      };
    },
  },
};
