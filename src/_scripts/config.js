const transforms = require('./transforms');
let algoliaHelper = null;

module.exports = {
  credentials: {
    appId: 'O3F8QXYK6R',
    apiKey: '62e71c961e169577a037176652496736',
    indexName: 'gamemaster_gods',
  },
  hitName: 'god',
  placeholder: 'Search for any name, domain or title',
  onSearch(query, helper) {
    // Make the helper publicly accessible because we need it in the
    // transformItems
    algoliaHelper = helper;
  },
  widgets: [
    {
      title: 'Alignment',
      options: {
        attribute: 'alignment',
      },
    },
    // Pantheons is an inverted refinements. Selecting an item removes the
    // matching hits from the list. To achieve that, we hack around the default
    // RefinementList by adding a "-" at the start of each facet value, to
    // exclude them. We also set it to conjunctive (AND) and update the CSS
    // classes to invert the display, to make it look like everything is
    // selected on load.
    // Finally, we need to reconstruct the list manually by calling the helper
    // to add the list of current refinements, as they are no longer returned in
    // the widget
    {
      title: 'Pantheons',
      options: {
        attribute: 'pantheons',
        operator: 'and',
        limit: 100,
        cssClasses: {
          root: 'ais-InvertedRefinementList',
        },
        transformItems(items) {
          const updatedItems = [];
          const currentRefinements = algoliaHelper.getRefinements('pantheons');

          // First, add all the current refinements
          currentRefinements.forEach((currentRefinement) => {
            const { value } = currentRefinement;
            const label = value.replace(/^-/, '');
            updatedItems.push({
              value,
              label,
              highlighted: label,
              isRefined: true,
            });
          });

          // Then, all the items, but negating their value
          items.forEach((item) => {
            const { value } = item;
            updatedItems.push({
              ...item,
              value: `-${value}`,
            });
          });

          return updatedItems;
        },
      },
    },
  ],
  transforms,
};
