import React from "react";
import { DrawerItems } from 'react-navigation-drawer';
import { ScrollView, StyleSheet, Dimensions, Image, TouchableOpacity, Alert, Linking } from "react-native";
import { Button, Icon } from "native-base";
import { Block, Text, theme } from "galio-framework";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { connect } from 'react-redux';

import { DrawerItem } from './DrawerItem'
import realm from './../../realm/realm';
import { getPlatform } from './../../api/utils';
import { getActivePlatforms } from './../../realm/utils/v1';
import { logoutAllPlatforms } from './../../redux/platform/actions';
import { resetAudio } from './../../redux/audio/actions';

const { width } = Dimensions.get("screen");

const smsLink = "sms:&body=Revibe%20Music%20is%20now%20available%21%20Stream%20Spotify%2C%20YouTube%2C%20and%20Revibe%27s%20catalog%20all%20in%20one%20place.%0A%0ATo%20sign%20up%3A%0A1.%20Install%20Apple%27s%20TestFlight%3A%20https%3A%2F%2Fapps.apple.com%2Fus%2Fapp%2Ftestflight%2Fid899247664%0A2.%20Click%20the%20link%20below%21%0Ahttps%3A%2F%2Ftestflight.apple.com%2Fjoin%2Fur5G7Fgq"

const _Drawer = props => (
  <Block
    style={styles.container}
    forceInset={{ top: "always", horizontal: "never" }}
  >
    <Block flex={0.05} style={styles.header}>
      <Image styles={styles.logo} source={require("../../../assets/RevibeLogo.png")} />
    </Block>
    <Block flex>
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <DrawerItems {...props} />
        <Block flex style={{ marginTop: 24, marginVertical: 8, paddingHorizontal: 8 }}>
            <Block style={{ borderColor: "rgba(0,0,0,0.2)", width: '100%', borderWidth: StyleSheet.hairlineWidth, alignItems: "flex-start", justifyContent: "flex-start" }}/>

            <Button style={{width: wp('40%'), height: hp('6%'), backgroundColor: "transparent",alignSelf: 'flex-start', justifyContent: "flex-start"}}
              block
              onPress={() => Linking.openURL("https://artist.revibe.tech/account/login").catch((err) => console.error('An error occurred', err))}
            >
              <Icon type="Ionicons" name="md-cloud-upload" style={{color:"#7248BD", fontSize: hp('2.3%')}} />
              <Text style={{color: "#7248BD",fontSize: hp('2%')}}>Upload to Revibe</Text>
            </Button>
            <Button style={{width: wp('40%'), height: hp('5%'), backgroundColor: "transparent",alignSelf: 'flex-start', justifyContent: "flex-start"}}
              block
              onPress={() => Linking.openURL(smsLink).catch((err) => console.error('An error occurred', err))}
            >
              <Icon type="Ionicons" name="md-share-alt" style={{color:"#7248BD", fontSize: hp('2.3%')}} />
              <Text style={{color: "#7248BD", fontSize: hp('2%')}}>Invite Friends</Text>
            </Button>
            <Button style={{width: wp('40%'), height: hp('6%'), backgroundColor: "transparent",alignSelf: 'flex-start', justifyContent: "flex-start"}}
              block
              onPress={() => Linking.openURL("https://revibe.tech/pages/contact-us").catch((err) => console.error('An error occurred', err))}
            >
              <Icon type="Ionicons" name="md-mail" style={{color:"#7248BD", fontSize: hp('2%')}} />
              <Text style={{color: "#7248BD",fontSize: hp('2%')}}>Feedback</Text>
            </Button>

            <Button style={{width: wp('40%'), height: hp('6%'), backgroundColor: "transparent",alignSelf: 'flex-start', justifyContent: "flex-start"}}
              block
              onPress={() => Linking.openURL("https://revibe.tech/pages/policies").catch((err) => console.error('An error occurred', err))}
            >
              <Icon type="MaterialCommunityIcons" name="file-document" style={{color:"#7248BD", fontSize: hp('2.3%')}} />
              <Text style={{color: "#7248BD",fontSize: hp('2%')}}>Legal</Text>
            </Button>


            <Button style={{width: wp('40%'), height: hp('6%'), backgroundColor: "transparent",alignSelf: 'flex-start', justifyContent: "flex-start"}}
              block
              onPress={() => (
                Alert.alert(
                  'Are you sure you want to logout?',
                  '',
                  [
                    {
                      text: "I'm sure",
                      onPress: async () => {
                        props.navigation.navigate("NotAuthenticated")
                        props.logoutAllPlatforms()
                        props.resetAudio()
                      },
                    },
                    {
                      text: 'Cancel',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                  ],
                  {cancelable: true},
                )
              )}
            >
              <Icon type="AntDesign" name="logout" style={{color:"red", fontSize: hp('1.8%')}} />
              <Text style={{color: "red",fontSize: hp('2%')}}>Logout</Text>
            </Button>
        </Block>
      </ScrollView>

    </Block>
  </Block>
);

const mapDispatchToProps = dispatch => ({
    logoutAllPlatforms: () => dispatch(logoutAllPlatforms()),
    resetAudio: () => dispatch(resetAudio())
});

const Drawer = connect( null, mapDispatchToProps)(_Drawer);

const Menu = {
  contentComponent: props => <Drawer {...props} />,
  drawerBackgroundColor: "#202020",
  drawerWidth: width * 0.8,
  contentOptions: {
    activeTintColor: "white",
    inactiveTintColor: "#000",
    activeBackgroundColor: "transparent",
    itemStyle: {
      width: width * 0.75,
      backgroundColor: "transparent"
    },
    labelStyle: {
      fontSize: 18,
      marginLeft: 12,
      fontWeight: "normal"
    },
    itemsContainerStyle: {
      paddingVertical: 16,
      paddingHorizonal: 12,
      justifyContent: "center",
      alignContent: "center",
      alignItems: "center",
      overflow: "hidden"
    }
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    paddingHorizontal: 28,
    paddingBottom: theme.SIZES.BASE,
    paddingTop: theme.SIZES.BASE * 3,
    justifyContent: "center"
  }
});

export default Menu;
