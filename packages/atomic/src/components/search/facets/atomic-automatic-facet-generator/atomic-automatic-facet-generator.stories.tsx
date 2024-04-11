import defaultStory from 'atomic-storybook/default-story';
import {html} from 'lit-html';

const {defaultModuleExport, exportedStory} = defaultStory(
  'atomic-automatic-facet-generator',
  {desiredCount: '2', areCollapsed: 'false'},
  {
    engineConfig: {
      preprocessRequest: (r) => {
        const parsed = JSON.parse(r.body as string);
        // add this selected facet in the request because facet generated by this query are better than the default ones.
        parsed.facets = [
          {
            filterFacetCount: true,
            injectionDepth: 1000,
            numberOfValues: 6,
            sortCriteria: 'automatic',
            type: 'specific',
            currentValues: [
              {
                value: 'Animalia',
                state: 'selected',
              },
            ],
            freezeCurrentValues: false,
            isFieldExpanded: false,
            preventAutoSelect: true,
            facetId: 'inat_kingdom',
            field: 'inat_kingdom',
            hasBreadcrumbs: false,
          },
        ];
        r.body = JSON.stringify(parsed);
        return r;
      },
    },
    additionalMarkup: () =>
      html`<div>
        <div style="text-align:center; font-size:18px; margin-top:10px;">
          To modify the shadow parts of these automatic facets, see
          <a
            style="color: #399ffe;"
            href="https://docs.coveo.com/en/atomic/latest/reference/components/atomic-automatic-facet/"
            >documentation</a
          >.
        </div>
        <style>
          atomic-automatic-facet-generator {
            gap: 10px;
            display: flex;
            flex-direction: column;
          }
        </style>
      </div>`,
  }
);
export default {
  ...defaultModuleExport,
  title: 'Atomic/AutomaticFacetGenerator',
  id: 'atomic-automatic-facet-generator',
};
export const Default = exportedStory;
