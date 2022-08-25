import React, { Component } from 'react';
import {
    View,    
    PixelRatio,
    BackHandler,
    Dimensions,
    StyleSheet,
    Image
} from 'react-native';


import Swiper from '../Utils/Swiper';

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const BASE_HEIGHY = Platform.OS === 'ios' ? 110 : 100;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextB} from '../Components/CustomText';


const SlideBanner=(props)=>{            
    return (
        <View style={styles.container}>
            <Swiper 
                style={styles.wrapper} showsButtons={false} loop={true} autoplay={true} autoplayTimeout={3} showsPagination={true}
                dot={<View style={{backgroundColor:'rgba(0,0,0,.2)', width: 8, height: 8,borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}
            >
                {props.children}
            </Swiper>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {        
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
  
    wrapper: {
        //width: SCREEN_WIDTH,
        //height:SCREEN_WIDTH/4*3
    },
    
});

export default SlideBanner;