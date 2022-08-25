import React, { Component } from 'react';
import {TouchableOpacity,Image,PixelRatio,View} from 'react-native';
import {createMaterialTopTabNavigator,RouteConfigs, TabNavigatorConfig} from '@react-navigation/material-top-tabs';
import {useSelector,useDispatch} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
const Stack = createStackNavigator();
const MaterailTopTab =  createMaterialTopTabNavigator(RouteConfigs, TabNavigatorConfig);
import {createStackNavigator} from '@react-navigation/stack';
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import {CustomTextB} from '../../Components/CustomText';
import CommonUtil from '../../Utils/CommonUtil';
const BACK_BUTTON_IMAGE = require('../../../assets/icons/back_icon2.png');
const HEADER_HAMBURG_IMAGE = require('../../../assets/icons/icon_hamburg.png');

import NoticeListScreen from '../Popup/NoticeListScreen';
import EventListScreen from '../Popup/EventListScreen';
import NoticeDetailScreen from '../Popup/NoticeDetailScreen';
import EventDetailScreen from '../Popup/EventDetailScreen';
import PopNoticeRegistScreen from '../Popup/PopNoticeRegistScreen';
import PopEventRegistScreen from '../Popup/PopEventRegistScreen';

const MaterialTopTabNavi = ({navigation,extraData}) => {
    
    let firstScreen = "공지";
    if (!CommonUtil.isEmpty(extraData.params.gubun) ) {        
        if ( extraData.params.gubun === 2 ) {
            firstScreen = "상품이벤트";
        }else{
            firstScreen = "공지";
        }
    }    

    return (
        <MaterailTopTab.Navigator
            initialRouteName={firstScreen}
            tabBarComponent={firstScreen}
            tabBarOptions={{
                activeTintColor: DEFAULT_COLOR.base_color,
                activeBackgroundColor: '#091e4b',
                inactiveBackgroundColor: '#ffffff',
                inactiveTintColor:  '#ccc',
                indicatorContainerStyle : {
                    borderTopWidth: 1,
                    borderColor: '#fff',
                },                
                indicatorStyle : {
                    borderTopWidth: 2,
                    borderColor: DEFAULT_COLOR.base_color,
                },
                labelStyle: {
                    fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),letterSpacing:-1,fontFamily:'NotoSansKR-Medium',lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize17)
                },
                style:{
                    paddingBottom : -10
                },                
            }}      
            lazy={true}      
            swipeEnabled={true}                
        >
            
            <MaterailTopTab.Screen name="공지">
                {props => <NoticeListScreen {...props} extraData={extraData} />}
            </MaterailTopTab.Screen>
            <MaterailTopTab.Screen name="상품이벤트">
                {props => <EventListScreen {...props} extraData={extraData} />}
            </MaterailTopTab.Screen>
        </MaterailTopTab.Navigator>
    );

    
};

const PopupAdminStack = ({navigation,route}) => {    
    let navTitle = "팝업관리";
    return (
        <Stack.Navigator
            initialRouteName={'MaterialTopTabNavi'}
            screenOptions={{
                headerLeft: (props) => (
                    <TouchableOpacity onPress= {()=> navigation.goBack()} style={{flex:1,flexGrow:1,paddingLeft:25,justifyContent:'center',alignItems:'center'}}>
                        <Image source={BACK_BUTTON_IMAGE} style={{width: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23), height: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23)}} />
                    </TouchableOpacity>
                ),
                headerTitle : (props) => (
                    <View style={{flex:1,flexGrow:1,justifyContent:'center',alignItems:'center',}}>
                        <CustomTextB style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color_000}}>{navTitle}</CustomTextB>
                    </View>
                ),
                headerRight : (props) => (<View style={{flex:1,flexGrow:1}} />),    
            }}
        >
            <Stack.Screen name="MaterialTopTabNavi">
                {props => <MaterialTopTabNavi {...props} extraData={route} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
}

const PopupNoticeDetailStack = ({navigation,route}) => {
    console.log(';ProductListStack',route)
    let navTitle = '공지사항 상세' ;
    if ( !CommonUtil.isEmpty(route.params.mode)) {
        if ( route.params.mode === 'old') {
            navTitle = '지난 공지사항 상세' ;
        }
    }
    const dispatch = useDispatch();
    const reduxData = useSelector(state => state);
    const {toggleNoticeDetail} = reduxData.GlabalStatus;
    
    checkConfigData = async() => {        
        await dispatch(ActionCreator.fn_ToggleNoticeDetail(!toggleNoticeDetail));
    }
    return (
        <Stack.Navigator
            initialRouteName={'NoticeDetailScreen'}
            screenOptions={{
                headerLeft: (props) => (
                    <TouchableOpacity onPress= {()=> navigation.goBack()} style={{flex:1,flexGrow:1,paddingLeft:25,justifyContent:'center',alignItems:'center'}}>
                        <Image source={BACK_BUTTON_IMAGE} style={{width: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23), height: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23)}} />
                    </TouchableOpacity>
                ),
                
                headerTitle : (props) => (
                    <View style={{flex:1,flexGrow:1,justifyContent:'center',alignItems:'center',}}>
                        <CustomTextB style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color_000}}>{navTitle}</CustomTextB>
                    </View>
                ),
                headerRight : (props) => (<TouchableOpacity onPress= {()=> checkConfigData()} style={{flex:1,justifyContent:'center',paddingRight:10}}><Image source={HEADER_HAMBURG_IMAGE} style={{width: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23), height: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23)}} /></TouchableOpacity>),    
            }}
            
        >
        
        <Stack.Screen name="NoticeDetailScreen" >
            {props => <NoticeDetailScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};


