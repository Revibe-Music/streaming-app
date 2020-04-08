import React, { PureComponent } from 'react';
import { View, Image, TouchableOpacity } from "react-native";
import { Card, Text, Icon, Body} from "native-base";
import PropTypes from 'prop-types';
import { compact } from 'lodash';
import { connect } from 'react-redux';

import FastImage from "./../images/fastImage";
import { goToPlaylist } from './../../redux/navigation/actions';
import styles from "./styles";

class PlaylistCard extends PureComponent {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity
      style={{borderBottomWidth:0}}
      onPress={() => this.props.goToPlaylist(this.props.playlist, false)}
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
                  {this.props.playlist.name}
                </Text>
              </View>
              <View style={{ flex: 0.5}}>
              </View>
            </View>
          </Body>
        </Card>
      </TouchableOpacity>
    )
  }
}

PlaylistCard.propTypes = {
  playlist: PropTypes.object.isRequired,
  image: PropTypes.string
};

const mapDispatchToProps = dispatch => ({
    goToPlaylist: (playlist, isLocal) => dispatch(goToPlaylist(playlist,isLocal)),
});

export default connect(null,mapDispatchToProps)(PlaylistCard)
