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
  const h3Theme = {
    color: variables.textColor,
    fontSize: variables.fontSizeH3,
    lineHeight: variables.lineHeightH3
  };

  return h3Theme;
};
