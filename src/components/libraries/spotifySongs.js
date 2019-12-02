import React, { Component } from "react";
import { Container } from "native-base";
import { connect } from 'react-redux';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import LibraryList from "./../../components/lists/libraryList";
import Loading from "./../loading/index";
import styles from "./styles";


class SpotifySongs extends Component {

  constructor(props) {
    super(props);
    this.state = {loading: false}
  }


  async componentDidUpdate(prevProps) {
   // if internet regains connection login spotify if needed
     if(!prevProps.connected && this.props.connected ) {
       if(!this.props.platforms["Spotify"].isLoggedIn()) {
         try {
           await this.props.platforms["Spotify"].silentLogin();
         }
         catch (error) {
           await this.props.platforms["Spotify"].login()
         }
       }
     }
  }

  render() {
    return (
      <Container style={[styles.libraryContainer, this.props.filtering ? {paddingTop:hp("15%")} : {paddingTop:hp("7%")}]}>
          <LibraryList filtering={false} platform={this.props.platforms["Spotify"]} navigation={this.props.navigation}/>
      </Container>
    );
  }

}

function mapStateToProps(state) {
  return {
    platforms: state.platformState.platforms,
    connected: state.connectionState.connected,
  }
};

export default connect(mapStateToProps)(SpotifySongs)
