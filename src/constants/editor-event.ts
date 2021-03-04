export type EditorEventType =
  | 'format-change'
  | 'selection-change'
  | 'text-change'
  | 'editor-change'
  | 'html-change'
  | 'blur'
  | 'focus';

export interface SelectionChangeData {
  range: { index: number; length: number } | null;
  oldRange: { index: number; length: number } | null;
  source: string;
}

export interface TextChangeData {
  delta: any;
  oldDelta: any;
  source: string;
  html: string;
}

export interface HtmlChangeData {
  html: string;
}

export interface EditorChangeData {
  eventName: string;
  args: Array<any>;
}

export interface FormatChangeData {
  formats: any;
}

export type EditorChangeHandler = (data: EditorChangeData) => void;
export type TextChangeHandler = (data: TextChangeData) => void;
export type SelectionChangeHandler = (data: SelectionChangeData) => void;
export type FormatChangeHandler = (data: FormatChangeData) => void;
export type HtmlChangeHandler = (data: HtmlChangeData) => void;

export type EditorEventHandler =
  | EditorChangeHandler
  | TextChangeHandler
  | SelectionChangeHandler
  | FormatChangeHandler
  | HtmlChangeHandler;
