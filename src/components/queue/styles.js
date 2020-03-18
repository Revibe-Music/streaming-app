const React = require("react-native");
const { Dimensions } = React;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default {

  container: {
    backgroundColor: "#121212",
    opacity: .98,
    width: "100%",
    height: "100%"
  },
  closeButtonContainer: {
    flex:.1,
    justifyContent: "center",
    alignItems:"flex-start",
    marginTop: hp("4%"),
    marginLeft: wp("3%"),
  },
  closeButton: {
    fontSize: hp("3")
  },
  closeButtonIcon: {
    color: "white",
    fontSize: hp("3%")
  },
  emptyQueueText: {
    fontSize: hp("2.5%"),
    color: "white",
    textAlign: "left",
    marginLeft: wp("10%")
  },

  title: {
    fontSize: hp("3%"),
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    padding: wp("5%"),
  },

  libraryItem: {
    width: wp("100%"),
    flexDirection: 'row',
  },

  libraryItemText: {
    flexDirection:"column",
    alignItems: 'flex-start',
    justifyContent: "center",
    width: wp("80%"),
    // paddingLeft: wp("5%"),
    color : "white",
    fontWeight: "bold",
    textAlign: "left",
  },

  textContainer: {
    marginLeft: wp("3%"),
    justifyContent: "center",
    flexDirection:"column",
    paddingLeft:0,
    fontWeight: "bold",
    textAlign: "left",
    alignItems:"flex-start",
    width: wp("65%")
  },

  image: {
    marginLeft: hp("2%"),
    width: hp("7%"),
    height: hp("7%"),
    resizeMode: 'contain',
    backgroundColor: "#121212",
  },

  mainText: {
    fontWeight: "bold",
    fontSize: hp("2%"),
    textAlign: "left",
    color: "white",
  },
  noteText: {
    color: "white",
    fontSize: hp("1.7%"),
    textAlign: "left",
  },

  songText: {
    fontWeight: "bold",
    fontSize: hp("2.2%"),
    textAlign: "left",
  },
  artistText: {
    fontSize: hp("1.9%"),
    textAlign: "left",
  },
  listIcon: {
    fontSize: hp("2.5%"),
    color: "white"
  },

  logoContainer: {
    height: hp("2%"),
    paddingRight: wp("2")
  },
  logo: {
    fontSize: hp("2%"),
  },



}
