import React, {Component} from 'react';
import {
  NativeModules,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {GetWidth, GetHeight, LoginStatus} from './utils/utils';
const {RNTwitterSignIn} = NativeModules;
import {twitterCredentials} from './credentials'



export default class TwitterLoginScreen extends Component {
  state = {
    isLoggedIn: false,
    authToken: '',
    authTokenSecret: '',
    startup: '',
    twitterButtonEnable: true,
  };
  _twitterSignIn = async () => {
    this.setState({twitterButtonEnable: false});
    const {setLogoutVisible, setLogoutPayload, setTwitterStatus,
      setTwitterKeyStatus } = this.props;
      if (this.state.authToken)
        return;
    RNTwitterSignIn.init(
      twitterCredentials.TWITTER_CONSUMER_KEY,
      twitterCredentials.TWITTER_CONSUMER_SECRET,
    );
    let bat = await RNTwitterSignIn.logIn()
      .then(loginData => loginData)
      .catch(error => {
        console.log(error);
      });
    this.setState({
      authToken: bat.authToken,
      authTokenSecret: bat.authTokenSecret,
    });
    setTwitterStatus(bat.authToken)
    setTwitterKeyStatus(bat.authTokenSecret)

    await AsyncStorage.setItem('tweetKey', bat.authToken);
    await AsyncStorage.setItem('tweetSecret', bat.authTokenSecret);
    this.setState({twitterButtonEnable: true});
  };
  handleLogout = async () => {
    const {setLogoutVisible, setLogoutPayload, setTwitterStatus,
      setTwitterKeyStatus } = this.props;
    this.setState({
      authToken: '',
      authTokenSecret: '',
    });
    setTwitterStatus('')
    setTwitterKeyStatus('')

    await AsyncStorage.setItem('tweetKey', '');
    await AsyncStorage.setItem('tweetSecret', '');
  };
  async componentDidMount() {
    this.setState({
      authToken: await AsyncStorage.getItem('tweetKey'),
      authTokenSecret: await AsyncStorage.getItem('tweetSecret'),
    });
  }
  render() {
    const {isLoggedIn} = this.state;
    const {setLogoutVisible, setLogoutPayload, setTwitterStatus,
      setTwitterKeyStatus } = this.props;
    return (
        <TouchableOpacity
            disabled={!this.state.twitterButtonEnable}
            onPress={() => {
                if (this.state.authToken) {
                  setLogoutVisible(true);
                  setLogoutPayload({
                    name: 'twitter',
                    close: () => {
                      setLogoutVisible(false);
                      setLogoutPayload({});
                    },
                    removeAccount: () => {
                      setLogoutVisible(false);
                      setLogoutPayload({});
                      this.handleLogout();
                    },
                    editDetails: () => {
                      setLogoutVisible(false);
                      setLogoutPayload({});
                      this.handleLogout();
                      this._twitterSignIn();
                    },
                  });
                }
                else {
                  this._twitterSignIn()
                }
            }}>
            <FontAwesomeIcon
                name={'twitter-square'}
                size={GetWidth(60, 360)}
                color={LoginStatus(this.state.authToken)}
            />
        </TouchableOpacity>
    );
  }
}