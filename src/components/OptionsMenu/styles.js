const React = require("react-native");
const { Dimensions } = React;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default {


  optionContainer: {
    backgroundColor: "transparent",
    width: "100%",
    height: "100%",
  },
  closeButtonContainer: {
    height: hp("5%"),
    width: wp("15%"),
    justifyContent: "center",
    alignItems:"center",
    marginTop: hp("5%"),
  },

  closeButton: {
    fontSize: hp("3"),

  },
  closeButtonIcon: {
    color: "white",
    fontSize: hp("3%")
  },
  detailsContainer: {
    marginRight:"auto",
    marginLeft:"auto",
    marginTop: hp("1%"),
    width: wp("80%"),
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    backgroundColor:"#222222",
    width: hp("30%"),
    height: hp("30%"),
    resizeMode: "contain"
  },
  mainText: {
    paddingTop: hp("3%"),
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
  topItemIcon: {
    textAlign:"center",
    color: "white",
    fontWeight: "bold",
    fontSize: hp("2.5%"),
  },
  topItemText: {
    textAlign:"center",
    color: "white",
    fontWeight: "bold",
    fontSize: hp("1.5%"),
    marginTop: hp("2%"),
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
    flex: 1
  },
  selectArtistScrollview: {
    marginTop:hp("5"),
    height:hp("75"),
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  selectPlaylistScrollview: {
    marginTop:hp("5"),
    height:hp("75"),
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
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

  cancelButtonContainer: {
    marginLeft: 0,
    width: wp('100%'),
    height: hp('8%'),
    backgroundColor: "transparent",
    alignitems: 'center',
    justifyContent: 'center',
    position: "absolute",
    bottom: 0,
  },
  filterCancelButton: {
    marginLeft: 0,
    width: wp('100%'),
    height: hp('5%'),
    backgroundColor: "transparent",
    alignSelf: 'center',
    position: "absolute",
    bottom: hp("3%"),
    // marginTop:hp("5%"),
  },
  filterCancelText: {
    fontSize: hp("2.5%"),
    color: "white",
  },
  headerContainer: {
    marginTop: hp("4"),
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  logo: {
    fontSize: hp("4%"),
    padding: 10
  },

  libraryHeader: {
    backgroundColor: "transparent",
    borderBottomWidth: 0,
    justifyContent: 'flex-start',
    margin: 0,
    paddingTop: hp("4.5")
  },
  pageTitle: {
    fontSize: hp("3.5%"),
    color: "white",
    fontWeight: "bold",
    paddingLeft: wp("2%"),
  },

}
