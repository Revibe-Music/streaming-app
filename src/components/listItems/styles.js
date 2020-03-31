import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default {

  listItem: {
    height: hp("8.5%"),
    paddingRight: 0,
  },
  listFooterItem: {
    height: hp("6%"),
    paddingRight: 0,
  },
  image: {
    width: hp("7%"),
    height: hp("7%"),
    resizeMode: 'contain',
    backgroundColor: "transparent",
  },

  multiImageContainer: {
    height: hp("7"),
    width: hp("7"),
    flexDirection: "column",
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  multiImage: {
    height: hp("3.5"),
    width: hp("3.5"),
    alignSelf: 'center',
    resizeMode: 'contain',
    backgroundColor:"#121212",
  },
  textContainer: {
    marginLeft: wp("3%"),
    justifyContent: "center",
    flexDirection:"column",
    paddingLeft:0,
    marginRight:wp("5%"),
    fontWeight: "bold",
    textAlign: "left",
    alignItems:"flex-start",
    width: wp("60%")
  },
  footerTextContainer: {
    paddingLeft:0,
    fontWeight: "bold",
    alignItems:"flex-start",
    justifyContent: "center",
    width: wp("83%")
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
  arrow: {
    fontSize: hp("3%"),
    color: "white"
  },

  logoContainer: {
    height: hp("2%"),
    paddingRight: wp("2")
  },
  logo: {
    fontSize: hp("2%"),
  },
  editCheckbox: {
    marginTop: 0,
    marginLeft: 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
}
