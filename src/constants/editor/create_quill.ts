export const create_quill = (
  id: string,
  toolbar: 'false' | string,
  placeholder: string,
  theme: 'snow' | 'bubble'
) => `
<script>
var quill = new Quill('#${id}', {
  modules: {
    toolbar: ${toolbar}
  },
  placeholder: '${placeholder}',
  theme: '${theme}'
});
</script>
`;
