import {Schema, StringValue} from '@coveo/bueno';
import {PostprocessSearchResponseMiddleware} from '../../api/search/search-api-client-middleware.js';
import {nonEmptyString} from '../../utils/validate-payload.js';
import {
  EngineConfiguration,
  engineConfigurationDefinitions,
  getSampleEngineConfiguration,
} from '../engine-configuration.js';

/**
 * The recommendation engine configuration.
 */
export interface RecommendationEngineConfiguration extends EngineConfiguration {
  /**
   * Specifies the name of the query pipeline to use for the query. If not specified, the default query pipeline will be used.
   */
  pipeline?: string;

  /**
   * The first level of origin of the request, typically the identifier of the graphical search interface from which the request originates.
   * Coveo Machine Learning models use this information to provide contextually relevant output.
   * Notes:
   *    This parameter will be overridden if the search request is authenticated by a search token that enforces a specific searchHub.
   *    When logging a Search usage analytics event for a query, the originLevel1 field of that event should be set to the value of the searchHub search request parameter.
   */
  searchHub?: string;

  /**
   * The locale of the current user. Must comply with IETF’s BCP 47 definition: https://www.rfc-editor.org/rfc/bcp/bcp47.txt.
   *
   * Notes:
   *  Coveo Machine Learning models use this information to provide contextually relevant output.
   *  Moreover, this information can be referred to in query expressions and QPL statements by using the $locale object.
   */
  locale?: string;
  /**
   * The [tz database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) identifier of the time zone to use to correctly interpret dates in the query expression, facets, and result items.
   * By default, the timezone will be [guessed](https://day.js.org/docs/en/timezone/guessing-user-timezone).
   *
   * @example
   * America/Montreal
   */
  timezone?: string;
  /**
   * Allows for augmenting a search response before the state is updated.
   */
  preprocessSearchResponseMiddleware?: PostprocessSearchResponseMiddleware;
  /**
   * The base URL to use to proxy Coveo search requests (e.g., `https://example.com/search`).
   *
   * This is an advanced option that you should only set if you need to proxy Coveo search requests through your own
   * server. In most cases, you should not set this option.
   *
   * By default, no proxy is used and the Coveo Search API requests are sent directly to the Coveo platform through the
   * search [organization endpoint](https://docs.coveo.com/en/mcc80216) resolved from the `organizationId` and
   * `environment` values provided in your engine configuration (i.e., `https://<organizationId>.org.coveo.com` or
   * `https://<organizationId>.org<environment>.coveo.com`, if the `environment` values is specified and different from
   * `prod`).
   *
   * If you set this option, you must also implement the following proxy endpoints on your server, otherwise the recommendation
   * engine will not work properly:
   *
   * - `POST` `/` to proxy requests to [`POST` `https://<organizationId>.org<environment|>.coveo.com/rest/search/v2`](https://docs.coveo.com/en/13/api-reference/search-api#tag/Search-V2/operation/searchUsingPost)
   * - `POST` `/plan` to proxy requests to [`POST` `https://<organizationId>.org<environment|>.coveo.com/rest/search/v2/plan`](https://docs.coveo.com/en/13/api-reference/search-api#tag/Search-V2/operation/planSearchUsingPost)
   * - `POST` `/querySuggest` to proxy requests to [`POST` `https://<organizationId>.org<environment|>.coveo.com/rest/search/v2/querySuggest`](https://docs.coveo.com/en/13/api-reference/search-api#tag/Search-V2/operation/querySuggestPost)
   * - `POST` `/facet` to proxy requests to [`POST` `https://<organizationId>.org<environment|>.coveo.com/rest/search/v2/facet`](https://docs.coveo.com/en/13/api-reference/search-api#tag/Search-V2/operation/facetSearch)
   * - `POST` `/html` to proxy requests to [`POST` `https://<organizationId>.org<environment|>.coveo.com/rest/search/v2/html`](https://docs.coveo.com/en/13/api-reference/search-api#tag/Search-V2/operation/htmlPost)
   * - `GET` `/fields` to proxy requests to [`GET` `https://<organizationId>.org<environment|>.coveo.com/rest/search/v2/fields`](https://docs.coveo.com/en/13/api-reference/search-api#tag/Search-V2/operation/fields)
   */
  proxyBaseUrl?: string;
}

export const recommendationEngineConfigurationSchema =
  new Schema<RecommendationEngineConfiguration>({
    ...engineConfigurationDefinitions,
    pipeline: new StringValue({required: false, emptyAllowed: true}),
    searchHub: nonEmptyString,
    locale: nonEmptyString,
    timezone: nonEmptyString,
  });

/**
 * Creates a sample recommendation engine configuration.
 *
 * @returns The sample recommendation engine configuration.
 */
export function getSampleRecommendationEngineConfiguration(): RecommendationEngineConfiguration {
  return {
    ...getSampleEngineConfiguration(),
    searchHub: 'default',
  };
}
