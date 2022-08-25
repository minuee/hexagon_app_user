import React, { Component } from 'react';
import {
    View,    
    PixelRatio,
    BackHandler,
    Dimensions,
    TouchableOpacity,
    Image
} from 'react-native';

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const BASE_HEIGHY = Platform.OS === 'ios' ? 110 : 100;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextB} from '../Components/CustomText';


const HeaderBackButton=(props)=>{            
    return (
        <View style={{flexDirection:'row',paddingVertical:10}}>
            <TouchableOpacity onPress= {()=> props.screenProps.navigation.goBack(null)} style={{flex:1,paddingLeft:25}}>
                <Image source={require('../../assets/icons/drawable-xhdpi/back_icon.png')} style={{width: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23), height: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23)}} />
            </TouchableOpacity>
            <View style={{flex:1,justifyContent:'flex-end',alignItems:'flex-end',paddingRight:25}}>
                <CustomTextB style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color}}>{props.title}</CustomTextB>
            </View>
        </View>
    )
}

export default HeaderBackButton;