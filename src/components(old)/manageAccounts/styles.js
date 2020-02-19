import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default {


  logoRow: {
    flexDirection: 'row',
    width: wp("100%"),
    marginTop: hp("3%"),
    marginBottom: 30,
    justifyContent: "center",
    alignItems:"center",
  },
  logo: {
    fontSize: hp("6%"),
    color: '#1DB954',
    marginRight:110
  },
  connectBtn: {
    width: wp('25%'),
    height: hp('5%'),
    // alignSelf: 'flex-end',
    backgroundColor: "green",
    justifyContent: "center",
    alignItems:"center",
  },
  disconnectBtn: {
    width: wp('25%'),
    height: hp('5%'),
    // alignSelf: 'flex-end',
    backgroundColor: "red",
    justifyContent: "center",
    alignItems:"center",
  },
  accountBtnText: {
    fontSize: hp("2%"),
    color: 'white',
    textAlign: "center",
    paddingLeft: 0,
    paddingRight: 0,
  }

};
