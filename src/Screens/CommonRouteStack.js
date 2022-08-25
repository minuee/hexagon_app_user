import React, { Component } from 'react';
import {TouchableOpacity,Image,PixelRatio,View,StyleSheet} from 'react-native';
const Stack = createStackNavigator();
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../Constants';
import CommonStyle from '../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import {CustomTextB} from '../Components/CustomText';
const BACK_BUTTON_IMAGE = require('../../assets/icons/back_icon2.png');
const HEADER_CLOSE_IMAGE = require('../../assets/icons/btn_close2.png');
import {createStackNavigator} from '@react-navigation/stack';

import CartScreen from './Order/CartScreen';

import OrderingScreen from './Order/OrderingScreen';
import OrderEndingScreen from './Settle/PayResultScreen';

import IntroduceApp2 from '../Components/IntroduceApp2';

const IntroduceStack = ({navigation,route}) => {
    let navTitle = '슈퍼바인더 소개' ;
    return (
        <Stack.Navigator
            initialRouteName={'IntroduceApp2'}
            screenOptions={{
                headerLeft: (props) => (
                    <TouchableOpacity onPress= {()=> navigation.goBack()} style={CommonStyle.stackHeaderLeftWrap}>
                        <Image source={BACK_BUTTON_IMAGE} style={CommonStyle.backButtonWrap} />
                    </TouchableOpacity>
                ),
                
                headerTitle : (props) => (
                    <View style={CommonStyle.stackHeaderCenterWrap}>
                        <CustomTextB style={CommonStyle.stackHeaderCenterText}>{navTitle}</CustomTextB>
                    </View>
                ),
                headerRight : (props) => (<View style={CommonStyle.stackHeaderRightWrap} />),  
            }}
        >
        <Stack.Screen name="IntroduceApp2" >
            {props => <IntroduceApp2 {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};




const CartStack = ({navigation,route}) => {
    let navTitle = '장바구니' ;
    return (
        <Stack.Navigator
            initialRouteName={'CartScreen'}
            screenOptions={{
                headerLeft : () => (
                    <View style={[CommonStyle.stackHeaderCenterWrap,{paddingLeft:20}]}>
                        <CustomTextB style={CommonStyle.stackHeaderCenterText}>{navTitle}</CustomTextB>
                    </View>
                ),
                headerTitle : () => (<View style={CommonStyle.stackHeaderLeftWrap} />),
                headerRight: (props) => (
                    <TouchableOpacity onPress= {()=> navigation.goBack()} style={CommonStyle.stackHeaderRightWrap}>
                        <Image source={HEADER_CLOSE_IMAGE} style={CommonStyle.backButtonWrap} />
                    </TouchableOpacity>
                ),
            }}
        >
        <Stack.Screen name="CartScreen" >
            {props => <CartScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};



const OrderingStack = ({navigation,route}) => {
    let navTitle = '주문서' ;
    return (
        <Stack.Navigator
            initialRouteName={'OrderingScreen'}
            screenOptions={{
                headerLeft: (props) => (
                    <TouchableOpacity onPress= {()=> navigation.goBack()} style={CommonStyle.stackHeaderLeftWrap}>
                       <Image source={BACK_BUTTON_IMAGE} style={CommonStyle.backButtonWrap} />
                    </TouchableOpacity>
                ),
                
                headerTitle : (props) => (
                    <View style={CommonStyle.stackHeaderCenterWrap}>
                        <CustomTextB style={CommonStyle.stackHeaderCenterText}>{navTitle}</CustomTextB>
                    </View>
                ),
                headerRight : (props) => (<View style={CommonStyle.stackHeaderRightWrap} />),  
            }}
            
        >
        <Stack.Screen name="OrderingScreen" >
            {props => <OrderingScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};


const OrderEndingStack = ({navigation,route}) => {
    let navTitle = '주문완료' ;
    return (
        <Stack.Navigator
            initialRouteName={'OrderEndingScreen'}
            screenOptions={{
                headerLeft: (props) => (
                    <TouchableOpacity onPress= {()=> navigation.goBack()} style={CommonStyle.stackHeaderLeftWrap}>
                        <Image source={BACK_BUTTON_IMAGE} style={CommonStyle.backButtonWrap} />
                    </TouchableOpacity>
                ),
                
                headerTitle : (props) => (
                    <View style={CommonStyle.stackHeaderCenterWrap}>
                    <CustomTextB style={CommonStyle.stackHeaderCenterText}>{navTitle}</CustomTextB>
                </View>
                ),
                headerRight : (props) => (<View style={CommonStyle.stackHeaderRightWrap} />),  
            }}
            
        >
        
        <Stack.Screen name="OrderEndingScreen" >
            {props => <OrderEndingScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};
export { CartStack,OrderingStack,OrderEndingStack,IntroduceStack } ;