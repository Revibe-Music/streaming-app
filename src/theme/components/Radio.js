/**
 * Audrix (https://www.enappd.com/audrix)
 *
 * Copyright © 2018-present Enappd. All rights reserved.
 *
 * This source code is licensed as per the terms found in the
 * LICENSE.md file in the root directory of this source tree.
 */
import { Platform } from "react-native";

import variable from "./../variables/platform";

export default (variables = variable) => {
  const radioTheme = {
    ".selected": {
      "NativeBase.IconNB": {
        color: Platform.OS === "ios"
          ? variables.radioColor
          : variables.radioSelectedColorAndroid,
        lineHeight: Platform.OS === "ios" ? 25 : variables.radioBtnLineHeight,
        height: Platform.OS === "ios" ? 20 : undefined
      }
    },
    "NativeBase.IconNB": {
      color: Platform.OS === "ios" ? "transparent" : undefined,
      lineHeight: Platform.OS === "ios"
        ? undefined
        : variables.radioBtnLineHeight,
      fontSize: Platform.OS === "ios" ? undefined : variables.radioBtnSize
    }
  };

  return radioTheme;
};
