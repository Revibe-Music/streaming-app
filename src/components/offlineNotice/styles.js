import { Dimensions } from "react-native";
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").height;
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


export default {
  bottomTabContainer: {
    alignItems: "center",
    paddingBottom: hp("2%"),
    backgroundColor:"#0E0E0E"
  },
  bottomTabText: {
    textAlign: "center",
    color: "white",
    fontSize: hp("1.5%")
  },
  form: {
    width: deviceWidth / 2.7,
  },
  label: {
    marginTop: 30,
    marginBottom: 40,
    textAlign: "center",
    fontSize: hp("2%"),
    color: "white",
    textAlign: "center",
    alignSelf: 'center'
  },
  noConnectionIcon: {
    fontSize: hp("15%"),
    color: "white",
    paddingRight:10
  }
};
