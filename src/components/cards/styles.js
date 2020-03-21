const React = require("react-native");
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default {

  text: {
    textAlign: "left",
    fontSize: hp("2%"),
    color: "white",
    fontWeight: "700",
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
  cardItem: {
    backgroundColor: "transparent",
    width: hp("15%"),
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
};
