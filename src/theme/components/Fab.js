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

	const fabTheme = {
		"NativeBase.Button": {
			alignItems: "center",
			padding: null,
			justifyContent: "center",
			"NativeBase.Icon": {
				alignSelf: "center",
				fontSize: 20,
				marginLeft: 0,
				marginRight: 0,
			},
			"NativeBase.IconNB": {
				alignSelf: "center",
				fontSize: 20,
				marginLeft: 0,
				marginRight: 0,
			},
		},
	};

	return fabTheme;
};
