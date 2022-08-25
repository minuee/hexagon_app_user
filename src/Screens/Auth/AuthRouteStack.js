import React, { Component } from 'react';
import {TouchableOpacity,Image,PixelRatio,View,StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
const Stack = createStackNavigator();
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import {CustomTextB} from '../../Components/CustomText';

const BACK_BUTTON_IMAGE = require('../../../assets/icons/back_icon2.png');

import FindIDScreen from './FindIDScreen';
import AuthCheckScreen from './AuthCheckScreen';
import PWResetScreen from './PWResetScreen';
import SignInScreen from './SignInScreen';
import NoticeDetailScreen from '../Push/NoticeDetailScreen';
import OrderDetailScreen from '../Push/OrderDetailScreen';
import CommonStyles from '../../Style/CommonStyle';
const AuthCheckStack = ({navigation,route}) => {
    return (
        <Stack.Navigator
            initialRouteName={'AuthCheckScreen'}
            screenOptions={{
                headerLeft: (props) => (
                    <TouchableOpacity onPress= {()=> navigation.goBack()} style={CommonStyles.stackHeaderLeftWrap}>
                        <Image source={BACK_BUTTON_IMAGE} style={{width: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23), height: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23)}} />
                    </TouchableOpacity>
                ),                
                headerTitle : (props) => (
                    <View style={CommonStyles.stackHeaderCenterWrap}>
                        <CustomTextB style={CommonStyles.stackHeaderCenterText}>계정확인하기</CustomTextB>
                    </View>
                ),
                headerRight : (props) => (<View style={CommonStyles.stackHeaderRightWrap} />)
            }}
        >        
            <Stack.Screen name="AuthCheckScreen">
                {props => <AuthCheckScreen {...props} extraData={route} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
};

const FindIDStack = ({navigation,route}) => {
    return (
        <Stack.Navigator
            initialRouteName={'FindIDScreen'}
            screenOptions={{
                headerLeft: (props) => (
                    <TouchableOpacity onPress= {()=> navigation.goBack()} style={CommonStyles.stackHeaderLeftWrap}>
                        <Image source={BACK_BUTTON_IMAGE} style={{width: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23), height: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23)}} />
                    </TouchableOpacity>
                ),
                
                headerTitle : (props) => (
                    <View style={CommonStyles.stackHeaderCenterWrap}>
                        <CustomTextB style={CommonStyles.stackHeaderCenterText}>계정 찾기</CustomTextB>
                    </View>
                ),
                headerRight : (props) => (<View style={CommonStyles.stackHeaderRightWrap} />)
            }}
            
        >
        
        <Stack.Screen name="FindIDScreen" >
            {props => <FindIDScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const PassWordResetStack = ({navigation,route}) => {
    return (
        <Stack.Navigator
            initialRouteName={'PWResetScreen'}
            screenOptions={{
                headerLeft: (props) => (
                    <TouchableOpacity onPress= {()=> navigation.goBack()} style={CommonStyles.stackHeaderLeftWrap}>
                        <Image source={BACK_BUTTON_IMAGE} style={{width: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23), height: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23)}} />
                    </TouchableOpacity>
                ),
                
                headerTitle : (props) => (
                    <View style={CommonStyles.stackHeaderCenterWrap}>
                        <CustomTextB style={CommonStyles.stackHeaderCenterText}>비밀번호 재설정</CustomTextB>
                    </View>
                ),
                headerRight : (props) => (<View style={CommonStyles.stackHeaderRightWrap} />)
            }}
            
        >
        
        <Stack.Screen name="PWResetScreen" >
            {props => <PWResetScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};


const SignInStack = ({navigation,route,rootState}) => {
    return (
        <Stack.Navigator
            initialRouteName={'SignInScreen'}
            screenOptions={{
                headerLeft: (props) => (
                    <TouchableOpacity onPress= {()=> navigation.goBack()} style={CommonStyles.stackHeaderLeftWrap}>
                        <Image source={BACK_BUTTON_IMAGE} style={{width: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23), height: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23)}} />
                    </TouchableOpacity>
                ),                
                headerTitle : (props) => (
                    <View style={CommonStyles.stackHeaderCenterWrap}>
                        <CustomTextB style={CommonStyles.stackHeaderCenterText}>회원가입</CustomTextB>
                    </View>
                ),
                headerRight : (props) => (<View style={CommonStyles.stackHeaderRightWrap} />)
            }}
            
        >
        
        <Stack.Screen name="SignInScreen" >
            {props => <SignInScreen {...props} extraData={route} rootState={rootState} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const NoticeDetailStack = ({navigation,route,rootState}) => {
    const navTitle = "공지사항안내"
    return (
        <Stack.Navigator
            initialRouteName={'NoticeDetailScreen'}
            screenOptions={{
                headerLeft: (props) => (
                    <TouchableOpacity onPress= {()=> navigation.goBack()} style={CommonStyles.stackHeaderLeftWrap}>
                        <Image source={BACK_BUTTON_IMAGE} style={{width: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23), height: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23)}} />
                    </TouchableOpacity>
                ),
                
                headerTitle : (props) => (
                    <View style={CommonStyles.stackHeaderCenterWrap}>
                        <CustomTextB style={CommonStyles.stackHeaderCenterText}>{navTitle}</CustomTextB>
                    </View>
                ),
                headerRight : (props) => (<View style={CommonStyles.stackHeaderRightWrap} />)
            }}
            
        >
        
        <Stack.Screen name="NoticeDetailScreen" >
            {props => <NoticeDetailScreen {...props} extraData={route} rootState={rootState} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const OrderDetailStack = ({navigation,route,rootState}) => {
    const navTitle = "주문상세정보"
    return (
        <Stack.Navigator
            initialRouteName={'OrderDetailScreen'}
            screenOptions={{
                headerLeft: (props) => (
                    <TouchableOpacity onPress= {()=> navigation.goBack()} style={CommonStyles.stackHeaderLeftWrap}>
                        <Image source={BACK_BUTTON_IMAGE} style={{width: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23), height: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23)}} />
                    </TouchableOpacity>
                ),
                
                headerTitle : (props) => (
                    <View style={CommonStyles.stackHeaderCenterWrap}>
                        <CustomTextB style={CommonStyles.stackHeaderCenterText}>{navTitle}</CustomTextB>
                    </View>
                ),
                headerRight : (props) => (<View style={CommonStyles.stackHeaderRightWrap} />)
            }}
            
        >
        
        <Stack.Screen name="OrderDetailScreen" >
            {props => <OrderDetailScreen {...props} extraData={route} rootState={rootState} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

export { FindIDStack,AuthCheckStack,PassWordResetStack,SignInStack,NoticeDetailStack,OrderDetailStack } ;