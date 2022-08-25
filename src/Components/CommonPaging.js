import React, { Component } from 'react';
import {View,PixelRatio,Dimensions,TouchableOpacity,Image,StyleSheet} from 'react-native';

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const BASE_HEIGHY = Platform.OS === 'ios' ? 110 : 100;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR} from '../Components/CustomText';


const CommonPaging=(props)=>{      
    //console.log('CommonPaging',props);

    buttonNext = (info) => {        
        if ( info.currentpage < info.totalPages && info.ismore) {
            props.screenState.getAPIData(parseInt(info.currentpage+1))
        }
    }

    buttonLast = (info) => {        
        if ( info.currentpage < info.totalPages && info.ismore) {
            props.screenState.getAPIData(parseInt(info.totalPages))
        }
    }

    buttonPrev = (info) => {        
        if ( info.currentpage <= info.totalPages && info.currentpage > 1 ) {
            props.screenState.getAPIData(parseInt(info.currentpage-1))
        }
    }

    buttonFirst = (info) => {        
        if ( info.currentpage <= info.totalPages && info.currentpage > 1 ) {
            props.screenState.getAPIData(parseInt(1))
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.pagingBoxWrap} >
                <TouchableOpacity 
                    hitSlop={{left:5,right:5,bottom:5,top:5}}
                    style={{paddingRight:5}}
                    onPress={()=>this.buttonFirst(props.screenState)}
                >
                    <Image
                        source={require('../../assets/icons/btn_prev_end.png')}
                        resizeMode={"contain"}
                        style={styles.buttonSize}
                    />
                </TouchableOpacity>
                <TouchableOpacity 
                    hitSlop={{left:5,right:5,bottom:5,top:5}}
                    style={{paddingRight:15}}
                    onPress={()=>this.buttonPrev(props.screenState)}
                >
                    <Image
                        source={require('../../assets/icons/btn_prev.png')}
                        resizeMode={"contain"}
                        style={styles.buttonSize}
                    />
                </TouchableOpacity>
                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),color:DEFAULT_COLOR.base_color}}>Page {props.screenState.currentpage}</CustomTextR>
                <TouchableOpacity 
                    style={{paddingLeft:15}}
                    hitSlop={{left:5,right:5,bottom:5,top:5}}
                    onPress={()=>this.buttonNext(props.screenState)}
                >
                    <Image
                        source={require('../../assets/icons/btn_next.png')}
                        resizeMode={"contain"}
                        style={styles.buttonSize}
                    />
                </TouchableOpacity>
                <TouchableOpacity 
                    hitSlop={{left:5,right:5,bottom:5,top:5}}
                    style={{paddingLeft:5}}
                    onPress={()=>this.buttonLast(props.screenState)}
                >
                    <Image
                        source={require('../../assets/icons/btn_next_end.png')}
                        resizeMode={"contain"}
                        style={styles.buttonSize}
                    />
                </TouchableOpacity>
            </View> 
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : "#fff",
    },
    pagingBoxWrap : {
        marginTop:30,marginHorizontal:10,width:SCREEN_WIDTH,backgroundColor : "#fff",alignItems:'center',justifyContent:'center',flexDirection:'row',flexGrow:1
    },
    buttonSize : {
        width:PixelRatio.roundToNearestPixel(18),height:PixelRatio.roundToNearestPixel(18)
    }
});

export default CommonPaging;