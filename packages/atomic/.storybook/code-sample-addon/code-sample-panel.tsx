import React, {useRef} from 'react';
import {useArgs, useParameter} from '@storybook/api';
import {
  DefaultStoryAdvancedConfig,
  renderArgsToHTMLString,
  renderShadowPartsToStyleString,
} from '../default-story-shared';
import MonacoEditor from '@monaco-editor/react';
import {renderArgsToResultTemplate} from '../default-result-component-story';
import {delay} from 'lodash';
interface StoryParameters {
  componentTag: string;
  isResultComponent: boolean;
  advancedConfig: DefaultStoryAdvancedConfig;
}

const addSpacingBetweenStylingAndHTML = (
  htmlString: string,
  styleString: string
) => {
  if (styleString && htmlString) {
    return `${styleString} \n\n ${htmlString}`;
  }
  return styleString ? styleString : htmlString;
};

export const CodeSamplePanel = () => {
  const storyParameters = useParameter('shadowParts', null);
  const [args, _] = useArgs();
  const monacoEditorRef = useRef(null);

  if (!storyParameters) {
    return '';
  }
  const {componentTag, isResultComponent, advancedConfig} =
    storyParameters as StoryParameters;

  const styleString = renderShadowPartsToStyleString(componentTag, args);
  const htmlString = isResultComponent
    ? renderArgsToResultTemplate(
        renderArgsToHTMLString(componentTag, args, advancedConfig),
        () => args,
        false
      )
    : renderArgsToHTMLString(componentTag, args, advancedConfig);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        position: 'relative',
      }}
    >
      <MonacoEditor
        width="100%"
        height="800px"
        theme="vs-dark"
        defaultValue={''}
        value={addSpacingBetweenStylingAndHTML(htmlString, styleString)}
        defaultLanguage="html"
        options={{
          theme: 'vs-dark',
          minimap: {
            enabled: false,
          },
        }}
        onMount={(editor, _) => {
          monacoEditorRef.current = editor;

          delay(
            () => editor.getAction('editor.action.formatDocument').run(),
            100
          );
          editor.onDidFocusEditorText(() => {
            editor.setScrollTop(0);
            editor.updateOptions({readOnly: true});
          });
          editor.onDidChangeModelContent(() =>
            editor.getAction('editor.action.formatDocument').run()
          );
        }}
      />
      <button
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          backgroundColor: 'white',
          border: '1px solid rgba(0,0,0,0.1)',
          borderRadius: '5px 0px 0px 5px',
          padding: '5px 13px',
          fontSize: '12px',
          fontWeight: 'bold',
          cursor: 'copy',
        }}
        onClick={() => {
          navigator.clipboard.writeText(monacoEditorRef.current.getValue());
        }}
      >
        Copy
      </button>
    </div>
  );
};
