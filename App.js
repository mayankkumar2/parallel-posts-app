/* eslint-disable no-unused-vars */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
} from '@react-navigation/stack';
import UploadsPage from './Pages/UploadsPage';

// imports of screens

import HomeScreen from './Pages/HomeScreen';
import {LinkedinLoginScreen} from './Pages/linkedinLogin';

var Stack = createStackNavigator();

// The component creates the stack navigation registry.
class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName={'HOME'} headerMode="none">
          <Stack.Screen name={'HOME'} component={HomeScreen} />
          <Stack.Screen name={'UPLOAD_PAGE'} component={UploadsPage} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
