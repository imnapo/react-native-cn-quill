export const create_quill = `
<script>
var quill = new Quill('#editor-container', {
  modules: {
    toolbar: false
  },
  placeholder: 'Write here',
  theme: 'snow'
});
</script>
`;
