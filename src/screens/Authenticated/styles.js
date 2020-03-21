const React = require("react-native");
const { Dimensions } = React;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';



export default {

  container: {
    backgroundColor: "#121212",
    flex: 1,
    paddingTop: hp("3.5%"),
    // marginTop: 200
  },

  libraryHeader: {
    backgroundColor: "#121212",
    borderBottomWidth: 0,
    height: hp("6.5%"),
    margin: 0
  },



  // TABS
  tabs :{
    backgroundColor: "#7248BD",
    // marginTop: 200
  },
  tab: {
    backgroundColor: "#222325",
    borderBottomWidth: 0
  },
  tabStyle: {
    backgroundColor: "#121212"
  },
  activeTabStyle: {
    backgroundColor: "#121212"
  },
  tabText: {
    color: "white",
    fontSize: hp("1.85%")
  },
  activeTabText: {
    color: "white",
    fontSize: hp("2.1%")
  },
  searchBar: {
    backgroundColor: "#121212",
    height: hp("11%")
  },
  searchText: {
    backgroundColor: "#222222",
    color: "white",
    textAlign: "left",
    fontSize: hp("2.5%"),
  },
  searchTextIcon: {
    color: "#7248BD",
    fontSize: hp("2.5%"),
    marginBottom:hp("0%"),
  },
  searchPlatformLogo: {
    marginTop:hp("2%"),
    width: undefined,
    height: hp("6%"),
    resizeMode: "contain",
    justifyContent:"flex-start",
    marginBottom: hp("2%")

  },
  searchIcon: {
    color: "white",
    fontSize: hp("22%"),
    marginTop: hp("20%"),
    marginBottom: hp("3%"),
  },
  searchBgText: {
    color: "white",
    fontSize: hp("3%"),
    paddingBottom: hp("1.8%"),
  },
  searchFindText: {
    color: "white",
    width: wp("80%"),
    textAlign: "center",
    fontSize: hp("2%"),
  },
  searchNoResults: {
    color: "white",
    fontSize: hp("2.2%"),
    marginLeft: wp("8%")
  },
  searchTabStyle: {
    width: wp("25%"),
    borderRadius: 20,
    backgroundColor: "#121212"
  },
  searchActiveTabStyle: {
    width: wp("25%"),
    borderRadius: 20,
    backgroundColor: "#7248BD"
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between"
  },
  browseCard: {
    height: deviceHeight / 6,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    width: null,
    borderColor: "black",
    },
  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "#1DB954",
    opacity: 0.4
  },
  text: {
    textAlign: "left",
    fontSize: hp("2%"),
    color: "white",
    fontWeight: "700",
  },
  browseText: {
    textAlign: "center",
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
    letterSpacing: 1.1,
    textShadowColor: "black",
    textShadowRadius: 3,
    textShadowOffset: {
      width: 1,
      height: 1
    }
  },
  browseBg: {
    width: null,
    height: deviceHeight / 6,
    borderColor: "black",
    opacity: 50
  },
  listText: {
    color : "white",
    fontWeight: "bold",
    textAlign: "left",
  },
  cardView: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly"
  },
  card: {
    height: hp("20%"),
    width: hp("18%"),
    backgroundColor: "transparent",
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  cardImg : {
    height: hp("15%"),
    width: hp("15%"),
    padding: 0,
    backgroundColor: "#121212",
    borderRadius: 10,
    resizeMode: "contain"
  },
  artistCardImg : {
    height: hp("15%"),
    width: hp("15%"),
    padding: 0,
    backgroundColor: "#121212",
    borderRadius: hp("7.5%"),
    resizeMode: "cover"
  },
  cardDesc: {
    backgroundColor: "transparent",
  },
  desc: {
    color: "white",
    fontSize: 12
  },
  cardName: {
    color: "white",
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 18
  },
  cardItem: {
    backgroundColor: "transparent",
    width: hp("15%"),
  },
  cardSub: {
    color: "#A9A9A9",
    fontSize: 10,
    textAlign: "center",
    fontWeight: "500"
  },
  radioScrollView: {
    alignItems: "center",
    paddingStart: 5,
    paddingEnd: 5,
    backgroundColor: "#121212"
  },

  titleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },


  title: {
    color: "white",
    fontWeight: "bold",
    fontSize: hp("2.5%"),
    textAlign: "left",
    marginVertical: 15,
    letterSpacing: 1.3,
    marginLeft: wp("2%")
  },
  subtitle: {
    color: "#A9A9A9",
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
    letterSpacing: 1.1
  },
  viewAll: {
    textAlign: "right",
    padding: hp("1%"),
    fontSize: hp("2"),
    fontWeight: "bold",
    color: "white"
  },
  scrollView: {
    alignItems: "center",
    paddingStart: 5,
    paddingEnd: 5,
  },


  signOutButton: {
    marginTop: 60,
    marginBottom: 20,
    backgroundColor: "red",
    width: deviceWidth / 4,
    alignSelf: 'center',
  },
  spotifyLoginButton: {
    height: 35,
    width: deviceWidth / 3.7,
    borderRadius: 20,
    backgroundColor: "#84bd00",
    // alignSelf: 'center',
  },
  libraryItem: {
    width:deviceWidth,
    // height: deviceHeight / 18,
    // flex: 1,
    flexDirection: 'row',
  },
  libraryItemText: {
    flexDirection:"column",
    alignItems: 'flex-start',
    justifyContent: "center",
    width:deviceWidth * .80,
    paddingLeft:0,
    color : "white",
    fontWeight: "bold",
    textAlign: "left",
  },

  loadingIndicator: {
    marginTop:deviceHeight/3,
  },




  libraryItem: {
    height: hp("9%")
  },

  libraryItemText: {
    flex: .9,
    justifyContent: "center",
    flexDirection:"column",
    paddingLeft:0,
    color : "white",
    fontWeight: "bold",
    textAlign: "left",
    alignItems:"flex-start",
    width: wp("80%")
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
  songOptions: {
    fontSize: hp("2.5%"),
    color: "white"
  },

  pageTitle: {
    fontSize: hp("3.5%"),
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  emptyQueueText: {
    marginTop: hp("40%"),
    fontSize: hp("2.5%"),
    color: "white",
    textAlign: "center",
  },

  settingsTitle: {
    color:"#7248BD",
    textAlign:"left",
    fontSize: hp("2.5%"),
    marginLeft: wp("4%"),
  },

  filterOptionConainter: {
    width: wp("80%"),
    left: wp("10%"),
    right: wp("10%"),
    // position: "absolute",
    top: hp("22%"),

  },
  filterButtonLarge: {
    height: hp("5%"),
    width: wp("15%"),
    borderRadius: hp(".8%"),
    backgroundColor: "#7248BD",
    justifyContent: "center",
    alignItems:"center",
  },
  filterTextLarge : {
    fontSize: hp("2%"),
    color: "white",
    // marginLeft: hp(".2%"),
    // marginRight: hp(".2%")
  },
  filterIconsLarge : {
    fontSize: hp("2.5%"),
    color: "white",
    marginLeft: hp(".2%"),
    marginRight: hp(".2%")
  },

  noFilterResultsText: {
    marginTop: hp("15%"),
    fontSize: hp("2.5%"),
    color: "white",
    textAlign: "center",
  },

  filterListItem: {
    paddingRight: 0,
  },
  filterCheckbox: {
    marginLeft: hp("2%"),
    justifyContent: "center",
    alignItems:"center",
    height: hp("3%"),
    width: hp("3%"),
    marginBottom: 0
  },
  filterOptionText: {
    marginLeft: hp("3%"),
    fontSize: hp("2.5%"),
    color: "white",
  },
  textContainer: {
    justifyContent: "center",
    flexDirection:"column",
    paddingLeft:0,
    fontWeight: "bold",
    textAlign: "left",
    alignItems:"flex-start",
    width: wp("65%")
  },
  filterCancelButton: {
    marginLeft: 0,
    width: wp('80%'),
    height: hp('5%'),
    backgroundColor: "transparent",
    alignSelf: 'center',
    marginTop: hp("5%"),
  },

  filterCancelText: {
    fontSize: hp("2.5%"),
    color: "white",
  },

  menuContainer: {
    height: hp("5%"),
    width: wp("5%"),
    flex:1,
    justifyContent: "center",
    marginRight:wp("3%")
  },
  menu: {
    fontSize: hp("3%"),
    color: "white"
  },

mainText: {
    fontWeight: "bold",
    fontSize: hp("2%"),
    textAlign: "left",
  },
};
