import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default {

  listItem: {
    height: hp("8.5%"),
    paddingRight: 0,
  },
  image: {
    width: hp("7%"),
    height: hp("7%"),
    resizeMode: 'contain',
    backgroundColor: "#121212",
  },
  textContainer: {
    marginLeft: wp("3%"),
    justifyContent: "center",
    flexDirection:"column",
    paddingLeft:0,
    fontWeight: "bold",
    textAlign: "left",
    alignItems:"flex-start",
    width: wp("65%")
  },
  mainText: {
    fontWeight: "bold",
    fontSize: hp("2%"),
    textAlign: "left",
  },
  noteText: {
    fontSize: hp("1.7%"),
    textAlign: "left",
  },

  arrowContainer: {
    height: hp("5%"),
    width: wp("5%"),
    justifyContent: "center",
    alignItems:"flex-end"
  },
  ellipsisContainer: {
    height: hp("5%"),
    width: wp("5%"),
    flex:1,
    justifyContent: "center",
    alignItems:"center"
  },
  ellipsisContainerImageAdjusted: {
    marginLeft: hp("7%")
  },
  ellipsis: {
    fontSize: hp("2.5%"),
    color: "white"
  },
}
