import React, { Component } from 'react';
import {TouchableOpacity,Image,PixelRatio,View,Alert} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
const Stack = createStackNavigator();

import {useSelector,useDispatch} from 'react-redux';
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import {CustomTextB} from '../../Components/CustomText';
import CommonFunction from '../../Utils/CommonFunction';
const BACK_BUTTON_IMAGE = require('../../../assets/icons/back_icon2.png');
const CLOSE_BUTTON_IMAGE = require('../../../assets/icons/btn_close2.png');
import PaymentScreen from './Payment'; 
import PaymentResultScreen from './PayResultScreen'; 

const PaymentStack = ({navigation,route}) => {
    let navTitle = "결제하기";

    //console.log('PaymentStack',route)
    goBackScreen = () => {
        navigation.goBack(null)
    }
    alertCancle = async() => {
        let aletTitle = DEFAULT_CONSTANTS.appName;
        let alertMessage = '정말로 결제를 취소하시겠습니까?';
        let alertbuttons = [
            {text: '확인', onPress: () => console.log(1)},
            {text: '취소', onPress: () => console.log(2)},
        ]
        let returnCode = await CommonFunction.showAsyncAlert(aletTitle, alertMessage, alertbuttons)

        if (returnCode === 0) {
            this.goBackScreen()
        } else {
            console.log('option else')
        }
    }
    return (
      <Stack.Navigator 
        initialRouteName="PaymentScreen"
        screenOptions={{
            headerLeft: (props) => (
                <TouchableOpacity onPress= {()=> alertCancle()} style={{flex:1,paddingLeft:25,justifyContent:'center',alignItems:'center'}}>
                    <Image source={CLOSE_BUTTON_IMAGE} style={{width: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23), height: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23)}} />
                </TouchableOpacity>
            ),
            headerTitle : () => null,
            headerRight : (props) => (
                <View style={{flex:1,justifyContent:'center',alignItems:'flex-end',paddingRight:25}}>
                    <CustomTextB style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color}}>{navTitle}</CustomTextB>
                </View>
            )

        }}
      >
        <Stack.Screen name="PaymentScreen">
            {props => <PaymentScreen {...props} extraData={route.params} />}
        </Stack.Screen>
      </Stack.Navigator>
    );
};


const PaymentResultStack = ({navigation,route}) => {
    let navTitle = "결제하기 -  완료";
    return (
      <Stack.Navigator 
        initialRouteName="PaymentResultScreen"
            
        screenOptions={{
            headerLeft: (props) => null,
            headerTitle : () => null,
            headerRight : (props) => (
                <View style={{flex:1,justifyContent:'center',alignItems:'flex-end',paddingRight:25}}>
                    <CustomTextB style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color}}>{navTitle}</CustomTextB>
                </View>
            )

        }}
      >
        <Stack.Screen name="PaymentResultScreen">
            {props => <PaymentResultScreen {...props} extraData={route.params} />}
        </Stack.Screen>
      </Stack.Navigator>
    );
};
  
export { PaymentStack,PaymentResultStack }