const PopupEventDetailStack = ({navigation,route}) => {
    console.log(';ProductListStack',route)
    let navTitle = '이벤트 상세' ;
    if ( !CommonUtil.isEmpty(route.params.mode)) {
        if ( route.params.mode === 'old') {
            navTitle = '지난 이벤트 상세' ;
        }
    }
    const dispatch = useDispatch();
    const reduxData = useSelector(state => state);
    const {toggleNoticeDetail} = reduxData.GlabalStatus;
    
    checkConfigData = async() => {        
        await dispatch(ActionCreator.fn_ToggleNoticeDetail(!toggleNoticeDetail));
    }
    return (
        <Stack.Navigator
            initialRouteName={'EventDetailScreen'}
            screenOptions={{
                headerLeft: (props) => (
                    <TouchableOpacity onPress= {()=> navigation.goBack()} style={{flex:1,flexGrow:1,paddingLeft:25,justifyContent:'center',alignItems:'center'}}>
                        <Image source={BACK_BUTTON_IMAGE} style={{width: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23), height: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23)}} />
                    </TouchableOpacity>
                ),
                
                headerTitle : (props) => (
                    <View style={{flex:1,flexGrow:1,justifyContent:'center',alignItems:'center',}}>
                        <CustomTextB style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color_000}}>{navTitle}</CustomTextB>
                    </View>
                ),
                headerRight : (props) => (<TouchableOpacity onPress= {()=> checkConfigData()} style={{flex:1,justifyContent:'center',paddingRight:10}}><Image source={HEADER_HAMBURG_IMAGE} style={{width: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23), height: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23)}} /></TouchableOpacity>),    
            }}
            
        >
        
        <Stack.Screen name="EventDetailScreen" >
            {props => <EventDetailScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const PopNoticeRegistStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '팝업 공지 등록' ;
    
    return (
        <Stack.Navigator
            initialRouteName={'PopNoticeRegistScreen'}
            screenOptions={{
                headerLeft: (props) => (
                    <TouchableOpacity onPress= {()=> navigation.goBack()} style={{flex:1,flexGrow:1,paddingLeft:25,justifyContent:'center',alignItems:'center'}}>
                        <Image source={BACK_BUTTON_IMAGE} style={{width: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23), height: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23)}} />
                    </TouchableOpacity>
                ),
                
                headerTitle : (props) => (
                    <View style={{flex:1,flexGrow:1,justifyContent:'center',alignItems:'center',}}>
                        <CustomTextB style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color_000}}>{navTitle}</CustomTextB>
                    </View>
                ),
                headerRight : (props) => (<View style={{flex:1,flexGrow:1}} />),    
            }}
            
        >
        
        <Stack.Screen name="PopNoticeRegistScreen" >
            {props => <PopNoticeRegistScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};
const PopEventRegistStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)
    let navTitle = '팝업 이벤트 등록' ;
    
    return (
        <Stack.Navigator
            initialRouteName={'PopEventRegistScreen'}
            screenOptions={{
                headerLeft: (props) => (
                    <TouchableOpacity onPress= {()=> navigation.goBack()} style={{flex:1,flexGrow:1,paddingLeft:25,justifyContent:'center',alignItems:'center'}}>
                        <Image source={BACK_BUTTON_IMAGE} style={{width: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23), height: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23)}} />
                    </TouchableOpacity>
                ),
                
                headerTitle : (props) => (
                    <View style={{flex:1,flexGrow:1,justifyContent:'center',alignItems:'center',}}>
                        <CustomTextB style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color_000}}>{navTitle}</CustomTextB>
                    </View>
                ),
                headerRight : (props) => (<View style={{flex:1,flexGrow:1}} />),    
            }}
            
        >
        
        <Stack.Screen name="PopEventRegistScreen" >
            {props => <PopEventRegistScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

export { PopupAdminStack ,PopupNoticeDetailStack,PopupEventDetailStack,PopNoticeRegistStack,PopEventRegistStack};
