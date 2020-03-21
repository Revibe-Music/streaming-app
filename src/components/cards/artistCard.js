import React, { PureComponent } from 'react';
import { View, Image, TouchableOpacity } from "react-native";
import { Card, Text, Icon, Body} from "native-base";
import PropTypes from 'prop-types';
import ImageLoad from 'react-native-image-placeholder';
import { connect } from 'react-redux';

import { goToArtist } from './../../redux/navigation/actions';
import styles from "./styles";

class ArtistCard extends PureComponent {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity
      style={{borderBottomWidth:0}}
      onPress={() => this.props.goToArtist(this.props.artist)}
      delayPressIn={0} useForeground >
        <Card style={styles.card} noShadow={true}>
          <Image source={this.props.image} style={styles.artistCardImg} />
          <Body style={styles.cardItem}>
            <View style={styles.radioCardName}>
              <View style={{ flex: 0.5}}>
                <Text numberOfLines={1} style={styles.text}>
                  {this.props.artist.name}
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

ArtistCard.propTypes = {
  artist: PropTypes.object.isRequired,
  image: PropTypes.string
};


const mapDispatchToProps = dispatch => ({
    goToArtist: (artist) => dispatch(goToArtist(artist)),
});

export default connect(null,mapDispatchToProps)(ArtistCard)
