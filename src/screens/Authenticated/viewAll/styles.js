import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


export default {
  container: {
    backgroundColor: "#121212",
    flex: 1,
    paddingTop: hp("3.5%"),
  },

  libraryHeader: {
    backgroundColor: "#121212",
    borderBottomWidth: 0,
    height: hp("6.5%")
  },
  
  pageTitle: {
    fontSize: hp("3.5%"),
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  }
}
