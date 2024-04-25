import type { CustomFont } from 'src/types';
import {
  create_quill,
  editor_css,
  editor_js,
  quill_bubble_css,
  quill_snow_css,
  quill_js,
} from '../constants/editor';

export const getFontName = (font: string) => {
  return font.toLowerCase().replace(/\s/g, '-');
};

interface CreateHtmlArgs {
  initialHtml?: string;
  placeholder: string;
  toolbar: string;
  clipboard?: string;
  keyboard?: string;
  formats?: string[];
  libraries: 'local' | 'cdn';
  theme: 'snow' | 'bubble';
  editorId: string;
  autoSize?: boolean;
  containerId: string;
  color: string;
  backgroundColor: string;
  placeholderColor: string;
  customStyles: string[];
  fonts: Array<CustomFont>;
  defaultFontFamily?: string;
  customJS?: string;
}

const Inital_Args = {
  initialHtml: '',
  placeholder: 'write here',
  toolbar: 'false',
  clipboard: '',
  keyboard: '',
  libraries: 'local',
  theme: 'snow',
  editorId: 'editor-container',
  autoSize: false,
  containerId: 'standalone-container',
  color: 'black',
  backgroundColor: 'white',
  placeholderColor: 'rgba(0,0,0,0.6)',
  customStyles: [],
  fonts: [],
  customJS: '',
} as CreateHtmlArgs;

export const createHtml = (args: CreateHtmlArgs = Inital_Args) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, user-scalable=1.0,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0">
  ${
    args.theme === 'bubble'
      ? quill_bubble_css(args.libraries === 'cdn')
      : quill_snow_css(args.libraries === 'cdn')
  }
  ${editor_css(
    args.editorId,
    args.containerId,
    !!args.autoSize,
    args.color,
    args.backgroundColor,
    args.placeholderColor,
    args.fonts,
    args.defaultFontFamily
  )}
  ${
    args.customStyles &&
    args.customStyles
      .map((style) => {
        return style.toLocaleLowerCase().trim().startsWith('<style>')
          ? style
          : `<style>${style}</style>`;
      })
      .join('\n')
  }

  </head>
  <body>
  <div id="${args.containerId}">
    <div id="${args.editorId}">
      ${args.initialHtml}
    </div>
  </div>
  ${quill_js(args.libraries === 'cdn')}
  ${create_quill({
    id: args.editorId,
    toolbar: args.toolbar,
    clipboard: args.clipboard ? args.clipboard : '',
    keyboard: args.keyboard ? args.keyboard : '',
    placeholder: args.placeholder,
    formats: args.formats,
    theme: args.theme,
    customFonts: args.fonts.map((f) => getFontName(f.name)),
    customJS: args.customJS ? args.customJS : '',
  })}
  ${editor_js}
  </body>
  </html>
  `;
};
