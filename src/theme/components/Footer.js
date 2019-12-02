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
  const platformStyle = variables.platformStyle;
  const platform = variables.platform;

  const iconCommon = {
    "NativeBase.Icon": {
      color: variables.tabBarActiveTextColor
    }
  };
  const iconNBCommon = {
    "NativeBase.IconNB": {
      color: variables.tabBarActiveTextColor
    }
  };
  const textCommon = {
    "NativeBase.Text": {
      color: variables.tabBarActiveTextColor
    }
  };
  const footerTheme = {
    "NativeBase.Left": {
      "NativeBase.Button": {
        ".transparent": {
          backgroundColor: "transparent",
          borderColor: null,
          elevation: 0,
          shadowColor: null,
          shadowOffset: null,
          shadowRadius: null,
          shadowOpacity: null,
          ...iconCommon,
          ...iconNBCommon,
          ...textCommon
        },
        alignSelf: null,
        ...iconCommon,
        ...iconNBCommon,
        // ...textCommon
      },
      flex: 1,
      alignSelf: "center",
      alignItems: "flex-start"
    },
    "NativeBase.Body": {
      flex: 1,
      alignItems: "center",
      alignSelf: "center",
      flexDirection: "row",
      "NativeBase.Button": {
        alignSelf: "center",
        ".transparent": {
          backgroundColor: "transparent",
          borderColor: null,
          elevation: 0,
          shadowColor: null,
          shadowOffset: null,
          shadowRadius: null,
          shadowOpacity: null,
          ...iconCommon,
          ...iconNBCommon,
          ...textCommon
        },
        ".full": {
          height: 0,
          paddingBottom: 0,
          flex: 1
        },
        ...iconCommon,
        ...iconNBCommon,
        // ...textCommon
      }
    },
    "NativeBase.Right": {
      "NativeBase.Button": {
        ".transparent": {
          backgroundColor: "transparent",
          borderColor: null,
          elevation: 0,
          shadowColor: null,
          shadowOffset: null,
          shadowRadius: null,
          shadowOpacity: null,
          ...iconCommon,
          ...iconNBCommon,
          ...textCommon
        },
        alignSelf: null,
        ...iconCommon,
        ...iconNBCommon,
        // ...textCommon
      },
      flex: 1,
      alignSelf: "center",
      alignItems: "flex-end"
    },
    backgroundColor: variables.footerDefaultBg,
    flexDirection: "row",
    justifyContent: "center",
    borderTopWidth:
      platform === "ios" && platformStyle !== "material"
        ? variables.borderWidth
        : undefined,
    borderColor:
      platform === "ios" && platformStyle !== "material"
        ? "#cbcbcb"
        : undefined,
    height: variables.footerHeight,
    paddingBottom: variables.footerPaddingBottom,
    elevation: 2,
    left: 0,
    right: 0
  };
  return footerTheme;
};
