const React = require("react-native");
const { Dimensions } = React;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default {


  optionContainer: {
    backgroundColor: "#121212",
    opacity: .95,
    position:"absolute",
    top:0,
    left:0,
    bottom:0,
    right:0
  },
  closeButton: {
    marginTop: hp("4%"),
    marginLeft: wp("2%"),
  },
  closeButtonIcon: {
    color: "white",
    fontSize: hp("3%")
  },
  detailsContainer: {
    marginRight:"auto",
    marginLeft:"auto",
    marginTop: 25,
    width: wp("80%"),
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    backgroundColor:"#222222",
    width: hp("30%"),
    height: hp("30%"),
    marginBottom: 30,
  },
  mainText: {
    textAlign:"center",
    color: "white",
    fontWeight: "bold",
    fontSize: hp("2.8%"),
    borderBottomWidth:1
  },
  noteText: {
    textAlign:"center",
    color: "white",
    fontWeight: "200",
    fontSize: hp("2%"),
    marginBottom: hp("2%"),
  },
  actionItemIcon: {
    textAlign:"left",
    color: "white",
    fontWeight: "bold",
    fontSize: hp("2.2%"),
    marginTop: hp("2%"),
    marginRight: wp("5%"),
  },
  actionItemText: {
    textAlign:"left",
    color: "white",
    fontWeight: "bold",
    fontSize: hp("2.2%"),
    marginTop: hp("2%"),
  },

}
