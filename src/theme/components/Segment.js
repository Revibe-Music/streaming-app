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

	const segmentTheme = {
		height: 45,
		borderColor: variables.segmentBorderColorMain,
		flexDirection: "row",
		justifyContent: "center",
		backgroundColor: variables.segmentBackgroundColor,
		"NativeBase.Button": {
			alignSelf: "center",
			borderRadius: 0,
			paddingHorizontal: 20,
			height: 30,
			backgroundColor: "transparent",
			borderWidth: 1,
			borderLeftWidth: 0,
			borderColor: variables.segmentBorderColor,
			elevation: 0,
			".active": {
				backgroundColor: variables.segmentActiveBackgroundColor,
				"NativeBase.Text": {
					color: variables.segmentActiveTextColor,
				},
			},
			".first": {
				borderTopLeftRadius: platform === "ios" ? 5 : undefined,
				borderBottomLeftRadius: platform === "ios" ? 5 : undefined,
				borderLeftWidth: 1,
			},
			".last": {
				borderTopRightRadius: platform === "ios" ? 5 : undefined,
				borderBottomRightRadius: platform === "ios" ? 5 : undefined,
			},
			"NativeBase.Text": {
				color: variables.segmentTextColor,
				fontSize: 14,
			},
		},
	};

	return segmentTheme;
};
