import React from 'react';
import {
  Image,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import logo from '../assets/images/logo.png';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import {Button, Surface} from 'react-native-paper';
import {LoginButton, LoginManager, AccessToken} from 'react-native-fbsdk';
import FacebookAvatar from '../assets/images/facebookAvatar.png';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import bgr from '../assets/images/bgr.png';
import menuBtn from '../assets/images/menu-2.png';
import Dialog from 'react-native-dialog';
const DeviceDim = {
  Width: Dimensions.get('window').width,
  Height: Dimensions.get('window').height,
};

export class FacebookLoginScreen extends React.Component {
  state = {
    facebookAccessToken: null,
    pagesList: [],
    selectedPageAccessToken: '',
  };
  handleLogin = async () => {
    let result = await LoginManager.logInWithPermissions([
      'email',
      'publish_pages',
      'manage_pages',
      'pages_show_list ',
    ]);
    if (!result.isCancelled) {
      let token = await AccessToken.getCurrentAccessToken();
      AsyncStorage.setItem('facebookAccessToken', token.accessToken.toString());
      this.setState({
        facebookAccessToken: token.accessToken.toString(),
      });
      const resp = await axios
        .get(
          `https://graph.facebook.com/v6.0/me/accounts?access_token=${token.accessToken.toString()}`,
        )
        .catch(err => alert('Error fetching data. ->' + err + ' |'));
      let _dictionary_Having_pages_id = [];
      for (let val in resp.data.data) {
        _dictionary_Having_pages_id.push({
          name: resp.data.data[val].name,
          access_token: resp.data.data[val].access_token,
        });
        if (val == 0) {
          this.state.selectedPageAccessToken = resp.data.data[val].access_token;
          AsyncStorage.setItem(
            'FacebookPageAccessToken',
            resp.data.data[val].access_token,
          );
        }
        if (_dictionary_Having_pages_id.length == 0) {
          alert('No associated pages found! Logging Out!');
        }
      }

      this.setState({pagesList: _dictionary_Having_pages_id});
    }
  };
  handleLogout = () => {
    LoginManager.logOut();
    this.setState({
      facebookAccessToken: null,
      selectedPageAccessToken: null,
    });
    AsyncStorage.setItem('facebookAccessToken', '');
    AsyncStorage.setItem('FacebookPageAccessToken', '');
  };
  _handleRightSwipe = () => {
    if (!this.state.startup) {
      this.props.navigation.pop();
    }
  };
  _handleLeftSwipe = () => {
    if (!this.state.startup) {
      this.props.navigation.navigate('twitter');
    }
  };
  render() {
    console.log(this.state.pagesList.length);
    let mapForPagesList = this.state.pagesList.map(value => {
      return (
        <Button
          onPress={() => {
            this.setState({
              selectedPagesAccessToken: value.access_token,
              pagesList: [],
            });
            AsyncStorage.setItem('FacebookPageAccessToken', value.access_token);
          }}>
          {value.name}
        </Button>
      );
    });
    return (
      <GestureRecognizer
        onSwipeLeft={this._handleLeftSwipe}
        onSwipeRight={this._handleRightSwipe}
        style={{
          flex: 1,
        }}>
        <View
          style={{
            flex: 1,
          }}>
          <ImageBackground
            source={bgr}
            style={{flex: 1}}
            resizeMode="contain"
            imageStyle={{
              bottom: DeviceDim.Height * -1.0,
              width: DeviceDim.Width * 1.5,
              left: DeviceDim.Width * -0.3,
            }}>
            <Dialog.Container visible={this.state.pagesList.length > 0}>
              <Dialog.Title> Select the page you want to manage</Dialog.Title>
              <Dialog.Description>
                Tap page you want to manage
              </Dialog.Description>
              {mapForPagesList}
            </Dialog.Container>
            <View
              style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
              <Image
                source={logo}
                resizeMode={'contain'}
                style={{
                  alignSelf: 'center',
                  width: DeviceDim.Width * 0.428,
                  height: DeviceDim.Height * 0.086,
                }}
              />
              <Text
                style={{
                  marginTop: DeviceDim.Height * 0.083,
                  fontSize: DeviceDim.Height * 0.03125,
                }}>
                With one click post to:
              </Text>
              <Image
                style={{
                  alignSelf: 'center',
                  marginTop: 30,
                  width: DeviceDim.Width * 0.2,
                  height: DeviceDim.Width * 0.2,
                }}
                source={FacebookAvatar}
              />
              <Text
                style={{
                  marginTop: 20,
                  alignSelf: 'center',
                  fontSize: DeviceDim.Height * 0.03125,
                  fontWeight: 'bold',
                }}>
                Facebook
              </Text>
              <View
                style={{
                  height: DeviceDim.Height * 0.2,
                }}
              />
            </View>

            {this.state.startup ? (
              <TouchableOpacity
                onPress={this.props.navigation.openDrawer}
                style={{
                  position: 'absolute',
                  width: DeviceDim.Height * 0.07,
                  height: DeviceDim.Height * 0.07,
                  alignItems: 'center',
                  justifyContent: 'center',
                  right: 20,
                  bottom: 20,
                  borderRadius: DeviceDim.Height * 0.035,
                  elevation: 30,
                  backgroundColor: 'white',
                }}>
                <Image
                  style={{
                    height: DeviceDim.Height * 0.07,
                    width: DeviceDim.Height * 0.07,
                  }}
                  resizeMode="contain"
                  source={menuBtn}
                />
              </TouchableOpacity>
            ) : (
              <View
                style={{
                  position: 'absolute',
                  bottom: 10,
                  right: DeviceDim.Width / 2 - 33,
                  height: 20,
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    width: 20,
                    borderRadius: 10,
                    elevation: 5,
                    backgroundColor: '#60E1E0',
                  }}
                />
                <View style={{width: 3}} />
                <View
                  style={{
                    width: 20,
                    borderRadius: 10,
                    elevation: 5,
                    backgroundColor: 'white',
                  }}
                />
                <View style={{width: 3}} />
                <View
                  style={{
                    width: 20,
                    borderRadius: 10,
                    elevation: 5,
                    backgroundColor: 'white',
                  }}
                />
              </View>
            )}
            {this.state.selectedPageAccessToken ? (
              <TouchableOpacity
                onPress={this.handleLogout}
                style={{
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 20,
                  width: DeviceDim.Width * 0.694,
                  height: DeviceDim.Height * 0.072,
                  bottom: DeviceDim.Height * 0.133,
                  left: DeviceDim.Width * 0.153,
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: DeviceDim.Height * 0.041,
                    color: '#0353A4',
                  }}>
                  Logout
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={this.handleLogin}
                style={{
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 20,
                  width: DeviceDim.Width * 0.694,
                  height: DeviceDim.Height * 0.072,
                  bottom: DeviceDim.Height * 0.133,
                  left: DeviceDim.Width * 0.153,
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: DeviceDim.Height * 0.041,
                    color: '#0353A4',
                  }}>
                  Login
                </Text>
              </TouchableOpacity>
            )}
          </ImageBackground>
        </View>
      </GestureRecognizer>
    );
  }
  async componentDidMount(): void {
    this.setState({
      facebookAccessToken: await AsyncStorage.getItem('facebookAccessToken'),
      selectedPageAccessToken: await AsyncStorage.getItem(
        'FacebookPageAccessToken',
      ),
      startup: await AsyncStorage.getItem('startup'),
    });
  }
}
/**
 <Button
 style={{marginTop: 'auto'}}
 onPress={() => alert(this.state.selectedPageAccessToken)}>
 ALERT
 </Button>
 **/
