import React, { Component } from "react";
import { Button, Icon } from "native-base";
import { View} from "react-native";
import { connect } from 'react-redux';
import { prevSong  } from './../../redux/audio/actions';
import styles from "./styles";


class PreviousButton extends Component{

    constructor(props) {
      super(props);
      this.goToPrevSong = this.goToPrevSong.bind(this);

    }

    goToPrevSong = () => {
      this.props.prevSong();
    };

  render() {
    return (
      <View>
        <Button
        style={styles.controlBtn}
        color="white"
        onPress={() => this.goToPrevSong()}
        >
            <Icon name="md-skip-backward" style={styles.previousBtn}/>
        </Button>
      </View>
    );
  }
}


const mapDispatchToProps = dispatch => ({
    prevSong: () => dispatch(prevSong()),
});

export default connect(null, mapDispatchToProps)(PreviousButton)
