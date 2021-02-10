const alignLeftIcon = require("./assets/icons/align-left.png");
const alignCenterIcon = require("./assets/icons/align-center.png");
const alignRightIcon = require("./assets/icons/align-right.png");
const alignJustifyIcon = require("./assets/icons/align-justify.png");
const backgroundIcon = require("./assets/icons/background.png");
const blockquoteIcon = require("./assets/icons/blockquote.png");
const boldIcon = require("./assets/icons/bold.png");
const cleanIcon = require("./assets/icons/clean.png");
const codeIcon = require("./assets/icons/code.png");
const colorIcon = require("./assets/icons/color.png");
const directionLeftToRightIcon = require("./assets/icons/direction-ltr.png");
const directionRightToLeftIcon = require("./assets/icons/direction-rtl.png");
const formulaIcon = require("./assets/icons/formula.png");
const headerIcon = require("./assets/icons/header.png");
const header2Icon = require("./assets/icons/header-2.png");
const header3Icon = require("./assets/icons/header-3.png");
const italicIcon = require("./assets/icons/italic.png");
const imageIcon = require("./assets/icons/image.png");
const indentIcon = require("./assets/icons/indent.png");
const outdentIcon = require("./assets/icons/outdent.png");
const linkIcon = require("./assets/icons/link.png");
const listBulletIcon = require("./assets/icons/list-bullet.png");
const listCheckIcon = require("./assets/icons/list-check.png");
const listOrderedIcon = require("./assets/icons/list-ordered.png");
const subscriptIcon = require("./assets/icons/subscript.png");
const superscriptIcon = require("./assets/icons/superscript.png");
const strikeIcon = require("./assets/icons/strike.png");
const tableIcon = require("./assets/icons/table.png");
const underlineIcon = require("./assets/icons/underline.png");
const videoIcon = require("./assets/icons/video.png");

export const icons: Record<string, any> = {
  "align": {
    "": alignLeftIcon,
    "center": alignCenterIcon,
    "right": alignRightIcon,
    "justify": alignJustifyIcon,
  },
  "background": backgroundIcon,
  "blockquote": blockquoteIcon,
  "bold": boldIcon,
  "clean": cleanIcon,
  "code": codeIcon,
  "code-block": codeIcon,
  "color": colorIcon,
  "direction": {
    "": directionLeftToRightIcon,
    "rtl": directionRightToLeftIcon,
  },
  "formula": formulaIcon,
  "header": {
    "1": headerIcon,
    "2": header2Icon,
    "3": header3Icon,
  },
  "italic": italicIcon,
  "image": imageIcon,
  "indent": {
    "+1": indentIcon,
    "-1": outdentIcon,
  },
  "link": linkIcon,
  "list": {
    bullet: listBulletIcon,
    check: listCheckIcon,
    ordered: listOrderedIcon,
  },
  "script": {
    sub: subscriptIcon,
    super: superscriptIcon,
  },
  "strike": strikeIcon,
  "table": tableIcon,
  "underline": underlineIcon,
  "video": videoIcon,
};
