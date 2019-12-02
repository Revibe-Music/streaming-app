/**
 * Audrix (https://www.enappd.com/audrix)
 *
 * Copyright © 2018-present Enappd. All rights reserved.
 *
 * This source code is licensed as per the terms found in the
 * LICENSE.md file in the root directory of this source tree.
 */
import variable from "./../variables/platform";

export default (variables = variable) => {
  const checkBoxTheme = {
    ".checked": {
      "NativeBase.Icon": {
        color: variables.checkboxTickColor
      },
      "NativeBase.IconNB": {
        color: variables.checkboxTickColor
      }
    },
    "NativeBase.Icon": {
      color: "transparent",
      lineHeight: variables.CheckboxIconSize,
      marginTop: variables.CheckboxIconMarginTop,
      fontSize: variables.CheckboxFontSize
    },
    "NativeBase.IconNB": {
      color: "transparent",
      lineHeight: variables.CheckboxIconSize,
      marginTop: variables.CheckboxIconMarginTop,
      fontSize: variables.CheckboxFontSize
    },
    borderRadius: variables.CheckboxRadius,
    overflow: "hidden",
    width: variables.checkboxSize,
    height: variables.checkboxSize,
    borderWidth: variables.CheckboxBorderWidth,
    paddingLeft: variables.CheckboxPaddingLeft - 1,
    paddingBottom: variables.CheckboxPaddingBottom,
    left: 10
  };

  return checkBoxTheme;
};
