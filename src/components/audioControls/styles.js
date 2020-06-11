import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


export default {
  time: {
      flex: 1,
      flexDirection: "row",
      width: wp("80%"),
      alignItems: "center",
      marginTop: 0,
      marginLeft:wp("10%"),
      justifyContent: 'center',
      alignItems: 'center'
  },
  seekBar: {
      marginTop: hp("2%"),
      width: wp("80%"),
      marginLeft: wp("10%"),
  },
  thumbStyle: {
    width: 12,
    height: 12,
    backgroundColor: 'white',
    borderRadius: 6
  },
  seekTimeContainer: {
    alignItems: "center",
    flex: 0.15
  },
  seekTime: {
    color: "grey",
    fontSize: hp("1.5%"),
    marginBottom: wp("5%"),

  },
  controlBtn: {
      backgroundColor: "transparent",
      height:null,
  },
  nextBtn: {
      color: "white",
      fontSize:hp("5%"),
  },
  previousBtn: {
      color: "white",
      fontSize:hp("5%"),
  },
  swiperStyle: {
      height: hp("1.5%"),
      alignItems: "center",
      justifyContent: "center",
      elevation: 200,
      top: 15,
  },
  albumArtContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:"#22222"
    // backgroundColor:"transparent"
  },
  albumArt: {
      width: wp("80%"),
      height: wp("80%"),
  },
  minAlbumArt: {
      width: wp(12),
      height: wp(12),
      marginBottom: wp("1%"),
  },
  albumArtPlaceholder: {
    width: wp("80%"),
    height: wp("80%"),
    backgroundColor:"#222222",
    resizeMode:"center",
  },

  videoPlayerContainer: {
      width: wp("100%"),
      height: wp("100%"),
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:"#22222"
  },
  videoPlayerStyle: {
      width: wp("95%"),
      height: wp("58%"),
      backgroundColor: "transparent",
  },
  minVideoStyle: {
      width: wp(13),
      height: wp(12),
      // width: "auto",
      // height: hp("8%"),
      // elevation: 200,
      // marginLeft: wp("1%"),
      // marginTop: wp("1%"),
      marginBottom: wp("1%"),

  },
  openPlayerSongDetailsContainer: {
      marginTop: hp("2"),
      width: wp("80%"),
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
  },
  openPlayerSongName: {
      fontSize: hp("2.5"),
      fontWeight: "bold",
      color: "white",
      textAlign: "center",
  },
  openPlayerArtistName: {
      color: "grey",
      fontSize: hp("2"),
      marginLeft: hp(".5"),
  },
  closedPlayerSongDetailsContainer: {
      flex: 0.8,
      alignItems: "center",
      justifyContent: "center"
  },
  closedPlayerSongName: {
      fontSize: hp("2"),
      fontWeight: "bold",
      color: "white",
      textAlign: "center",
  },
  closedPlayerArtistName: {
      color: "grey",
      fontSize: hp("1.5"),
  },
  logo: {
    fontSize: hp("3"),
  },

};
