import React, { PureComponent } from 'react';
import { Image, View, ViewPropTypes, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


export default class PlaylistImage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loaded1: false,
      loaded2: false,
      loaded3: false,
      loaded4: false,
    };
    this.onLoadEnd = this.onLoadEnd.bind(this)
    this.isLoaded = this.isLoaded.bind(this)
  }

  onLoadEnd(index) {
    this.setState({ ["loaded" + index]: true });
  }

  isLoaded() {
    return this.state.loaded1 && this.state.loaded2 && this.state.loaded3 && this.state.loaded4
  }

  render() {
    return (
      <View>
        <View style={[styles.multiImageContainer, this.isLoaded() ? {height: this.props.height, width: this.props.width} : { width: 0, height: 0 }]}>
          <View style={{flexDirection: "row"}}>
            <FastImage
              source={this.props.images[0]}
              style={[styles.multiImage, {borderTopLeftRadius: 5}, this.isLoaded() ? {height: this.props.height/2, width: this.props.width/2} : { width: 0, height: 0 }]}
              onLoadEnd={() => this.onLoadEnd(1)}
              resizeMode={FastImage.resizeMode.cover}
            />
            <View style={[styles.multiImage, this.isLoaded() ? {height: this.props.height/2, width: this.props.width/2} : { width: 0, height: 0 }]}>
            <FastImage
              source={this.props.images[1]}
              style={[styles.multiImage, {borderTopRightRadius: 5}, this.isLoaded() ? {height: this.props.height/2, width: this.props.width/2} : { width: 0, height: 0 }]}
              onLoadEnd={() => this.onLoadEnd(2)}
              resizeMode={FastImage.resizeMode.cover}
            />
            </View>
          </View>
          <View style={{flexDirection: "row"}}>
          <View style={[styles.multiImage, this.isLoaded() ? {height: this.props.height/2, width: this.props.width/2} : { width: 0, height: 0 }]}>
            <FastImage
              source={this.props.images[2]}
              style={[styles.multiImage, {borderBottomLeftRadius: 5}, this.isLoaded() ? {height: this.props.height/2, width: this.props.width/2} : { width: 0, height: 0 }]}
              onLoadEnd={() => this.onLoadEnd(3)}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
            <FastImage
              source={this.props.images[3]}
              style={[styles.multiImage, {borderBottomRightRadius: 5}, this.isLoaded() ? {height: this.props.height/2, width: this.props.width/2} : { width: 0, height: 0 }]}
              onLoadEnd={() => this.onLoadEnd(4)}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
        </View>
        <Image
          source={require("./../../../assets/albumArtPlaceholder.png")}
          style={[styles.placeholder, this.isLoaded() ? { width: 0, height: 0 } : {height: this.props.height, width: this.props.width}]}
        />
      </View>
    );
  }
}

PlaylistImage.propTypes = {
  images: PropTypes.array.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};

PlaylistImage.defaultProps = {
  resizeMode: 'cover',
  height:  hp("24"),
  width: hp("24"),
};

const styles = StyleSheet.create({
  multiImageContainer: {
    flexDirection: "column",
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  multiImage: {
    alignSelf: 'center',
    backgroundColor:"#121212",
    resizeMode: "cover"
  },
  placeholder: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
    backgroundColor:"#121212",
  },

});
