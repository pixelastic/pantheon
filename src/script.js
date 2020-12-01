// TODO: Maybe require('{theme}/frontend') and have it replace in js cmpile just
// like we did with style compile?
// And have the default theme do the lazyload
const theme = require('norska-theme-search-infinite/src/script.js');

(async () => {
  await theme.init({
    placeholder: 'Search for any name, domain or title',
    hitName: 'god',
    transforms: {
      titles(item) {
        return item.titles.join(', ');
      },
      domains(item) {
        return item.domains.join(', ');
      },
    },
  });
})();
