import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default {
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000099'
  },
  activityIndicatorWrapper: {
    height: hp("10%"),
    width: hp("10%"),
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  loadingText: {
    textAlign: "center",
    fontSize: hp("3%"),
    color: "white",
    fontWeight: "700",
  }
};
