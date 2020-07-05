/**
 * @format
 */
import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Provider as PaperProvider} from 'react-native-paper';
export default class Main extends React.Component {
  render() {
    return (
      <PaperProvider>
        <App />
      </PaperProvider>
    );
  }
}
AppRegistry.registerComponent(appName, () => Main);
