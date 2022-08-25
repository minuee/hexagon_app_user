import React from "react";
import { StyleSheet, Text, View ,Image,Dimensions} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');

export default class TextReadMore extends React.Component {
  state = {
    measured: false,
    shouldShowReadMore: false,
    showAllText: false
  };

  async componentDidMount() {
    this._isMounted = true;
    await nextFrameAsync();

    if (!this._isMounted) {
      return;
    }

    // Get the height of the text with no restriction on number of lines
    const fullHeight = await measureHeightAsync(this._text);
    this.setState({ measured: true });
    await nextFrameAsync();

    if (!this._isMounted) {
      return;
    }

    // Get the height of the text now that number of lines has been set
    const limitedHeight = await measureHeightAsync(this._text);

    if (fullHeight > limitedHeight) {
      this.setState({ shouldShowReadMore: true }, () => {
        this.props.onReady && this.props.onReady();
      });
    } else {
      this.props.onReady && this.props.onReady();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    let { measured, showAllText } = this.state;

    let { numberOfLines,isOpened } = this.props;

    return (
      <View>
        <Text
          numberOfLines={measured && !showAllText ? numberOfLines : 0}
          style={this.props.textStyle}
          ref={text => {
            this._text = text;
          }}
        >
          {this.props.children}
        </Text>
       
        {this._maybeRenderReadMore()}
       
        
      </View>
    );
  }

  _handlePressReadMore = () => {    
    this.props.isOpened && this.props.isOpened();
    this.setState({ showAllText: true });
  };

  _handlePressReadLess = () => {
    this.props.isClosed && this.props.isClosed();
    this.setState({ showAllText: false });
  };

  _maybeRenderReadMore() {
    let { shouldShowReadMore, showAllText } = this.state;

    if (shouldShowReadMore && !showAllText) {
      if (this.props.renderTruncatedFooter) {
        return this.props.renderTruncatedFooter(this._handlePressReadMore);
      }

      return (
        <TouchableOpacity 
            style={styles.buttonWrap} 
            onPress={this._handlePressReadMore}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
            <Image source={require('../../assets/icons/btn_more_open.png')} resizeMode='contain' style={{width:18,height:10}} />
        </TouchableOpacity>
      );
    } else if (shouldShowReadMore && showAllText) {
      if (this.props.renderRevealedFooter) {
        return this.props.renderRevealedFooter(this._handlePressReadLess);
      }

      return (
        <TouchableOpacity 
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          style={styles.buttonWrap} onPress={this._handlePressReadLess}
        >
            <Image source={require('../../assets/icons/btn_more_close.png')} resizeMode='contain' style={{width:18,height:10}} />
        </TouchableOpacity>
      );
    }
  }
}

function measureHeightAsync(component) {
  return new Promise(resolve => {
    component.measure((x, y, w, h) => {
      resolve(h);
    });
  });
}

function nextFrameAsync() {
  return new Promise(resolve => requestAnimationFrame(() => resolve()));
}

const styles = StyleSheet.create({
    buttonWrap: {
    width:SCREEN_WIDTH-60,
    justifyContent:'center',
    alignItems:'center',
    paddingTop: 10
    
  }
});