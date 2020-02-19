import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default {

    loading: {
        width: wp('100%'),
        marginTop: 35
    },
    welcomeText: {
      width: wp('90%'),
      color: "#7248BD",
      fontSize: hp('5%'),
      fontWeight: "bold",
      textAlign: "center"
    },
    animatedView: {
      color: "#7248BD",
      fontWeight: "bold"
    },
    syncingText: {
      width: wp('90%'),
      paddingLeft: wp('10%'),
      color: "#7248BD",
      fontSize: hp('4%'),
      textAlign: "center"
    }
};
