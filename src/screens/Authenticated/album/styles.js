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
  image: {
    height: hp("30"),
    width: wp("100"),
    alignSelf: 'stretch',
    resizeMode: 'center',
    backgroundColor: "#121212",
  },
  title: {
    textAlign: "center",
    fontSize: hp("2.5"),
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrowContainer: {
    marginTop: hp("3")
  },
  imageTitle: {
    color: 'white',
    backgroundColor: 'transparent',
    fontSize: hp("4"),
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
  textContainer: {
    paddingTop: hp("10%"),
    flex: 1,
    justifyContent: "center",
    alignItems:"center",
  },
  noDataText: {
    fontSize: hp("2.5%"),
    color: "white",
    textAlign: "center",
  },
};
