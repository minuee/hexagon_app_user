import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Text,Dimensions,PixelRatio,Image,TextInput, TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR} from './CustomText';

import CommonUtil from '../Utils/CommonUtil';
import CommonFunction from '../Utils/CommonFunction';


export default  class CustomConfirm extends Component {
    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

   

    render() {
        return(
            <View style={ styles.container }>
                { !CommonUtil.isEmpty(this.props.screenState.alertTitle) &&
                <View style={{height:40}}>
                    <View style={{paddingVertical:5,alignItems:'center',justifyContent:'center'}}>
                        <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color}}>{this.props.screenState.alertTitle}
                        </CustomTextM>
                    </View>
                </View>   
                }
                <View style={{flex:2,marginTop:5,padding:15,alignItems:'flex-start',justifyContent:'flex-start'}}>
                    <ScrollView>
                        {this.props.screenState.alertBody || <View></View>}
                    </ScrollView>
                </View>
                <View style={{flex:0.5,flexDirection:'row',justifyContent:'center',alignItems:'center',width:'100%',backgroundColor:DEFAULT_COLOR.base_color}}>                    
                    <TouchableOpacity         
                        hitSlop={{left:10,right:5,top:10,bottom:10}}                            
                        onPress={()=> this.props.screenState.closePopLayer()}
                    >
                        <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#fff'}}>확인</CustomTextM>
                    </TouchableOpacity>
                </View>
                
            </View>
        );
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        //backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputBlankNull : {
        borderWidth:1,borderColor:'#fff'
    },
    inputBlank : {
        borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color,borderRadius:5
    },
    boxWrap2 : {
        paddingHorizontal:15
    },
    selectedWrap2 : {
        paddingHorizontal:15,backgroundColor:'#000',opacity:0.4,flexDirection:'row'
    },
    menuOnBox : {
        flex:1,backgroundColor:DEFAULT_COLOR.base_color,justifyContent:'center',alignItems:'center'
    },
    menuOffBox : {
        flex:1,backgroundColor:'#fff',justifyContent:'center',alignItems:'center',height:'100%'
    },
    menuOnText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#fff'
    },
    menuOffText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color
    },
});