import React, { Component } from 'react';
import {TouchableOpacity,Image,PixelRatio,View,StyleSheet} from 'react-native';
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
const CLOSE_BUTTON_IMAGE = require('../../assets/icons/btn_close2.png');
import {createStackNavigator} from '@react-navigation/stack';

import NoticeListScreen from './Board/NoticeListScreen';
import NoticeDetailScreen from './Board/NoticeDetailScreen';
import FaqListScreen from './Board/FaqListScreen';
import CustomService from './Board/CustomService';
import MyGradeScreen from './MyPage/MyGradeScreen';
import MyPointListScreen from './MyPage/MyPointListScreen';
import MyOrderListScreen from './MyPage/MyOrderListScreen';
import OrderDetailScreen from './MyPage/OrderDetailScreen';
import OrderCancelScreen from './MyPage/OrderCancelScreen';
import OrderBaroCancelScreen from './MyPage/OrderBaroCancelScreen';
import OrderBankCancelScreen from './MyPage/OrderBankCancelScreen';
import CouponListScreen from './MyPage/CouponListScreen';
import ChatScreen from './MyPage/ChatScreen'; 

const ChatStack = ({navigation,route}) => {
    let navTitle = '1:1 문의하기';
    
    return (
        <Stack.Navigator
            initialRouteName={'CouponListScreen'}
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
            <Stack.Screen name="ChatScreen" >
                {props => <ChatScreen {...props} extraData={route} />}
            </Stack.Screen>         
        </Stack.Navigator>
    );
};

const CouponListStack = ({navigation,route}) => {
    let navTitle = '쿠폰';
    
    return (
        <Stack.Navigator
            initialRouteName={'CouponListScreen'}
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
            <Stack.Screen name="CouponListScreen" >
                {props => <CouponListScreen {...props} extraData={route} />}
            </Stack.Screen>         
        </Stack.Navigator>
    );
};

const NoticeListStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '공지사항';
    
    return (
        <Stack.Navigator
            initialRouteName={'NoticeListScreen'}
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
        
        <Stack.Screen name="NoticeListScreen" >
            {props => <NoticeListScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const NoticeDetailStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '공지사항 상세';
    
    return (
        <Stack.Navigator
            initialRouteName={'NoticeDetailScreen'}
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
        
        <Stack.Screen name="NoticeDetailScreen" >
            {props => <NoticeDetailScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const FaqListStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = 'FAQ';
    
    return (
        <Stack.Navigator
            initialRouteName={'FaqListScreen'}
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
        
        <Stack.Screen name="FaqListScreen" >
            {props => <FaqListScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const CustomServiceStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '고객센터';
    
    return (
        <Stack.Navigator
            initialRouteName={'CustomService'}
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
        
        <Stack.Screen name="CustomService" >
            {props => <CustomService {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const MyGradeStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '등급';
    
    return (
        <Stack.Navigator
            initialRouteName={'MyGradeScreen'}
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
        
        <Stack.Screen name="MyGradeScreen" >
            {props => <MyGradeScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};


const MyPointListStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '적립금';
    
    return (
        <Stack.Navigator
            initialRouteName={'MyPointListScreen'}
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
        
        <Stack.Screen name="MyPointListScreen" >
            {props => <MyPointListScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};


const MyOrderListStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '주문 내역';
    
    return (
        <Stack.Navigator
            initialRouteName={'MyOrderListScreen'}
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
        
        <Stack.Screen name="MyOrderListScreen" >
            {props => <MyOrderListScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};


const OrderDetailStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '주문 내역 상세';
    
    return (
        <Stack.Navigator
            initialRouteName={'OrderDetailScreen'}
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
        
        <Stack.Screen name="OrderDetailScreen" >
            {props => <OrderDetailScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};


const OrderCancelStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '주문  취소';
    
    return (
        <Stack.Navigator
            initialRouteName={'OrderCancelScreen'}
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
        
        <Stack.Screen name="OrderCancelScreen" >
            {props => <OrderCancelScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const OrderBaroCancelStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '주문 취소(결제취소)';
    
    return (
        <Stack.Navigator
            initialRouteName={'OrderBaroCancelScreen'}
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
        
        <Stack.Screen name="OrderBaroCancelScreen" >
            {props => <OrderBaroCancelScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const OrderBankCancelStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '주문 취소(환불요청)';
    
    return (
        <Stack.Navigator
            initialRouteName={'OrderBankCancelScreen'}
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
        
        <Stack.Screen name="OrderBankCancelScreen" >
            {props => <OrderBankCancelScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

export { NoticeListStack,NoticeDetailStack,FaqListStack,CustomServiceStack,MyGradeStack,MyPointListStack,MyOrderListStack,OrderDetailStack,OrderCancelStack,OrderBaroCancelStack,OrderBankCancelStack,CouponListStack,ChatStack} ;