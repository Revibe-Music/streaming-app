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
  const textAreaTheme = {
    ".underline": {
      borderBottomWidth: variables.borderWidth,
      marginTop: 5,
      borderColor: variables.inputBorderColor
    },
    ".bordered": {
      borderWidth: 1,
      marginTop: 5,
      borderColor: variables.inputBorderColor
    },
    color: variables.textColor,
    paddingLeft: 10,
    paddingRight: 5,
    fontSize: 15,
    textAlignVertical: "top"
  };

  return textAreaTheme;
};
