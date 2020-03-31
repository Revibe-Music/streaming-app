import React, { PureComponent } from 'react';
import { Image, View } from 'react-native';
import PropTypes from 'prop-types';
import {default as BaseFastImage} from 'react-native-fast-image';


export default class FastImage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {loaded: false};
    this.onLoadEnd = this.onLoadEnd.bind(this)
  }

  onLoadEnd() {
    this.setState({ loaded: true });
  }

  render() {
    return (
      <View>
      {!this.state.loaded ? <Image source={this.props.placeholder} style={this.props.style} /> : null}
      <BaseFastImage
        source={this.props.source}
        style={[this.props.style, this.state.loaded ? {} : {width: 0, height: 0} ]}
        onLoadEnd={() => this.onLoadEnd()}
        resizeMode={BaseFastImage.resizeMode.cover}
      />
      </View>
    );
  }
}

Image.propTypes = {
  source: PropTypes.object.isRequired,
  placeholder: PropTypes.object.isRequired,
};
