/**
 * Audrix (https://www.enappd.com/audrix)
 *
 * Copyright © 2018-present Enappd. All rights reserved.
 *
 * This source code is licensed as per the terms found in the
 * LICENSE.md file in the root directory of this source tree.
 */
import { Platform, Dimensions } from "react-native";

import variable from "./../variables/platform";

const deviceHeight = Dimensions.get("window").height;
export default (variables = variable) => {
  const theme = {
    flex: 1,
    height: Platform.OS === "ios" ? deviceHeight : deviceHeight - 20
  };

  return theme;
};
