import React, { PureComponent } from 'react';
import { View, Image, TouchableOpacity } from "react-native";
import { Card, Text, Icon, Body} from "native-base";
import PropTypes from 'prop-types';
import { compact } from 'lodash';
import { connect } from 'react-redux';

import FastImage from "./../images/fastImage";
import { goToAlbum } from './../../redux/navigation/actions';
import styles from "./styles";

class SongCard extends PureComponent {

  constructor(props) {
    super(props);

    // this is used as an album object to display song related info on album page
    this.album = {
      id: this.props.song.id,
      name: this.props.song.name,
      platform: this.props.song.platform,
      contributors: this.props.song.contributors,
      images: this.props.song.album.images,
      type: "song"
    }
  }

  setArtist(item) {
    var contributors = Object.keys(item.contributors).map(x => item.contributors[x])
    var contributorString = compact(contributors.map(function(x) {if(x.type === "Artist") return x.artist.name})).join(', ')
    return contributorString
  }


  render() {
    return (
      <TouchableOpacity
      style={{borderBottomWidth:0}}
      onPress={() => this.props.goToAlbum(this.album,[this.props.song])}
      delayPressIn={0} useForeground >
        <Card style={styles.card} noShadow={true}>
          <FastImage
            style={styles.cardImg} // rounded or na?
            source={this.props.image}
            placeholder={require("./../../../assets/albumArtPlaceholder.png")}
          />
          <Body style={styles.cardItem}>
            <View style={styles.radioCardName}>
              <View style={{ flex: 0.5}}>
                <Text numberOfLines={1} style={styles.text}>
                  {this.props.song.name}
                </Text>
              </View>
              <View style={{ flex: 0.5}}>
                <Text numberOfLines={1} note>
                  {this.setArtist(this.props.song)}
                </Text>
              </View>
            </View>
          </Body>
        </Card>
      </TouchableOpacity>
    )
  }
}

SongCard.propTypes = {
  song: PropTypes.object.isRequired,
  image: PropTypes.string
};

SongCard.defaultProps = {
  song: [],
};

const mapDispatchToProps = dispatch => ({
    goToAlbum: (album,songs) => dispatch(goToAlbum(album,songs)),
});

export default connect(null,mapDispatchToProps)(SongCard)
