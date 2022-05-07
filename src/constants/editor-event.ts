export type EditorEventType =
  | 'format-change'
  | 'selection-change'
  | 'text-change'
  | 'editor-change'
  | 'html-change'
  | 'dimensions-change'
  | 'blur'
  | 'focus';

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

export interface DimensionsChangeData {
  width: number;
  height: number;
}

export type EditorChangeHandler = (eventName: string,
  ...args: Array<any>) => void;
export type TextChangeHandler = (
  delta: any,
  oldDelta: any,
  source: string
) => void;
export type SelectionChangeHandler = (
  range: { index: number; length: number } | null,
  oldRange: { index: number; length: number } | null,
  source: string
) => void;
export type FormatChangeHandler = (data: FormatChangeData) => void;
export type HtmlChangeHandler = (data: HtmlChangeData) => void;
export type DimensionsChangeHandler = (data: DimensionsChangeData) => void;

export type EditorEventHandler =
  | EditorChangeHandler
  | TextChangeHandler
  | SelectionChangeHandler
  | FormatChangeHandler
  | HtmlChangeHandler
  | DimensionsChangeHandler;

export type EditorCommonHandler =
  | FormatChangeHandler
  | HtmlChangeHandler;

export type Range = { index: number; length: number };
