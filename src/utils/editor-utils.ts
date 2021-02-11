import {
  create_quill,
  editor_css,
  editor_js,
  quill_css,
  quill_js,
} from '../constants/editor';

export const createHtml = () => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, user-scalable=1.0,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0">
  ${quill_css}
  ${editor_css}
  </head>
  <body>
  <div id="standalone-container">
  <div id="editor-container"></div>
  </div>
  ${quill_js}
  ${create_quill}
  ${editor_js}
  </body>
  </html>
  `;
};
