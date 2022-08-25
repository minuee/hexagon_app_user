import {StyleSheet, Dimensions,PixelRatio} from 'react-native';

const {width: SCREEN_WIDTH,height : SCREEN_HEIGHT} = Dimensions.get("window");
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../Utils/CommonUtil'; 

const CommonStyles = StyleSheet.create({    
    fontDefault : { color : '#222'},
    fontRed : { color : '#ff0000'},
    fontblack : { color : '#000000'},
    fontGray : { color : '#ccc'},
    fontTheme : { color : '#28a5ce'},
    
    fontStrike : {
        textDecorationLine: 'line-through', textDecorationStyle: 'solid'
    },
    //stack form
    backButtonWrap : {
        width: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23), height: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23)
    },
    stackHeaderCenterWrap : {
        flex:1,flexGrow:1,justifyContent:'center',alignItems:'center',
    },
    stackHeaderCenterText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color_000
    },
    ststackHeaderInsideWrapa : {
        flex:1,minWidth:'100%',justifyContent:'center',alignItems:'center'
    },
    stackHeaderLeftWrap : {
        flex:1,flexGrow:1,paddingLeft:25,justifyContent:'center',alignItems:'center'
    },
    stackHeaderRightWrap : {
        flex:1,flexGrow:1,justifyContent:'center',paddingRight:15
    },
    //stack form2 
    subHeaderLeftWrap : {
        flex:1,flexGrow:1,paddingLeft:20,justifyContent:'center',alignItems:'center'
    },
    subHeaderCenterWrap : {
        flex:1,flexGrow:1,justifyContent:'center',alignItems:'center',width:SCREEN_WIDTH*0.6
    },
    subHeaderRightWrap : {
        flex:1,flexGrow:1,justifyContent:'center',alignItems:'center',paddingHorizontal:20,zIndex:100
    },
    subImageWrap : {
        width:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize25),height:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize25)
    },
    //해더 탭스
    headerTapsWrap : {
        marginTop:10,paddingHorizontal:15,flexDirection:'row',width:SCREEN_WIDTH,borderBottomColor:'#ccc',borderBottomWidth:0.5
    },
    headerTabpWidth : {
        flex:1,maxWidth:100,alignItems:'center',paddingVertical:10
    },
    headerTabsBottomLine : {
        position:'absolute',bottom:0,left:0,height:2,width:'100%',backgroundColor:DEFAULT_COLOR.base_color,zIndex:10
    },
    leftEmptyIcon : {
        width:CommonUtil.dpToSize(40),height:CommonUtil.dpToSize(27)
    },
    LeftLoginIcon : {
        width:CommonUtil.dpToSize(24),height:CommonUtil.dpToSize(24)
    },
    //etc 
    checkboxIcon : {
        width : PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize22),height:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize22)
    },
    checkboxIcon2 : {
        width:CommonUtil.dpToSize(22),height:CommonUtil.dpToSize(22)
    },
    fullWidthImage : {
        width:'95%',aspectRatio:1
    },
    fullWidthImage100 : {
        width:'100%',aspectRatio:1
    },
    fullWidthHeightImage : {
        width:'95%',aspectRatio:1,height:'100%'
        
    },
    emptyWrap : {
        flex:1,justifyContent:'center',alignItems:'center',paddingVertical:20,backgroundColor:'#fff',
    },
    //검색폼
    searchFormWrap : {
       backgroundColor:'#f7f7f7',paddingVertical:10,paddingHorizontal:10,flexDirection:'row',height:45
    },
    searchinputContainer : {
        borderWidth:1,
        borderColor:'#fff',
        borderRadius:0,backgroundColor:'#fff',margin:0,padding:0,height:45
    },
    searchinput : {
        margin:0,paddingLeft: 10,color: '#a4a4a4',fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize17)
    },
    searchLeftIcon : {
        justifyContent:'center',alignItems:'center'
    },
    searchrightIconContainer : {
        backgroundColor:'#ccc',height:45
    },
    searchrightIconContainerOn : {
        backgroundColor:DEFAULT_COLOR.base_color,height:45
    },
    cartWrap : {
        position:'absolute',right:-5,top:5,width:16,height:16,borderRadius:8,backgroundColor:'#555',justifyContent:'center',alignItems:'center',zIndex:2,overflow:'hidden',opacity:0.8
    },
    cartBigWrap : {
        position:'absolute',right:10,top:5,width:26,height:16,borderRadius:8,backgroundColor:'#ccc',justifyContent:'center',alignItems:'center',zIndex:2,overflow:'hidden'
    },
    cartCountText : {
        fontSize:10,color:'#fff'
    },
    //테이블
    blankWrap : {
        flex:1,    
        paddingVertical:50,
        justifyContent:'center',
        alignItems:'center'
    },
    nullDataWrap :{ 
        marginHorizontal:15,paddingVertical:25,borderTopWidth:1,borderTopColor:'#ccc',borderBottomWidth:1,borderBottomColor:'#ccc'
    },
    titleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#000'
    },
    titleText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#545454'
    },
    priceText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),color:'#545454'
    },
    dataText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#545454'
    },
    dataTextWhite : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#fff'
    },
    dataText16White : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),color:'#fff'
    },
    dataText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#4780fd'
    },
    requiredText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20),color:'#f64444'
    },
    requiredText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#f64444'
    },
    titleText15 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)
    },
    dataText15 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#545454'
    },

    //more button
    moreButtonWrap : {
        flex:1,marginTop:10,justifyContent:'center',alignItems:'center',marginBottom:20
    },
    moreButton : {
        paddingVertical:5,paddingHorizontal:15,justifyContent:'center',alignItems:'center',
        borderWidth:1,borderColor:'#ccc',borderRadius:5,backgroundColor:DEFAULT_COLOR.input_bg_color
    },
 
    moreText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)
    },

    //select form
    selectBoxText  : {
        color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),lineHeight: DEFAULT_TEXT.fontSize20 * 1,
    },
    unSelectedBox : {
        borderRadius:5,borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color,paddingVertical:5,paddingHorizontal:10,backgroundColor:'#fff'
    },

    selectBackground : {
        backgroundColor:'#f8f8f8'
    },
    defaultBackground : {
        backgroundColor:'#f8f8f8'
    },

    //defautll form
    defaultOneWayForm : {
        height:40 ,width:'100%',paddingLeft: 5,textAlignVertical: 'center',textAlign:'left',fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)
    },
    defaultOneWayFormAlignRight : {
        height:40,width:'100%',paddingRight: 5,textAlignVertical: 'center',textAlign:'right',fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)
    },
    inputBlank : {
        borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color,borderRadius:5,backgroundColor:'#fff'
    },
    blankArea : {
        flex:1,height:100,backgroundColor:'#fff'
    },
    moreWrap : {
        flex:1,paddingVertical:10,alignItems:'center',justifyContent:'center'
    },
    defaultIconImage : {
        width:PixelRatio.roundToNearestPixel(25),height:PixelRatio.roundToNearestPixel(25)
    },
    defaultIconImage20 : {
        width:PixelRatio.roundToNearestPixel(20),height:PixelRatio.roundToNearestPixel(20)
    },
    defaultIconImage30 : {
        width:PixelRatio.roundToNearestPixel(30),height:PixelRatio.roundToNearestPixel(30)
    },
    defaultImage40 : {
        flex:1,flexGrow:1,paddingLeft:25,justifyContent:'center',alignItems:'center'
    },
    defaultIconImage55 : {
        width:PixelRatio.roundToNearestPixel(55),height:PixelRatio.roundToNearestPixel(55)
    },
    defaultIconImage60 : {
        width:PixelRatio.roundToNearestPixel(60),height:PixelRatio.roundToNearestPixel(60)
    },
    defaultIconImage70 : {
        width:PixelRatio.roundToNearestPixel(70),height:PixelRatio.roundToNearestPixel(70)
    },
    defaultImage97 : {
        width:PixelRatio.roundToNearestPixel(97),height:PixelRatio.roundToNearestPixel(97)
    },
    defaultNoImage : {
        width:PixelRatio.roundToNearestPixel(55),height:PixelRatio.roundToNearestPixel(55)
    },
    termLineWrap : {
        flex:1,
        paddingVertical:5,
        backgroundColor:'#f5f6f8'
    },
    termLineWrap80 : {
        flex:1,
        paddingVertical:40,
        backgroundColor:'#f5f6f8'
    },
    //screen footer common 
    scrollFooterWrap : {
        position:'absolute',right:0,bottom:0,width:SCREEN_WIDTH,height:DEFAULT_CONSTANTS.BottomHeight,justifyContent:'center',alignItems:'center',flexDirection:'row'
    },
    scrollFooterLeftWrap : {
        flex:1,height:DEFAULT_CONSTANTS.BottomHeight,backgroundColor:DEFAULT_COLOR.base_color,justifyContent:'center',alignItems:'center'
    },
    scrollFooterRightWrap : {
        flex:1,height:DEFAULT_CONSTANTS.BottomHeight,backgroundColor:'#ccc',justifyContent:'center',alignItems:'center'
    },
    scrollFooterText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#fff'
    },
    scrollFooterText20 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20),color:'#fff'
    },
    bottomButtonWrap : {
        position:'absolute',right:0,bottom:0,width:SCREEN_WIDTH,height:DEFAULT_CONSTANTS.BottomHeight,backgroundColor:DEFAULT_COLOR.base_color,justifyContent:'center',alignItems:'center',flexDirection:'row',borderTopWidth:1, borderTopColor:DEFAULT_COLOR.base_color
    },
    bottomLeftBox : {
        flex:1,backgroundColor:DEFAULT_COLOR.base_color,justifyContent:'center',alignItems:'center'
    },
    bottomRightBox : {
        flex:1,backgroundColor:'#fff',justifyContent:'center',alignItems:'center',height:'100%'
    },
    bottomMenuOnText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color
    },
    baseColorText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color
    },
    bottomMenuOffText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#fff'
    },
})

export default CommonStyles;