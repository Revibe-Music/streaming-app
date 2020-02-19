import React, { PureComponent } from "react";
import { Container } from "native-base";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import LibraryList from "./../../components/lists/libraryList";
import Loading from "./../loading/index";
import styles from "./styles";


class RevibeSongs extends PureComponent {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container style={[styles.libraryContainer, this.props.filtering ? {paddingTop:hp("15%")} : {paddingTop:hp("7%")}]}>
          <LibraryList platform={this.props.platforms["Revibe"]}  navigation={this.props.navigation}/>
      </Container>
    );
  }

}

function mapStateToProps(state) {
  return {
    platforms: state.platformState.platforms,
  }
};

export default connect(mapStateToProps)(RevibeSongs)
