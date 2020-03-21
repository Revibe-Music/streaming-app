import React, { PureComponent } from 'react';
import { View, Image, TouchableOpacity } from "react-native";
import { Card, Text, Icon, Body} from "native-base";
import PropTypes from 'prop-types';
import { compact } from 'lodash';
import { connect } from 'react-redux';

import { goToAlbum } from './../../redux/navigation/actions';
import styles from "./styles";

class AlbumCard extends PureComponent {

  constructor(props) {
    super(props);
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
      onPress={() => this.props.goToAlbum(this.props.album,this.props.songs)}
      delayPressIn={0} useForeground >
        <Card style={styles.card} noShadow={true}>
          <Image source={this.props.image} style={styles.cardImg} />
          <Body style={styles.cardItem}>
            <View style={styles.radioCardName}>
              <View style={{ flex: 0.5}}>
                <Text numberOfLines={1} style={styles.text}>
                  {this.props.album.name}
                </Text>
              </View>
              <View style={{ flex: 0.5}}>
                <Text numberOfLines={1} note>
                  {this.setArtist(this.props.album)}
                </Text>
              </View>
            </View>
          </Body>
        </Card>
      </TouchableOpacity>
    )
  }
}

AlbumCard.propTypes = {
  album: PropTypes.object.isRequired,
  songs: PropTypes.array,
  image: PropTypes.string
};

AlbumCard.defaultProps = {
  songs: [],
};

const mapDispatchToProps = dispatch => ({
    goToAlbum: (album,songs) => dispatch(goToAlbum(album,songs)),
});

export default connect(null,mapDispatchToProps)(AlbumCard)
