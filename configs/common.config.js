// todo(vmyshko): rename to colors.config?
export const colors = {
  red: "var(--red)",
  green: "var(--green)",
  blue: "var(--blue)",
  yellow: "var(--yellow)",
  black: "var(--black)",
  white: "var(--white)",
  gray: "var(--gray)",
  dimgray: "var(--dimgray)",
  dark: "var(--dark)",
  //mixins
};

export const colorMixins = {
  contrast: "hsl(from var(--color) h s calc(l - 15))",
  darken: "hsl(from var(--color) h s calc(l * 0.6))",
};

export const rgbColors = [colors.red, colors.green, colors.blue];

export const defaultColors = [
  colors.red,
  colors.green,
  colors.blue,
  colors.yellow,
];

export const defaultViewBox = "0 0 100 100";
