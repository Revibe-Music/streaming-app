const React = require("react-native");
const { Dimensions } = React;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',

  },
  activityIndicatorWrapper: {
    backgroundColor: '#222222',
    height: 175,
    width: 175,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop:20,
    textAlign: "center",
    fontSize: 15,
    color: "white",
  }
};
