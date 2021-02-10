import {
  ToggleData,
  TextListData,
  formats,
  formatType,
  ColorListData,
  formatValueType,
} from "../const";
import { icons } from "../icons";

export const getToolbarData = (
  options: Array<Array<string | object> | string | object>
): Array<Array<ToggleData | TextListData | ColorListData>> => {
  let iconSet: Array<Array<ToggleData | TextListData | ColorListData>> = [];

  const isSingle: boolean = !(options.length > 0 && Array.isArray(options[0]));
  if (isSingle) {
    const set = createToolSet(options);
    iconSet.push(set);
  } else {
    for (let i = 0; i < options.length; i++) {
      const opt = options[i];
      if (Array.isArray(opt)) {
        const set = createToolSet(opt);
        iconSet.push(set);
      } else
        console.log(opt, "is not an array, you should pass it as an array");
    }
  }

  return iconSet;
};

const createToolSet = (
  tools: Array<string | object>
): Array<ToggleData | TextListData | ColorListData> => {
  let ic: Array<ToggleData | TextListData | ColorListData> = [];
  for (let i = 0; i < tools.length; i++) {
    const opt = tools[i];

    if (typeof opt === "string") {
      const format = formats.find((f) => f.name === opt);
      if (format && format.type === formatType.toggle) {
        const formatIcon = icons[format.name];
        if (formatIcon) {
          ic.push({
            name: format.name,
            source: formatIcon,
            valueOff: false,
            valueOn: true,
            type: formatType.toggle,
          } as ToggleData);
        } else {
          ic.push({
            name: format.name,
            valueOff: false,
            valueOn: true,
            type: formatType.toggle,
          } as ToggleData);
        }
      }
    } else if (typeof opt === "object" && opt !== null) {
      const keys = Object.keys(opt);
      const values = Object.values(opt);
      for (let j = 0; j < keys.length; j++) {
        const key = keys[j];
        const value = values[j];
        const format = formats.find((f) => f.name === key);
        if (format) {
          if (typeof value === "string" || typeof value === "number") {
            const formatIcon = icons[format.name][value];
            if (formatIcon) {
              ic.push({
                name: format.name,
                source: formatIcon,
                valueOff: false,
                valueOn: value,
                type: formatType.toggle,
              } as ToggleData);
            } else {
              ic.push({
                name: format.name,
                valueOff: false,
                valueOn: value,
                type: formatType.toggle,
              } as ToggleData);
            }
          } else if (Array.isArray(value)) {
            const formatIcon = icons[format.name];

            if (format.defaults) {
              const listItems =
                value.length > 0
                  ? format.defaults.filter((f) => value.indexOf(f.value) !== -1)
                  : format.defaults;
              if (format.type === formatType.select) {
                ic.push({
                  name: format.name,
                  values: listItems.map((x) => {
                    let icon =
                      x.type === formatValueType.icon
                        ? x.value === false
                          ? icons[format.name][""]
                          : typeof x.value === "string"
                          ? icons[format.name][x.value]
                          : undefined
                        : undefined;

                    return {
                      name: x.name,
                      valueOff: false,
                      valueOn: x.value,
                      source: icon,
                      type: (
                        x.type === formatValueType.icon && icon ? true : false
                      )
                        ? formatType.icon
                        : formatType.toggle,
                    } as ToggleData;
                  }),
                  type: formatType.select,
                } as TextListData);
              } else {
                ic.push({
                  name: format.name,
                  source: formatIcon,
                  values: listItems.map(
                    (x) =>
                      ({
                        name: x.name,
                        valueOff: false,
                        valueOn: x.value,
                        type: formatType.color,
                      } as ToggleData)
                  ),
                  type: formatType.color,
                } as ColorListData);
              }
            } else {
              const fIcon = icons[format.name];
              if (fIcon) {
                ic.push({
                  name: format.name,
                  source: fIcon,
                  valueOff: false,
                  valueOn: true,
                  type: formatType.toggle,
                } as ToggleData);
              }
            }
          }
        }
      }
    }
  }
  return ic;
};
