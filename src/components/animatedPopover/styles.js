import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default {
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  animationBackground: {
    backgroundColor: '#222222',
    borderRadius: hp("2%"),
  },
  animationWrapper: {
    height: wp("40"),
    width: wp("40%"),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },

  loadingText: {
    textAlign: "center",
    fontSize: hp("2%"),
    color: "white",
    fontWeight: "700",
    marginBottom: hp("2%")
  }
};
