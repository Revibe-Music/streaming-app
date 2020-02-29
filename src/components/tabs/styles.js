import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default {
  container: {
    backgroundColor: "#121212",
    flex: 1,
    paddingTop: hp("3.5%"),
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
  noDataTextContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems:"center",
  },
  noDataText: {
    fontSize: hp("2.5%"),
    color: "white",
    textAlign: "center",
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 22,
    fontWeight: 'bold',
    color: "#7248BD",
    backgroundColor: '#121212',
  },



}
