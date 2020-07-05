import axios from 'axios';
import React from 'react';
import {View, Text} from 'react-native';
import {Button} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
export default class InstagramBusinessAcountScreen extends React.Component {
  state = {
    businessId: null,
  };
  handleBLogin = async () => {
    let token = await AsyncStorage.getItem('FacebookPageAccessToken');
    let _url = `https://graph.facebook.com/v6.0/me?fields=instagram_business_account&access_token=${token}`;
    let response = await axios
      .get(_url)
      .catch(error => alert('error occured ' + error));
    let businessAccountId = response.data.instagram_business_account.id;
    await AsyncStorage.setItem(
      'InstagramBusinessAccountId',
      businessAccountId.toString(),
    );
    this.setState({businessId: businessAccountId});
  };
  render() {
    return (
      <View>
        <Button onPress={this.handleBLogin}>
          Fetch The business account ID
        </Button>
        <Text style={{fontWeight: 'bold'}}>
          BusinessID : {this.state.businessId}
        </Text>
      </View>
    );
  }
  async componentDidMount(): void {
    let buss = await AsyncStorage.getItem('InstagramBusinessAccountId');
    this.setState({businessId: buss});
  }
}
