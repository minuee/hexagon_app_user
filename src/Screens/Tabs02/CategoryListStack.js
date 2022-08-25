import React, { Component } from 'react';
import {TouchableOpacity,Image,PixelRatio,View,TouchableHighlight} from 'react-native';
import {createMaterialTopTabNavigator,RouteConfigs, TabNavigatorConfig} from '@react-navigation/material-top-tabs';
import {useSelector,useDispatch} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
const Stack = createStackNavigator();
const MaterailTopTab =  createMaterialTopTabNavigator(RouteConfigs, TabNavigatorConfig);
import {createStackNavigator} from '@react-navigation/stack';
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonStyle from '../../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import {CustomTextR} from '../../Components/CustomText';
import CommonUtil from '../../Utils/CommonUtil';
import CommonFunction from '../../Utils/CommonFunction';
const BACK_BUTTON_IMAGE = require('../../../assets/icons/back_icon2.png');
const HEADER_HAMBURG_IMAGE = require('../../../assets/icons/icon_hamburg.png');
const LOGO_IMAGE = require('../../../assets/icons/logo.png');
const USER_IMAGE_OFF = require('../../../assets/icons/icon_joinus.png');
const USER_IMAGE_ON = require('../../../assets/icons/icon_user_on.png');
const CART_IMAGE = require('../../../assets/icons/icon_cart2.png');
import CommonMyShop from '../CommonMyShop';
import IntroScreen from './IntroScreen';
import IntroScreen2 from './IntroScreen2';
const MaterialTopTabNavi = ({navigation}) => {
   
  
    return (
        <MaterailTopTab.Navigator
            initialRouteName={IntroScreen}
            tabBarComponent={IntroScreen}
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
            
            <MaterailTopTab.Screen name="브랜드">
                {props => <IntroScreen {...props}  />}
            </MaterailTopTab.Screen>
            <MaterailTopTab.Screen name="제품군">
                {props => <IntroScreen2 {...props}  />}
            </MaterailTopTab.Screen>
        </MaterailTopTab.Navigator>
    );

    
};

const CategoryListStack = ({navigation,route}) => {    
    const dispatch = useDispatch();
    const reduxData = useSelector(state => state);
    const {userToken,userCartCount} = reduxData.GlabalStatus;

    const loginAlert = async() => {
       
        let aletTitle = DEFAULT_CONSTANTS.appName;
        let alertMessage = '로그인이 필요합니다.\n로그인 하시겠습니까?';
        let alertbuttons = [
            {text: '확인', onPress: () => console.log(1)},
            {text: '취소', onPress: () => console.log(2)},
        ]
        let returnCode = await CommonFunction.showAsyncAlert(aletTitle, alertMessage, alertbuttons)

        if (returnCode === 0) {
            await dispatch(ActionCreator.saveNonUserToken({}));
            setTimeout(() => {
                navigation.popToTop();
            }, 500);
        } else {
            console.log('option else')
        }
    }
    return (
        <Stack.Navigator
            initialRouteName={'MaterialTopTabNavi'}
            screenOptions={{
                headerLeft : () => (
                    <TouchableHighlight 
                        underlayColor="transparent"
                        onPress={()=> CommonUtil.isEmpty(userToken) ? loginAlert() : navigation.navigate('Tabs04Stack')}
                        hitSlop={{left:10,right:10,bottom:10,top:10}}
                        style={CommonStyle.subHeaderLeftWrap}
                    >
                        <Image
                            source={CommonUtil.isEmpty(userToken) ? USER_IMAGE_OFF : USER_IMAGE_ON}
                            resizeMode={"contain"}
                            style={CommonUtil.isEmpty(userToken) ? CommonStyle.leftEmptyIcon : CommonStyle.LeftLoginIcon }
                        />
                    </TouchableHighlight>
                ),   
                headerTitle : () => (
                    <TouchableHighlight 
                        underlayColor="transparent"
                        style={CommonStyle.subHeaderCenterWrap} 
                        onPress={()=>navigation.navigate('Tabs01Stack')}
                    >
                        <Image
                            source={LOGO_IMAGE}
                            resizeMode={"contain"}
                            style={{width:CommonUtil.dpToSize(54),height:CommonUtil.dpToSize(32)}}
                        />
                    </TouchableHighlight>
                ),
                headerRight : () => (
                    !CommonUtil.isEmpty(userToken) ?
                    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                        <CommonMyShop
                            menutext=""
                            //menustyle={{width:40,height:50,marginRight:0}}
                            menustyle={CommonStyle.subHeaderRightWrap}
                            textStyle={{color: '#fff'}}                                                
                            isIcon={true}
                            onPressModify={()=>this.modifyContent()}
                            onPressRemove={()=>this.removeContent()}
                            userCartCount={userCartCount}
                            userToken={userToken}
                            navigation={navigation}
                        />
                    </View>
                    :
                    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}></View>
                )
            }}
        >
            <Stack.Screen name="MaterialTopTabNavi">
                {props => <MaterialTopTabNavi {...props} extraData={route} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
}

export { CategoryListStack};
