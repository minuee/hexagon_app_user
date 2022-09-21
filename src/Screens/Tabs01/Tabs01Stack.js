import React, { Component } from 'react';
import {TouchableOpacity,Image,PixelRatio,View,TouchableHighlight,Dimensions,Platform} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector,useDispatch} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
const MaterailTopTab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonStyle from '../../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextB,CustomTextR,CustomTextL} from '../../Components/CustomText';
import CommonFunction from '../../Utils/CommonFunction';
import CommonUtil from '../../Utils/CommonUtil'; 
import RecommScreen from './RecommScreen';
import EventScreen from './EventScreen'; 
import CommonMyShop from '../CommonMyShop';
import ArrivalScreen from './ArrivalScreen';
import BestProductScreen from './BestProductScreen';


const LOGO_IMAGE = require('../../../assets/icons/logo.png');
const USER_IMAGE_OFF = require('../../../assets/icons/icon_joinus.png');
const USER_IMAGE_ON = require('../../../assets/icons/icon_user_on.png');
const CART_IMAGE = require('../../../assets/icons/icon_cart2.png');

const MaterialTopTabNavi = (navigation) => {
    return (
        <MaterailTopTab.Navigator
            initialRouteName="RecommScreen"
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
                    //paddingBottom : -10
                },
                
            }}
            
            swipeEnabled={false}
        >
            <MaterailTopTab.Screen name="HOME" >
                {props => <RecommScreen {...props} />}
            </MaterailTopTab.Screen>
            <MaterailTopTab.Screen name="신제품" >
                {props => <ArrivalScreen {...props} />}  
            </MaterailTopTab.Screen>
            <MaterailTopTab.Screen name="베스트" >
                {props => <BestProductScreen {...props} />}  
            </MaterailTopTab.Screen>
            <MaterailTopTab.Screen name="이벤트" >
                {props => <EventScreen {...props} />}  
            </MaterailTopTab.Screen>
        </MaterailTopTab.Navigator>
    );
};

const Tabs01Stack = ({navigation,route}) => {
    const dispatch = useDispatch();
    const reduxData = useSelector(state => state);
    const {userToken,userCartCount} = reduxData.GlabalStatus;

    const loginAlert = async() => {
       
        let alertTitle = DEFAULT_CONSTANTS.appName;
        let alertMessage = '회원가입을 하시겠습니까?';
        let alertbuttons = [
            {text: '확인', onPress: () => console.log(1)},
            {text: '취소', onPress: () => console.log(2)},
        ]
        let returnCode = await CommonFunction.showAsyncAlert(alertTitle, alertMessage, alertbuttons)

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
        initialRouteName="IntroScreen" 
        //screenOptions={{headerShown: false}}
        screenOptions={{
            headerLeft : () => (
                <TouchableHighlight 
                    underlayColor="transparent"                    
                    onPress={()=> CommonUtil.isEmpty(userToken) ? loginAlert() : navigation.navigate('Tabs04Stack')}
                    hitSlop={{left:10,right:20,bottom:10,top:10}}
                    style={[CommonStyle.subHeaderLeftWrap,{zIndex:10}]}
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
          {props => <MaterialTopTabNavi {...props} extraData={{route}} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default Tabs01Stack;
