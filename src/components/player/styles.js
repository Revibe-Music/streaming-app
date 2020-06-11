const React = require("react-native");
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import DeviceInfo from 'react-native-device-info';

const device = DeviceInfo.getModel();

export default {
    // FULLSCREEN PLAYER
    playerHeader: {
      backgroundColor: "transparent",
      height:0,
      borderBottomWidth: 0,
      marginBottom:hp("5%"),
      marginTop: hp("2%"),
    },
    playerView1: {
      flex: 1,
      borderTopLeftRadius: device.includes("X") || device.includes("11") ? hp("4.7%") : 0,
      borderTopRightRadius: device.includes("X") || device.includes("11") ? hp("4.7%") : 0
    },
    playerView2: {
      flex: 1,
    },
    playerCloseArrowButton: {
      height: hp("4%"),
    },
    playerCloseArrow: {
      height: hp("4%"),
      color: "white",
      fontSize: hp("4%"),
      marginLeft: wp("5%")
    },
    headerBody: {
      height: hp("4%"),
      marginTop: hp("2%"),
    },
    logoContainer: {
      height: hp("5.5%"),
    },
    logo: {
      fontSize: hp("4%"),
    },
    videoPlayerContainer: {
        width: wp("95%"),
        height: wp("80%"),
        marginLeft: wp(2.5),
        alignItems: "center",
        justifyContent: "center",
        backgroundColor:"#22222"
    },
    albumArtContainer: {
      minWidth: 1,
      height: wp("80%"),
    },
    playerIcons: {
      height: hp("3.5%"),
      color: "#7248BD",
      fontSize: hp("3.5%"),
    },
    controls: {
      flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: wp("70%"),
        marginRight: wp("15%"),
        marginLeft: wp("15%"),
        // marginTop: wp("2%"),
    },

    // MIN PLAYER
    minPlayerContainer : {
      marginBottom: hp("6%"),
    },

    ellipsisContainer: {
      height: hp("5%"),
      width: wp("5%"),
      // flex:1,
      justifyContent: "center",
      // alignItems:"center"
    },
    ellipsis: {
      fontSize: hp("2.5%"),
      color: "white"
    },

};
