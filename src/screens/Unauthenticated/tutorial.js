import React, { Component }  from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Icon } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import AppIntroSlider from 'react-native-app-intro-slider';

import image from './../../../assets/browseCover.jpg';

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  image: {
    width: 200,
    height: 200,
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingHorizontal: 20,
    fontSize: 20,
  },
  title: {
    fontSize: 35,
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: 20,
  },
});

const slides = [
  {
    key: 'Intro',
    title: 'Welcome To Revibe!',
    text:
      'Revibe lets you stream all your music in one place. You can stream from Revibe, YouTube, and Spotify!',
    icon: 'ios-images-outline',
    colors: ['#7248BD', '#0E0E0E'],
  },
  {
    key: 'somethun1',
    title: 'Connect Your Spotify',
    text:
      'The component is also super customizable, so you can adapt it to cover your needs and wants.',
    icon: 'ios-options-outline',
    colors: ['#7248BD', '#0E0E0E'],
  },
  {
    key: 'somethun2',
    title: 'No need to buy me beer',
    text: 'Usage is all free',
    icon: 'ios-beer-outline',
    colors: ['#7248BD', '#0E0E0E'],
  },
];


class Tutorial extends Component {

  // Dont need to go to link other accounts page after this one, just go to authenticated part

  constructor(props) {
    super(props);
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
    <Icon type="Ionicons" name={item.icon} style={{ backgroundColor: 'transparent', fontSize:50,color:"white"}} />
      <View style={{marginTop: 20}}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    </LinearGradient>
  );

  render() {
    return (
      <AppIntroSlider slides={slides} renderItem={this._renderItem} bottomButton />
    );
  }
}


export default Tutorial
