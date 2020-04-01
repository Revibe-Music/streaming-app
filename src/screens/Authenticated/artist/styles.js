const React = require("react-native");
const { Dimensions } = React;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
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
  image: {
    height: hp("30"),
    width: wp("100"),
    alignSelf: 'stretch',
    resizeMode: 'center',
    backgroundColor: "#121212",
  },
  titleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    textAlign: "left",
    padding: hp("1%"),
    fontSize: hp("2.5"),
    color: "white",
    width: "65%"
  },
  viewAll: {
    textAlign: "right",
    padding: hp("1%"),
    fontSize: hp("2"),
    fontWeight: "bold",
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
  keywords: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  keywordContainer: {
    backgroundColor: '#999999',
    borderRadius: 10,
    margin: 10,
    padding: 10,
  },
  keyword: {
    fontSize: 16,
    color: 'white',
  },
  titleContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  headerContainer: {
    marginTop: hp("3"),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  imageTitle: {
    color: 'white',
    backgroundColor: 'transparent',
    fontSize: hp("3.5"),
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
  textContainer: {
    width: wp("90%"),
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

    artistImg: {
      height: hp("25"),
      width: hp("25"),
      alignSelf: 'center',
      resizeMode: 'contain',
      backgroundColor:"#121212",
    },
    artistPlaceholderImg: {
      height: hp("20"),
      width: hp("20"),
      alignSelf: 'center',
      resizeMode: 'contain',
      backgroundColor:"#121212",
      top: hp("10%")
    },
    artistName: {
        color: "white",
        fontWeight: "800",
        textAlign: "center",
        fontSize: 30,
    },
    artistNameView: {
        marginTop: 50
    },
    shuffle: {
        fontSize: 15,
        letterSpacing: 1.2,
        fontWeight: "bold",
    },
    shuffleBtn: {
        backgroundColor: "#1DB954",
        height: 50,
    },
    scrollView: {
        alignItems: "center",
        paddingStart: 5,
        paddingEnd: 5,
    },
    card: {
        height: deviceHeight / 3.7,
        width: deviceWidth / 2.3,
        backgroundColor: "#121212",
        borderColor: "black",
        marginLeft: 10,
        marginRight: 10,
    },
    radioCardName: {
        flex: 1,
        alignItems: "center",
        paddingTop: 5,
        backgroundColor: "#121212",
        flexDirection: "column"
    },
    text: {
        fontSize: hp("2"),
        color: "white",
        fontWeight: "700",
    },
    cardSub: {
        color: "#A9A9A9",
        fontSize: 10,
        textAlign: "center",
        fontWeight: "500"
    },
    loadingIndicator: {
      marginTop: 100,
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
      resizeMode: "contain"
    },
    cardImgPlaceholder : {
      height: hp("15%"),
      width: hp("15%"),
      backgroundColor: "#121212",
      resizeMode: "center"
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
    donationButton: {
      alignSelf: "flex-end",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      backgroundColor: "transparent",
      // borderColor: "#7248BD",
      // borderWidth: hp(.3),
      width: wp("20"),
      height: hp("7"),
      // marginBottom: hp(1),
    },
    donationButtonText: {
      color: "#7248BD",
      fontSize: hp("2"),
      paddingRight: wp("2"),
      paddingLeft: wp("2"),
    }
};
