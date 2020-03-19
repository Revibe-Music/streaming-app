import React, { Component } from "react";
import { Container, View, Button, Text, Icon, Header, Left, Body, Right } from "native-base";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import List from "../../../components/lists/List";
import AnimatedPopover from "../../../components/animatedPopover/index";

import OptionsMenu from "../../../components/OptionsMenu/index";
import { getPlatform } from '../../../api/utils';

import styles from "./styles";



class ViewAll extends Component {

  static navigationOptions = {
    header:  null
  };

  constructor(props) {
     super(props);
     this.state = {
       loading: false,
       data: [...this.props.navigation.state.params.data]
     }
     this.type = this.props.navigation.state.params.type
     this.type = this.type.charAt(0).toUpperCase() + this.type.slice(1,this.type.length)
     if(this.props.navigation.state.params.title) {
       this.title = this.props.navigation.state.params.title
     }
     else {
       this.title = null
     }
   }

   async componentDidMount() {
     if(this.state.data.length < 1) {
       if(this.props.navigation.state.params.endpoint) {
         this.setState({loading: true})
         const platform = getPlatform(this.props.navigation.state.params.platform)
         var response = await platform.makeRequest(this.props.navigation.state.params.endpoint, "GET", null, true)
         response = response.data
         if(response.type==="songs") {
           response.results = response.results.map(x => platform._parseSong(x))
         }
         else if(response.type==="albums") {
           response.results = response.results.map(x => platform._parseAlbum(x))
         }
         else if(response.type==="artists") {
           response.results = response.results.map(x => platform._parseArtist(x))
         }
         this.setState({loading: false, data: response.results})
       }
     }
   }

  render() {
    return (
      <>
      <Header style={styles.libraryHeader} androidStatusBarColor="#222325" iosBarStyle="light-content">
        <View style={{flexDirection: "row", alignItems: "center", width: wp("100%")}}>
          <View style={{flexDirection: "row", justifyContent: "flex-start", width: wp("20%")}}>
            <Button
              transparent
              onPress={() => this.props.navigation.goBack()}>
              <Icon name="ios-arrow-back" style={{color:"white", left: 10}}/>
            </Button>
          </View>
          <View style={{flexDirection: "row", justifyContent: "center", width: wp("60%")}}>
            <Text style={[styles.pageTitle]}>{this.title ? this.title : this.type}</Text>
            </View>
        </View>
      </Header>

      <Container style={styles.container}>
        <AnimatedPopover type="Loading" show={this.state.loading} />
        <List
          data={this.state.data}
          type={this.type}
          isLocal={false}
          allowRefresh={false}
          noDataText="No Results"
          displayLogo={this.props.navigation.state.params.displayLogo}
          navigation={this.props.navigation}
        />
        <OptionsMenu navigation={this.props.navigation} />
      </Container>
      </>
    );
  }
}

export default ViewAll
