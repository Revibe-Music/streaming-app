import React, { Component }  from 'react';
import { StyleSheet, View, Text, Image, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { Header, Content, Card, CardItem, Body, Icon } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import AppIntroSlider from 'react-native-app-intro-slider';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import Carousel, { Pagination } from 'react-native-snap-carousel';
import { logEvent } from './../../amplitude/amplitude';

import ButtonSubmit from './../../components/ButtonSubmit';
import Logo from './../../components/Logo';
// import image1 from './../../../assets/page1.png';
// import image2 from './../../../assets/page2.png';
// import image3 from './../../../assets/page3.png';

import image1 from './../../../assets/intro-library.png';
import image2 from './../../../assets/intro-search.png';
import image3 from './../../../assets/intro-browse.png';

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

class Tutorial extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeSlide:0,
      carouselItems: [
        {
            text: "Fill your library and playlists",
            image: image1,
        },
        {
            text: "Easily search any song",
            image: image2,
        },
        {
            text: "Discover and support local artists",
            image: image3,
        },
      ]
    }
  }

  componentDidMount() {
    logEvent("Onboarding", "Started")
  }

  _renderItem({item,index}){
        return (
          <Card style={{backgroundColor:'#242424',borderRadius: 20, borderColor: "transparent", height: hp(55), width: wp("90"),}}>
            <CardItem style={{backgroundColor: "transparent"}}>
              <Body style={{alignItems: "center", justifyContent: "space-between", marginTop: hp(1)}}>
                <Image source={item.image} style={{height: wp(85), width:wp(80), borderRadius: 10}}/>
                <Text style={{color: "white", fontSize: hp(3), textAlign: "center", fontWeight: "bold", marginTop: hp(2)}}>
                   {item.text}
                </Text>
              </Body>
            </CardItem>
          </Card>
        )
    }

    render() {
        return (
          <>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={{flex: 1, backgroundColor:'#0E0E0E', alignItems: "center", justifyContent: "center"}}>
              <Logo />
              <Carousel
                containerCustomStyle={{marginTop: hp(5)}}
                ref={ref => this.carousel = ref}
                data={this.state.carouselItems}
                sliderWidth={wp(90)}
                itemWidth={wp(90)}
                renderItem={this._renderItem}
                onSnapToItem = { index => this.setState({activeSlide:index})}
              />
              <Pagination
              dotsLength={3}
              carouselRef={this.carousel}
              tappableDots={true}
              activeDotIndex={this.state.activeSlide}
              containerStyle={{alignItems: "center", width: wp("80")}}
              dotStyle={{
                  width: wp(20),
                  height: hp(.8),
                  borderRadius: 2,
                  backgroundColor: '#7248BD'
              }}
              inactiveDotStyle={{
                width: wp(20),
                height: hp(.8),
                borderRadius: 2,
                backgroundColor: '#242424'
              }}
              inactiveDotScale={0.8}
            />
            <TouchableOpacity
              style={{alignItems: 'center',justifyContent: 'center',backgroundColor: '#7248BD',height: hp(5), width: wp(70), borderRadius: 20, marginBottom: hp(3)}}
              onPress={() => this.props.navigation.navigate({key: "Login",routeName: "Login", params:{registering: true}})}
              activeOpacity={1}
            >
              <Text style={{color: 'white',fontWeight: "bold",backgroundColor: 'transparent'}}>Sign Up</Text>
            </TouchableOpacity>
            <View style={{flexDirection: "row", width: wp(68), justifyContent: "center", alignItems: "center"}}>
              <Text
                style={{color: "white", fontSize: hp(2),fontWeight: "bold"}}
                onPress={() => this.props.navigation.navigate({key: "Login",routeName: "Login", params:{registering: false}})}
              >
                Login
              </Text>
                {/*<Text style={{color: "white", fontSize: hp(2), fontWeight: "bold"}}>Skip</Text>*/}
              </View>
            </SafeAreaView>
          </>
        );
    }

}


export default Tutorial
