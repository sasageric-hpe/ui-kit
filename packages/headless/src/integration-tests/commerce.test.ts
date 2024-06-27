import {
  CommerceEngine,
  buildCommerceEngine,
  CommerceEngineConfiguration,
} from '../app/commerce-engine/commerce-engine';
import {getSampleCommerceEngineConfiguration} from '../app/commerce-engine/commerce-engine-configuration';
import {ProductListing} from '../controllers/commerce/product-listing/headless-product-listing';
import {buildProductListing} from '../controllers/commerce/product-listing/headless-product-listing';
import {buildRecommendations} from '../controllers/commerce/recommendations/headless-recommendations';
import {buildSearchBox} from '../controllers/commerce/search-box/headless-search-box';
import {buildSearch} from '../controllers/commerce/search/headless-search';
import {waitForNextStateChange} from '../test/functional-test-utils';

describe.skip('commerce', () => {
  let configuration: CommerceEngineConfiguration;
  let engine: CommerceEngine;

  beforeAll(async () => {
    Object.defineProperty(global, 'document', {
      value: {referrer: 'referrer'},
      configurable: true,
    });

    configuration = getSampleCommerceEngineConfiguration();
    engine = buildCommerceEngine({
      configuration,
      loggerOptions: {level: 'silent'},
    });
  });

  describe('product listing', () => {
    let productListing: ProductListing;

    const fetchProductListing = async () => {
      await waitForNextStateChange(productListing, {
        action: () => productListing.refresh(),
        expectedSubscriberCalls: 2,
      });
    };

    beforeAll(async () => {
      productListing = buildProductListing(engine);
      await fetchProductListing();
    });

    it('uses the context to fetch the product listing', async () => {
      expect(productListing.state.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            ec_name: 'Lime Surfboard',
          }),
          expect.objectContaining({
            ec_name: 'Sunnysurf Surfboard',
          }),
          expect.objectContaining({
            ec_name: 'Eco-Surf',
          }),
        ])
      );
    });

    it('applies sort to product listing', async () => {
      const sort = productListing.sort();
      const differentSort = sort.state.availableSorts.find(
        (availableSort) => !sort.isSortedBy(availableSort)
      )!;

      await waitForNextStateChange(sort, {
        action: () => sort.sortBy(differentSort),
      });

      expect(sort.isSortedBy(differentSort)).toBeTruthy();
      expect(sort.isAvailable(differentSort)).toBeTruthy();
      expect(sort.state.availableSorts.length).toEqual(3);
    });

    it('has selectable facets', async () => {
      const facetGenerator = productListing.facetGenerator();
      const controllers = facetGenerator.facets;
      const facetController = controllers[0];

      await waitForNextStateChange(productListing, {
        action: () => {
          switch (facetController.type) {
            case 'numericalRange':
              facetController.toggleSelect(facetController.state.values[0]);
              break;
            case 'dateRange':
              facetController.toggleSelect(facetController.state.values[0]);
              break;
            case 'regular':
              facetController.toggleSelect(facetController.state.values[0]);
              break;
            case 'hierarchical':
              facetController.toggleSelect(facetController.state.values[0]);
              break;
            default:
              break;
          }
        },
        expectedSubscriberCalls: 2,
      });

      expect(facetController.state.values[0].state).toEqual('selected');
    });
  });

  it('searches', async () => {
    const searchBox = buildSearchBox(engine);
    searchBox.updateText('yellow');

    const search = buildSearch(engine);

    await waitForNextStateChange(search, {
      action: () => search.executeFirstSearch(),
      expectedSubscriberCalls: 2,
    });

    expect(search.state.products).not.toEqual([]);
  });

  it('provides suggestions', async () => {
    const box = buildSearchBox(engine);
    await waitForNextStateChange(box, {
      action: () => box.updateText('l'),
      expectedSubscriberCalls: 3,
    });

    expect(box.state.suggestions).not.toEqual([]);
  });

  it('provides recommendations', async () => {
    const recommendations = buildRecommendations(engine, {
      options: {
        slotId: 'abccdea4-7d8d-4d56-b593-20267083f88f',
      },
    });
    await waitForNextStateChange(recommendations, {
      action: () => recommendations.refresh(),
      expectedSubscriberCalls: 2,
    });

    expect(recommendations.state.products).not.toEqual([]);
  });
});
