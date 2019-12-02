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
	const swipeRowTheme = {
		"NativeBase.ListItem": {
			".list": {
				backgroundColor: "#FFF",
			},
			marginLeft: 0,
		},
		"NativeBase.Left": {
			flex: 0,
			alignSelf: null,
			alignItems: null,
			"NativeBase.Button": {
				flex: 1,
				alignItems: "center",
				justifyContent: "center",
				alignSelf: "stretch",
				borderRadius: 0,
			},
		},
		"NativeBase.Right": {
			flex: 0,
			alignSelf: null,
			alignItems: null,
			"NativeBase.Button": {
				flex: 1,
				alignItems: "center",
				justifyContent: "center",
				alignSelf: "stretch",
				borderRadius: 0,
			},
		},
		"NativeBase.Button": {
			flex: 1,
			height: null,
			alignItems: "center",
			justifyContent: "center",
			alignSelf: "stretch",
			borderRadius: 0,
		},
	};

	return swipeRowTheme;
};
