import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, StatusBar} from 'react-native';
import { Container as BaseContainer, Content, Header, Left, Body, Right, Text, View, Button, Icon} from "native-base";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { goBack } from './../../redux/navigation/actions';
import OptionsMenu from "./../OptionsMenu/index";



export class Container extends Component {

  render() {
    return (
      <>
      <View style={styles.container}>
      <StatusBar barStyle="light-content" />
        <View style={styles.libraryHeader}>
          <View style={{flexDirection: "row", alignItems: "center", width: wp("100%")}}>
          {this.props.showBackButton ?
            <>
            <View style={{flexDirection: "row", justifyContent: "flex-start", width: wp("20%")}}>
              <Button
                transparent
                onPress={() => this.props.goBack()}>
                <Icon name="ios-arrow-back" style={{color:"white", fontSize: 30}}/>
              </Button>
            </View>
            <View style={{flexDirection: "row", justifyContent: "center", width: wp("60%")}}>
              <Text style={[styles.pageTitle, {fontSize: hp("2.5%"), paddingLeft: 0}]}>{this.props.title}</Text>
            </View>
            </>
          :
            <View style={{flexDirection: "row", justifyContent: this.props.headerTitlePosition=="left" ? "flex-start" : "center", width: wp("60%")}}>
              <Text style={styles.pageTitle}> {this.props.title} </Text>
            </View>
          }
          {this.props.headerIcon ?
            <View style={{alignItems: "flex-end", width: "20%"}}>
              {this.props.headerIcon}
            </View>
          :
            null
          }
          </View>
        </View>

      {this.props.scrollable ?
        <Content style={styles.content}>
          {this.props.children}
        </Content>
      :
        <BaseContainer style={styles.content}>
          {this.props.children}
        </BaseContainer>
      }
      </View>
      <OptionsMenu />
      </>
    );
  }
}

Container.propTypes = {
  headerTitle: PropTypes.string,
  headerTitlePosition: PropTypes.string,
  showBackButton: PropTypes.bool,
  headerIcon: PropTypes.element,
  scrollable: PropTypes.bool,
};

Container.defaultProps = {
  headerTitlePosition: "left",
  scrollable: true,
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: "#121212",
    flex: 1,
  },
  content: {
    paddingTop: hp("3.5%"),
    backgroundColor: "transparent",
  },
  libraryHeader: {
    backgroundColor: "transparent",
    borderBottomWidth: 0,
    justifyContent: 'flex-start',
    margin: 0,
    paddingTop: hp("4.5")
  },
  pageTitle: {
    fontSize: hp("3.5%"),
    color: "white",
    fontWeight: "bold",
    paddingLeft: wp("2%"),
  },
});

const mapDispatchToProps = dispatch => ({
    goBack: () => dispatch(goBack()),
});

export default connect(null, mapDispatchToProps)(Container)
