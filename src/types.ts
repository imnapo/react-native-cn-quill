import type { formatType, formatValueType } from './constants/formats';

export interface format {
  name: string;
  defaults?: Array<formatDefault>;
  type: formatType;
}

export interface formatDefault {
  name: string;
  value: string | number | boolean;
  type: formatValueType;
}

export interface ToggleData {
  name: string;
  valueOn: any;
  valueOff: any;
  source: any;
  type: formatType.toggle | formatType.color | formatType.icon;
}

export interface ColorListData {
  name: string;
  source: any;
  values: Array<ToggleData>;
  type: formatType.color;
}

export interface IconListData {
  name: string;
  source: any;
  values: Array<ToggleData>;
  type: formatType.select;
}

export interface TextListData {
  name: string;
  values: Array<ToggleData>;
  type: formatType.select;
}

export interface ToolbarTheme {
  background: string;
  color: string;
  overlay: string;
  size: number;
}

export interface EditorMessage {
  type: string;
  data: any;
  key?: string;
}

export interface EditorResponse {
  key: string;
  resolve: Function;
}
