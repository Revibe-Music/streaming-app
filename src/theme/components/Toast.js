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
  const platform = variables.platform;

  const toastTheme = {
    ".danger": {
      backgroundColor: variables.brandDanger
    },
    ".warning": {
      backgroundColor: variables.brandWarning
    },
    ".success": {
      backgroundColor: variables.brandSuccess
    },
    backgroundColor: "rgba(0,0,0,0.8)",
    borderRadius: platform === "ios" ? 5 : 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    minHeight: 50,
    "NativeBase.Text": {
      color: "#fff",
      flex: 1
    },
    "NativeBase.Button": {
      backgroundColor: "transparent",
      height: 30,
      elevation: 0,
      "NativeBase.Text": {
        fontSize: 14
      }
    }
  };

  return toastTheme;
};
