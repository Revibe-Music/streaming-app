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

  closeButtonContainer: {
    flex:.1,
    justifyContent: "center",
    alignItems:"flex-start",
    marginTop: hp("3%"),
    marginLeft: wp("3%"),
  },
  closeButton: {
    fontSize: hp("3")
  },
  closeButtonIcon: {
    color: "white",
    fontSize: hp("3%")
  },
  donationAmountButton: {
    margin: hp("2"),
    backgroundColor: "transparent",
    borderColor: "#7248BD",
    borderWidth: hp(".2"),
    width: wp("12"),
    justifyContent: "center",
    alignItems: "center" ,
  },
  nextButton: {
    margin: hp("2"),
    backgroundColor: "transparent",
    width: wp("20"),
    justifyContent: "center",
    alignItems: "center" ,
  },
  paymentButton: {
    backgroundColor: "white",
    width: wp("30"),
    // height: hp("6"),
    justifyContent: "center",
  }
};
