const React = require("react-native");
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default {

  filterOptionConainter: {
    width: wp("80%"),
    left: wp("10%"),
    right: wp("10%"),
    top: hp("22%"),
  },

  filterHeaderText: {
    textAlign: "center",
    fontSize: hp("2.5%"),
    color: "white",
  },

  filterListItem: {
    paddingRight: 0,
  },
  filterCheckbox: {
    justifyContent: "center",
    alignItems:"center",
    height: hp("3%"),
    marginBottom: 0
  },
  filterOptionText: {
    fontSize: hp("2%"),
    color: "white",
  },
  textContainer: {
    justifyContent: "center",
    flexDirection:"column",
    paddingLeft:0,
    fontWeight: "bold",
    textAlign: "left",
    alignItems:"flex-start",
  },

  filterCancelButton: {
    marginLeft: 0,
    width: wp('80%'),
    height: hp('5%'),
    backgroundColor: "transparent",
    alignSelf: 'center',
    position: "absolute",
    bottom: hp("3%"),
  },
  filterCancelText: {
    fontSize: hp("2.5%"),
    color: "white",
  },
};
