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
  },
  animationWrapper: {
    height: wp("30%"),
    width: wp("30%"),
    borderRadius: hp("2%"),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },

  loadingText: {
    textAlign: "center",
    fontSize: hp("3%"),
    color: "white",
    fontWeight: "700",
  }
};
