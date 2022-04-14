import QuillEditor from './editor/quill-editor';
import { QuillToolbar } from './toolbar/quill-toolbar';
import type {
  EditorEventHandler,
  EditorChangeData,
  FormatChangeData,
  HtmlChangeData,
  DimensionsChangeData,
  TextChangeHandler,
  SelectionChangeHandler,
} from './constants/editor-event';
import type { EditorProps } from './editor/quill-editor';
export default QuillEditor;
export { QuillToolbar };
export type {
  EditorEventHandler,
  EditorChangeData,
  FormatChangeData,
  HtmlChangeData,
  DimensionsChangeData,
  TextChangeHandler,
  SelectionChangeHandler,
  EditorProps,
};
