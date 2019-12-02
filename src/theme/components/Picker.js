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
  const pickerTheme = {
    ".note": {
      color: "#8F8E95"
    },
    // width: 90,
    marginRight: -4,
    flexGrow: 1
  };

  return pickerTheme;
};
