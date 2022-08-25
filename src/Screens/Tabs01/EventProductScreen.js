import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Text,Dimensions,ActivityIndicator, PixelRatio,Image as NativeImage,TouchableOpacity, Platform,Animated,Alert,BackHandler} from 'react-native';
import 'moment/locale/ko'
import  moment  from  "moment";
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import Image from 'react-native-image-progress';
//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonStyle from '../../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR} from '../../Components/CustomText';
import CommonFunction from '../../Utils/CommonFunction';
import CommonUtil from '../../Utils/CommonUtil';
import CountDown from '../../Components/CountDown';
import FooterScreen from '../../Components/FooterScreen';
import Loader from '../../Utils/Loader';
import { apiObject } from "../Apis";

const iconEvent = require('../../../assets/icons/icon_event.png');
const iconEventterm = require('../../../assets/icons/icon_eventterm.png');
const iconEventlimit = require('../../../assets/icons/icon_eventlimit.png');
const ICON_CART = require('../../../assets/icons/icon_cart.png');
const ICON_ZZIM = require('../../../assets/icons/icon_zzim.png');

class EventProductScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            isCountDown : false,
            eventDetail : {},
            productArray :  []
        }
    }
    

    getBaseData = async(event_pk) => {
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/event/view/'+event_pk;
            //console.log('url',url)   
            const token = this.props.userToken.apiToken;
            returnCode = await apiObject.API_getDetailDefault(this.props,url,token);          
            //console.log('returnCode',returnCode)   
            if ( returnCode.code === '0000'  ) {
                this.setState({
                    eventDetail : CommonUtil.isEmpty(returnCode.data.eventDetail) ? [] : returnCode.data.eventDetail,
                    productArray : CommonUtil.isEmpty(returnCode.data.eventDetail.product_array) ? [] : returnCode.data.eventDetail.product_array,
                })
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.',1500);
                setTimeout(
                    () => {            
                       this.props.navigation.goBack(null);
                    },1500
                )
            }
            this.setState({moreLoading:false,loading:false})
        }catch(e){
            console.log('e333333',e)   
            this.setState({loading:false,moreLoading : false})
        }
    }
    async UNSAFE_componentWillMount() {
       // console.log('RewardDetailScreen',this.props.extraData.params.screenData)
        try{
            if ( !CommonUtil.isEmpty(this.props.extraData.params.screenData)) {
                await this.getBaseData(this.props.extraData.params.screenData.event_pk);
            }else{
                CommonFunction.fn_call_toast('잘못된 접근입니다1.',2000);
                setTimeout(
                    () => {            
                    this.props.navigation.goBack(null);
                    },1000
                )
            }
        }catch(e) {
            console.log('eee',e)
        }
       
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);          
    }

    handleBackButton = () => {        
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);  
        this.props.navigation.goBack(null);                
        return true;
    };


    handleOnScroll (event) {             
        if ( event.nativeEvent.contentOffset.y >= 200 ) {
            //this.setState({showTopButton : true}) 
        }else{
            //this.setState({showTopButton : false}) 
         }

        let paddingToBottom = 1;
        paddingToBottom += event.nativeEvent.layoutMeasurement.height;                            
        if (event.nativeEvent.contentOffset.y + paddingToBottom >= event.nativeEvent.contentSize.height) {            
            //this.scrollEndReach();
        }
    }

    scrollEndReach = () => {       
       
    }

    moveDetail = (item) => {
        if ( CommonUtil.isEmpty(this.props.userToken)) {
            Alert.alert(DEFAULT_CONSTANTS.appName, '로그인이 필요합니다.\n로그인 하시겠습니까',
            [
                {text: '확인', onPress: () => CommonUtil.moveLogin(this.props)},
                {text: '취소', onPress: () => console.log('취소')},
            ]);
            
        }else{
            this.props.navigation.navigate('ProductDetailStack',{
                screenData:item
            })
        }
    }


    addZzimAlert = (item) => {
        if ( CommonUtil.isEmpty(this.props.userToken)) {
            Alert.alert(DEFAULT_CONSTANTS.appName, '로그인이 필요합니다.\n로그인 하시겠습니까',
            [
                {text: '확인', onPress: () => CommonUtil.moveLogin(this.props)},
                {text: '취소', onPress: () => console.log('취소')},
            ]);
        }else{
            Alert.alert(DEFAULT_CONSTANTS.appName, '찜리스트에 추가하시겠습니까?',
            [
                {text: '확인', onPress: () => this.registZzim(item)},
                {text: '취소', onPress: () => console.log('취소')},
            ]);
        }
    }

    registZzim = async (item) => {
        await this.setState({moreLoading:true})
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/bookmark/eachadd';
            const token = this.props.userToken.apiToken;
            let sendData = {
                member_pk : this.props.userToken.member_pk,
                product_pk : item.product_pk
            };
            returnCode = await apiObject.API_registCommon(this.props,url,token,sendData);
            if ( returnCode.code === '0000'  ) {
                let userZzimCount = CommonUtil.isEmpty(returnCode.totalCount) ? 0 : returnCode.totalCount ;
                this.props._fn_getUserZzimCount(userZzimCount);
                CommonFunction.fn_call_toast('찜리스트에 추가되었습니다',2000);
            }else{
                CommonFunction.fn_call_toast('오류가 발생하였111습니다, 잠시후 다시 이용해주세요',2000);
            }
            this.setState({moreLoading:false})
        }catch(e){
            CommonFunction.fn_call_toast('오류가 발생하였습니다, 잠시후 다시 이용해주세요',2000);
            this.setState({moreLoading:false})
        }  
    }

    addEachAlert = (item,idx) => {
        if ( CommonUtil.isEmpty(this.props.userToken)) {
            Alert.alert(DEFAULT_CONSTANTS.appName, '로그인이 필요합니다.\n로그인 하시겠습니까',
            [
                {text: '확인', onPress: () => CommonUtil.moveLogin(this.props)},
                {text: '취소', onPress: () => console.log('취소')},
            ]);
            
        }else{
            Alert.alert(DEFAULT_CONSTANTS.appName, '장바구니에서 추가하시겠습니까?',
            [
                {text: '확인', onPress: () => this.addCart(item,idx)},
                {text: '취소', onPress: () => console.log('취소')},
            ]);
        }
    }

    addCart = async(item) => {
        await this.setState({moreLoading:true})
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/cart/eachadd';
            const token = this.props.userToken.apiToken;
            let sendData = {
                member_pk : this.props.userToken.member_pk,
                product_pk : item.product_pk,
                quantity : 1,
                unit_type : 'Each'
            };
            returnCode = await apiObject.API_registCommon(this.props,url,token,sendData);          
            console.log('API_insertEachCart returnCode',returnCode)   
            if ( returnCode.code === '0000'  ) {
                let userCartCount = CommonUtil.isEmpty(returnCode.data.totalCount) ? 0 : returnCode.data.totalCount;
                this.props._fn_getUserCartCount(userCartCount);
                CommonFunction.fn_call_toast('장바구니에 추가되었습니다',2000);
            }else{
                CommonFunction.fn_call_toast('오류가 발생하였습니다, 잠시후 다시 이용해주세요',2000);
            }
            this.setState({moreLoading:false})
        }catch(e){
            //console.log('e',e)   
            CommonFunction.fn_call_toast('오류가 발생하였습니다, 잠시후 다시 이용해주세요',2000);
            this.setState({moreLoading:false})
        }

       
    }

    renderEventGubun = (data) => {
        switch(data.event_gubun) {
            case 'TERM' : return '기간할인이벤트';break;
            case 'LIMIT' : return '한정특가';break;
            case 'SALE' : return '할인이벤트';break;
            default : return '할인이벤트';break;
        }
    }
    renderEventTerm = (data) => {
        switch(data.event_gubun) {
            case 'TERM' : 
                return (
                    `${CommonFunction.convertUnixToDate(this.state.eventDetail.start_dt,"YYYY.MM.DD HH:mm")} ~ ${CommonFunction.convertUnixToDate(this.state.eventDetail.end_dt,"YYYY.MM.DD HH:mm")}`
                );
                break;
            default : 
                return (
                    `${CommonFunction.convertUnixToDate(this.state.eventDetail.start_dt,"YYYY.MM.DD HH:mm")} ~ 소진시`
                );
            break;
        }
    }

    renderEventTitle = (item) => {

        if (item.event_gubun==='TERM' ) {
            return (
                <View style={styles.iconEventterm}>
                    <View style={styles.dataLeftWrap}>
                        <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize17),color:'#222'}}>기간할인 이벤트</CustomTextR>
                        <CustomTextB style={[styles.commonTitleText,{color:'#fff',lineHeight:25}]} numberOfLines={2} ellipsizeMode={'tail'}>{item.title}</CustomTextB>
                        <CustomTextL style={CommonStyle.dataText} >
                            {this.renderEventTerm(item)}
                        </CustomTextL>
                        {
                            !CommonUtil.isEmpty(this.state.eventDetail.end_dt) &&
                            <View style={styles.timerBoxWrap}>
                                <CustomTextR style={CommonStyle.titleText}>남은시간 : </CustomTextR>
                                {this.setRealTimer(this.state.eventDetail.end_dt)}
                            </View>
                            }
                    </View>
                    <View style={styles.dataRightWrap}>
                        <NativeImage
                            source={iconEventterm}
                            resizeMode='contain'
                            style={CommonStyle.defaultIconImage70}
                        />
                    </View>
                </View>
            )

        }else if (item.event_gubun==='LIMIT' ) {
            return (
                <View style={styles.iconEventlimit}>
                    <View style={styles.dataLeftWrap}>
                        <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize17),color:'#db2364'}}>한정수량 이벤트</CustomTextR>
                        <CustomTextB style={[styles.commonTitleText,{color:'#0a2364',lineHeight:30}]} numberOfLines={2} ellipsizeMode={'tail'}>{item.title}</CustomTextB>
                        <CustomTextL style={CommonStyle.dataText} >
                            {this.renderEventTerm(item)}
                        </CustomTextL>
                    </View>
                    <View style={styles.dataRightWrap}>
                        <NativeImage
                            source={iconEventlimit}
                            resizeMode='contain'
                            style={CommonStyle.defaultIconImage70}
                        />
                    </View>
                </View>
            )
        }else {
            return (
                <View style={styles.iconEvent}>
                    <View style={styles.dataLeftWrap}>
                        <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize17),color:'#db2364'}}>할인이벤트</CustomTextR>
                        <CustomTextB style={[styles.commonTitleText,{color:'#ff313b',lineHeight:25}]} numberOfLines={2} ellipsizeMode={'tail'}>{item.title}</CustomTextB>
                        <CustomTextL style={CommonStyle.dataText} >
                            {this.renderEventTerm(item)}
                        </CustomTextL>
                    </View>
                    <View style={styles.dataRightWrap}>
                        <NativeImage
                            source={iconEvent}
                            resizeMode='contain'
                            style={CommonStyle.defaultIconImage70}
                        />
                    </View>
                </View>
            )
        }
    }
    
    setRealTimer = (item) => {
        const oneDays = 24*60*60;
        //console.log('oneDays',oneDays);
        const activeDate =  moment().unix();
        //console.log('activeDate',activeDate);
        let times = item - activeDate;
        //console.log('times',times);
        //console.log('reformat',CommonFunction.convertUnixToRestDate(times))
        if ( times < oneDays ) {
            return (
                <CountDown
                    until={times}
                    size={10}
                    onFinish={() => this.setState({isCountDown:false})}
                    isActive={this.state.isCountDown}
                    digitStyle={{backgroundColor: '#FFF',}}
                    digitTxtStyle={{color:'#545454',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12)}}
                    timeLabelStyle={{color: 'red', fontWeight: 'bold'}}
                    separatorStyle={{color: '#545454',paddingHorizontal:3}}
                    timeToShow={['H','M', 'S']}
                    timeLabels={{h:'H',m: 'M', s: 'SS'}}
                    showSeparator
                />
            )
        }else{
            return (
            <CustomTextR style={CommonStyle.dataText}>{CommonFunction.convertUnixToRestDate(times)}</CustomTextR>
            )
        }
        
    }

    render() {
        if ( this.state.loading ) {
            return (
                <ActivityIndicator animating={this.state.loading} color={DEFAULT_COLOR.base_color} />
            )
        }else {  
        return(
            <SafeAreaView style={ styles.container }>
                
                <ScrollView
                    ref={(ref) => {
                        this.ScrollView = ref;
                    }}
                    showsVerticalScrollIndicator={false}
                    indicatorStyle={'white'}
                    scrollEventThrottle={16}
                    keyboardDismissMode={'on-drag'}
                    onScroll={e => this.handleOnScroll(e)}                    
                    style={{width:'100%'}}
                >
                    <View style={styles.eventWrap2}>
                        {this.renderEventTitle(this.state.eventDetail)}
                    </View>
                    <View style={styles.eventDescWrap}>
                        <View style={[styles.defaultWrap,{backgroundColor: this.state.eventDetail.event_gubun==='TERM'?'#9fe4ba': this.state.eventDetail.event_gubun==='LIMIT'?'#dbe5ff':'#f9f4f1'}]}>
                            <View style={styles.boxWrap}>
                                <CustomTextR style={CommonStyle.titleText}>이벤트 상품</CustomTextR>
                            </View>
                        </View>

                    </View>
                    <View style={styles.eventWrap}>
                        <View style={styles.dataWarp}>
                        {
                            this.state.productArray.length === 0 ? 
                            <View style={styles.blankWrap}>
                                <CustomTextR style={styles.menuText}>상품을 준비중입니다.</CustomTextR>
                            </View>

                            :
                            this.state.productArray.map((item, index) => {  
                            return (
                                <View key={index} style={styles.dataEachWarp}>
                                    <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail(item)}>
  
                                        { !CommonUtil.isEmpty(item.thumb_img) ?
                                            <Image
                                                source={{uri:DEFAULT_CONSTANTS.defaultImageDomain+item.thumb_img}}
                                                resizeMode={"cover"}
                                                style={CommonStyle.fullWidthImage100}
                                            />
                                            :
                                            <Image
                                                source={require('../../../assets/icons/no_image.png')}
                                                resizeMode={"contain"}
                                                style={CommonStyle.defaultNoImage}
                                            />
                                        }
                                        <View style={styles.textPadding}>
                                            <CustomTextR style={CommonStyle.titleText}>{item.product_name}</CustomTextR>
                                            { 
                                            !CommonUtil.isEmpty(this.props.userToken) &&
                                            (
                                            item.event_each_price > 0 ?
                                                <TextRobotoR style={styles.menuText2}>{CommonFunction.currencyFormat(item.event_each_price)}원{"  "}<TextRobotoR style={[styles.menuText888,CommonStyle.fontStrike]}>{CommonFunction.currencyFormat(item.each_price)} 원</TextRobotoR></TextRobotoR>
                                            :
                                                <TextRobotoR style={styles.menuText2}>{CommonFunction.currencyFormat(item.each_price)}원</TextRobotoR>  
                                            )}
                                        </View>
                                         
                                        <TouchableOpacity onPress={()=>this.addEachAlert(item)} style={styles.cartIcoWrap}>
                                            <NativeImage source={ICON_CART} resizeMode={"contain"} style={styles.icon_cart_image} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={()=>this.addZzimAlert(item)} style={styles.zzimIconWrap}>
                                            <NativeImage source={ICON_ZZIM} resizeMode={"contain"} style={styles.icon_cart_image} />
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                </View>
                            )
                            })
                        } 
                        </View>
                    </View>

                    
                    <View style={[CommonStyle.blankArea,{backgroundColor:DEFAULT_COLOR.default_bg_color}]}></View>
                    { this.state.moreLoading &&
                        <View style={CommonStyle.moreWrap}>
                            <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} />
                        </View>
                    }
                </ScrollView>   
            </SafeAreaView>
        );
        }
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : "#f5f6f8"
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },

    iconEvent : {
        flex:1,
        minHeight:100,
        flexDirection:'row',     
        padding:20,
        backgroundColor:'#f9f4f1',
    },
    iconEventterm : {
        flex:1,
        minHeight:100,
        flexDirection:'row',     
        padding:20,
        backgroundColor:'#9fe4ba',
    },
    iconEventlimit : {
        flex:1,
        minHeight:100,
        flexDirection:'row',     
        padding:20,
        backgroundColor:'#dbe5ff',
    },
    dataLeftWrap : {
        flex:3,
        justifyContent:'flex-start',
    },
    dataRightWrap : {
        flex:1,     
        justifyContent:'center',
        alignItems:'center',
    },
    boxLeftWrap : {
        flex:2.5,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center'
    },
    commonTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),paddingVertical:4
    },
    eventDescWrap : {
        flex:1,borderTopWidth:1,borderTopColor:'#fff'
    },
    menuText888 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),color:'#888'
    },
    priceText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#888'
    },
    eventpriceText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)
    },
    commonTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),paddingVertical:0,
    },
    eventWrap : {
        flex:1,
        minHeight:SCREEN_HEIGHT*0.4
    },
    eventWrap2 : {
        flex:1,
    },
    defaultWrap:{
        flex:1,justifyContent:'center',paddingVertical:10
    },
    boxWrap : {
        flex:1,paddingHorizontal:20,paddingVertical:5
    },
    timerBoxWrap : {
        flex:1,flexDirection:'row'
    },
    blankWrap : {
        flex:1,paddingVertical:SCREEN_HEIGHT/4,justifyContent:'center',alignItems:'center'
    },
    dataWarp : {
        flexDirection:'row',justifyContent:'space-between',flexWrap:'wrap',paddingHorizontal:15,paddingTop:15,
    },
    dataEachWarp : {
        width:SCREEN_WIDTH/2-22,backgroundColor:'#fff',justifyContent:'center',alignItems:'center',marginBottom:15
    },
    fixedUpButton : {
        position:'absolute',bottom:80,right:20,width:50,height:50,backgroundColor:DEFAULT_COLOR.base_color,borderColor:'#ccc',borderWidth:1,borderRadius:25,alignItems:'center',justifyContent:'center',zIndex:10
    },
    boxSubWrap : {
        flex:1,
    },
    textPadding : {
        padding:10
    },
    boxLeftWrap : {
        flex:1,        
        justifyContent:'center',
        alignItems:'center'
    },
    boxRightWrap : {
        flex:5,        
        justifyContent:'center',
        alignItems:'flex-start'
    },
    menuText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingRight:10
    },
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),paddingRight:10
    },
    cartIcoWrap : {
        position:'absolute',top:SCREEN_WIDTH/3,right:10,width:30,height:30,borderRadius:20,justifyContent:'center',alignItems:'center'
    },
    zzimIconWrap : {
        position:'absolute',top:SCREEN_WIDTH/3,right:45,width:30,height:30,borderRadius:20,justifyContent:'center',alignItems:'center'
    },
    icon_cart_image : {
        width:CommonUtil.dpToSize(25*1.1),height:CommonUtil.dpToSize(25*1.1)
    },
    /**** Modal  *******/
    modalContainer: {   
        zIndex : 10,     
        position :'absolute',
        left:0,
        //top : BASE_HEIGHY,
        width:SCREEN_WIDTH,
        height: SCREEN_HEIGHT-200,
        paddingTop: 16,
        backgroundColor: '#fff'
    },
    modalTitleWrap : {
        paddingHorizontal:20,paddingVertical:Platform.OS === 'ios' ? 10 : 5,flexDirection:'row'
    },
    modalLeftWrap : {
        flex:1,justifyContent:'center'
    },
    modalRightWrap : {
        flex:1,justifyContent:'center',alignItems:'flex-end'
    },
    checkboxIcon : {
        width : PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize22),height:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize22)
    },
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)
    },
    bottomWrap : {
        height:60,justifyContent:'center',alignItems:'center',flexDirection:'row'
    },
    bottomDataWrap : {
        width:80,backgroundColor:'#e1e1e1',justifyContent:'center',alignItems:'center',padding:5,marginRight:5
    }
});

function mapStateToProps(state) {
    return {
        userToken : state.GlabalStatus.userToken,
        toggleproduct: state.GlabalStatus.toggleproduct,
        userCartCount : state.GlabalStatus.userCartCount,
    };
}
function mapDispatchToProps(dispatch) {
    return {                
        _saveUserToken:(str)=> {
            dispatch(ActionCreator.saveUserToken(str))
        },
        _saveNonUserToken:(str)=> {
            dispatch(ActionCreator.saveNonUserToken(str))
        },
        _fn_getUserCartCount : (num) => {
            dispatch(ActionCreator.fn_getUserCartCount(num))
        },
        _fn_getUserZzimCount : (num) => {
            dispatch(ActionCreator.fn_getUserZzimCount(num))
        },
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(EventProductScreen);