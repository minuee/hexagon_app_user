import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Text,Dimensions,PixelRatio,Image,TextInput, TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import { Rating, AirbnbRating } from 'react-native-elements';
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR} from './CustomText';

import CommonUtil from '../Utils/CommonUtil';
import CommonFunction from '../Utils/CommonFunction';


export default  class CustomAlert extends Component {
    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    render() {
        return(
            <View style={ styles.container }>
                <View style={{height:40}}>
                    <View style={styles.titleWrap}>
                        <CustomTextM style={styles.titleText}>{this.props.screenState.alertTitle}
                        </CustomTextM>
                    </View>
                </View>   
                <View style={styles.bodyWrap}>
                    <ScrollView>
                        {this.props.screenState.alertBody || <View></View>}
                    </ScrollView>
                </View>
                <View style={this.props.screenState.isCenter ? styles.footerWrap2 : styles.footerWrap}>
                    { this.props.screenState.isCancelView &&
                    <TouchableOpacity                                     
                        hitSlop={{left:10,right:5,top:10,bottom:10}}
                        onPress={()=> this.props.screenState.clickCancle()}
                        style={{marginRight:25}}
                    >
                        <CustomTextM style={styles.cancleText}>{this.props.screenState.cancleText || "CANCEL"}</CustomTextM>
                    </TouchableOpacity>
                    }
                    <TouchableOpacity         
                        hitSlop={{left:10,right:5,top:10,bottom:10}}                            
                        onPress={()=> this.props.screenState.closePopLayer()}
                    >
                        <CustomTextM style={styles.okayText}>{this.props.screenState.okayText || "OK"}</CustomTextM>
                    </TouchableOpacity>
                </View>
                
            </View>
        );
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,        
        marginHorizontal:10
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        //backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },

    titleWrap : {
        paddingVertical:5,alignItems:'flex-start',justifyContent:'flex-start'
    },
    titleText : { 
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#494949'
    },
    bodyWrap : {
        flex:2,marginTop:5,alignItems:'flex-start',justifyContent:'flex-start'
    },
    footerWrap : {
        flex:0.5,flexDirection:'row',justifyContent:'flex-end',alignItems:'flex-end',width:'95%',paddingBottom:20
    },
    footerWrap2 : {
        flex:0.5,flexDirection:'row',justifyContent:'center',alignItems:'center',width:'95%',paddingBottom:20
    },
    cancleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#7d7d7d'
    },
    okayText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:DEFAULT_COLOR.base_color
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