import React from 'react'
import { Text, View, Image, TouchableWithoutFeedback, Animated} from 'react-native'
import PropTypes from 'prop-types';
// external libs
import Icon from 'react-native-vector-icons/MaterialIcons'
Icon.loadFont();
// styles
import styles from './ToggleBoxStyle'
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoB,TextRobotoM,TextRobotoR} from '../Components/CustomText';
class ToggleBox extends React.Component {

  static propTypes = {
    arrowColor: PropTypes.string,
    arrowSize: PropTypes.number,
    arrowDownType: PropTypes.string,
    arrowUpType: PropTypes.string,
    children: PropTypes.element.isRequired,
    expanded: PropTypes.bool,
    label: PropTypes.string.isRequired,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }

  static defaultProps = {
    arrowColor: 'rgb(178, 178, 178)',
    arrowSize: 30,
    arrowDownType: 'keyboard-arrow-down',
    arrowUpType: 'keyboard-arrow-up',
    expanded: false,
    style: {},
    value: null,
  }

  constructor(props) {
    super(props)

    this.icons = {
      'up': this.props.arrowUpType,
      'down': this.props.arrowDownType,
    }

    this.state = {
      expanded: this.props.expanded,
    }
  }

  toggle = () => {
    let initialValue = this.state.expanded ? this.state.maxHeight + this.state.minHeight : this.state.minHeight
    let finalValue = this.state.expanded ? this.state.minHeight : this.state.minHeight + this.state.maxHeight

    this.setState({
      expanded: !this.state.expanded
    })

    this.state.animation.setValue(initialValue)
    Animated.spring(
      this.state.animation,
        {
          useNativeDriver :false,
            toValue: finalValue,
            bounciness: 0,
        }
    ).start()
  }

  setMaxHeight = (event) => {
    if (!this.state.maxHeight) {
      this.setState({
        maxHeight: event.nativeEvent.layout.height
      })
    }
  }

  setMinHeight = (event) => {
    if (!this.state.animation) {
      this.setState({animation:
        this.state.expanded ?
          new Animated.Value(this.props.screenHeight || 100 ) :
          new Animated.Value(parseInt(event.nativeEvent.layout.height))
      })
    }
    this.setState({
      minHeight: event.nativeEvent.layout.height
    })
  }

  render() {
    const icon = this.icons[this.state.expanded ? 'up' : 'down']

    return (
      <Animated.View style={[styles.box, this.props.style, {height: this.state.animation}]}>
        <TouchableWithoutFeedback
          onPress={this.toggle}
          onLayout={this.setMinHeight}
        >
          <View style={this.props.titleContainer ? this.props.titleContainer  :styles.titleContainer}>
            <TextRobotoB style={this.props.labelStyle ? this.props.labelStyle : styles.label}>{this.props.label}</TextRobotoB>
            {this.props.value ? <TextRobotoB style={styles.value}>{this.props.value}</TextRobotoB> : null}
            <Icon
              name={icon}
              color={this.props.arrowColor}
              style={this.props.buttonImageStyle ? this.props.buttonImageStyle : styles.buttonImage}
              size={this.props.arrowSize}
            />
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.body} onLayout={this.setMaxHeight}>
          {this.props.children}
        </View>
      </Animated.View>
    )
  }
}
export default ToggleBox
