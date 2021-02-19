export const editor_css = (
  editorId: string,
  containerId: string,
  color = 'rgb(32, 35, 42)',
  background = 'white',
  placeholder = 'rgba(0,0,0,0.6)'
) => `
<style>
* {outline: 0px solid transparent;-webkit-tap-highlight-color: rgba(0,0,0,0);-webkit-touch-callout: none;box-sizing: border-box;}
html, body { margin: 0; padding: 0; height: 100%;}
body { overflow-y: hidden; -webkit-overflow-scrolling: touch;background-color: ${background};}
#${containerId} {color: ${color}; width: 100%;height: 100%;  -webkit-overflow-scrolling: touch;padding-left: 0;padding-right: 0;}
#${editorId} {
  height: 100%;
  outline: 0; overflow-y: auto;
  padding: 0;
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
</style>
`;
