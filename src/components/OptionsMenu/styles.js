const React = require("react-native");
const { Dimensions } = React;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default {


  optionContainer: {
    backgroundColor: "#121212",
    opacity: .95,
    width: "100%",
    height: "100%"
  },
  closeButtonContainer: {
    height: hp("5%"),
    width: wp("7%"),
    flex:1,
    justifyContent: "center",
    alignItems:"center",
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
    resizeMode: "contain"
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

  selectArtistContainer: {
    marginTop:hp("10"),
    flex: 1
  },
  selectArtistScrollview: {
    marginTop:hp("5"),
    height:hp("50"),
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },

  selectArtistText: {
    textAlign:"left",
    color: "white",
    fontWeight: "bold",
    fontSize: hp("2.2%"),
    marginTop: hp("2%"),
  },
  selectArtistCancelButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('80%'),
    height: hp('5%'),
    backgroundColor: "transparent",
    alignSelf: 'center',
    marginTop: hp("15")
  },
  selectArtistCancelText: {
    fontSize: hp("3%"),
    color: "white",
  },

}
