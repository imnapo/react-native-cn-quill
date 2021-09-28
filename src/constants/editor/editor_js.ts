export const editor_js = `
<script>
(function (doc) {

  var sendMessage = function (message) {
    if (window.ReactNativeWebView)
      window.ReactNativeWebView.postMessage(message);
      else console.log(message)
  }

  var getSelectedFormats = function () {
    var formats = quill.getFormat();
      var contentChanged = JSON.stringify({
                type: 'format-change',
                data: {formats} });
      sendMessage(contentChanged);
  }
  //Format text at user’s current selection
  var formatSelection = function (name, value) {
    var range = quill.getSelection();
    if (!range) quill.focus();
    quill.format(name, value);
    getSelectedFormats();
  }

  var hasFocus = function (key) {
    var hs = quill.hasFocus();
 
    var hsJson = JSON.stringify({
                type: 'has-focus',
                key: key,
                data: hs });
      sendMessage(hsJson);
  }

  var getContents = function (key, index, length) {
    var getContentsData = quill.getContents(index, length);
    var getContentsDataJson = JSON.stringify({
      type: 'get-contents',
      key: key,
      data: getContentsData });
      sendMessage(getContentsDataJson);
  }

  var getText = function (key, index, length) {
    var getTextData = quill.getText(index, length);
    var getTextDataJson = JSON.stringify({
      type: 'get-text',
      key: key,
      data: getTextData });
      sendMessage(getTextDataJson);
  }

  var getLength = function (key) {
    var getLengthData = quill.getLength();
    var getLengthDataJson = JSON.stringify({
      type: 'get-length',
      key: key,
      data: getLengthData });
      sendMessage(getLengthDataJson);
  }

  var getHtml = function (key) {
    var html = quill.root.innerHTML;
    var getHtmlJson = JSON.stringify({
      type: 'get-html',
      key: key,
      data: html });
      sendMessage(getHtmlJson);
  }

  var insertEmbed = function (index, type, value) {
    quill.insertEmbed(index, type, value);
  }

  var insertText = function (index, text, formats={}) {
    console.log('InsertText TS');
    var ind = index;
    if (ind == null) {
      var range = quill.getSelection();
      if (range) { 
      ind = range.index;
      }
    }
    quill.insertText(ind, text, formats);
  }

  var setContents = function (delta) {
    quill.setContents(delta);
  }

  var setText = function (text) {
    quill.setText(text);
  }

  var updateContents = function (delta) {
    quill.updateContents(delta);
  }

  var dangerouslyPasteHTML = function (index, html) {
    quill.clipboard.dangerouslyPasteHTML(index, html);
  }

  var getRequest = function (event) {
    var msg = JSON.parse(event.data);    
    switch (msg.command) {
      case 'format':
        formatSelection(msg.name, msg.value);
        break;
      case 'focus':
        quill.focus();
        break;
      case 'blur':
        quill.blur();
        break;
      case 'enable':
        quill.enable(msg.value);
        break;
      case 'hasFocus':
        hasFocus(msg.key);
        break;
      case 'deleteText':
        quill.deleteText(msg.index, msg.length);
        break;
      case 'getContents':
        getContents(msg.key, msg.index, msg.length);
        break;
      case 'getText':
        getText(msg.key, msg.index, msg.length);
        break;
      case 'getHtml':
        getHtml(msg.key);
        break;
      case 'getLength':
        getLength(msg.key);
        break;
      case 'insertEmbed':
        insertEmbed(msg.index, msg.type, msg.value);
        break;
      case 'insertText':
        insertText(msg.index, msg.text, msg.formats);
        break;
      case 'setContents':
        setContents(msg.delta);
        break;
      case 'setText':
        setText(msg.text);
        break;
      case 'updateContents':
        updateContents(msg.delta);
        break;
      case 'dangerouslyPasteHTML':
        dangerouslyPasteHTML(msg.index, msg.html);
        break;
      default:
        break;
    }
  };

  document.addEventListener("message", getRequest, false);
  window.addEventListener("message", getRequest, false);
 
  quill.on('editor-change', function(eventName, ...args) {
    if (eventName === 'text-change') {
      getSelectedFormats();
    } else if (eventName === 'selection-change') {
      var range = quill.getSelection();
      if (range) {
        getSelectedFormats();
      } 
    }
    var getEditorChange = JSON.stringify({
      type: 'editor-change',
      data: { eventName, args } });
      sendMessage(getEditorChange);
  });

  quill.on('text-change', function(delta, oldDelta, source) {
    var getTextChange = JSON.stringify({
      type: 'text-change',
      data: { delta, oldDelta, source } });
      sendMessage(getTextChange);

      var html = quill.root.innerHTML;
      var getHtmlJson = JSON.stringify({
        type: 'html-change',
        data: { html } });
        sendMessage(getHtmlJson);
  });

  quill.on('selection-change', function(range, oldRange, source) {
    var getSelectionChange = JSON.stringify({
      type: 'selection-change',
      data: { range, oldRange, source } });
      sendMessage(getSelectionChange)
  });
  
  quill.root.addEventListener('blur', function () {
    sendMessage(JSON.stringify({type: 'blur'}));
  });

  quill.root.addEventListener('focus', function () {
    sendMessage(JSON.stringify({type: 'focus'}));
  });

})(document)
</script>
`;
