/*
* All accounts that require authentication will be tested to ensure
* the user has signed in before rendering the account tabs and all
* public platform tabs (YouTube) will automatically render
*/
import React, { Component } from "react";
import { TouchableOpacity, View, Text } from 'react-native'
import { Container, Tabs, Tab, Icon, Header, Left, Body, Right, Button, ListItem } from "native-base";
import { CheckBox } from 'react-native-elements'
import { connect } from 'react-redux';
import styles from "./styles";
import {default as SearchBar} from 'react-native-search-box';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Modal from "react-native-modal";
import { shuffleSongs, playSong } from './../../redux/audio/actions'
import List from "./../../components/lists/List";
import OptionsMenu from "./../../components/OptionsMenu/index";

import realm from './../../realm/realm';


class Library extends Component {

  static navigationOptions = {
    header: null
  };

  constructor(props) {
     super(props);

     this.state = {
       showFilterModal: false,
       filtering: false,
       selectedFilter: "Songs",
       filterText: "",
     }

     this.goToContentPage = this.goToContentPage.bind(this)
  }

  goToContentPage(type) {
    this.props.navigation.navigate(
      {
        key: "LibraryContent",
        routeName: "LibraryContent",
        params: {
          contentType: type,
        }
      }
    )
  }

  render() {

    return (
      <>
      <Header style={styles.libraryHeader} androidStatusBarColor="#222325" iosBarStyle="light-content">
        <Left>
        <Text style={styles.pageTitle}> Library </Text>
        </Left>
        <Body>
        </Body>
        <Right>
        </Right>
      </Header>

      <View style={styles.container}>
      <View style={{flexDirection: "row", justifyContent: "space-evenly"}}>
        <Button
          bordered
          light
          onPress={() => this.goToContentPage("Songs")}
          style={{width: wp("40"), height: hp("15"), justifyContent: "center", alignItems: "center", flexDirection: "column", borderColor: "#7248BD"}}
        >
          <Icon type="MaterialCommunityIcons" name="music-circle-outline" style={{fontSize: hp("8%"), color: "white"}} />
          <Text style={{fontSize: hp("2%"), color: "white"}} >Songs</Text>
        </Button>
        <Button
          bordered
          light
          onPress={() => this.goToContentPage("Artists")}
          style={{width: wp("40"), height: hp("15"), justifyContent: "center", alignItems: "center", flexDirection: "column", borderColor: "#7248BD"}}
        >
          <Icon type="Entypo" name="modern-mic" style={{fontSize: hp("8%"), color: "white"}} />
          <Text style={{fontSize: hp("2%"), color: "white"}} >Artists</Text>
        </Button>
      </View>
      <View style={{flexDirection: "row", justifyContent: "space-evenly", paddingTop: wp("7")}}>
        <Button
          bordered
          light
          onPress={() => this.goToContentPage("Albums")}
          style={{width: wp("40"), height: hp("15"), justifyContent: "center", alignItems: "center", flexDirection: "column", borderColor: "#7248BD"}}
        >
          <Icon type="FontAwesome5" name="compact-disc" style={{fontSize: hp("7%"), color: "white", paddingBottom: hp("1")}} />
          <Text style={{fontSize: hp("2%"), color: "white"}} >Albums</Text>
        </Button>
        <Button
          bordered
          light
          disabled
          style={{width: wp("40"), height: hp("15"), justifyContent: "center", alignItems: "center", flexDirection: "column", borderColor: "#7248BD"}} >
          <Icon type="Feather" name="music" style={{opacity: .2,fontSize: hp("8%"), color: "white"}} />
          <Text style={{opacity: .2,fontSize: hp("2%"), color: "white"}} >Playlists</Text>
        </Button>
        <Text style={{textAlign: "center", top:hp("7"), fontWeight: "bold",right: wp("7"), color: "#7248BD", fontSize: hp("3"), position: "absolute", width: wp("40")}}> COMING SOON</Text>
      </View>
      </View>
      </>
    );
  }
}


function mapStateToProps(state) {
  return {
    platforms: state.platformState.platforms,
  }
};

const mapDispatchToProps = dispatch => ({
    shuffleSongs: () => dispatch(shuffleSongs()),
    playSong: (index, playlist) => dispatch(playSong(index, playlist))
});


export default connect(mapStateToProps, mapDispatchToProps)(Library)
