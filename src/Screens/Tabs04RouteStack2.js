import React, { Component } from 'react';
import {TouchableOpacity,Image,PixelRatio,View,StyleSheet} from 'react-native';
import {useSelector,useDispatch} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import ActionCreator from '../Ducks/Actions/MainActions';
const Stack = createStackNavigator();
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../Constants';
import CommonStyle from '../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import {CustomTextB,CustomTextR} from '../Components/CustomText';
import CommonUtil from '../Utils/CommonUtil';
const BACK_BUTTON_IMAGE = require('../../assets/icons/back_icon2.png');
const HEADER_HAMBURG_IMAGE = require('../../assets/icons/icon_hamburg.png');
import {createStackNavigator} from '@react-navigation/stack';

import MyInfoScreen from './Tabs04/MyInfoScreen';
import UseYakwanScreen from './Tabs04/UseYakwanScreen';
import PrivateYakwanScreen from './Tabs04/PrivateYakwanScreen';
import RefundYakwanScreen from './Tabs04/RefundYakwanScreen';
import MyIDModifyScreen from './Tabs04/MyIDModifyScreen';
import MyPWModifyScreen from './Tabs04/MyPWModifyScreen';
import MyBookMarkScreen from './Tabs04/MyBookMarkScreen'
import MyAlarmScreen from './Tabs04/MyAlarmScreen'

const MyInfoStack = ({navigation,route}) => {
    let navTitle = '계정설정' ;
    
    return (
        <Stack.Navigator
            initialRouteName={'MyInfoScreen'}
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
        
        <Stack.Screen name="MyInfoScreen" >
            {props => <MyInfoScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const PrivateYakwanStack = ({navigation,route}) => {
    let navTitle = '개인정보 처리방침' ;
    
    return (
        <Stack.Navigator
            initialRouteName={'PrivateYakwanScreen'}
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
        
        <Stack.Screen name="PrivateYakwanScreen" >
            {props => <PrivateYakwanScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};


const RefundYakwanStack = ({navigation,route}) => {
    let navTitle = '환불약관' ;
    
    return (
        <Stack.Navigator
            initialRouteName={'RefundYakwanScreen'}
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
        
        <Stack.Screen name="RefundYakwanScreen" >
            {props => <RefundYakwanScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const UseYakwanStack = ({navigation,route}) => {
    let navTitle = '이용 약관' ;
    
    return (
        <Stack.Navigator
            initialRouteName={'UseYakwanScreen'}
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
        
        <Stack.Screen name="UseYakwanScreen" >
            {props => <UseYakwanScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const MyIDModifyStack = ({navigation,route}) => {
    let navTitle = '계정 정보 편집' ;
    
    return (
        <Stack.Navigator
            initialRouteName={'MyIDModifyScreen'}
            screenOptions={{
                headerLeft: (props) => (
                    <TouchableOpacity onPress= {()=> navigation.goBack()} style={CommonStyle.stackHeaderLeftWrap}>
                        <Image source={BACK_BUTTON_IMAGE} style={CommonStyle.backButtonWrap} />
                    </TouchableOpacity>
                ),
                
                headerTitle : (props) => (
                    <View style={{flex:1,flexGrow:1,justifyContent:'center',alignItems:'center',}}>
                        <CustomTextB style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color_000}}>{navTitle}</CustomTextB>
                    </View>
                ),
                headerRight : (props) => (<View style={CommonStyle.stackHeaderRightWrap} />),  
            }}
            
        >
        
        <Stack.Screen name="MyIDModifyScreen" >
            {props => <MyIDModifyScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const MyPWModifyStack = ({navigation,route}) => {
    let navTitle = '비밀번호 변경' ;
    
    return (
        <Stack.Navigator
            initialRouteName={'MyPWModifyScreen'}
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
        
        <Stack.Screen name="MyPWModifyScreen" >
            {props => <MyPWModifyScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const MyBookMarkStack = ({navigation,route}) => {
    let navTitle = '찜리스트' ;
    
    return (
        <Stack.Navigator
            initialRouteName={'MyBookMarkScreen'}
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
        
        <Stack.Screen name="MyBookMarkScreen" >
            {props => <MyBookMarkScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const MyAlarmStack = ({navigation,route}) => {
    let navTitle = '입고알림 리스트' ;
    
    return (
        <Stack.Navigator
            initialRouteName={'MyAlarmScreen'}
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
        
        <Stack.Screen name="MyAlarmScreen" >
            {props => <MyAlarmScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

export { MyInfoStack,UseYakwanStack,RefundYakwanStack,PrivateYakwanStack,MyIDModifyStack,MyPWModifyStack,MyBookMarkStack, MyAlarmStack} ;