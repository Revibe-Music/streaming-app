import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, StatusBar,Image, ScrollView, Flatlist} from 'react-native';
import { Container as BaseContainer, Content, Header, Left, Body, Right, Text, View, Button, Icon} from "native-base";
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import ImageLoad from 'react-native-image-placeholder';
import * as Animatable from 'react-native-animatable';
import { getColorFromURL } from 'rn-dominant-color';

import { connect } from 'react-redux';
import OptionsMenu from "./../OptionsMenu/index";
import FastImage from "./../images/fastImage";
import PlaylistImage from "./../images/playlistImage";
import { goBack } from './../../redux/navigation/actions';


export class ParalaxContainer extends Component {

  constructor(props) {
     super(props);
     this.state = {
       primaryColor: "#121212",
       secondaryColor: "#121212",
     }
     this.displayLogo = this.displayLogo.bind(this)
     this.getColorBackdrop = this.getColorBackdrop.bind(this)
  }

  componentDidMount() {
    this.getColorBackdrop()
  }

  componentDidUpdate(prevProps) {
    if(prevProps.images.length === undefined && this.props.images.length === undefined) {
      if(prevProps.images.uri !== this.props.images.uri) {
        this.getColorBackdrop()
      }
    }
  }

  async getColorBackdrop() {
    if(this.props.images.length === undefined) {
      if(this.props.images.hasOwnProperty("uri")) {
        try {
          var color = await getColorFromURL(this.props.images.uri)
          this.setState({ primaryColor: color.primary, secondaryColor: color.secondary})
        }
        catch(error) {
          console.log(error);
        }
      }
    }
  }

  displayLogo() {
    if(this.props.platform.toLowerCase() === "spotify") {
      var platformIcon = <Icon type="FontAwesome5" name="spotify" style={[styles.logo, {color: "#1DB954"}]} />
    }
    else if(this.props.platform.toLowerCase() === "youtube") {
      var platformIcon = <Icon type="FontAwesome5" name="youtube" style={[styles.logo, {color: "red"}]} />
    }
    else {
      var platformIcon = <Image source={require('./../../../assets/revibe_logo.png')}/>
    }
    return platformIcon
  }

  render() {
    return (
      <>
      <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      <HeaderImageScrollView
        maxHeight={hp("40")}
        minHeight={hp("10")}
        maxOverlayOpacity={0.5}
        minOverlayOpacity={0}
        overlayColor="#121212"
        fadeOutForeground
        ScrollViewComponent={Flatlist}
        scrollViewBackgroundColor="#121212"
        renderHeader={() => (
          <LinearGradient
            style={{flex:1}}
            locations={[0,0.4,0.65]}
            colors={[this.state.primaryColor, this.state.secondaryColor, '#121212']}
          >
          <View style={{top: hp("10%")}}>
          {this.props.images.length ?
            <PlaylistImage images={this.props.images} />
            :
            <FastImage
              style={styles.singleImage} // rounded or na?
              source={this.props.images}
              placeholder={this.props.placeholderImage}
            />
          }

          </View>
          </LinearGradient>
        )}
        renderFixedForeground={() => (
          <Animatable.View
            style={styles.navTitleView}
            ref={navTitleView => {
              this.navTitleView = navTitleView;
            }}
          >
            <Text style={styles.navTitle}>{this.props.title}</Text>
          </Animatable.View>
        )}
        renderForeground={() => (
          <>
          <View style={styles.titleContainer}>
            <Text style={styles.imageTitle}>{this.props.title}</Text>
          </View>

          </>
        )}
        renderTouchableFixedForeground={() => (
          <>
          <View style={styles.headerContainer}>
            <Button
              transparent
              title=""
              onPress={() => this.props.goBack()}>
              <Icon name="ios-arrow-back" style={{color:"white", fontSize: 30, textAlign: "left"}}/>
            </Button>
            {this.props.displayLogo ?
              <View style={{padding: 10}}>
              {this.displayLogo()}
              </View>
            :
              null
            }

          </View>
          </>
        )}
      >

        <TriggeringView
          style={styles.section}
          onHide={() => this.navTitleView.fadeInUp(200)}
          onDisplay={() => this.navTitleView.fadeOut(100)}
        >
        <View style={styles.title}>
          <Text style={styles.title}>{this.props.text}</Text>
          <Text note style={{textAlign: "center"}}>{this.props.note}</Text>
        </View>
        {this.props.showButton ?
          <View style={styles.center}>
            <Button
            rounded
            large
            onPress={() => this.props.onButtonPress()}
            style={styles.shuffleBtn}>
            <View style={styles.center}>
              <Text uppercase style={styles.shuffle}>{this.props.buttonText}</Text>
            </View>
            </Button>
          </View>
        :
          null
        }

        </TriggeringView>
        {this.props.children}
      </HeaderImageScrollView>
      </View>
      <OptionsMenu />
      </>
    );
  }
}

ParalaxContainer.propTypes = {
  platform: PropTypes.string,
  displayLogo: PropTypes.bool,
  placeholderImage: PropTypes.node,
  title: PropTypes.string,
  text: PropTypes.string,
  note: PropTypes.string,
  showButton: PropTypes.bool,
  buttonText: PropTypes.string,
  onButtonPress: PropTypes.func,
  image: PropTypes.string,
  images: PropTypes.array,
};

ParalaxContainer.defaultProps = {
  showButton: false,
  displayLogo: true,
  buttonText: "Listen",
  images: [],
  // placeholderImage:require("./../../../assets/albumArtPlaceholder.png")
};


const styles = StyleSheet.create({

  titleContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  navTitleView: {
    height: hp("10"),
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
    opacity: 0,
  },
  title: {
    textAlign: "center",
    marginTop: hp("1"),
    fontSize: hp("2"),
    color: "white"
  },
  navTitle: {
    color: 'white',
    fontSize: 18,
    backgroundColor: 'transparent',
  },
  imageTitle: {
    color: 'white',
    backgroundColor: 'transparent',
    fontSize: hp("3"),
  },
  center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "space-between"
  },
  shuffle: {
      fontSize: 15,
      letterSpacing: 1.2,
      fontWeight: "bold",
      color: "white"
  },
  shuffleBtn: {
      backgroundColor: "#7248BD",
      height: hp("5%"),
      width: wp("35%"),
      marginTop: hp("2"),
  },

  headerContainer: {
    marginTop: hp("3"),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  logo: {
    fontSize: hp("4%"),
  },

  singleImage: {
    height: hp("24"),
    width: hp("24"),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
    backgroundColor:"#121212",
  },
  multiImageContainer: {
    height: hp("24"),
    width: hp("24"),
    flexDirection: "column",
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  multiImage: {
    height: hp("11.5"),
    width: hp("11.5"),
    alignSelf: 'center',
    resizeMode: 'contain',
    backgroundColor:"#121212",
  },

});

const mapDispatchToProps = dispatch => ({
    goBack: () => dispatch(goBack()),
});

export default connect(null, mapDispatchToProps)(ParalaxContainer)
