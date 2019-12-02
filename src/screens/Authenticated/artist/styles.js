const React = require("react-native");
const { Dimensions } = React;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;


export default {
    container: {
        backgroundColor: "#121212",
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between"
    },
    heading: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
        marginBottom: 10
    },
    title: {
        flex: 0.5,
        color: "white",
        fontWeight: "bold",
        fontSize: 18,
        paddingLeft: 10,
        letterSpacing: 1.3
    },
    all: {
        flex: 0.5,
        color: "white",
        fontWeight: "bold",
        fontSize: 18,
        textAlign: "right",
        paddingRight: 10
    },
    artistImg: {
        backgroundColor:"#222222",
        width: deviceHeight / 3.5,
        height: deviceHeight / 3.5,
        top: deviceHeight/40
    },
    artistImgBlur: {
        width: deviceWidth,
        height: deviceHeight/4.5,
        position:"absolute",
        // resizeMode:"stretch",
        // top: 0
      },
    artistPlaceholderImg: {
        backgroundColor:"#222222",
        width: deviceHeight / 3.5,
        height: deviceHeight / 3.5,
        resizeMode:"center",
    },
    artistName: {
        color: "white",
        fontWeight: "800",
        textAlign: "center",
        fontSize: 30,
    },
    artistNameView: {
        marginTop: 50
    },
    shuffle: {
        fontSize: 15,
        letterSpacing: 1.2,
        fontWeight: "bold",
    },
    shuffleBtn: {
        backgroundColor: "#1DB954",
        height: 50,
    },
    scrollView: {
        alignItems: "center",
        paddingStart: 5,
        paddingEnd: 5,
    },
    card: {
        height: deviceHeight / 3.7,
        width: deviceWidth / 2.3,
        backgroundColor: "#121212",
        borderColor: "black",
        marginLeft: 10,
        marginRight: 10,
    },
    cardImg : {
        height: deviceHeight / 5,
        width: deviceWidth / 2.3,
        padding: 0,
    },
    cardImgPlaceholder : {
        backgroundColor:"#222222",
        height: deviceHeight / 5,
        width: deviceWidth / 2.3,
        resizeMode:"center",
    },
    radioCardName: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 5,
        backgroundColor: "#121212",
        flexDirection: "column"
    },
    text: {
        textAlign: "center",
        fontSize: 13,
        color: "white",
        fontWeight: "700",
    },
    cardSub: {
        color: "#A9A9A9",
        fontSize: 10,
        textAlign: "center",
        fontWeight: "500"
    },
    loadingIndicator: {
      marginTop: 100,
    },
};
