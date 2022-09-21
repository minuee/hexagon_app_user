import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Image,Dimensions,PixelRatio,TouchableOpacity,Alert,RefreshControl} from 'react-native';
import 'moment/locale/ko'
import  moment  from  "moment";
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import FastImage from 'react-native-fast-image';
//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonStyle from '../../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoB,TextRobotoM,TextRobotoR} from '../../Components/CustomText';
import CommonFunction from '../../Utils/CommonFunction';
import CommonUtil from '../../Utils/CommonUtil';
import Loader from '../../Utils/Loader';
import { apiObject } from "../Apis";
import CheckConnection from '../../Components/CheckConnection';
import SlideBanner2 from './SlideBanner2';
import FooterScreen from '../../Components/FooterScreen';
import PopupScreen from '../Popup/PopupScreen';
import PopupFullScreen from '../Popup/PopupFullScreen';
import CountDown from '../../Components/CountDown';


const TodayTimeStamp = moment().unix();  // 서울
const iconEvent = require('../../../assets/icons/icon_event.png');
const iconEventterm = require('../../../assets/icons/icon_eventterm.png');
const iconEventlimit = require('../../../assets/icons/icon_eventlimit.png');
const ICON_CART = require('../../../assets/icons/icon_cart.png');
const ICON_ZZIM = require('../../../assets/icons/icon_zzim.png');

class RecommScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading : false,
            moreLoading : false,
            showTopButton :false,
            modalVisible: false,
            modalVisible2: false,
            repeatmodalVisible :false,
            bannerList : [],
            myHistoryList : [],
            limitEvent : [],
            eventNews : [],
            newArraval : [],
            popularItems : [],
            popLayerList : [],
            PopFullScreenList : [],
            popLayerExpireTime : 0,
            popFullExpireTime : 0,
        }
    }
    
    getBaseData = async() => {
        let returnCode = {code:9998};
        const member_pk = !CommonUtil.isEmpty(this.props.userToken) ? this.props.userToken.member_pk : 0;
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/main/basedata/'+member_pk;
            const token = this.props.userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_getPageList(this.props,url,token,sendData);          
            //console.log('RecommScreen returnCode',returnCode.data.my_orderhistory)  
            if ( returnCode.code === '0000'  ) {
                this.setState({
                    myHistoryList : CommonUtil.isEmpty(returnCode.data.my_orderhistory) ? []: returnCode.data.my_orderhistory,
                    limitEvent :  CommonUtil.isEmpty(returnCode.data.limit_event) ? []: returnCode.data.limit_event,
                    eventNews :  CommonUtil.isEmpty(returnCode.data.event_news) ? []: returnCode.data.event_news,
                    newArraval :  CommonUtil.isEmpty(returnCode.data.new_arrivals) ? []: returnCode.data.new_arrivals,
                    popularItems :  CommonUtil.isEmpty(returnCode.data.popularproduct) ? []: returnCode.data.popularproduct,
                    popLayerList : CommonUtil.isEmpty(returnCode.data.popup_layer) ? []: returnCode.data.popup_layer,
                    PopFullScreenList : CommonUtil.isEmpty(returnCode.data.popup_full) ? []: returnCode.data.popup_full
                })
                //
                console.log('returnCode.data.bookmarklist',returnCode.data.bookmarklist)
                this.props._fn_getUserCartCount(CommonUtil.isEmpty(returnCode.data.carttotalcount)?0:returnCode.data.carttotalcount);
                this.props._fn_getUserZzimCount(CommonUtil.isEmpty(returnCode.data.zzimtotalcount)?0:returnCode.data.zzimtotalcount);
                this.props._fn_getUserOrderingCount(CommonUtil.isEmpty(returnCode.data.orderingcount)?0:returnCode.data.orderingcount);
                this.props._fn_getUserPoint(CommonUtil.isEmpty(returnCode.data.remain_reward)?0:returnCode.data.remain_reward);
                this.props._fn_getMyZzimList(CommonUtil.isEmpty(returnCode.data.bookmarklist)?[]:returnCode.data.bookmarklist)

                //console.log('TodayTimeStamp',TodayTimeStamp);
                //console.log('this.state.popLayerExpireTime',Platform.OS,this.state.popLayerExpireTime);   
                //console.log('this.state.popFullExpireTime',Platform.OS,this.state.popFullExpireTime);

                //둘다 있을때 
                if ( this.state.PopFullScreenList.length > 0 && this.state.popLayerList.length > 0 ) {
                    //풀이 가능하고 레이어도 가능
                    if ( (TodayTimeStamp > this.state.popFullExpireTime ) && (TodayTimeStamp > this.state.popLayerExpireTime  ) 
                    ) {
                        this.setState({ modalVisible2 :true,repeatmodalVisible : true})
                    //풀만 가능하고 레이어는 불가
                    }else if ( (TodayTimeStamp > this.state.popFullExpireTime ) && (TodayTimeStamp <= this.state.popLayerExpireTime  ) ) {
                        this.setState({ modalVisible2 :true})   
                    //풀은 불가 레이어느는 가능
                    }else if ( (TodayTimeStamp < this.state.popFullExpireTime ) && (TodayTimeStamp > this.state.popLayerExpireTime  ) ) {
                        this.setState({ modalVisible :true})   
                    }else{
                    }
                // 풀만 있을때 
                }else if ( this.state.PopFullScreenList.length > 0 && this.state.popLayerList.length === 0 && TodayTimeStamp > this.state.popFullExpireTime ) {
                    this.setState({ modalVisible2 :true})   
                //레이어만 있을때 
                }else if ( this.state.PopFullScreenList.length === 0 && this.state.popLayerList.length > 0 && TodayTimeStamp > this.state.popLayerExpireTime ) {
                    this.setState({ modalVisible :true})   
                }else{
                }
                
            }else{
                CommonFunction.fn_call_toast('RecommScreen 처리중 오류가 발생하였습니다.',2000);
            }

            this.setState({moreLoading:false,loading:false})
        }catch(e){
            console.log('eee',e)
            this.setState({loading:false,moreLoading : false})
        }
    }
    refreshingData = async() => {
        this.getBaseData();
    }
    async UNSAFE_componentWillMount() {
        
        const getpopFullExpireTime  = await CommonFunction.getStorageCode('popFullExpireTime');
        const getpopLayerExpireTime  = await CommonFunction.getStorageCode('popLayerExpireTime');
        this.setState({
            popFullExpireTime : !CommonUtil.isEmpty(getpopFullExpireTime) ? getpopFullExpireTime : 0 ,
            popLayerExpireTime : !CommonUtil.isEmpty(getpopLayerExpireTime) ? getpopLayerExpireTime : 0 ,
        })
        await this.getBaseData();

        this.props.navigation.addListener('focus', () => {            
            //this.getBaseData();
        })
    }

    componentDidMount() {
    }
    componentWillUnmount(){        
    }

    handleOnScroll (event) {             
        if ( event.nativeEvent.contentOffset.y >= 200 ) {
            this.setState({showTopButton : true}) 
        }else{
            this.setState({showTopButton : false}) 
         }

        let paddingToBottom = 1;
        paddingToBottom += event.nativeEvent.layoutMeasurement.height;                            
        if (event.nativeEvent.contentOffset.y + paddingToBottom >= event.nativeEvent.contentSize.height) {            
            //this.scrollEndReach();
        }
    }
    upButtonHandler = () => {        
        this.ScrollView.scrollTo({ x: 0,  animated: true });
    };

    moveDetail = (item) => {
        //console.log('recomm',item)
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

    moveDetail2 = (item) => {
        if ( item.arrival_type === 'product' ) {
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
        }else{
            this.props.navigation.navigate('ProductListStack',{
                screenData:{...item,category_pk : item.product_pk,category_name: item.product_name}
                
            })
        }
        
    }

    moveDetail3 = (item) => {
        //console.log('recomm',item)
        if ( CommonUtil.isEmpty(this.props.userToken)) {
            Alert.alert(DEFAULT_CONSTANTS.appName, '로그인이 필요합니다.\n로그인 하시겠습니까',
            [
                {text: '확인', onPress: () => CommonUtil.moveLogin(this.props)},
                {text: '취소', onPress: () => console.log('취소')},
            ]);
            
        }else{
            this.props.navigation.navigate('ProductDetailStack',{
                screenData:{product_pk : item.measure,product_name:item.measure_product_name}
            })
        }
        
    }

    moveEvent = (item) => {
        this.props.navigation.navigate('EventProductStack',{
            screenTitle:"이벤트 리스트",
            screenData:item
        })
    }
    closePopUp = async() => {
        this.setState({
            modalVisible :false,loading:false,moreLoading:false
        })
    }
    closePopUp2 = async() => {
        //console.log('this.state.repeatmodalVisible',this.state.repeatmodalVisible)
        //console.log('this.state.popLayerList',this.state.popLayerList)
        if ( this.state.repeatmodalVisible ) {
            this.setState({modalVisible2 :false,modalVisible:true})
        }else{
            this.setState({modalVisible2 :false})
        }
        
    }

    addEachAlert = (item) => {
        if ( CommonUtil.isEmpty(this.props.userToken)) {
            Alert.alert(DEFAULT_CONSTANTS.appName, '로그인이 필요합니다.\n로그인 하시겠습니까',
            [
                {text: '확인', onPress: () => CommonUtil.moveLogin(this.props)},
                {text: '취소', onPress: () => console.log('취소')},
            ]);
        }else{
            Alert.alert(DEFAULT_CONSTANTS.appName, '장바구니에서 추가하시겠습니까?',
            [
                {text: '확인', onPress: () => this.addCart(item)},
                {text: '취소', onPress: () => console.log('취소')},
            ]);
        }
    }

    addHistoryAlert = (item) => {
        if ( CommonUtil.isEmpty(this.props.userToken)) {
            Alert.alert(DEFAULT_CONSTANTS.appName, '로그인이 필요합니다.\n로그인 하시겠습니까',
            [
                {text: '확인', onPress: () => CommonUtil.moveLogin(this.props)},
                {text: '취소', onPress: () => console.log('취소')},
            ]);
        }else{
            Alert.alert(DEFAULT_CONSTANTS.appName, '장바구니에서 추가하시겠습니까?',
            [
                {text: '확인', onPress: () => this.cartInsertAgiain(item)},
                {text: '취소', onPress: () => console.log('취소')},
            ]);
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
            this.registZzim(item)
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
            //console.log('APregistZzimI_insertEachCart returnCode',returnCode)   
            if ( returnCode.code === '0000'  ) {
                let userZzimCount = CommonUtil.isEmpty(returnCode.totalCount) ? 0 : returnCode.totalCount ;
                this.props._fn_getUserZzimCount(userZzimCount);
                CommonFunction.fn_call_toast('찜리스트에 추가되었습니다',2000);
            }else{
                CommonFunction.fn_call_toast('오류가 발생하였111습니다, 잠시후 다시 이용해주세요',2000);
            }
            this.setState({moreLoading:false})
        }catch(e){
            console.log('e',e)   
            CommonFunction.fn_call_toast('오류가 발생하였습니다, 잠시후 다시 이용해주세요',2000);
            this.setState({moreLoading:false})
        }  
    }

    cartInsertAgiain = async(item) => {
        const member_pk  = this.props.userToken.member_pk;
        const product_pk = item.product_pk;
        let cart_array = [];
        item.product_info[0].child.forEach((item) => {
            cart_array.push({
                member_pk : member_pk,
                product_pk : product_pk,
                quantity : item.quantity,
                unit_type : item.unit_type
            })
        })
        if ( cart_array.length > 0 ) {
            this.setState({moreLoading:true,loading:true})
            let returnCode = {code:9998};     
            try {            
                const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/order/cart/clone';
                const token = this.props.userToken.apiToken;
                let sendData = {
                    member_pk : this.props.userToken.member_pk,
                    cart_array :  cart_array
                } 
                returnCode = await apiObject.API_registCommon(this.props,url,token,sendData);
                if ( returnCode.code === '0000'  ) {
                    let userCartCount = CommonUtil.isEmpty(returnCode.data.totalCount) ? 0 : returnCode.data.totalCount ;
                    this.props._fn_getUserCartCount(userCartCount);
                    CommonFunction.fn_call_toast('장바구니에 추가되었습니다.',2000);
                }else{
                    CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.\n[ERR]' + returnCode.msg ,2000);
                }
                this.setState({moreLoading:false,loading:false})
            }catch(e){
                console.log('eeee',e) 
                this.setState({loading:false,moreLoading : false})
            }
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
            //console.log('API_insertEachCart returnCode',returnCode)   
            if ( returnCode.code === '0000'  ) {
                let userCartCount = CommonUtil.isEmpty(returnCode.data.totalCount) ? 0 : returnCode.data.totalCount ;
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

    
    setRealTimer = (item ) => {
        const oneDays = 24*60*60;
        const activeDate =  moment().unix();
        let times = item.end_dt - activeDate;
        //console.log('reformat',CommonFunction.convertUnixToRestDate(times))
        if ( times < oneDays ) {
            return (
                <CountDown
                    until={times}
                    size={10}
                    onFinish={() => this.setState({isCountDown:false})}
                    isActive={true}
                    digitStyle={{backgroundColor: 'transparent',padding:0,margin:0}}
                    digitTxtStyle={{color: '#fff'}}
                    timeLabelStyle={{color: 'red', fontWeight: 'bold'}}
                    separatorStyle={{color: '#fff',padding:0,margin:0}}
                    timeToShow={['H','M','S']}
                    timeLabels={{h:'H',m:'M',s:'SS'}}
                    showSeparator
                    addSubTitle={'남음'}
                />
            )
        }else{
            return (
            <CustomTextR style={styles.menuTextWhite}>{CommonFunction.convertUnixToRestDate(times)} 남음</CustomTextR>
            )
        }
        
    }

    renderEventTerm = (data) => {
        switch(data.event_gubun) {
            case 'TERM' : 
                return (
                    `${CommonFunction.convertUnixToDate(data.start_dt,"YYYY.MM.DD")} ~ ${CommonFunction.convertUnixToDate(data.end_dt,"YYYY.MM.DD")}`
                );
                break;
            default : 
                return (
                    `${CommonFunction.convertUnixToDate(data.start_dt,"YYYY.MM.DD")} ~`
                );
            break;
        }
    }

    registAlarm = (item) => {
        if ( CommonUtil.isEmpty(this.props.userToken)) {
            Alert.alert(DEFAULT_CONSTANTS.appName, '로그인이 필요합니다.\n로그인 하시겠습니까',
            [
                {text: '확인', onPress: () => CommonUtil.moveLogin(this.props)},
                {text: '취소', onPress: () => console.log('취소')},
            ]);
            
        }else{
            Alert.alert(DEFAULT_CONSTANTS.appName, '입고시 알림을 받으시겠습니까?',
            [
                {text: '확인', onPress: () => this.actionRegistAlarm(item)},
                {text: '취소', onPress: () => console.log('취소')},
            ]);
        }
    }
   
    actionRegistAlarm = async (item) => {
        await this.setState({moreLoading:true})
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/member/addalarm';
            const token = this.props.userToken.apiToken;
            let sendData = {
                member_pk : this.props.userToken.member_pk,
                product_pk : item.product_pk
            };
            returnCode = await apiObject.API_registCommon(this.props,url,token,sendData);
            if ( returnCode.code === '0000'  ) {                
                CommonFunction.fn_call_toast('알림리스트에 추가되었습니다',2000);
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
    renderIcons = (idx, item ) => {
        if ( !item.is_soldout ) {
            <>
                <TouchableOpacity onPress={()=>this.addEachAlert(item)} style={styles.cartIcoWrap2}>
                    <Image source={ICON_CART} resizeMode={"contain"} style={styles.icon_cart_image}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.addZzimAlert(item)} style={styles.zzimIconWrap2}>
                    <Image source={ICON_ZZIM} resizeMode={"contain"} style={styles.icon_cart_image} />
                </TouchableOpacity>
            </>
        }else{
            if ( item.measure ) {
                return (
                    <View style={styles.renderIconWrap}>
                        <View style={styles.renderIconDataWrap}>
                            <CustomTextB style={styles.menuTextWhite}>일시품절</CustomTextB>  
                        </View>
                        
                        <View style={styles.renderIconTitleWrap}>
                            <TouchableOpacity style={styles.renderIconData} onPress={()=>this.registAlarm(item)}>
                                <Icon name="bells" size={CommonUtil.dpToSize(13)} color="#fff" />
                                <CustomTextB style={styles.menuTextWhite}>{"  "}입고알림</CustomTextB>  
                            </TouchableOpacity>
                        </View>
                        <View style={styles.renderIconDataWrap}>
                            <TouchableOpacity style={styles.renderIconData} onPress={()=>this.moveDetail3(item)}>
                                <Icon name="sync" size={CommonUtil.dpToSize(13)} color="#fff" />
                                <CustomTextB style={styles.menuTextWhite}>{"  "}대체상품</CustomTextB>  
                            </TouchableOpacity>
                        </View>
                    </View>
                )  
            }else{
                return (
                    <View style={styles.renderIconWrap}>
                        <View style={styles.renderIconTitleWrap}>
                            <CustomTextB style={styles.menuTextWhite}>일시품절</CustomTextB>  
                        </View>
                        
                        <View style={styles.renderIconDataWrap}>
                            <TouchableOpacity style={styles.renderIconData} onPress={()=>this.registAlarm(item)}>
                                <Icon name="bells" size={CommonUtil.dpToSize(13)} color="#fff" />
                                <CustomTextB style={styles.menuTextWhite}>{"  "}입고알림</CustomTextB>  
                            </TouchableOpacity>
                        </View>
                    </View>
                )  
            }
                     
        }     
        
    }

    renderIcons2 = (idx, item ) => {
        return (
            <>
            <TouchableOpacity onPress={()=>this.addEachAlert(item)} style={styles.cartIcoWrap}>
                <Image source={ICON_CART} resizeMode={"contain"} style={styles.icon_cart_image}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>this.addZzimAlert(item)} style={styles.zzimIconWrap}>
                <Image source={ICON_ZZIM} resizeMode={"contain"} style={styles.icon_cart_image} />
            </TouchableOpacity>
            </>
        )                
        
    }

    renderEventData = async(item,index) => {
        
    }

    renderPriceInfo = (item) => {
        if ( !CommonUtil.isEmpty(this.props.userToken) ) {
            if (item.event_each_price > 0  ) {
                return (
                    <TextRobotoR>
                        <TextRobotoB style={styles.eventpriceText}>{CommonFunction.currencyFormat(item.event_each_price)}</TextRobotoB>
                        <CustomTextR style={CommonStyle.dataText}>{"원  "}</CustomTextR>
                        <TextRobotoR style={[styles.priceText,CommonStyle.fontStrike]}>{CommonFunction.currencyFormat(item.each_price)}{"원"}</TextRobotoR>
                    </TextRobotoR>
                )
            }else{
                return (
                    <TextRobotoB style={styles.eventpriceText}>{CommonFunction.currencyFormat(item.each_price)}
                    <CustomTextR style={CommonStyle.dataText}>{"원"}</CustomTextR></TextRobotoB>  
                )
            }
        }else{
            return null
        }
    }
    render() {
    
        if ( this.state.loading ) {
            return (
                <Loader screenState={{isLoading:this.state.loading,color:'#ff0000'}} /> 
            )
        }else {  
            
            const popularItems = this.state.popularItems.length > 0 ? this.state.popularItems  : this.state.newArraval.filter((info) => info.arrival_type === 'product');
            
            return(
                <SafeAreaView style={ styles.container }>
                    <CheckConnection />
                    { 
                        this.state.showTopButton &&
                        <TouchableOpacity 
                            style={styles.fixedUpButton3}
                            onPress={e => this.upButtonHandler()}
                        >
                            <Icon name="up" size={25} color="#000" />
                        </TouchableOpacity>
                    }
                    { 
                        (this.state.popLayerList.length > 0 && this.state.modalVisible) &&
                        <PopupScreen 
                            isVisible={this.state.modalVisible}
                            screenState={{closePopUp:this.closePopUp.bind(this),popLayerList:this.state.popLayerList}}
                            screenProps={this.props}
                        /> 
                    }
                    {
                        (this.state.PopFullScreenList.length > 0 && this.state.modalVisible2 ) &&
                        <PopupFullScreen 
                            isVisible={this.state.modalVisible2}
                            screenState={{closePopUp:this.closePopUp2.bind(this),popLayerList:this.state.PopFullScreenList}}
                            screenProps={this.props}
                        /> 
                    }
                   
                    <ScrollView
                        ref={(ref) => {
                            this.ScrollView = ref;
                        }}
                        showsVerticalScrollIndicator={false}
                        indicatorStyle={'white'}
                        scrollEventThrottle={16}
                        keyboardDismissMode={'on-drag'}
                        style={{width:'100%'}}
                        //onScroll={e => this.handleOnScroll(e)}
                        refreshControl={
                            <RefreshControl
                              refreshing={this.state.moreLoading}
                              onRefresh={this.refreshingData}
                            />
                        }
                    >
                    <View style={styles.bannerWrapper}>
                        <SlideBanner2 screenProps={this.props} />
                    </View>
                    {this.state.myHistoryList.length > 0 &&
                    <View style={styles.mainWrap}>
                        <CustomTextB style={styles.mainTitle}>{this.props.userToken.name}님의 구매이력</CustomTextB>
                        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{marginTop:20}}>
                            <View style={styles.dataWarp}>
                            {
                                this.state.myHistoryList.map((item, index) => {  
                                return (
                                    <View key={index} style={styles.dataEachWarp}>
                                        <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail(item)}>
                                            <View style={styles.thumbWrap}>
                                                { !CommonUtil.isEmpty(item.thumb_img) ?
                                                    <Image
                                                        source={{uri:DEFAULT_CONSTANTS.defaultImageDomain+item.thumb_img}}
                                                        resizeMode={"cover"}
                                                        style={{width:'100%',height:SCREEN_WIDTH/3}}
                                                    />
                                                    :
                                                    <Image
                                                        source={require('../../../assets/icons/no_image.png')}
                                                        resizeMode={"cover"}
                                                        style={{width:SCREEN_WIDTH/3,height:SCREEN_WIDTH/3}}
                                                    />
                                                }
                                                {this.renderIcons2(index,item)}
                                            </View>
                                            <View style={{padding:10}}>
                                                {item.product_count > 1 ?
                                                <CustomTextL style={styles.menuText} numberOfLines={2} ellipsizeMode={'tail'}>
                                                    {item.product_name}외 {item.product_count-1}건
                                                </CustomTextL>
                                                :
                                                <CustomTextL style={styles.menuText} numberOfLines={2} ellipsizeMode={'tail'}>
                                                    {item.product_name}
                                                </CustomTextL>
                                                }
                                                <View style={styles.textPadding}>
                                                    <TextRobotoR style={styles.menuText}>{CommonFunction.convertUnixToDate(item.reg_dt,"YYYY.MM.DD")}</TextRobotoR>
                                                </View>
                                                <View style={styles.textPadding}>
                                                    <TextRobotoR style={styles.menuText}>{CommonFunction.currencyFormat(item.total_amount)}<CustomTextR style={CommonStyle.menuText}>{"원"}</CustomTextR></TextRobotoR>
                                                </View>
                                           
                                            </View>
                                            
                                        </TouchableOpacity>
                                    </View>
                                )
                                })
                            } 
                            </View>  
                        </ScrollView>   
                    </View>
                    }
                    {this.state.limitEvent.length > 0 &&
                    <View style={[styles.mainWrap,{backgroundColor:'#fff'}]}>
                        <CustomTextB style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),color:'#000'}}>한정특가</CustomTextB>
                        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{marginTop:20}}>
                            <View style={styles.dataWarp}>
                            {
                            this.state.limitEvent.map((item, index) => {
                                if ( !CommonUtil.isEmpty(item.event_img) ) {
                                    return (
                                        <TouchableOpacity key={index} style={styles.dataLimitWarp}  onPress={()=>this.moveDetail(item)}>
                                            <FastImage
                                                source={{uri:DEFAULT_CONSTANTS.defaultImageDomain+item.event_img}}
                                                resizeMode={FastImage.resizeMode.cover}
                                                style={{width:SCREEN_WIDTH*0.8,minHeight:120}}
                                            />
                                        </TouchableOpacity>
                                    )
                                }else{
                                    return (
                                        <TouchableOpacity key={index} onPress={()=>this.moveDetail(item)}>
                                            <View style={styles.dataLimitWarp}>
                                                <View style={styles.iconEventlimitImage}>
                                                    <View style={styles.thumbWrap}>
                                                        { !CommonUtil.isEmpty(item.thumb_img) ?
                                                            <Image
                                                                source={{uri:DEFAULT_CONSTANTS.defaultImageDomain+item.thumb_img}}
                                                                resizeMode={'stretch'}
                                                                style={{width:SCREEN_WIDTH/3,height:SCREEN_WIDTH/3}}
                                                            />
                                                            :
                                                            <Image
                                                                source={require('../../../assets/icons/no_image.png')}
                                                                resizeMode={"contain"}
                                                                style={{width:SCREEN_WIDTH/3,height:SCREEN_WIDTH/3}}
                                                            />
                                                        }
                                                    </View>
                                                </View>
                                                <View style={styles.iconEventlimit2} >
                                                    <View style={styles.dataLeftWrap2}>
                                                        <CustomTextR style={[CommonStyle.dataText15,{color:'#db2364'}]}>한정특가 이벤트</CustomTextR>
                                                        <CustomTextL style={CommonStyle.dataText} >
                                                            {this.renderEventTerm(item)}
                                                        </CustomTextL>
                                                    </View>
                                                    <TouchableOpacity onPress={()=>this.addEachAlert(item)} style={styles.cartIcoWrap2}>
                                                        <Image source={ICON_CART} resizeMode={"contain"} style={styles.icon_cart_image}/>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={()=>this.addZzimAlert(item)} style={styles.zzimIconWrap}>
                                                        <Image source={ICON_ZZIM} resizeMode={"contain"} style={styles.icon_cart_image} />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                            <View style={{paddingVertical:10,justifyContent:'center'}}>
                                                <CustomTextR style={[styles.menuText,{color:'#888'}]} numberOfLines={2} ellipsizeMode={'tail'}>
                                                        [{item.category_name}]<CustomTextR style={[CommonStyle.titleText15,{color:'#000',lineHeight:20}]}>{item.product_name}</CustomTextR>
                                                </CustomTextR>
                                                {!CommonUtil.isEmpty(this.props.userToken) &&
                                                <View style={{paddingVertical:5,flexDirection:'row'}}>
                                                    <View style={{flex:3,paddingLeft:15}}>
                                                        {this.renderPriceInfo(item)}
                                                    </View>
                                                    <View style={{flex:1}}>
                                                        { 
                                                        ( item.event_each_price > 0 && item.each_price ) &&
                                                        <TextRobotoR style={styles.salesText2}>
                                                            {Math.round(100-(item.event_each_price /item.each_price*100))}%
                                                        </TextRobotoR>
                                                        }
                                                    </View>
                                                </View>
                                                }                                            
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                })
                            } 
                            </View>  
                        </ScrollView>   
                    </View>
                    }   
                  
                    {this.state.eventNews.length > 0 &&
                    <View style={styles.mainWrap}>
                        <CustomTextB style={styles.mainTitle}>이벤트</CustomTextB> 
                        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{marginTop:20}}>
                            <View style={styles.dataWarp}>
                            {
                            this.state.eventNews.map((item, index) => {
                                if ( !CommonUtil.isEmpty(item.event_img) ) {
                                    return (
                                        <TouchableOpacity 
                                            key={index} 
                                            style={styles.eventImageWrap}
                                            onPress={()=>this.moveEvent(item)}
                                        >
                                            <FastImage
                                                source={{uri:DEFAULT_CONSTANTS.defaultImageDomain+item.event_img}}
                                                resizeMode={FastImage.resizeMode.contain}
                                                style={{width:SCREEN_WIDTH*0.8,minHeight:120}}
                                            />
                                        </TouchableOpacity>
                                    )
                                }else{
                                    return (
                                        <TouchableOpacity key={index} style={ item.event_gubun === 'LIMIT' ? styles.dataLimitWarp : item.event_gubun === 'TERM' ? styles.dataTermWarp : styles.dataEventWarp} onPress={()=>this.moveEvent(item)}>
                                            { ( item.event_gubun === 'TERM'  &&  item.end_dt > 0 )&&
                                                <View style={styles.timerWrap2}>
                                                    {this.setRealTimer(item)}
                                                </View>
                                            }
                                            <View style={styles.iconEventlimitImage}>
                                                <Image
                                                    source={ item.event_gubun === 'LIMIT' ? iconEventlimit : item.event_gubun === 'TERM' ? iconEventterm : iconEvent}
                                                    resizeMode={"contain"}
                                                    style={CommonStyle.defaultIconImage70}
                                                />
                                            </View>
                                            <View style={ item.event_gubun === 'LIMIT' ? styles.iconEventlimit : item.event_gubun === 'TERM' ? styles.iconEventterm : styles.iconEvent} >
                                                <View style={styles.dataLeftWrap}>
                                                    { 
                                                    item.event_gubun === 'LIMIT' ?
                                                        <CustomTextR style={[CommonStyle.dataText15,{color:'#db2364',lineHeight:20}]}>한정특가 이벤트</CustomTextR>
                                                    :
                                                    item.event_gubun === 'TERM' ?
                                                        <CustomTextR style={[CommonStyle.titleText,{color:'#222',lineHeight:20}]} >기간할인 이벤트</CustomTextR>
                                                    :
                                                        <CustomTextR style={[CommonStyle.titleText,{color:'#444',lineHeight:20}]}>할인이벤트</CustomTextR>
                                                    }
                                                    <CustomTextB style={[styles.commonTitleText,{lineHeight:25,color: item.event_gubun === 'LIMIT' ?  '#0a2364' : item.event_gubun === 'TERM' ? '#0a2364' : '#ff313b'}]} numberOfLines={2} ellipsizeMode={'tail'}>{item.event_title}</CustomTextB>
                                                    <CustomTextL style={CommonStyle.dataText} >
                                                        {this.renderEventTerm(item)}
                                                    </CustomTextL>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                })
                            } 
                            </View>  
                        </ScrollView> 
                    </View>
                    }
                    <View style={[styles.mainWrap,{flex:1,backgroundColor:'#fff'}]}>
                        <CustomTextB style={styles.mainTitle}>신제품 {"&"} 브랜드</CustomTextB> 
                        <ScrollView 
                            showsHorizontalScrollIndicator={true} 
                            nestedScrollEnabled={true} 
                            horizontal={true} 
                            style={{marginTop:20}}  
                            contentContainerStyle={{flexGrow:1}}
                        >
                            <View style={[styles.dataWarp,{flex:1,flexGrow:1}]}>
                            {
                            this.state.newArraval.map((item, index) => {  
                            return (
                                <View key={index} style={styles.dataEachWarp2}>
                                    <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail2(item)}>
                                        <View style={styles.thumbWrap2}>
                                            { !CommonUtil.isEmpty(item.thumb_img) ?
                                                <Image
                                                    source={{uri:DEFAULT_CONSTANTS.defaultImageDomain+item.thumb_img}}
                                                    resizeMode={"contain"}
                                                    style={{width:SCREEN_WIDTH/3,height:SCREEN_WIDTH/3}}
                                                />
                                                :
                                                <Image
                                                    source={require('../../../assets/icons/no_image.png')}
                                                    resizeMode={"cover"}
                                                    style={{width:SCREEN_WIDTH/3,height:SCREEN_WIDTH/3}}
                                                />
                                            }
                                            {item.arrival_type === 'product' &&
                                                this.renderIcons(index,item)
                                            }
                                        </View>
                                        <View style={{padding:10}}>
                                            <CustomTextR style={[styles.menuText,{lineHeight:20}]} numberOfLines={2} ellipsizeMode={'tail'}>
                                                {item.arrival_type == 'product' ? item.product_name : '[브랜드]'+item.product_name}
                                            </CustomTextR>
                                            { ( item.arrival_type === 'product' && !CommonUtil.isEmpty(this.props.userToken) ) && this.renderPriceInfo(item)}
                                        </View>
                                        { (item.each_price > 0  && item.event_each_price > 0  && !CommonUtil.isEmpty(this.props.userToken) ) &&
                                        <View style={styles.salseWrap}>
                                            <TextRobotoR style={styles.salesText}>
                                                {Math.round(100-(item.event_each_price /item.each_price*100))}%
                                            </TextRobotoR>
                                        </View>
                                        } 
                                    </TouchableOpacity>
                                </View>
                                )
                                })
                            }
                            </View>  
                        </ScrollView> 
                    </View>
                    {popularItems.length > 0 && 
                    <View style={styles.mainWrap}>
                        <CustomTextB style={styles.mainTitle}>인기판매순위
                        </CustomTextB> 
                        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{marginTop:20}}>
                            <View style={styles.dataWarp}>
                            {
                            popularItems.map((item, index) => {  
                            return (
                                <View key={index} style={styles.dataEachWarp2}>
                                    <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail(item)}>
                                        <View style={styles.thumbWrap2}>
                                            { !CommonUtil.isEmpty(item.thumb_img) ?
                                                <Image
                                                    source={{uri:DEFAULT_CONSTANTS.defaultImageDomain+item.thumb_img}}
                                                    resizeMode={"cover"}
                                                    style={{width:'100%',height:SCREEN_WIDTH/2-40}}
                                                />
                                                :
                                                <Image
                                                    source={require('../../../assets/icons/no_image.png')}
                                                    resizeMode={"cover"}
                                                    style={{width:SCREEN_WIDTH/2-40,height:SCREEN_WIDTH/2-40}}
                                                />
                                            }
                                            {this.renderIcons(index,item)}
                                        </View>
                                        <View style={{padding:10}}>
                                            <CustomTextR style={[styles.menuText,{lineHeight:20}]} numberOfLines={1} ellipsizeMode={'tail'}>
                                                {item.product_name}
                                            </CustomTextR>
                                            { 
                                            !CommonUtil.isEmpty(this.props.userToken) && 
                                                this.renderPriceInfo(item)
                                            }
                                        </View>
                                        <View style={styles.rankWrap}>
                                            <TextRobotoR style={styles.salesText}>BEST {index+1}</TextRobotoR>
                                        </View>                                          
                                    </TouchableOpacity>
                                </View>
                                )
                                })
                            } 
                            </View>  
                        </ScrollView> 
                    </View>
                    }                    
                    <FooterScreen contentHeight={0} screenProps={this.props} /> 
                    <View style={[CommonStyle.blankArea,{backgroundColor:DEFAULT_COLOR.base_background_color}]}></View>
                    { 
                        this.state.moreLoading &&
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
    },
    fixedUpButton : {
        position:'absolute',bottom:20,left:20,width:50,height:50,backgroundColor:DEFAULT_COLOR.base_color,borderColor:'#ccc',borderWidth:1,borderRadius:25,alignItems:'center',justifyContent:'center',zIndex:10
    },
    fixedUpButton2 : {
        position:'absolute',bottom:20,left:80,width:50,height:50,backgroundColor:DEFAULT_COLOR.base_color,borderColor:'#ccc',borderWidth:1,borderRadius:25,alignItems:'center',justifyContent:'center',zIndex:10
    },
    fixedUpButton3 : {
        position:'absolute',bottom:20,right:20,width:50,height:50,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',zIndex:3,borderColor:'#ccc',borderWidth:1,borderRadius:25,opacity:0.5
    },
    IndicatorContainer : {flex: 1,width:'100%',backgroundColor : "#fff",textAlign: 'center',alignItems: 'center',justifyContent: 'center',
    },
    timerWrap : {
        position:'absolute',left:10,top:10,padding:2,backgroundColor:'#555',zIndex:10,alignItems:'center',justifyContent:'center'
    },
    timerWrap2 : {
        position:'absolute',left:5,top:5,padding:2,backgroundColor:'#000',zIndex:10,alignItems:'center',justifyContent:'center',opacity:0.5
    },
    mainTitle : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),color:'#000'
    },
    bannerWrapper : {
        flex:1,minHeight:SCREEN_WIDTH/4*3
    },
    mainWrap : {        
        padding:20
    },
    dataWarp : {
        flex:1,flexDirection:'row'
    },
    dataEachWarp : {
        minWidth:SCREEN_WIDTH/3+10,maxWidth:SCREEN_WIDTH/3+10,backgroundColor:'#fff',justifyContent:'center',alignItems:'center',marginRight:10,borderWidth:0.5,borderColor:DEFAULT_COLOR.input_border_color
    },
    dataEachWarp2 : {
        minWidth:SCREEN_WIDTH/2-40,maxWidth:SCREEN_WIDTH/2-40,backgroundColor:'#fff',justifyContent:'center',alignItems:'center',marginRight:10,borderWidth:0.5,borderColor:DEFAULT_COLOR.input_border_color
    },
    dataLimitWarp : {
        minHeight:120,marginRight:10,borderWidth:0.5,borderColor:'#dbe5ff',backgroundColor:'#dbe5ff',flexDirection:'row'
    },
    dataEventWarp : {
        minHeight:120,marginRight:10,borderWidth:0.5,borderColor:'#dbe5ff',backgroundColor:'#f9f4f1',flexDirection:'row'
    },
    dataTermWarp : {
        minHeight:120,marginRight:10,borderWidth:0.5,borderColor:'#dbe5ff',backgroundColor:'#9fe4ba',flexDirection:'row'
    },
    textPadding : {
       paddingTop:5
    },
    boxSubWrap : {
        flex:1
    },
    eventImageWrap : {
        marginRight : 10
    },
    renderIconWrap : {
        position:'absolute',left:0,bottom:0,width:'100%',height:'100%',backgroundColor:'#333',opacity:0.6,zIndex:5,flex:1
    },
    renderIconTitleWrap : {
        flex:1,opacity:1,justifyContent:'center',alignItems:'center'
    },
    renderIconDataWrap : {
        flex:1,flexDirection:'row',opacity:1,backgroundColor:'#000',justifyContent:'center',alignItems:'center'
    },
    renderIconData : {
        flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'
    },
    icon_cart_image : {
        width:CommonUtil.dpToSize(25*1.2),height:CommonUtil.dpToSize(25*1.2)
    },
    thumbWrap : {
        alignItems:'center',justifyContent:'center',minWidth:SCREEN_WIDTH/3
    },
    thumbWrap2 : {
        alignItems:'center',justifyContent:'center',minWidth:SCREEN_WIDTH/2-40
    },
    iconEventlimitImage : {
        flex:1.5,justifyContent:'center',alignItems:'center'
    },
    dataLeftWrap : {
        flex:3,paddingHorizontal:10,paddingTop:10,justifyContent:'center',alignItems:'flex-start',minWidth:150
    },
    dataLeftWrap2 : {
        flex:1,paddingHorizontal:10,justifyContent:'flex-start',
    },
    iconEventlimit : {
        flex:1,minHeight:100,flexDirection:'row',paddingHorizontal:10,backgroundColor:'#dbe5ff',
    },
    iconEventlimit2 : {
        flex:2,minHeight:100,flexDirection:'row',paddingHorizontal:10,paddingTop:10,backgroundColor:'#dbe5ff',
    },
    eventBoxSubWrap : {
        flex:1,paddingHorizontal:0,paddingVertical: 15,justifyContent:'flex-end'
    },
    boxLeftWrap : {
        flex:1,justifyContent:'center',alignItems:'center'
    },
    boxRightWrap : {
        flex:5,justifyContent:'center',alignItems:'flex-start'
    },
    menuText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11)
    },
    menuText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)
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
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),paddingVertical:0,backgroundColor:'#ff0000'
    },
    menuTextWhite : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#fff'
    },
    menuTextWhiteSmall : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize10),color:'#fff'
    },
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),paddingRight:10
    },
    cartIcoWrap : {
        position:'absolute',top:SCREEN_WIDTH/3-35,right:10,width:30,height:30,borderRadius:15,justifyContent:'center',alignItems:'center'
    },
    cartIcoWrap2 : {
        position:'absolute',top:SCREEN_WIDTH/2-80,right:5,width:30,height:30,borderRadius:15,justifyContent:'center',alignItems:'center'
    },
    zzimIconWrap : {
        position:'absolute',top:SCREEN_WIDTH/3-35,right:45,width:30,height:30,borderRadius:15,justifyContent:'center',alignItems:'center'
    },
    zzimIconWrap2 : {
        position:'absolute',top:SCREEN_WIDTH/2-80,right:45,width:30,height:30,borderRadius:15,justifyContent:'center',alignItems:'center'
    },
    salseWrap : {
        position:'absolute',top:0,left:0,width:45,height:25,justifyContent:'center',alignItems:'center',backgroundColor:'#0059a9',
    },
    rankWrap : {
        position:'absolute',top:0,left:0,width:50,height:25,justifyContent:'center',alignItems:'center',backgroundColor:'#0059a9',borderBottomRightRadius:10
    },
    rankWrap2 : {
        position:'absolute',top:0,left:0,width:50,height:25,justifyContent:'center',alignItems:'center',backgroundColor:'#ff5b63',borderBottomRightRadius:10,zIndex:10
    },
    salesText:{
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),color:'#fff'
    },
    salesText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#0059a9'
    }
});

function mapStateToProps(state) {
    return {
        userToken : state.GlabalStatus.userToken,
        userCartCount : state.GlabalStatus.userCartCount,
        userOrderingCount : state.GlabalStatus.userOrderingCount
    };
}

function mapDispatchToProps(dispatch) {
    return {        
        _saveUserToken:(str)=> {
            dispatch(ActionCreator.saveUserToken(str))
        },
        _saveNonUserToken:(str) => {
            dispatch(ActionCreator.saveNonUserToken(str))
        },
        _fn_getUserCartCount : (num) => {
            dispatch(ActionCreator.fn_getUserCartCount(num))
        },
        _fn_getUserZzimCount : (num) => {
            dispatch(ActionCreator.fn_getUserZzimCount(num))
        },
        _fn_getMyZzimList : (arr) => {
            dispatch(ActionCreator.fn_getMyZzimList(arr))
        },
        _fn_getUserOrderingCount : (num) => {
            dispatch(ActionCreator.fn_getUserOrderingCount(num))
        },
        _fn_getUserPoint : (num) => {
            dispatch(ActionCreator.fn_getUserPoint(num))
        },
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(RecommScreen);