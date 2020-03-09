import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default {
  container: {
    backgroundColor: "#121212",
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loginForm: {
    width: wp('80%'),
    height: hp('30%'),
    justifyContent: 'space-evenly'
  },
  signupForm: {
    width: wp('80%'),
    height: hp('40%'),
    justifyContent: 'space-evenly'
  },
  label: {
    fontSize: hp("2%"),
    textAlign: "left",
    color: "white",
  },
  formInputField: {
    height: hp("2.5%"),
    color: "white",
    borderColor: "white",
    fontSize: hp("1.8%"),
  },

  signInButton: {
    width: wp('80%'),
    height: hp('5%'),
    backgroundColor: "#7248BD",
    alignSelf: 'center',
    marginTop: hp("3%"),
    marginBottom: hp("3%"),
  },
  signInText: {
    fontSize: hp("2.5%")
  },
  authenticationError: {
    // marginLeft: 15,
    textAlign: "center",
    color:"red",
    fontSize: hp("1.8%"),
    marginTop:hp("1.5%"),
    marginBottom: hp("1.5%")
  },

  dividerContainer: {
    height: hp("2.5%"),
    flexDirection: 'row',
    width: wp('80%'),
    marginTop: hp("2.5%"),
    marginBottom: hp("2.5%"),
  },
  divider: {
    height: 24,
    borderBottomWidth: hp('.2%'),
    borderColor: "#7248BD",
    flex: 1
  },
  dividerText: {
    paddingHorizontal: 24,
    fontSize: hp("2.5%"),
    fontWeight: '500',
    color: "#7248BD"
  },

  googleSignInButton: {
    marginTop: hp("5%"),
    width: 312,
    height: 48
  },

  logoRow: {
    flexDirection: 'row',
    marginTop: hp("3%"),
    marginBottom: 30,
  },
  logo: {
    fontSize: hp("6%"),
    color: '#1DB954',
    marginRight:110
  },
  check: {
    fontSize: hp("6%"),
    color: 'white'
  },

  spotifyLoginButton: {
    borderRadius: 3,
    marginTop: 10,
    marginBottom: 20,
    width: wp("40%"),
    height: hp("5%"),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: "#1DB954"
  },
  linkAccountButtonLogo: {
    fontSize: hp("3%"),
    color: "white",
    paddingRight:0
  },
  linkAccountButtonText: {
    fontSize: hp("2.5%"),
    color: "white",
    textAlign: "left",
    textAlignVertical: 'center'
  },

  footer: {
    position: "absolute",
    bottom: hp("5%"),
    right: wp("4%"),
  },
  skipText: {
    fontSize: hp("2%"),
    fontWeight: "bold",
    color: "white"
  },
  continueBtn: {
    backgroundColor: "#7248BD",
    width: wp("30%"),
    alignSelf: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  continueBtnText: {
    fontSize: hp("2%"),
    color: "white",
    textAlign: "center",
    textAlignVertical: 'center'
  },

  accountSyncContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  connectBtn: {
    width: wp('25%'),
    height: hp('5%'),
    alignSelf: 'center',
    backgroundColor: "#7248BD",
    justifyContent: "center",
    alignItems:"center",
  },
  disconnectBtn: {
    width: wp('25%'),
    height: hp('5%'),
    alignSelf: 'center',
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
