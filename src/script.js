const theme = require('norska/theme');

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
