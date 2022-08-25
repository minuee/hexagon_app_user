import React, { Component } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    StyleSheet,
    Text,
    Dimensions
} from 'react-native';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');

export default  class SampleScreen extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style={ styles.container }>
                <Text>This is {this.constructor.name}</Text>
            </View>
        );
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
});