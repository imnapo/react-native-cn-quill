import type { CustomFont } from '../../types';

const getFontName = (font: string) => {
  return font.toLowerCase().replace(/\s/g, '-');
};

export const editor_css = (
  editorId: string,
  containerId: string,
  autoSize: boolean,
  color = 'rgb(32, 35, 42)',
  background = 'white',
  placeholder = 'rgba(0,0,0,0.6)',
  fonts: Array<CustomFont> = [],
  defaultFont: string | undefined = undefined
) => {
  let fontCss = '';
  fonts.forEach((f) => {
    fontCss = fontCss + ' ' + f.css;
  });

  fonts.forEach((f) => {
    fontCss =
      fontCss +
      `
      /* Set content font-families */
      .ql-font-${getFontName(f.name)} {
      font-family: "${f.name}";
      }
    `;
  });

  return `
<style>
* {outline: 0px solid transparent;-webkit-tap-highlight-color: rgba(0,0,0,0);-webkit-touch-callout: none;box-sizing: border-box;}
html, body { margin: 0; padding: 0; height: 100%;}
body { overflow-y: hidden; -webkit-overflow-scrolling: touch;background-color: ${background};}
#${containerId} {
  color: ${color};
  ${
    autoSize
      ? `
    display: inline-block;
  `
      : `
    height: 100%;
  `
  }
  width: 100%;
  -webkit-overflow-scrolling: touch;
  padding-left: 0;
  padding-right: 0;
}
#${editorId} {
  height: 100%;
  outline: 0;
  overflow-y: auto;
  padding: 0;
  ${defaultFont ? 'font-family: "' + defaultFont + '"' : ''}
}

#${editorId}:focus {
  outline: 0px solid transparent;
}

.ql-container.ql-snow {
  border: none;
}

.ql-container > .ql-editor.ql-blank::before{
  color: ${placeholder};
}

${fontCss}


</style>
`;
};
