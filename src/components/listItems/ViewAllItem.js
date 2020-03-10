import React, { PureComponent } from 'react';
import { View, TouchableOpacity } from "react-native";
import { Text,  Icon, ListItem as BaseListItem } from "native-base";
import PropTypes from 'prop-types';

import styles from "./styles";

class ViewAllItem extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {}
    this.goToViewAll = this.goToViewAll.bind(this)
  }

  goToViewAll() {

    var navigationOptions = {
      key: "ViewAll"+this.props.type,
      routeName: "ViewAll",
      params: {
        data: this.props.data,
        type: this.props.type
      }
    }
    this.props.navigation.navigate(navigationOptions)
  }


  render() {
    return (
      <BaseListItem noBorder style={styles.listFooterItem}>
        <TouchableOpacity onPress={this.goToViewAll}>
          <View style={{flexDirection: "row"}}>
            <View style={styles.footerTextContainer}>
             <View>
               <Text style={[styles.mainText,{color:"white"}]} numberOfLines={1}>View All {this.props.type}</Text>
             </View>
           </View>
           <View style={styles.arrowContainer}>
            <Icon type="FontAwesome" name="angle-right" style={styles.ellipsis} />
           </View>
         </View>
        </TouchableOpacity>
      </BaseListItem>
    )
  }
}

ViewAllItem.propTypes = {
  data: PropTypes.array.isRequired,
  type: PropTypes.oneOfType(["Songs","Artists","Albums, Singles"]),
};


export default ViewAllItem
