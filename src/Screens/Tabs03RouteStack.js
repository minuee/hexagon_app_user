import React, { Component } from 'react';
import {TouchableOpacity,Image,PixelRatio,View,StyleSheet} from 'react-native';
import {useSelector,useDispatch} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import ActionCreator from '../Ducks/Actions/MainActions';
const Stack = createStackNavigator();
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import {CustomTextB} from '../Components/CustomText';
const BACK_BUTTON_IMAGE = require('../../assets/icons/back_icon2.png');
import {createStackNavigator} from '@react-navigation/stack';

import RewardDetailScreen from './Tabs03/RewardDetailScreen';

const RewardDetailStack = ({navigation,route}) => {
    return (
        <Stack.Navigator
            initialRouteName={'RewardDetailScreen'}
            screenOptions={{
                headerLeft: (props) => (
                    <TouchableOpacity onPress= {()=> navigation.goBack()} style={{flex:1,flexGrow:1,paddingLeft:25,justifyContent:'center',alignItems:'center'}}>
                        <Image source={BACK_BUTTON_IMAGE} style={{width: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23), height: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23)}} />
                    </TouchableOpacity>
                ),
                
                headerTitle : (props) => (
                    <View style={{flex:1,flexGrow:1,justifyContent:'center',alignItems:'center',}}>
                        <CustomTextB style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color_000}}>리워드 상세</CustomTextB>
                    </View>
                ),
                headerRight : (props) => (<View style={{flex:1,flexGrow:1}} />),    
                
            }}
            
        >
        
        <Stack.Screen name="RewardDetailScreen" >
            {props => <RewardDetailScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};


export { RewardDetailStack } ;