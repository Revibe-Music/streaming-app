import React, { Component }  from 'react';
import { StyleSheet, View, Text, Image, Dimensions, ScrollView } from 'react-native';
import { Icon } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import AppIntroSlider from 'react-native-app-intro-slider';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
// import { builder, BuilderComponent } from '@builder.io/react-native';
import HTML from 'react-native-render-html';
import axios from "axios"


import { logEvent } from './../../amplitude/amplitude';

import image1 from './../../../assets/page1.png';
import image2 from './../../../assets/page2.png';
import image3 from './../../../assets/page3.png';

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    paddingTop: hp("10%"),
    paddingBottom: hp("5%"),
    alignItems: 'center',
  },
  image: {
    width: wp("75%"),
    height: hp("45%"),
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingTop: hp("5%"),
    paddingHorizontal: 20,
    fontSize: hp("3%"),
  },
  title: {
    fontSize: 35,
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

// builder.init('45eb812c33c74d6c8743ffd2934762bb')

const slides = [
  {
    key: 'Intro',
    title: 'Welcome!',
    text: 'Revibe lets you stream all your music in one place. You can stream from Revibe, YouTube, and Spotify!',
    note: "",
    image: image1,
    colors: ['#7248BD', '#0E0E0E'],
    builderIoName: "Onboarding Test"
  },
  {
    key: 'Accounts',
    title: 'Connect Accounts',
    text: 'Login to your accounts and we automatically import your libraries.',
    note: "*Requires premium account.",
    image: image2,
    colors: ['#7248BD', '#0E0E0E'],
    builderIoName: "Onboarding Test"
  },
  {
    key: 'Features',
    title: 'Search, Queue, Stream',
    text: 'Revibe makes searching, queuing, and streaming easy by giving you one place for all your music. Enjoy!',
    note: "",
    image: image3,

    colors: ['#7248BD', '#0E0E0E'],
    builderIoName: "Onboarding Test"
  },
];

// <BuilderComponent
//   name="modal"
//   entry="754a5ca2675f417ebfedd77826f86029" />


class Tutorial extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentSlide: 0,
      htmlContent: ""
    }
  }

  async componentDidMount() {
    logEvent("Onboarding", "Started")
    var request = {
      method:"GET",
      responseType:"json",
      url: "https://builder.io/api/v1/html/modal/754a5ca2675f417ebfedd77826f86029?apiKey=45eb812c33c74d6c8743ffd2934762bb"
    }
    var htmlContent = await axios(request)
    this.setState({htmlContent: htmlContent.data.data.html})
    console.log(htmlContent);
  }

  _renderItem = ({ item, dimensions }) => (
    <LinearGradient
      style={[
        styles.mainContent,
        dimensions,
      ]}
      colors={item.colors}
      start={{ x: 0, y: 0.1 }}
      end={{ x: 0.1, y: 1 }}
    >
    <ScrollView style={{height: "10%"}} >
      <HTML decode={false} html={this.state.htmlContent} imagesMaxWidth={Dimensions.get('window').width/4}/>

    </ScrollView>
    </LinearGradient>
  );

  render() {
    return (
      <AppIntroSlider
        slides={slides}
        renderItem={this._renderItem}
        onSlideChange={(index, lastIndex) => this.setState({currentSlide: index})}
        onDone={() => {
          logEvent("Onboarding", "Completed")
          this.props.navigation.navigate({key: "LinkAccounts", routeName: "LinkAccounts"})
        }}
        onSkip={() => logEvent("Onboarding", "Skipped", {"Last Page Viewed": this.state.currentSlide+1})}
        doneLabel="Get Started"
        bottomButton />
    );
  }
}


export default Tutorial
