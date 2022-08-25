import React, { Component } from 'react';
import {TouchableOpacity,Image,PixelRatio,View,Platform} from 'react-native';
import {useSelector,useDispatch} from 'react-redux';
import ActionCreator from '../Ducks/Actions/MainActions';
const Stack = createStackNavigator();
import TextTicker from '../Utils/TextTicker';
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../Constants';
import CommonStyle from '../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import {CustomTextB} from '../Components/CustomText';
const BACK_BUTTON_IMAGE = require('../../assets/icons/back_icon2.png');
const HEADER_FILTER_IMAGE = require('../../assets/icons/icon_filter.png');
import {createStackNavigator} from '@react-navigation/stack';
import CommonUtil from '../Utils/CommonUtil';

import ProductListScreen from './Product/ProductListScreen';
import ProductDetailScreen from './Product/ProductDetailScreen';


import EventProductScreen from './Tabs01/EventProductScreen';

const EventProductStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)    
    let navTitle = CommonUtil.isEmpty(route.params.screenTitle) ? '이벤트 상품' : route.params.screenTitle;
    return (
        <Stack.Navigator
            initialRouteName={'EventProductScreen'}
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
        
        <Stack.Screen name="EventProductScreen" >
            {props => <EventProductScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const ProductListStack = ({navigation,route}) => {
     //console.log(';ProductListStack',route)
     const dispatch = useDispatch();
     const reduxData = useSelector(state => state);
     const {toggleproduct} = reduxData.GlabalStatus;
     
     checkConfigData2 = async() => {        
         await dispatch(ActionCreator.fn_ToggleProduct(!toggleproduct));
     }
     let navTitle = CommonUtil.isEmpty(route.params.screenData.category_name) ? '' : route.params.screenData.category_name;
    return (
        <Stack.Navigator
            initialRouteName={'ProductListScreen'}
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
                headerRight : (props) => (<TouchableOpacity onPress= {()=> checkConfigData2()} style={CommonStyle.stackHeaderRightWrap}><Image source={HEADER_FILTER_IMAGE} style={{width: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23), height: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23)}} /></TouchableOpacity>),  
                
            }}
            
        >
            <Stack.Screen name="ProductListScreen" >
                {props => <ProductListScreen {...props} extraData={route} />}
            </Stack.Screen>         
        </Stack.Navigator>
    );
};


const ProductDetailStack = ({navigation,route}) => {
    //console.log(';ProductListStack',route)    
    let navTitle = CommonUtil.isEmpty(route.params.screenData.product_name) ? '상품' : route.params.screenData.product_name;
    return (
        <Stack.Navigator
            initialRouteName={'ProductDetailScreen'}
            screenOptions={{
                headerLeft: (props) => (
                    <TouchableOpacity onPress= {()=> navigation.goBack()} style={CommonStyle.stackHeaderLeftWrap}>
                        <Image source={BACK_BUTTON_IMAGE} style={CommonStyle.backButtonWrap} />
                    </TouchableOpacity>
                ),
                
                headerTitle : (props) => (
                    <View style={CommonStyle.stackHeaderCenterWrap}>
                        {/*<CustomTextB style={CommonStyle.stackHeaderCenterText}>{navTitle}</CustomTextB>*/}
                        <View style={{minWidth:'100%',paddingTop:Platform.OS === 'ios'?10:0}}>
                            <TextTicker
                                //marqueeOnMount={false} 
                                style={{fontFamily: DEFAULT_CONSTANTS.defaultFontFamilyRegular,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color_000,lineHeight: DEFAULT_TEXT.fontSize15 * 1.42,}}
                                shouldAnimateTreshold={10}
                                duration={8000}
                                loop
                                bounce
                                repeatSpacer={100}
                                marqueeDelay={1000}
                            >
                                {navTitle}
                            </TextTicker>
                        </View>
                    </View>
                ),
               
                
            }}
            
        >
        
        <Stack.Screen name="ProductDetailScreen" >
            {props => <ProductDetailScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

const ProductDetailStack2 = ({navigation,route}) => {
    let navTitle = CommonUtil.isEmpty(route.params.screenData.product_name) ? '상품' : route.params.screenData.product_name;
    return (
        <Stack.Navigator
            initialRouteName={'ProductDetailScreen'}
            screenOptions={{
                headerLeft: (props) => (
                    <TouchableOpacity onPress= {()=> navigation.goBack()} style={CommonStyle.stackHeaderLeftWrap}>
                        <Image source={BACK_BUTTON_IMAGE} style={CommonStyle.backButtonWrap} />
                    </TouchableOpacity>
                ),
                
                headerTitle : (props) => (
                    <View style={CommonStyle.stackHeaderCenterWrap}>
                        {/*<CustomTextB style={CommonStyle.stackHeaderCenterText}>{navTitle}</CustomTextB>*/}
                        <View style={{minWidth:'100%',paddingTop:Platform.OS === 'ios'?10:0}}>
                            <TextTicker
                                //marqueeOnMount={false} 
                                style={{fontFamily: DEFAULT_CONSTANTS.defaultFontFamilyRegular,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color_000,lineHeight: DEFAULT_TEXT.fontSize15 * 1.42,}}
                                shouldAnimateTreshold={10}
                                duration={8000}
                                loop
                                bounce
                                repeatSpacer={100}
                                marqueeDelay={1000}
                            >
                                {navTitle}
                            </TextTicker>
                        </View>
                    </View>
                ),
               
                
            }}
            
        >
        
        <Stack.Screen name="ProductDetailScreen" >
            {props => <ProductDetailScreen {...props} extraData={route} />}
        </Stack.Screen>         
        </Stack.Navigator>
    );
};

export { ProductListStack,ProductDetailStack,ProductDetailStack2,EventProductStack } ;