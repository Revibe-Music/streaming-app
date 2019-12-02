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

  const tabHeadingTheme = {
    flexDirection: "row",
    backgroundColor: variables.tabDefaultBg,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    ".scrollable": {
      paddingHorizontal: 20,
      flex: platform === "android" ? 0 : 1,
      minWidth: platform === "android" ? undefined : 60
    },
    "NativeBase.Text": {
      color: variables.topTabBarTextColor,
      marginHorizontal: 7
    },
    "NativeBase.Icon": {
      color: variables.topTabBarTextColor,
      fontSize: platform === "ios" ? 26 : undefined
    },
    ".active": {
      "NativeBase.Text": {
        color: variables.topTabBarActiveTextColor,
        fontWeight: "600"
      },
      "NativeBase.Icon": {
        color: variables.topTabBarActiveTextColor
      }
    }
  };

  return tabHeadingTheme;
};
