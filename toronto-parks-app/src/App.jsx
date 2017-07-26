import React from 'react';
import ReactDOM from 'react-dom';
import {Tabbar, Tab} from 'react-onsenui';

import firebase from 'firebase';

import HomePage from './HomePage';
import SettingsPage from './SettingsPage';

export default class App extends React.Component {
  componentWillMount() {
    var config = {
      apiKey: "AIzaSyA3TTUZBqrjEM31yNhFmL6tX04Kj_ex8q0",
      authDomain: "toronto-parks.firebaseapp.com",
      databaseURL: "https://toronto-parks.firebaseio.com",
      projectId: "toronto-parks",
      storageBucket: "toronto-parks.appspot.com",
      messagingSenderId: "383431756293"
    };
    firebase.initializeApp(config);
  }

  renderTabs() {
    return [
      {
        content: <HomePage />,
        tab: <Tab label='Home' icon='md-home' />
      },
      {
        content: <SettingsPage />,
        tab: <Tab label='Settings' icon='md-settings' />
      }
    ]
  }

  render() {
    return (
      <Tabbar initialIndex={0} renderTabs={this.renderTabs.bind(this)} />
    );
  }
}