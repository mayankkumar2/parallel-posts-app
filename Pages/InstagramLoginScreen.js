import React from 'react';
import 'react-native-get-random-values';
import {WebView} from 'react-native-webview';
import {View, Text, Image} from 'react-native';
import CookieManager from '@react-native-community/react-native-cookies';
import AsyncStorage from '@react-native-community/async-storage';
import {Button} from 'react-native-paper';
import instagramAvatar from '../assets/images/instagramAvatar.png';
const config = {
  clientId: '667980820695966',
  clientSecret: 'a7dec6d9fbacb0c07ccc05bb41a7fcae',
  scope: 'user_profile,user_media',
  response_type: 'code',
  state: 'googleGogges',
  redirect_uri: 'https://localhost/callback',
};

function getUrlForAuth(_config) {
  let _baseURL = 'https://api.instagram.com/oauth/authorize?';
  _baseURL += 'client_id=' + _config.clientId + '&'; // adding clientID
  _baseURL += 'response_type=' + _config.response_type + '&'; //adding response type
  _baseURL += 'redirect_uri=' + _config.redirect_uri + '&'; //add redirect uri
  _baseURL += 'state=' + _config.state + '&'; // add state
  _baseURL += 'scope=' + _config.scope; // add scopes
  return _baseURL;
}

export default class App extends React.Component {
  state = {
    showLoginWebview: false,
    instagram_Code: null,
    instagram_accessToken: null,
  };
  _handleNav = obj => {
    var url = decodeURIComponent(obj.url);
    const hashes = url.slice(url.indexOf('?') + 1).split('&');
    const params = {};
    hashes.map(hash => {
      const [key, val] = hash.split('=');
      params[key] = decodeURIComponent(val);
    });
    hashes.forEach(value => {
      const [key, val] = value.split('=');
      console.log(key, decodeURIComponent(val));
      params[key.replace('"', '')] = decodeURIComponent(val);
    });
    if (params.code) {
      //console.log({token: params.code, status: 'sucess'});
      this.setState({showLoginWebview: false, instagram_Code: params.code});
      CookieManager.clearAll();
      this.fetchAcessToken(params.code, config);
    } else if (params.error) {
      alert(
        'Error occured : ' +
          params.error +
          '\nError Description: ' +
          params.error_description,
      );
      CookieManager.clearAll();
    }
    // this.setState({showLoginWebview: false});
  };

  fetchAcessToken = async (codeVal, _config) => {
    // let formData = new FormData();
    // formData.append('grant_type', 'authorization_code');
    // formData.append('code', codeVal);
    // formData.append('redirect_uri', _config.redirect_uri);
    // formData.append('client_id', _config.clientId);
    // formData.append('client_secret', _config.clientSecret);
    let _string =
      'grant_type=authorization_code&' +
      'code=' +
      codeVal +
      '&redirect_uri=' +
      _config.redirect_uri;
    _string +=
      '&client_id=' +
      _config.clientId +
      '&client_secret=' +
      _config.clientSecret;
    const returnValue = await fetch(
      'https://api.instagram.com/oauth/access_token',
      {
        method: 'POST',
        body: _string,
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
        },
      },
    ).catch(error => {
      console.log(error);
    });
    const result = await returnValue.json();
    console.log('result ===--?>', result);
    this.setState({
      instagram_accessToken: result.access_token,
    });
    await AsyncStorage.setItem(
      'instagramAccessToken',
      result.access_token,
      () => alert('Login Successful'),
    ).catch(error => console.log(error));
  };
  async componentDidMount() {
    this.setState({
      instagram_accessToken: await AsyncStorage.getItem('instagramAccessToken'),
    });
    console.log(await AsyncStorage.getItem('instagramAccessToken'));
  }

  render() {
    console.log(this.state);
    return (
      <View style={{flex: 1}}>
        {this.state.showLoginWebview ? (
          <WebView
            source={{uri: getUrlForAuth(config)}}
            style={{marginTop: 20}}
            onNavigationStateChange={this._handleNav}
          />
        ) : this.state.instagram_accessToken ? (
          <View
            style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
            <Image
              source={instagramAvatar}
              style={{alignSelf: 'center', height: 200}}
              resizeMode={'contain'}
            />
            <Button
              color={'#C13584'}
              icon={'instagram'}
              onPress={async () => {
                this.setState({instagram_accessToken: null});
                await AsyncStorage.setItem('instagramAccessToken', '');
              }}>
              Logout
            </Button>
          </View>
        ) : (
          <View
            style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
            <Image
              source={instagramAvatar}
              style={{alignSelf: 'center', height: 200}}
              resizeMode={'contain'}
            />
            <Button
              color={'#C13584'}
              icon={'instagram'}
              onPress={() =>
                this.setState({
                  showLoginWebview: true,
                })
              }>
              Login
            </Button>
          </View>
        )}
        <Button
          onPress={async () => {
            alert(await AsyncStorage.getItem('instagramAccessToken'));
          }}>
          Alert
        </Button>
      </View>
    );
  }
}
