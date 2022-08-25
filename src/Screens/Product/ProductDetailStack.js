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

import ProductDetailScreen from './ProductDetailScreen';
import ProductDetailScreen2 from './ProductDetailScreen2';

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
            
            <MaterailTopTab.Screen name="상품설명">
                {props => <ProductDetailScreen {...props} extraData={extraData} />}
            </MaterailTopTab.Screen>
            <MaterailTopTab.Screen name="상세정보">
                {props => <ProductDetailScreen2 {...props} extraData={extraData} />}
            </MaterailTopTab.Screen>
        </MaterailTopTab.Navigator>
    );

    
};

const ProductDetailStack = ({navigation,route}) => {    
    //let navTitle = "상품설명";
    let navTitle = CommonUtil.isEmpty(route.params.screenData.name) ? '상품 카테고리' : route.params.screenData.name;
    let navData = CommonUtil.isEmpty(route.params.screenData) ? {}: route.params.screenData;
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

export { ProductDetailStack};
