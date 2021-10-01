export const create_quill = (
  id: string,
  toolbar: 'false' | string,
  placeholder: string,
  theme: 'snow' | 'bubble',
  customFonts: Array<string> = [],
  customJS: string
) => {
  let font = '';
  if (customFonts.length > 0) {
    const fontList = "'" + customFonts.join("','") + "'";
    font = `
    // Add fonts to whitelist
    var Font = Quill.import('formats/font');
    Font.whitelist = [${fontList}];
    Quill.register(Font, true);

    `;
  }

  return `
  <script>
  
  ${font}
  ${customJS}
  var quill = new Quill('#${id}', {
    modules: {
      toolbar: ${toolbar}
    },
    placeholder: '${placeholder}',
    theme: '${theme}'
  });
  </script>
  `;
};
