import React, { Component } from "react";
import { Button, Icon } from "native-base";
import { View} from "react-native";
import { connect } from 'react-redux';
import { nextSong  } from './../../redux/audio/actions';
import styles from "./styles";


class NextButton extends Component{

    constructor(props) {
      super(props);
      this.goToNextSong = this.goToNextSong.bind(this);
    }

    goToNextSong() {
      this.props.nextSong();
    };


  render() {

    return (
      <View>
          <Button
          style={styles.controlBtn}
          color="white"
          onPress={() => this.goToNextSong()}
          >
              <Icon name="md-skip-forward" style={styles.nextBtn}/>
          </Button>
      </View>
    );
  }
}


const mapDispatchToProps = dispatch => ({
    nextSong: () => dispatch(nextSong()),
});

export default connect(null, mapDispatchToProps)(NextButton)
