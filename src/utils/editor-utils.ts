import {
  create_quill,
  editor_css,
  editor_js,
  quill_bubble_css,
  quill_snow_css,
  quill_js,
} from '../constants/editor';

interface CreateHtmlArgs {
  initialHtml?: string;
  placeholder: string;
  toolbar: string;
  libraries: 'local' | 'cdn';
  theme: 'snow' | 'bubble';
  editorId: string;
  containerId: string;
  color: string;
  backgroundColor: string;
  placeholderColor: string;
}

const Inital_Args = {
  initialHtml: '',
  placeholder: 'write here',
  toolbar: 'false',
  libraries: 'local',
  theme: 'snow',
  editorId: 'editor-container',
  containerId: 'standalone-container',
  color: 'black',
  backgroundColor: 'white',
  placeholderColor: 'rgba(0,0,0,0.6)',
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
    args.color,
    args.backgroundColor,
    args.placeholderColor
  )}
  </head>
  <body>
  <div id="${args.containerId}">
  <div id="${args.editorId}">
    ${args.initialHtml}
  </div>
  </div>
  ${quill_js(args.libraries === 'cdn')}
  ${create_quill(args.editorId, args.toolbar, args.placeholder, args.theme)}
  ${editor_js}
  </body>
  </html>
  `;
};
