import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default {

  libraryItem: {
    height: hp("8.5%"),
    paddingRight: 0,
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
  songOptionContainer: {
    height: hp("5%"),
    flex:1,
    justifyContent: "center",
    alignItems:"center"
  },
  searchItemText: {
    flex: .9,
    justifyContent: "center",
    flexDirection:"column",
    paddingLeft:0,
    color : "white",
    fontWeight: "bold",
    textAlign: "left",
    alignItems:"flex-start",
    width: wp("80%"),
    color:"white",
    paddingLeft: wp("3%"),
  },
  songText: {
    fontWeight: "bold",
    fontSize: hp("2%"),
    textAlign: "left",
  },
  artistText: {
    fontSize: hp("1.7%"),
    textAlign: "left",
  },
  songOptions: {
    fontSize: hp("2.5%"),
    color: "white"
  },
  artistImage: {
    width: hp("7%"),
    height: hp("7%"),
    resizeMode: "contain",
  },

  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  showHideText: {
    color: "white",
    textAlign: "center",
    fontSize: hp("1.9%"),
    fontWeight: "bold",

  },

}
