import type { ImageSourcePropType } from 'react-native';
import type { formatType, formatValueType } from './constants/formats';

export interface format {
  name: string;
  defaults?: Array<formatDefault>;
  type: formatType;
  allowCustoms?: boolean;
}

export interface formatDefault {
  name: string;
  value: string | number | boolean;
  type: formatValueType;
}

export interface ToggleData {
  name: string;
  valueOn: string | number | boolean;
  valueOff: string | number | boolean;
  source: ImageSourcePropType;
  type: formatType.toggle | formatType.color | formatType.icon;
}

export interface ColorListData {
  name: string;
  source: ImageSourcePropType;
  values: Array<ToggleData>;
  type: formatType.color;
}

export interface IconListData {
  name: string;
  source?: ImageSourcePropType;
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

export interface SampleArray {
  [index: number]: {
    action: string;
    handler: (name: string, value: any) => void;
  };
}

export interface ToolbarCustom {
  handler?: (name: string, value: any) => void;
  actions?: Array<string>;
  icons?: Record<string, any>;
}

export interface CustomFont {
  name: string;
  css: string;
}

export interface GetLeafResponse {
  offset: number;
  text: string;
  length: number;
  index: number;
  attributes: Record<string, string>;
}

export interface QuillConfig {
  id?: string;
  modules?: {
    toolbar: boolean | Array<Array<string | object> | string | object> | string;
    clipboard?: string;
    keyboard?: string;
  };
  theme?: 'snow' | 'bubble';
  placeholder: string;
  formats?: (
    | 'background'
    | 'bold'
    | 'color'
    | 'font'
    | 'code'
    | 'italic'
    | 'link'
    | 'size'
    | 'strike'
    | 'script'
    | 'underline'
    | 'blockquote'
    | 'header'
    | 'indent'
    | 'list'
    | 'align'
    | 'direction'
    | 'code-block'
    | 'formula'
    | 'image'
    | 'video'
  )[];
}

export type StyleFunc = (provided: object) => object;
export interface CustomStyles {
  toolbar?: {
    provider?: StyleFunc;
    root?: StyleFunc;
    toolset?: {
      root?: StyleFunc;
      listButton?: {
        overlay: StyleFunc;
        tool: StyleFunc;
        text: StyleFunc;
        image: StyleFunc;
      };
      colorListButton?: {
        overlay: StyleFunc;
        tool: StyleFunc;
        image: StyleFunc;
      };
    };
  };
  separator?: StyleFunc;
  selection?: {
    root?: StyleFunc;
    scroll?: StyleFunc;
    close?: {
      view?: StyleFunc;
      text?: StyleFunc;
    };
    textToggle?: {
      overlay?: StyleFunc;
      tool?: StyleFunc;
      text?: StyleFunc;
    };
    iconToggle?: {
      overlay?: StyleFunc;
      tool?: StyleFunc;
      image?: StyleFunc;
    };
    colorToggle?: {
      overlay?: StyleFunc;
      tool?: StyleFunc;
      noColor?: StyleFunc;
    };
  };
  // [fieldName: string]: (provided: StyleProp<ViewStyle>) => object;
}
