interface format {
  name: string;
  defaults?: Array<formatDefault>;
  type: formatType;
}

export enum formatType {
  toggle,
  select,
  color,
  icon,
}

export enum formatValueType {
  text,
  icon,
  color,
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

const colors = [
  "#000000",
  "#e60000",
  "#ff9900",
  "#ffff00",
  "#008a00",
  "#0066cc",
  "#9933ff",
  "#ffffff",
  "#facccc",
  "#ffebcc",
  "#ffffcc",
  "#cce8cc",
  "#cce0f5",
  "#ebd6ff",
  "#bbbbbb",
  "#f06666",
  "#ffc266",
  "#ffff66",
  "#66b966",
  "#66a3e0",
  "#c285ff",
  "#888888",
  "#a10000",
  "#b26b00",
  "#b2b200",
  "#006100",
  "#0047b2",
  "#6b24b2",
  "#444444",
  "#5c0000",
  "#663d00",
  "#666600",
  "#003700",
  "#002966",
  "#3d1466",
];

export const formats: Array<format> = [
  {
    name: "background",
    type: formatType.color,
    defaults: [
      {
        name: "no color",
        value: false,
        type: formatValueType.color,
      } as formatDefault,
      ...colors.map(
        (c) =>
          ({
            name: c,
            value: c,
            type: formatValueType.color,
          } as formatDefault)
      ),
    ],
  },
  {
    name: "color",
    type: formatType.color,
    defaults: [
      {
        name: "no color",
        value: false,
        type: formatValueType.color,
      } as formatDefault,
      ...colors.map(
        (c) =>
          ({
            name: c,
            value: c,
            type: formatValueType.color,
          } as formatDefault)
      ),
    ],
  },
  { name: "bold", type: formatType.toggle },
  { name: "italic", type: formatType.toggle },
  { name: "underline", type: formatType.toggle },
  {
    name: "header",
    defaults: [
      { name: "Normal", value: false, type: formatValueType.text },
      { name: "H1", value: 1, type: formatValueType.icon },
      { name: "H2", value: 2, type: formatValueType.icon },
      { name: "H3", value: 3, type: formatValueType.icon },
      { name: "H4", value: 4, type: formatValueType.text },
      { name: "H5", value: 5, type: formatValueType.text },
      { name: "H6", value: 6, type: formatValueType.text },
    ],
    type: formatType.select,
  },
  {
    name: "align",
    defaults: [
      { name: "left", value: false, type: formatValueType.icon },
      { name: "right", value: "right", type: formatValueType.icon },
      { name: "center", value: "center", type: formatValueType.icon },
      { name: "justify", value: "justify", type: formatValueType.icon },
    ],
    type: formatType.select,
  },
  {
    name: "font",
    defaults: [
      { name: "Sans Serif", value: false, type: formatValueType.text },
      { name: "Serif", value: "serif", type: formatValueType.text },
      { name: "Monospace", value: "monospace", type: formatValueType.text },
    ],
    type: formatType.select,
  },
  { name: "code", type: formatType.toggle },
  { name: "blockquote", type: formatType.toggle },
  { name: "strike", type: formatType.toggle },
  {
    name: "size",
    defaults: [
      { name: "small", value: "small", type: formatValueType.text },
      { name: "Normal", value: false, type: formatValueType.text },
      { name: "large", value: "large", type: formatValueType.text },
      { name: "huge", value: "huge", type: formatValueType.text },
    ],
    type: formatType.select,
  },
  {
    name: "script",
    defaults: [
      { name: "sub", value: "sub", type: formatValueType.icon },
      { name: "super", value: "super", type: formatValueType.icon },
    ],
    type: formatType.select,
  },
  {
    name: "list",
    defaults: [
      { name: "ordered", value: "ordered", type: formatValueType.icon },
      { name: "bullet", value: "bullet", type: formatValueType.icon },
    ],
    type: formatType.select,
  },
  {
    name: "indent",
    defaults: [
      { name: "-1", value: "-1", type: formatValueType.icon },
      { name: "+1", value: "+1", type: formatValueType.icon },
    ],
    type: formatType.select,
  },
  {
    name: "direction",
    defaults: [
      // { name: "", value: false },
      { name: "rtl", value: "rtl", type: formatValueType.icon },
    ],
    type: formatType.toggle,
  },
  { name: "code-block", type: formatType.toggle },
  { name: "formula", type: formatType.toggle },
  { name: "image", type: formatType.toggle },
  { name: "video", type: formatType.toggle },
];

export const fullOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],
  [{ size: ["small", false, "large", "huge"] }], // custom dropdown

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  // ["clean"], // remove formatting button
];

export const basicOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ align: [] }],
];

export interface ToolbarTheme {
  background: string;
  color: string;
  overlay: string;
  size: number;
}

export const darkTheme: ToolbarTheme = {
  background: "#1c1e21",
  color: "#ebedf0",
  overlay: "rgba(255, 255, 255, .15)",
  size: 30,
};

export const lightTheme: ToolbarTheme = {
  background: "#ebedf0",
  color: "#1c1e21",
  overlay: "rgba(55,99,115, .1)",
  size: 30,
};
