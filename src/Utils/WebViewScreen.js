import React, { Component } from 'react';

import WebView from 'react-native-webview';

export default class WebViewScreen extends Component {
  render() {
    return (
      <WebView
        source={{
          uri: 'https://apis.openapi.sk.com/tmap/app/routes?appKey=l7xxb3e8c39ee3404f4e9283fe7e2601db76&name=SKT타워&lon=126.984098&lat=37.566385'
        }}
        style={{ marginTop: 20 }}
      />
    );
  }
}