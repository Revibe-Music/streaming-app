const React = require("react-native");
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default {
  container: {
      backgroundColor: "#121212",
      flex: 1
  },
  center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "space-between"
  },

  title: {
    textAlign: "center",
    fontSize: hp("2"),
    color: "white"
  },
  name: {
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
    backgroundColor: '#121212',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionContent: {
    fontSize: 16,
    textAlign: 'justify',
  },

  titleContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  backArrowContainer: {
    marginTop: hp("3")
  },
  imageTitle: {
    color: 'white',
    backgroundColor: 'transparent',
    fontSize: hp("3"),
  },
  navTitleView: {
    height: hp("10"),
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
    opacity: 0,
  },
  navTitle: {
    color: 'white',
    fontSize: 18,
    backgroundColor: 'transparent',
  },
  sectionLarge: {
    height: 600,
  },

  shuffle: {
      fontSize: 15,
      letterSpacing: 1.2,
      fontWeight: "bold",
      color: "white"
  },
  shuffleBtn: {
      backgroundColor: "#7248BD",
      height: hp("5%"),
      width: wp("35%"),
      marginTop: hp("2"),
  },

  saveText: {
      fontSize: hp(1.5),
      letterSpacing: 1.2,
      fontWeight: "bold",
      color: "#7248BD"
  },
  saveBtn: {
      backgroundColor: "transparent",
      height: hp("6%"),
      width: wp("12%"),
      marginTop: hp("2"),
  },

  headerContainer: {
    marginTop: hp("3"),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  textContainer: {
    width: wp("90%"),
    marginTop: wp("15%"),
    marginLeft: wp("5%"),
    justifyContent: "center",
    alignItems:"center",
  },
  noDataText: {
    fontSize: hp("2.5%"),
    color: "white",
    textAlign: "center",
  },

  logoContainer: {
    height: hp("3%"),
  },
  logo: {
    fontSize: hp("4%"),
  },

  albumImg: {
    height: hp("25"),
    width: hp("25"),
    alignSelf: 'center',
    resizeMode: 'contain',
    backgroundColor:"#121212",
  },
  albumPlaceholderImg: {
    height: hp("20"),
    width: hp("20"),
    alignSelf: 'center',
    resizeMode: 'contain',
    backgroundColor:"#121212",
    top: hp("10%")
  },
  loadingIndicator: {
    marginTop: 100,
  },


};
