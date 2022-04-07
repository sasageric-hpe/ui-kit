import {ResultTemplate, ResultTemplateCondition} from '@coveo/headless';
import {Component, Element, Prop, State, Method} from '@stencil/core';
import {MapProp} from '../../utils/props-utils';
import {ResultTemplateCommon} from '../result-templates/result-template-common';

/**
 * TODO:
 * @internal
 */
@Component({
  tag: 'atomic-result-children-template',
  shadow: true,
})
export class AtomicResultChildrenTemplate {
  @Element() public host!: HTMLDivElement;

  @State() public error!: Error;

  /**
   * A function that must return true on results for the result template to apply.
   *
   * For example, a template with the following condition only applies to results whose `title` contains `singapore`:
   * `[(result) => /singapore/i.test(result.title)]`
   */
  @Prop() public conditions: ResultTemplateCondition[] = [];

  /**
   * Fields and field values that results must match for the result template to apply.
   *
   * For example, a template with the following attribute only applies to result items whose `filetype` is `lithiummessage` or `YouTubePlaylist`: `must-match-filetype="lithiummessage,YouTubePlaylist"`
   */
  @MapProp({splitValues: true}) public mustMatch: Record<string, string[]> = {};

  /**
   * Fields and field values that results must not match for the result template to apply.
   *
   * For example, a template with the following attribute only applies to result items whose `filetype` is not `lithiummessage`: `must-not-match-filetype="lithiummessage"`
   */
  @MapProp({splitValues: true}) public mustNotMatch: Record<string, string[]> =
    {};

  public resultTemplateCommon: ResultTemplateCommon;

  constructor() {
    this.resultTemplateCommon = new ResultTemplateCommon({
      host: this.host,
      setError: (err) => {
        this.error = err;
      },
      validParents: ['atomic-result-children'],
    });
  }

  /**
   * Gets the appropriate result template based on conditions applied.
   */
  @Method()
  public async getTemplate(): Promise<ResultTemplate<DocumentFragment> | null> {
    return this.resultTemplateCommon.getTemplate(this.conditions, this.error);
  }

  public componentWillLoad() {
    this.resultTemplateCommon.addMatchConditions(
      this.mustMatch,
      this.mustNotMatch
    );
  }

  public render() {
    return this.resultTemplateCommon.renderIfError(this.error);
  }
}
