import React, { Component } from 'react';
import {View,PixelRatio,Dimensions,TouchableOpacity,TouchableNativeFeedback,Image,StyleSheet,Platform} from 'react-native';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import {useSelector,useDispatch} from 'react-redux';
import ActionCreator from '../Ducks/Actions/MainActions';
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../Constants';
import CommonStyle from '../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const BASE_HEIGHY = Platform.OS === 'ios' ? 110 : 100;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {TextRobotoL,CustomTextR,CustomTextL} from '../Components/CustomText';
import CommonFunction from '../Utils/CommonFunction';
import CommonUtil from '../Utils/CommonUtil'; 

const LOGO_IMAGE = require('../../assets/icons/logo.png');
const USER_IMAGE_OFF = require('../../assets/icons/icon_user_off.png');
const USER_IMAGE_ON = require('../../assets/icons/icon_user_on.png');
const CART_IMAGE = require('../../assets/icons/icon_cart2.png');

const CommonMyShop = (props) => {

    const dispatch = useDispatch();
    const reduxData = useSelector(state => state);
    const {userToken,userCartCount,userZzimCount,userOrderingCount,userNowPoint} = reduxData.GlabalStatus;
    let _menu = null;
    return (
        <View style={props.menustyle}>
            <Menu
                ref={(tref) => (_menu = tref)}
                PaperProps={{  
                    style: {  
                      width: SCREEN_WIDTH*0.9,  
                    },  
                }}
                button={
                props.isIcon ? (
                    <TouchableOpacity 
                        underlayColor="transparent"                        
                        onPress={() => _menu.show()} hitSlop={{left:20,right:20,bottom:10,top:10}}
                        //hitSlop={{left:10,right:10,bottom:10,top:10}}
                        style={styles.cartWrap}
                    >
                        <View style={userCartCount > 9 ? CommonStyle.cartBigWrap : CommonStyle.cartWrap}>
                            <CustomTextR style={CommonStyle.cartCountText}>{userCartCount}</CustomTextR>
                        </View>
                        <Image source={CART_IMAGE} resizeMode={"contain"} style={styles.cartIconWrap} />
                    </TouchableOpacity>
                ) : (
                    null
                )}
            >
                <MenuItem onPress={() => {_menu.hide()}} style={styles.menuItemCoverWrap}>
                    {
                    Platform.OS === 'ios' ? 
                    <View style={styles.menuItemWrap2}>
                        <View style={styles.menuItemDataWrap}>
                            <View style={styles.menuTopTitleWrap}>
                                <CustomTextR style={styles.menuBigTitle}>MY 쇼핑</CustomTextR>
                            </View>
                            <View style={styles.menuTopDataWrap}>
                                <CustomTextR style={styles.menuSubTitle}>
                                    나의 적립금{" "}
                                    <TextRobotoL style={styles.menuSubTitle2}>
                                        {CommonFunction.currencyFormat(userNowPoint)}
                                    </TextRobotoL>
                                </CustomTextR>                                
                            </View>                            
                        </View>
                    </View>
                    :
                    <View style={styles.menuItemDataWrap}>
                        <View style={styles.menuTopTitleWrap}>
                            <CustomTextR style={styles.menuBigTitle}>MY 쇼핑{"                 "}</CustomTextR>
                        </View>
                        <View style={styles.menuTopDataWrap}>
                            <CustomTextR style={styles.menuSubTitle}>
                                나의 적립금{" "}<TextRobotoL style={styles.menuSubTitle2}>{CommonFunction.currencyFormat(userNowPoint)}</TextRobotoL>
                            </CustomTextR>
                        </View>
                    </View>     
                    }
                </MenuItem>               
                {
                Platform.OS === 'ios' ? 
                     <MenuItem style={styles.menuItemCoverWrap2}>
                        <View style={styles.menuItemWrap}>
                            <View style={styles.menuItemDataWrap}>
                                <TouchableOpacity style={styles.menuSubWrap} onPress={()=>{props.navigation.navigate('MyOrderListStack');_menu.hide()}}>
                                    <CustomTextL style={styles.menuSubTitle}>주문배송 <TextRobotoL style={styles.menuSubTitle2}>{userOrderingCount > 10 ? '10+' : userOrderingCount}</TextRobotoL></CustomTextL>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.menuSubWrap} onPress={()=>{props.navigation.navigate('CartStack');_menu.hide()}}>
                                    <CustomTextL style={styles.menuSubTitle}>장바구니 <TextRobotoL style={styles.menuSubTitle2}>{userCartCount > 99 ? '99+' : userCartCount}</TextRobotoL></CustomTextL>
                                </TouchableOpacity>
                                <TouchableOpacity                                 
                                    style={styles.menuSubWrap2} 
                                    //activeOpacity={0.8}
                                    hitSlop={{left:10,right:200,bottom:10,top:10}}
                                    onPress={()=>{props.navigation.navigate('MyBookMarkStack');_menu.hide()}}>
                                    <CustomTextL style={styles.menuSubTitle}>찜한상품 <TextRobotoL style={styles.menuSubTitle2}>{userZzimCount > 99 ? '99+' : userZzimCount}</TextRobotoL></CustomTextL>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </MenuItem>
                :                    
                    <MenuItem onPress={() => {_menu.hide()}} style={styles.menuItemCoverWrap3}>
                        <TouchableOpacity style={styles.menuSubWrapAndroid} onPress={()=>{props.navigation.navigate('MyOrderListStack');_menu.hide()}}>
                            <CustomTextL style={styles.menuSubTitle}>주문배송 <TextRobotoL style={styles.menuSubTitle2}>{userOrderingCount > 10 ? '10+' : userOrderingCount}</TextRobotoL></CustomTextL>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuSubWrapAndroid} onPress={()=>{props.navigation.navigate('CartStack');_menu.hide()}}>
                            <CustomTextL style={styles.menuSubTitle}>장바구니 <TextRobotoL style={styles.menuSubTitle2}>{userCartCount > 99 ? '99+' : userCartCount}</TextRobotoL></CustomTextL>
                        </TouchableOpacity>
                        <TouchableOpacity                                 
                            style={styles.menuSubWrapAndroid} onPress={()=>{props.navigation.navigate('MyBookMarkStack');_menu.hide()}}>
                            <CustomTextL style={styles.menuSubTitle}>찜한상품 <TextRobotoL style={styles.menuSubTitle2}>{userZzimCount > 99 ? '99+' : userZzimCount}</TextRobotoL></CustomTextL>
                        </TouchableOpacity>
                    </MenuItem>
                }
            </Menu>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : "#ffffff",
    },
    cartWrap : {
        flex:1,flexGrow:1,justifyContent:'center',alignItems:'flex-end',paddingLeft:20,zIndex:100
    },
    cartIconWrap : {
        width:CommonUtil.dpToSize(22),height:CommonUtil.dpToSize(22)
    },
    menuItemCoverWrap : {
        minWidth:SCREEN_WIDTH*0.9,
        maxWidth:SCREEN_WIDTH*0.9,
        ...Platform.select({
            ios: {
                backgroundColor:'#e7e7e7',borderBottomWidth:0.5,borderBottomColor:'#e7e7e7'
            },
            android: {
                backgroundColor:'#e7e7e7',borderBottomWidth:0.5,borderBottomColor:'#e7e7e7'
            }
        })
    },
    menuItemCoverWrap3 : {
        flex:1,
        flexDirection:'row',
        minWidth:SCREEN_WIDTH*0.9,maxWidth:SCREEN_WIDTH*0.9,
    },
    menuItemCoverWrap2 : {
        ...Platform.select({
            ios: {
                minWidth:SCREEN_WIDTH*0.9, maxWidth:SCREEN_WIDTH*0.9,flexDirection:'row',flexGrow:1,alignItems:'center'
            },
            android: {
                minWidth:SCREEN_WIDTH*0.9, maxWidth:SCREEN_WIDTH*0.9,flexDirection:'row',flexGrow:1,alignItems:'center'
            }
        })
    },
    menuItemWrap : {
        ...Platform.select({
            ios: {           
                justifyContent:'center',width:SCREEN_WIDTH*0.9,
            },
            android: {
                flex:1,
                flexDirection:'row',justifyContent:'center',
            }
        })
    },
    menuItemWrap2 : {
        ...Platform.select({
            ios: {
                flex:1,paddingHorizontal:10,justifyContent:'center',width:SCREEN_WIDTH*0.9
            },
            android: {
                flexDirection:'row',padding:0,margin:0,justifyContent:'center'
            }
        })
    },
    menuItemDataWrap : {
        flexDirection:'row',justifyContent:'space-evenly'
    },
    menuTopTitleWrap : {        
        ...Platform.select({
            ios: {
               flex:1,paddingLeft : 10
            },
            android: {
                paddingLeft : 10
            }
        })
    },
    menuTopDataWrap : {        
        ...Platform.select({
            ios: {
                paddingTop:5,flex:2,paddingLeft:5,alignItems:'flex-end'
            },
            android: {          
                paddingTop:5,paddingLeft:5
            }
        })
    },
    menuSubWrap : {
        flex:1,justifyContent:'center',alignItems:'center',paddingVertical:5
    },
    menuSubWrapAndroid : {
        flex:1,justifyContent:'center',alignItems:'center',paddingVertical:15,paddingHorizontal:15
    },
    menuSubWrap2 : {
        flex:1,justifyContent:'center',alignItems:'center',marginLeft:5,zIndex:999
    },
    menuBigTitle : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color,fontWeight:'bold'
    },
    menuTitle : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:DEFAULT_COLOR.base_color,fontWeight:'bold'
    },
    menuSubTitle : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#000'
    },
    menuSubTitle2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:DEFAULT_COLOR.base_color
    }
});

export default CommonMyShop;