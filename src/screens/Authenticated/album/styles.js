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
    albumImg: {
        width: deviceHeight / 3.5,
        height: deviceHeight / 3.5,
        top: 20
    },
    albumImgPlaceholder: {
        backgroundColor:"#222222",
        width: deviceHeight / 3.5,
        height: deviceHeight / 3.5,
        resizeMode: "center",
    },
    albumName: {
        color: "white",
        textAlign: "center",
        fontSize: 20,
    },
    albumNameView: {
        width: deviceHeight / 3.5,
        marginTop: 30
    },
    shuffle: {
        fontSize: 15,  
        letterSpacing: 1.2,
        fontWeight: "bold",
    },
    shuffleBtn: {
        backgroundColor: "#7248BD",
        height: hp("5%"),
    },
    listItemContainerStyle: {
        flex: 1,
        flexDirection: "row",
        width: deviceWidth,
        paddingRight: 0,
        marginRight: 0
    },
    loadingIndicator: {
      marginTop: 100,
    },
};
