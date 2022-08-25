import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Alert,Dimensions,Linking, PixelRatio,Image,TouchableOpacity,TextInput,Animated,BackHandler,Platform} from 'react-native';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import Icon2 from 'react-native-vector-icons/AntDesign';
Icon2.loadFont();
import Icon from 'react-native-vector-icons/MaterialIcons'
Icon.loadFont();
import 'moment/locale/ko'
import  moment  from  "moment";
import Modal from 'react-native-modal';
import {Overlay,CheckBox,Tooltip} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonStyle from '../../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoB,TextRobotoM,TextRobotoR,DropBoxIcon,DropBoxIconSmall, TextRobotoL} from '../../Components/CustomText';
import Loader from '../../Utils/Loader';
import CommonUtil from '../../Utils/CommonUtil';
import CommonFunction from '../../Utils/CommonFunction';
import { apiObject } from "../Apis";


import FooterScreen from '../../Components/FooterScreen2';
import ToggleBox from '../../Utils/ToggleBox';
import PopLayerAddress from './PopLayerAddress';
import PopLayerCoupon from './PopLayerCoupon';
import UseYakwanScreen from '../Tabs04/UseYakwanScreen';
import SelectType from "../../Utils/SelectType";

const CHECKNOX_OFF = require('../../../assets/icons/checkbox_off.png');
const CHECKNOX_ON = require('../../../assets/icons/checkbox_on.png');
const RADIOON_OFF = require('../../../assets/icons/check_off.png');
const RADIOON_ON = require('../../../assets/icons/check_on.png');
const alertContents = 
(<View style={{flex:1,marginTop:10}}>
    <View style={{paddingTop:20}}>
        <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),color:'#494949'}}>
            {DEFAULT_CONSTANTS.CompanyInfoTel}
        </CustomTextR>        
    </View>                        
</View>);
const maxDateVbank =  moment().add(2, 'd').format('YYYYMMDD');
const mockData2  = [
    {id : 1, name  : '신용카드' , code : 'card' },
    {id : 2, name  : '휴대폰' , code : 'phone' },
    {id : 3, name  : '무통장 입금', code : 'vbank' }
]
const mockData3  = [
    {id : 1, name  : DEFAULT_CONSTANTS.return_CashTitle,code:'Cash'},
    {id : 2, name  : DEFAULT_CONSTANTS.return_ProductTitle,code:'Product'},
]

class OrderDetailScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            showTopButton : false,
            isSettleComplete : false,
            showModal :false,
            showModal2 :false,
            showCouponModal :false,
            bankArray : [],
            agreeCheck : false,
            openTab1 :false,
            isOpen05 : true,
            isAllUse : false,
            cartList : [],
            selectedArray : [],
            selectedTotalAmount : 0,
            selectedTotalDiscount : 0,
            selectedRewardAmount : 0,
            userRate : 0,
            selectedDeliveryAmount : 0,
            seletedSettleAmount : 0,
            isCanNotUsePoint : false,
            canUsePount : 0,
            formUsePoint : 0,
            formUseCoupon : 0,
            useCouponData : {},
            useCouponIdx : 0,
            memberidx : 0,
            productInfo : [],
            formUserEmail : null,
            formUserMemo : '',
            formUserName : '',
            formUserPhone : null,
            formSalesManCode : null,
            formSalesManName : null,
            TextUserCode : null,
            settleMethode : '',
            refundMethode : '',
            formAccountName : '',
            formRefundAccount : "",
            formRefundAccountName : "",
            formRefundBankCode:null,
            formRefundBankName:null,
            formAddressPk:0,
            formAddressData:null,
            iamPortTokenKey : null,
            couponList : [],
            pointList :[],
            deliveryList : [],
            
            //poplayer
            popLayerView : false,
            _closepopLayer : this._closepopLayer.bind(this),
            _closeCouponModal: this._closeCouponModal.bind(this),
        }
    }

    clickCancle = () => {
        this.setState({popLayerView : false})
    }
    showPopLayer = async() => {
        this.setState({popLayerView : true})
    } 
    _closepopLayer = ( data = null ) => {
        if ( CommonUtil.isEmpty(data)) {
            this.setState({popLayerView : false})
        }else{
            let addressArr = this.state.deliveryList;   
            this.setState({
                deliveryList : addressArr.concat(data),
                popLayerView : false
            })
        }
    } 
    getBaseData = async(member_pk) => {
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/order/memberinfo/' + member_pk ;
            const token = this.props.userToken.apiToken;
            returnCode = await apiObject.API_getDetailDefault(this.props,url,token);      
            if ( returnCode.code === '0000'  ) {
                let userDeliveryData = [];
                if ( !CommonUtil.isEmpty(returnCode.data.userDetail.delivery)) {
                    userDeliveryData = returnCode.data.userDetail.delivery[0];
                }
                this.setState({
                    memberidx : member_pk,
                    canUsePount : returnCode.data.userDetail.remain_point,
                    formUserName : returnCode.data.userDetail.name,
                    formUserPhone : CommonFunction.fn_dataDecode(returnCode.data.userDetail.phone),
                    formSalesManCode : returnCode.data.userDetail.agent_code,
                    TextUserCode : returnCode.data.userDetail.special_code,
                    couponList : !CommonUtil.isEmpty(returnCode.data.userDetail.coupon)?returnCode.data.userDetail.coupon:[],
                    deliveryList : !CommonUtil.isEmpty(returnCode.data.userDetail.delivery)?returnCode.data.userDetail.delivery:[],
                    orderSeq : 0,
                    formAddressPk :!CommonUtil.isEmpty(userDeliveryData) ? userDeliveryData.memberdelivery_pk : 0,
                    formAddressData : !CommonUtil.isEmpty(userDeliveryData) ? userDeliveryData : {}
                })
               
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다1.',1000);
                setTimeout(
                    () => {            
                       this.props.navigation.goBack(null);
                    },1000
                )
            }
            this.setState({moreLoading:false,loading:false})
        }catch(e){            
            this.setState({loading:false,moreLoading : false})
            CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.',1000);
            setTimeout(
                () => {            
                    this.props.navigation.goBack(null);
                },1000
            )
        }
    }

    checkStorageCode = async (arr) => {
        //console.log('BankCode',arr)  
        let newBankCode = [];
        await JSON.parse(arr).forEach(function(element,index,array){            
            if ( element.bankcode2) {
                newBankCode.push({
                    id:index,
                    idx:element.bankidx,
                    name:element.bankname,
                    code:element.bankcode2
                })
            }
        })
        console.log('newBankCode',newBankCode)  
        await this.setState({bankArray: newBankCode});
    }

    async UNSAFE_componentWillMount() {
        if ( !CommonUtil.isEmpty(this.props.extraData.params.screenData)) {
            await this.getBaseData(this.props.userToken.member_pk);
            let cartList = [];
            let selectedArray = this.props.extraData.params.screenData.selectedArray;
            selectedArray.forEach(function(element){ 
                element.child.forEach(function(child){ 
                    cartList.push(child.cart_pk);
                })
            })
            const BankCode = await AsyncStorage.getItem('BankCode');
            if ( !CommonUtil.isEmpty(BankCode)) {
                this.checkStorageCode(BankCode);
                console.log('BankCode',BankCode)  
            }
            this.setState({
                cartList : cartList,
                selectedArray : selectedArray,
                productInfo : selectedArray,
                selectedTotalAmount : this.props.extraData.params.screenData.selectedTotalAmount,
                selectedTotalDiscount : this.props.extraData.params.screenData.selectedTotalDiscount,
                selectedDeliveryAmount : this.props.extraData.params.screenData.selectedDeliveryAmount,
                seletedSettleAmount : this.props.extraData.params.screenData.seletedSettleAmount,
                selectedRewardAmount : this.props.extraData.params.screenData.selectedRewardAmount,
                userRate : this.props.extraData.params.screenData.userRate,
                isCanNotUsePoint : selectedArray.some((info)=>info.can_point === false),
                formAccountName :  this.props.userToken.name
            })
        }else{
            CommonFunction.fn_call_toast('잘못된 접근입니다.',1500);
            setTimeout(
                () => {            
                   this.props.navigation.goBack(null);
                },1500
            )
        }
       
        this.props.navigation.addListener('focus', () => {            
            BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        })

        this.props.navigation.addListener('blur', () => {     
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        })
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        setTimeout(
            () => {            
                this.setState({loading:false,openTab1:true})
            },500
        )
    }
    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);          
    }

    handleBackButton = () => {     
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);         
        return true;
    };
    handleOnScroll (event) {             
        if ( event.nativeEvent.contentOffset.y >= 150 ) {
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

    scrollEndReach = () => {
        if ( this.state.moreLoading === false && this.state.ismore) {            
            this.setState({moreLoading : true})   
            setTimeout(
                () => {
                },500
            )
        }
    }

    fn_calculatorSettlePrice = async() => {

        let selectedTotalAmount =  this.state.selectedTotalAmount;
        let selectedTotalDiscount =  this.state.selectedTotalDiscount;
        let selectedDeliveryAmount =  this.state.selectedDeliveryAmount;
        let formUsePoint =  this.state.formUsePoint;
        let formUseCoupon =  this.state.formUseCoupon;
 
        let plusAmount = parseInt(selectedTotalAmount)+parseInt(selectedDeliveryAmount);
        let minusAmount = parseInt(selectedTotalDiscount)+parseInt(formUseCoupon)+parseInt(formUsePoint);

        this.setState({
            seletedSettleAmount : plusAmount-minusAmount,
            showCouponModal : false
        })
        if (  (plusAmount-minusAmount) === 0 ) {
            this.setState({settleMethode : 'point'})
        }else{
            this.setState({settleMethode : ''})
        }

    }
    animatedHeight = new Animated.Value(SCREEN_HEIGHT * 0.5);
    animatedHeight2 = new Animated.Value(SCREEN_HEIGHT);
    animatedHeight3 = new Animated.Value(SCREEN_HEIGHT * 0.6);

    closeModal = () => { this.setState({showModal :false})};
    closeModal2 = () => { this.setState({showModal2 :false})};
    checkItem = (idx) => {
        this.setState({orderSeq:idx})
        
    }
    showCouponModal = () => {
        if ( this.state.isCanNotUsePoint ) {
            CommonFunction.fn_call_toast('적립금/쿠폰 사용불가상품이 있습니다',20000);return;
        }else if ( this.state.couponList.length > 0 ) {
            this.setState({showCouponModal : true})
        }else{
            CommonFunction.fn_call_toast('사용가능한 쿠폰이 없습니다.',20000);return;
        }
    }
    setUseAllPoint = async(bool) => {
        if ( this.state.isCanNotUsePoint === false ) {            
            let usePoint = 0; 
            if ( parseInt(this.state.seletedSettleAmount) < parseInt(this.state.canUsePount) ) {
                usePoint = this.state.seletedSettleAmount;
            }else{
                usePoint = parseInt(this.state.canUsePount);
            }
            this.setState({isAllUse : !bool,formUsePoint : !bool ? usePoint:0})
            setTimeout(
                () => {            
                    this.fn_calculatorSettlePrice();
                },500
            )
        }else{
            CommonFunction.fn_call_toast('적립금 사용불가상품이 있습니다',20000);return;
        }
    }

    setformUsePoint =  (data = null ) => {        
        let originalAmount = this.state.selectedTotalAmount - this.state.selectedTotalDiscount + this.state.selectedDeliveryAmount;        
        if ( data > 0) {
            let LimitAmount = parseInt(originalAmount)-parseInt(this.state.formUseCoupon);            
            if (  LimitAmount >= parseInt(data) ) {
                this.setState({formUsePoint : data,isAllUse:false})
                setTimeout(
                    () => {            
                        this.fn_calculatorSettlePrice();
                    },100
                )
            }
        }else{            
            this.setState({formUsePoint : 0,isAllUse:false})
            setTimeout(
                () => {            
                    this.fn_calculatorSettlePrice();
                },100
            )
        }
    }

    _closeCouponModal = (data = null, mode=null) => {
        let seletedSettleAmount = this.state.seletedSettleAmount;
        if ( !CommonUtil.isEmpty(data)) {
            if ( seletedSettleAmount < 1 ) {
                this.setState({showCouponModal : false})
                CommonFunction.fn_call_toast('결제금액이 현재 0원으로 사용불가합니다.',2000);return;
            }else{
                let useCoupin = 0; 
                if ( parseInt(this.state.seletedSettleAmount) < parseInt(data.price) ) {
                    useCoupin = this.state.seletedSettleAmount;
                }else{
                    useCoupin = parseInt(data.price);
                }
                this.setState({
                    useCouponIdx : data.coupon_pk,
                    useCouponData : data,
                    formUseCoupon : useCoupin,
                })
                setTimeout(
                    () => {            
                        this.fn_calculatorSettlePrice();
                    },500
                )
            }
        }else{
            if ( mode === 'update' ) {
                this.setState({
                    useCouponIdx : 0,
                    useCouponData : {},
                    formUseCoupon : 0,
                })
                setTimeout(
                    () => {            
                        this.fn_calculatorSettlePrice();
                    },500
                )
            }else{
                this.setState({showCouponModal : false})
            }
        }
        
    } 

    btnchoiceDelivery = async(seq) => {
        let item = this.state.deliveryList[seq];
        this.setState({formAddressPk:item.memberdelivery_pk,formAddressData:item})
        this.closeModal();
    }

    openModal = async() => {
        if ( CommonUtil.isEmpty(this.props.userToken)) {
            Alert.alert(DEFAULT_CONSTANTS.appName, '로그인이 필요합니다.\n로그인 하시겠습니까?',
            [
                {text: '확인', onPress: () => this.props.navigation.navigate('SignInStack', {screenData : {routeName: 'ProductDetailStack',routeIdx:1}})},
                {text: '취소', onPress: () => console.log('로그인 취소')},
            ]);
        }else{
            this.setState({showCartForm:true});
        }
    }

    showpopLayer = () => this.setState({ popLayerView: true });

    upButtonHandler = () => {        
        this.ScrollView.scrollTo({ x: 0,  animated: true });
    };

    onLayoutSlide = ( evt ) => {
        if ( this.state.expandedHeight === 0 ) {            
            this.setState({expandedHeight : parseInt(evt.nativeEvent.layout.height)* 1.25});
        }
    }
    onLayoutSlide2 = ( evt ) => {
        if ( this.state.expandedHeight2 === 0 ) {
            this.setState({expandedHeight2 : parseInt(evt.nativeEvent.layout.height)* 1.5});
        }
    }
    onLayoutSlide3 = ( evt ) => {
        if ( this.state.expandedHeight3 === 0 ) {
            this.setState({expandedHeight3 : parseInt(evt.nativeEvent.layout.height)* 1.2});
        }
    }
    onLayoutSlide4 = ( evt ) => {
        if ( this.state.expandedHeight4 === 0 ) {
            this.setState({expandedHeight4 : parseInt(evt.nativeEvent.layout.height)* 1.2});
        }
    }
    onLayoutSlide5 = ( evt ) => {
       
        if ( this.state.expandedHeight5 === 0 ) {
            this.setState({expandedHeight5 : parseInt(evt.nativeEvent.layout.height)* 1.2});
        }
    }

    actionSettle = (nav,item) => {
        this.props.navigation.navigate('OrderEndingStack',{
            screenTitle:item
        })
    }

    
    actionOrder = async() => { //OrderEndingStack
        if ( CommonUtil.isEmpty(this.state.formAddressPk)) {
            CommonFunction.fn_call_toast_top('배송지를 선택해주세요',2000,'center');return;
        }else if ( CommonUtil.isEmpty(this.state.formUserName)) {
            CommonFunction.fn_call_toast_top('받는분을 입력해주세요',2000,'center');return;
        }else if ( CommonUtil.isEmpty(this.state.formUserPhone)) {
            CommonFunction.fn_call_toast_top('휴대폰번호를 입력해주세요',2000,'center');return;
        }else if ( this.state.settleMethode === 'vbank'  &&  CommonUtil.isEmpty(this.state.formAccountName) ) {
            CommonFunction.fn_call_toast('입금자명을 입력해 주세요',2000);return;
        }else if ( this.state.settleMethode === 'vbank'  &&  CommonUtil.isEmpty(this.state.formRefundBankCode) ) {
            CommonFunction.fn_call_toast('환불용 은행을 선택해 주세요',2000);return;
        }else if ( this.state.settleMethode === 'vbank'  &&  CommonUtil.isEmpty(this.state.formRefundAccountName) ) {
            CommonFunction.fn_call_toast('환불용 계좌수신명을 입력해 주세요',2000);return;
        }else if ( this.state.settleMethode === 'vbank'  &&  CommonUtil.isEmpty(this.state.formRefundAccount) ) {
            CommonFunction.fn_call_toast('환불용 계좌번호를 입력해 주세요',2000);return;
        }else if ( CommonUtil.isEmpty(this.state.refundMethode) ) {
            CommonFunction.fn_call_toast('미출고시 조치방법을 선택해 주세요',2000);return;
        }else if ( this.state.agreeCheck === false) {
            CommonFunction.fn_call_toast_top('개인정보 수집/제공등의 동의를 해주세요',2000,'center');return;
        }else{
            if ( this.state.settleMethode === 'point' && this.state.seletedSettleAmount === 0 ) {
                Alert.alert(
                    DEFAULT_CONSTANTS.appName,
                    "결제금액이 0원입니다. \n주문을 진행하시겠습니까?",
                    [
                        {text: '결제진행', onPress: () =>  this.orderCheckSum()},
                        {text: '아니오', onPress: () => console.log('Cancle')},
                        
                    ],
                    { cancelable: true }
                )  
            }else{
                if ( this.state.seletedSettleAmount >= 1000 && this.state.settleMethode === 'phone') {
                    CommonFunction.fn_call_toast_top('핸드폰 소액결제는 1000원 미만일때만 가능합니다.',2000,'center');return;
                }else{
                    Alert.alert(
                        DEFAULT_CONSTANTS.appName,
                        "주문결제를 진행하시겠습니까?",
                        [
                            {text: '결제진행', onPress: () =>  this.getTokenKey()},
                            {text: '아니오', onPress: () => console.log('Cancle')},
                            
                        ],
                        { cancelable: true }
                    )  
                }
            }
        }
    }
     
    moveDetail = (nav,item) => {
        this.props.navigation.navigate(nav,{
            screenTitle:item
        })
    }
  
    getTokenKey = async () => {
        const formData = new FormData();        
        formData.append('imp_key', DEFAULT_CONSTANTS.iamPortAPIKey);
        formData.append('imp_secret', DEFAULT_CONSTANTS.iamPortAPISecrentKey);
        await CommonUtil.callAPI( 'https://api.iamport.kr/users/getToken',{
            method: 'POST', body:formData
        },10000).then(response => {
            if ( typeof response.response.access_token !== 'undefined') {
                this.setState({iamPortTokenKey : response.response.access_token})
                if ( this.state.formUsePoint > 0 || !CommonUtil.isEmpty(this.state.useCouponData)) {
                    this.orderCheckSum(response.response.access_token);
                }else{
                    this.onPressCallPgAction(response.response.access_token)
                }
            }else{
                CommonFunction.fn_call_toast('네트워크 오류 또는 인증에 문제가 생겼습니다.',2000);
                return false;
            }
        })
        .catch(err => {            
            CommonFunction.fn_call_toast('네트워크 오류 또는 인증에 문제가 생겼습니다.',2000);
            return false;
        });
    }

    orderCheckSum = async(TmpiamPortTokenKey = null) => {
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/order/point/check/member_pk=' + this.props.userToken.member_pk+'&point=' + this.state.formUsePoint+'&coupon_pk=' + this.state.useCouponIdx;
            const token = this.props.userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_getPageList(this.props,url,token,sendData);
            if ( returnCode.code === '0000' || returnCode.code === '2006'  ) {
                if ( CommonUtil.isEmpty(TmpiamPortTokenKey && this.state.settleMethode === 'point')) {
                    this.onPressCallFreeAction();
                }else{
                    this.onPressCallPgAction(TmpiamPortTokenKey);
                }
            }else if ( returnCode.code === '3023' ) {
                CommonFunction.fn_call_toast('사용가능한 포인트가 부족합니다..',2000);
                this.setState({moreLoading:false,loading:false})
            }else if ( returnCode.code === '3024' ) {
                CommonFunction.fn_call_toast('사용가능한 쿠폰이 아니거나 잘못된 쿠폰입니다.',2000);
                this.setState({moreLoading:false,loading:false})
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.',2000);
                this.setState({moreLoading:false,loading:false})
            }
        }catch(e){
            this.setState({loading:false,moreLoading : false})
        }
    }

    onPressCallFreeAction = async() => {
        let settleMethodeCode =  this.state.settleMethode;
        this.setState({moreLoading :false})   
            const method = settleMethodeCode;
            let settleMethodeName = '포인트';
            const merchantUid = `${moment().format('YYYYMMDD')}-SB${new Date().getTime()}`
            let addName = this.state.selectedArray.length > 1 ? ' 외 '+ (this.state.selectedArray.length - 1) + '건' : "";
            const name = this.state.selectedArray[0].product_name + addName;
            const amount = parseInt(this.state.seletedSettleAmount);
            const buyerName = this.state.formUserName;
            const buyerTel= this.state.formUserPhone;
            const buyerEmail = CommonUtil.isEmpty(this.props.userToken.email)? "" :CommonFunction.fn_dataDecode(this.props.userToken.email);
            const cal_selectedRewardAmount = (this.state.selectedRewardAmount-this.state.formUsePoint-this.state.formUseCoupon)*this.state.userRate > 0 ? (this.state.selectedRewardAmount-this.state.formUsePoint-this.state.formUseCoupon)*this.state.userRate : 0;
            const params = {
                pay_method: method,
                merchant_uid: merchantUid,
                name,
                amount,
                buyer_name: buyerName,
                buyer_tel: buyerTel,
                buyer_email: buyerEmail,
                settleMethodeCode : settleMethodeCode,
                settleMethodeName : settleMethodeName,
                information : {
                    memberidx : this.props.userToken.member_pk,
                    userInfo : this.props.userToken,
                    cartList : this.state.cartList,
                    selectedArray : this.state.selectedArray,
                    userRate : this.state.userRate,
                    selectedTotalAmount : this.state.selectedTotalAmount,
                    selectedRewardAmount : cal_selectedRewardAmount,
                    selectedTotalDiscount : this.state.selectedTotalDiscount,
                    selectedDeliveryAmount : this.state.selectedDeliveryAmount,
                    seletedSettleAmount : this.state.seletedSettleAmount,
                    canUsePount : this.state.canUsePount,
                    formUsePoint : this.state.formUsePoint,
                    formUseCoupon : this.state.formUseCoupon,
                    useCouponData : this.state.useCouponData,
                    useCouponIdx : this.state.useCouponIdx,
                    productInfo : this.state.productInfo,
                    formUserEmail : this.state.formUserEmail,
                    formUserMemo : this.state.formUserMemo,
                    formUserName : this.state.formUserName,
                    formUserPhone : this.state.formUserPhone,
                    formSalesManCode : this.state.formSalesManCode,
                    TextUserCode : this.state.TextUserCode,
                    settleMethode : this.state.settleMethode,
                    refundMethode : this.state.refundMethode,
                    formAccountName : this.state.formAccountName,
                    formRefundAccount : this.state.formRefundAccount,
                    formRefundBankCode : this.state.formRefundBankCode,
                    formRefundBankName : this.state.formRefundBankName,
                    formRefundAccountName: this.state.formRefundAccountName,
                    formAddressPk : this.state.formAddressPk,
                    formAddressData : this.state.formAddressData
                }
            };

            this.props.navigation.replace('PaymentResultStack', { response : {imp_success : true, merchant_uid : merchantUid }, settleData:params });
        
    }

    onPressCallPgAction = async(TmpiamPortTokenKey) => {        
        let settleMethodeCode =  this.state.settleMethode;
        this.setState({settleMethodeCode: settleMethodeCode,moreLoading :false})        
        let notiUrl = '';
        if ( !CommonUtil.isEmpty(settleMethodeCode) && !CommonUtil.isEmpty(this.state.iamPortTokenKey) ) {
            const pg = 'uplus'; //uplus.MID ..사업부별로 처리
            const notice_url2 = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/settle/iamport/modify';//notiUrl;
            const method = settleMethodeCode;
            let settleMethodeName = '신용/체크카드';
            switch ( settleMethodeCode) {
                case 'card' : 
                    settleMethodeName = '신용/체크카드'; break;
                case 'vbank' : 
                    settleMethodeName = '무통장입금'; break;
                case 'phone' : 
                    settleMethodeName = '휴대폰'; break;
                case 'trans' : 
                    settleMethodeName = '실시간계좌이체'; break;                
                default : 
            }
            const cardQuota = 0            
            const merchantUid = `${moment().format('YYYYMMDD')}-SB${new Date().getTime()}`
            let addName = this.state.selectedArray.length > 1 ? ' 외 '+ (this.state.selectedArray.length - 1) + '건' : "";
            const name = this.state.selectedArray[0].product_name + addName;
            const amount = parseInt(this.state.seletedSettleAmount);
            const buyerName = this.state.formUserName;
            const buyerTel= this.state.formUserPhone;
            const buyerEmail = CommonUtil.isEmpty(this.props.userToken.email)? "" :CommonFunction.fn_dataDecode(this.props.userToken.email);
            const vbankDue = maxDateVbank;
            const bizNum = '';
            const escrow =false;
            const digital = false;
            let iamPortTokenKey = CommonUtil.isEmpty(TmpiamPortTokenKey) ? this.state.iamPortTokenKey : TmpiamPortTokenKey;            
            const cal_selectedRewardAmount = (this.state.selectedRewardAmount-this.state.formUsePoint-this.state.formUseCoupon)*this.state.userRate > 0 ? (this.state.selectedRewardAmount-this.state.formUsePoint-this.state.formUseCoupon)*this.state.userRate : 0;
            const params = {
                pg,
                notice_url : notice_url2,
                pay_method: method,
                merchant_uid: merchantUid,
                name,
                amount,
                buyer_name: buyerName,
                buyer_tel: buyerTel,
                buyer_email: buyerEmail,
                escrow,
                resultScreen : 'PaymentResultStack',
                iamPortTokenKey :  iamPortTokenKey,
                settleMethodeCode : settleMethodeCode,
                settleMethodeName : settleMethodeName,
                settleLimitDate : maxDateVbank,
                information : {
                    memberidx : this.props.userToken.member_pk,
                    userInfo : this.props.userToken,
                    cartList : this.state.cartList,
                    selectedArray : this.state.selectedArray,
                    userRate : this.state.userRate,
                    selectedTotalAmount : this.state.selectedTotalAmount,
                    selectedRewardAmount : cal_selectedRewardAmount,
                    selectedTotalDiscount : this.state.selectedTotalDiscount,
                    selectedDeliveryAmount : this.state.selectedDeliveryAmount,
                    seletedSettleAmount : this.state.seletedSettleAmount,
                    canUsePount : this.state.canUsePount,
                    formUsePoint : this.state.formUsePoint,
                    formUseCoupon : this.state.formUseCoupon,
                    useCouponData : this.state.useCouponData,
                    useCouponIdx : this.state.useCouponIdx,
                    productInfo : this.state.productInfo,
                    formUserEmail : this.state.formUserEmail,
                    formUserMemo : this.state.formUserMemo,
                    formUserName : this.state.formUserName,
                    formUserPhone : this.state.formUserPhone,
                    formSalesManCode : this.state.formSalesManCode,
                    TextUserCode : this.state.TextUserCode,
                    settleMethode : this.state.settleMethode,
                    refundMethode : this.state.refundMethode,
                    formAccountName : this.state.refundMethode,
                    formRefundAccount : this.state.formRefundAccount,
                    formRefundBankCode : this.state.formRefundBankCode,
                    formRefundBankName : this.state.formRefundBankName,
                    formRefundAccountName: this.state.formRefundAccountName,
                    formAddressPk : this.state.formAddressPk,
                    formAddressData : this.state.formAddressData
                }
            };
            
            // 신용카드의 경우, 할부기한 추가
            if (method === 'card' && cardQuota !== 0) {
            params.display = {
                card_quota: cardQuota === 1 ? [] : [cardQuota],
            };
            }
        
            // 가상계좌의 경우, 입금기한 추가
            if (method === 'vbank' && vbankDue) {
                params.vbank_due = vbankDue;
            }
        
            // 다날 && 가상계좌의 경우, 사업자 등록번호 10자리 추가
            if (method === 'vbank' && pg === 'danal_tpay') {
            params.biz_num = bizNum;
            }
        
            // 휴대폰 소액결제의 경우, 실물 컨텐츠 여부 추가
            if (method === 'phone') {
            params.digital = digital;
            }
        
            // 정기결제의 경우, customer_uid 추가
            if (pg === 'kcp_billing') {
            params.customer_uid = `cuid_${new Date().getTime()}`;
            }
            this.props.navigation.navigate('PaymentStack', { params });
        }else{
            CommonFunction.fn_call_toast('결제방법이 선택되지 않았습니다',2000);
            return false;
        }
    };


    selectFilter = async(filt) => {    
        let bankData = this.state.bankArray;     
        this.setState({
            formRefundBankCode:bankData[filt-1].code,
            formRefundBankName:bankData[filt-1].name
        }); 
    }

    renderTooltip = (mode) => {
        if ( mode === 'delivery') {
            return (<View style={{width:'100%',padding:5,backgroundColor:'#ccc'}}>
                <CustomTextB style={CommonStyle.dataText}>무료배송 기준 </CustomTextB>
                <CustomTextR style={CommonStyle.dataText}>브론즈:결제금액  {CommonFunction.currencyFormat(DEFAULT_CONSTANTS.bronzeDeliveryFreeCost)}만원 이상 주문시 </CustomTextR>
                <CustomTextR style={CommonStyle.dataText}>실버:결제금액  {CommonFunction.currencyFormat(DEFAULT_CONSTANTS.silverDeliveryFreeCost)}만원 이상 주문시 </CustomTextR>
                <CustomTextR style={CommonStyle.dataText}>골드이상 무료배송 </CustomTextR>
            </View>)
        }else if ( mode === 'reward') {
            return (<View style={{width:'100%',padding:5,backgroundColor:'#ccc'}}>
                <CustomTextB style={CommonStyle.dataText}>적립포인트 산정 </CustomTextB>
                <CustomTextR style={CommonStyle.dataText}>순발주금액(결제금액 - 부가세(10%) - 포인트/쿠폰사용금액 )*적립률</CustomTextR>
                <CustomTextR style={CommonStyle.dataText}>적립률: 등급별 상이</CustomTextR>
            </View>)
        }else if ( mode === 'coupon') {
            return (<View style={{width:'100%',padding:5,backgroundColor:'#ccc'}}>
                <CustomTextB style={CommonStyle.dataText}>쿠폰사용 </CustomTextB>
                <CustomTextR style={CommonStyle.dataText}>1. 쿠폰은 1회사용시 전액을 사용합니다.</CustomTextR>
                <CustomTextR style={CommonStyle.dataText}>2. 쿠폰금액이 결제금액보다 클경우 잔액은 환불되지 않고 소멸됩니다.</CustomTextR>
            </View>)
        }else if ( mode === 'not') {
            return (<View style={{width:'100%',padding:5,backgroundColor:'#ccc'}}>
                <CustomTextB style={CommonStyle.dataText}>미출고 사유 </CustomTextB>
                <CustomTextR style={CommonStyle.dataText}>1. 제품품절</CustomTextR>
                <CustomTextR style={CommonStyle.dataText}>2. 파손, 분실등</CustomTextR>
            </View>)
        }
    }


    render() {
        if ( this.state.loading ) {
            return (
                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} /> 
            )
        }else {  
        return(
            <SafeAreaView style={ styles.container }>
                { 
                    this.state.showTopButton &&
                    <TouchableOpacity 
                        style={styles.fixedUpButton}
                        onPress={e => this.upButtonHandler()}
                    >
                        <Icon2 name="up" size={25} color="#555" />
                    </TouchableOpacity>
                }
                {
                    this.state.popLayerView && (
                    <View >
                        <Overlay
                            isVisible={this.state.popLayerView}
                            onBackdropPress={this.closepopLayer}
                            windowBackgroundColor="rgba(0, 0, 0, 0.8)"
                            overlayBackgroundColor="tranparent"                                
                            containerStyle={{margin:0,padding:0}}
                        >
                            <View style={styles.popLayerWrap}>
                                <PopLayerAddress screenState={this.state} screenProps={this.props} />
                            </View>
                        </Overlay>
                    </View>
                )}
              
                <ScrollView
                    ref={(ref) => {
                        this.ScrollView = ref;
                    }}
                    showsVerticalScrollIndicator={false}
                    indicatorStyle={'white'}
                    scrollEventThrottle={16}
                    keyboardDismissMode={'on-drag'}
                    onScroll={e => this.handleOnScroll(e)}
                    onMomentumScrollEnd = {({nativeEvent}) => {
                    }}
                    onScrollEndDrag ={({nativeEvent}) => { 
                    }}
                    style={{flex:1, backgroundColor:'#f5f6f8'}}
                >
                    <View style={styles.defaultWrap}>
                        <CustomTextR style={CommonStyle.titleText15}>주문 상품</CustomTextR>
                    </View>
                    <View style={{flex:1,paddingHorizontal:0}}>
                    {
                    this.state.selectedArray.map((item, index) => {                          
                    return (
                        <View key={index} style={styles.boxSubWrap}>
                            <View style={styles.itemTitleWrap}>
                                <CustomTextR style={styles.dataTitleText}>
                                    {item.product_name} <CustomTextR style={CommonStyle.dataText}>{!item.can_point  && "(적립금사용불가상품)"}</CustomTextR>
                                </CustomTextR>  
                            </View>
                            <View style={styles.itemDataWrap}>
                                <View style={styles.detailLeftWrap}>
                                { 
                                    !CommonUtil.isEmpty(item.thumb_img) ?
                                    <Image
                                        source={{uri:DEFAULT_CONSTANTS.defaultImageDomain+item.thumb_img}}
                                        resizeMode={"cover"}
                                        style={CommonStyle.defaultIconImage60}
                                    />
                                    :
                                    <Image
                                        source={require('../../../assets/icons/no_image.png')}
                                        resizeMode={"cover"}
                                        style={CommonStyle.defaultIconImage60}
                                    />
                                }  
                                </View>
                                <View style={[styles.detailRightWrap,{flex:4}]}>
                                { 
                                item.child.map((titem, tindex) => {  
                                    return (
                                    <View style={styles.boxSubWrap2} key={tindex}>
                                        { titem.event_price > 0 ?
                                            <View style={styles.unitWrap}>
                                                <TextRobotoR style={CommonStyle.priceText}>
                                                    {CommonFunction.replaceUnitType(titem.unit_type)}  <TextRobotoR style={[styles.menuText888,CommonStyle.fontStrike]}>{CommonFunction.currencyFormat(titem.price)}원</TextRobotoR> {CommonFunction.currencyFormat(titem.event_price)}원
                                                </TextRobotoR>
                                                <TextRobotoR style={CommonStyle.priceText}> 수량:{CommonFunction.currencyFormat(titem.quantity)}</TextRobotoR>
                                            </View>
                                            :
                                            <View style={styles.unitWrap}>
                                                <TextRobotoR style={CommonStyle.dataText}>
                                                    {CommonFunction.replaceUnitType(titem.unit_type)}({CommonFunction.currencyFormat(titem.price)}원)
                                                </TextRobotoR>
                                                <TextRobotoR style={CommonStyle.dataText}> 수량:{CommonFunction.currencyFormat(titem.quantity)}</TextRobotoR>
                                            </View>
                                        }
                                    </View>
                                    )
                                    })
                                }    
                                </View>
                            </View> 
                            <View style={[styles.itemTitleWrap,{alignItems:'flex-end',paddingRight:20}]}>
                                { 
                                    item.eventTotalPrice > 0 ?
                                    <CustomTextR style={CommonStyle.titleText}>
                                        {"합계금액 : "}
                                        <CustomTextR style={[styles.menuText888,CommonStyle.fontStrike]}>{CommonFunction.currencyFormat(item.totalPrice)}원</CustomTextR> {CommonFunction.currencyFormat(item.eventTotalPrice)}원
                                    </CustomTextR>
                                    :
                                    <CustomTextR style={CommonStyle.titleText}>합계금액 : {CommonFunction.currencyFormat(item.totalPrice)}</CustomTextR>  
                                }
                            </View>                           
                        </View>
                    )})
                    }
                    </View>
                    <View style={styles.termLineWrap} /> 
                    <ToggleBox 
                        label='주문자 정보' 
                        value=''                         
                        arrowColor={'#555'}
                        style={styles.toggleBoxWrap}
                        expanded={true}
                        screenHeight={210}
                    >
                        <View style={{flex:1,paddingVertical:15}} >
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>주문자 명</CustomTextR>
                                </View>
                                <View style={styles.detailRightWrap}>
                                    <CustomTextL style={styles.menuTitleSubText}>{this.props.userToken.name}</CustomTextL>     
                                </View>
                            </View>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>휴대폰</CustomTextR>
                                </View>
                                <View style={styles.detailRightWrap}>
                                    <CustomTextL style={styles.menuTitleSubText}>
                                        {CommonUtil.isEmpty(this.props.userToken.phone)? "" :CommonFunction.fn_dataDecode(this.props.userToken.phone)}
                                    </CustomTextL>     
                                </View>
                            </View>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>이메일</CustomTextR>
                                </View>
                                <View style={styles.detailRightWrap}>
                                    <CustomTextL style={styles.menuTitleSubText}>
                                        {CommonUtil.isEmpty(this.props.userToken.email)? "" :CommonFunction.fn_dataDecode(this.props.userToken.email)}
                                    </CustomTextL>     
                                </View>
                            </View>
                        </View>
                    </ToggleBox>
                    <View style={styles.termLineWrap} />  
                    <ToggleBox 
                        label='배송 정보' 
                        value='' 
                        arrowColor={'#555'}
                        style={styles.toggleBoxWrap}
                        expanded={true}
                        screenHeight={Platform.OS === 'ios' ? 480 : 500}
                    >
                        <View style={{flex:1,paddingVertical:15}} >
                            <TouchableOpacity style={styles.dataSubWrap} onPress={()=>this.showpopLayer()}>
                                <CustomTextM style={[styles.menuTitleSubText,{color:DEFAULT_COLOR.base_color}]}>+새 배송지 추가</CustomTextM>
                            </TouchableOpacity>
                            <View style={[styles.deliveryWrap,{minHeight:70}]}>
                                <View style={{paddingVertical:5}}>
                                    <CustomTextR style={styles.menuTitleSubText}>배송지</CustomTextR>     
                                </View>
                                <View style={styles.deliveryDataWrap}>
                                    <TouchableOpacity onPress={()=> this.setState({showModal:true})} style={styles.deliveryAddressWrap}>
                                        {
                                            this.state.formAddressPk > 0 ?
                                            <CustomTextR style={[styles.menuTitleSubText,{color:DEFAULT_COLOR.base_color}]}>{this.state.formAddressData.address}{this.state.formAddressData.address_detail}</CustomTextR>     
                                            :
                                            <CustomTextR style={[styles.menuTitleSubText,{color:DEFAULT_COLOR.base_color}]}>배송지를 선택해주세요</CustomTextR>     
                                        }
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        onPress={()=> this.setState({showModal:true})}
                                        hitSlop={{left:10,right:10,top:10,bottom:10}}
                                        style={styles.deliveryButtonWrap}
                                    >
                                        <Image
                                            source={require('../../../assets/icons/arrow_right_blue.png')}
                                            resizeMode={"contain"}
                                            style={{width:PixelRatio.roundToNearestPixel(25),height:PixelRatio.roundToNearestPixel(25)}}
                                        />   
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.formWarp}>
                                <View style={styles.formTitleWrap}>
                                    <CustomTextR style={CommonStyle.titleText}>받는분</CustomTextR>
                                    <CustomTextR style={CommonStyle.requiredText}></CustomTextR>
                                </View>
                                <View style={styles.formDataWrap}>
                                    <TextInput                                    
                                        style={[CommonStyle.inputBlank,CommonStyle.defaultOneWayForm]}
                                        placeholder={'이름입력'}
                                        value={this.state.formUserName}
                                        placeholderTextColor={DEFAULT_COLOR.base_color_666}
                                        onChangeText={text=>this.setState({formUserName:text})}
                                        multiline={false}
                                        clearButtonMode='always'
                                    />
                                </View>   
                                <View style={styles.formTitleWrap}>
                                    <CustomTextR style={CommonStyle.titleText}>휴대폰</CustomTextR>
                                    <CustomTextR style={CommonStyle.requiredText}></CustomTextR>
                                </View>
                                <View style={styles.formDataWrap}>
                                    <TextInput     
                                        keyboardType={'name-phone-pad'}    
                                        value={this.state.formUserPhone}
                                        style={[CommonStyle.inputBlank,CommonStyle.defaultOneWayForm]}
                                        placeholder={'휴대폰입력'}
                                        placeholderTextColor={DEFAULT_COLOR.base_color_666}
                                        onChangeText={text=>this.setState({formUserPhone:text})}
                                        multiline={false}
                                        clearButtonMode='always'
                                    />
                                </View>
                                <View style={styles.formTitleWrap}>
                                    <CustomTextR style={CommonStyle.titleText}>배송시 요청사항</CustomTextR>
                                    <CustomTextR style={CommonStyle.requiredText}></CustomTextR>
                                </View>
                                <View style={styles.formDataWrap}>
                                    <TextInput                            
                                        style={[CommonStyle.inputBlank,CommonStyle.defaultOneWayForm]}
                                        placeholder={'요청사항'}
                                        placeholderTextColor={DEFAULT_COLOR.base_color_666}
                                        onChangeText={text=>this.setState({formUserMemo:text})}
                                        multiline={false}
                                        clearButtonMode='always'
                                    />
                                </View>
                            </View>
                        </View>                        
                    </ToggleBox>
                    <View style={styles.termLineWrap} />  
                    <ToggleBox 
                        label='결제 금액' 
                        value={CommonFunction.currencyFormat(this.state.seletedSettleAmount)+'원'}
                        arrowColor={'#555'}
                        style={styles.toggleBoxWrap}
                        expanded={true}
                        screenHeight={550}
                    >
                        <View style={{paddingVertical:15}} >
                            <View style={[styles.formWarp2,{minHeight:75}]}>
                                <View style={styles.formTitleWrap}>
                                    <CustomTextR style={CommonStyle.titleText}>
                                        적립금 사용<CustomTextR style={CommonStyle.dataText}>{this.state.isCanNotUsePoint && ' 사용불가상품이 있습니다.'}</CustomTextR>
                                    </CustomTextR>
                                    <CustomTextR style={CommonStyle.requiredText}></CustomTextR>
                                </View>
                                <View style={styles.formDataWrap}>
                                    <TextInput
                                        editable={!this.state.isCanNotUsePoint}
                                        keyboardType={'number-pad'}   
                                        value={this.state.formUsePoint.toString()}
                                        style={[CommonStyle.inputBlank,CommonStyle.defaultOneWayFormAlignRight]}
                                        onChangeText={text=>this.setformUsePoint(text)}
                                        multiline={false}
                                        clearButtonMode='always'
                                    />
                                </View>  
                            </View>                           
                            <View style={styles.dataSubWrap}>
                                <View style={[styles.detailLeftWrap,{flex:1}]}>
                                    <CustomTextR style={CommonStyle.titleText}>보유적립금 {CommonFunction.currencyFormat(this.state.canUsePount)}원</CustomTextR>
                                </View>
                                <TouchableOpacity 
                                    style={styles.detailRightWrap2}
                                    onPress={() => this.setUseAllPoint(this.state.isAllUse)}
                                >
                                    <CheckBox 
                                        containerStyle={{padding:0,margin:0}}   
                                        iconType={'FontAwesome'}
                                        checkedIcon={<Image source={CHECKNOX_ON} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                        uncheckedIcon={<Image source={CHECKNOX_OFF} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                        checkedColor={DEFAULT_COLOR.base_color}                          
                                        checked={this.state.isAllUse}
                                        size={PixelRatio.roundToNearestPixel(15)}
                                        onPress={() => this.setUseAllPoint(this.state.isAllUse)}
                                    />
                                    <CustomTextR style={CommonStyle.dataText}>모두사용</CustomTextR>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.deliveryWrap,{minHeight:70}]}>
                                <View style={{paddingVertical:5,flexDirection:'row'}}>
                                    <CustomTextR style={CommonStyle.titleText}>쿠폰사용<CustomTextR style={[CommonStyle.titleText,{color:DEFAULT_COLOR.base_color}]}>({this.state.couponList.length})</CustomTextR></CustomTextR>   
                                    <TouchableOpacity 
                                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                        style={styles.tooltipWrap}        
                                    >
                                        <Tooltip popover={this.renderTooltip('coupon')} width={SCREEN_WIDTH*0.8} height={120} backgroundColor="#ccc" skipAndroidStatusBar={true}>
                                            <Icon2 name="questioncircleo" size={PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16)} color="#bbb" />
                                        </Tooltip>
                                    </TouchableOpacity>  
                                </View>
                                <TouchableOpacity 
                                    style={styles.deliveryDataWrap}
                                    onPress={()=> this.showCouponModal()}
                                    hitSlop={{left:10,right:10,top:10,bottom:10}}
                                >
                                    <View style={styles.deliveryAddressWrap}>
                                        {
                                            !CommonUtil.isEmpty(this.state.useCouponData) ?
                                            <CustomTextR style={[CommonStyle.titleText,{color:DEFAULT_COLOR.base_color}]}>{CommonFunction.currencyFormat(this.state.useCouponData.price)}원 사용</CustomTextR> 
                                            :
                                            <CustomTextR style={[CommonStyle.titleText,{color:DEFAULT_COLOR.base_color}]}>선택된 쿠폰이 없습니다.</CustomTextR> 
                                        }   
                                    </View>
                                    <View style={styles.deliveryButtonWrap}>
                                        <Image
                                            source={require('../../../assets/icons/arrow_right_blue.png')}
                                            resizeMode={"contain"}
                                            style={CommonStyle.defaultIconImage}
                                        />   
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.bottomBoxSubWrap,{marginTop:10}]} >
                                <View style={styles.bottomBoxLeftWrap}>
                                    <CustomTextR style={CommonStyle.titleText}>상품금액</CustomTextR>
                                </View>
                                <View style={styles.bottomBoxRightWrap}>
                                    <TextRobotoL style={CommonStyle.dataText}>{CommonFunction.currencyFormat(this.state.selectedTotalAmount)}원</TextRobotoL>
                                </View>
                            </View>
                            <View style={styles.bottomBoxSubWrap} >
                                <View style={styles.bottomBoxLeftWrap}>
                                    <CustomTextR style={CommonStyle.titleText}>상품할인금액</CustomTextR>
                                </View>
                                <View style={styles.bottomBoxRightWrap}>
                                    <TextRobotoL style={CommonStyle.titleText}>{CommonFunction.currencyFormat(this.state.selectedTotalDiscount)}원</TextRobotoL>
                                </View>
                            </View>
                            <View style={styles.bottomBoxSubWrap} >
                                <View style={styles.bottomBoxLeftWrap}>
                                    <CustomTextR style={CommonStyle.titleText}>배송비</CustomTextR>
                                    <TouchableOpacity 
                                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                        style={styles.tooltipWrap}        
                                    >
                                        <Tooltip popover={this.renderTooltip('delivery')} width={SCREEN_WIDTH*0.8} height={120} backgroundColor="#ccc" skipAndroidStatusBar={true}>
                                            <Icon2 name="questioncircleo" size={PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16)} color="#bbb" />
                                        </Tooltip>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.bottomBoxRightWrap}>
                                    <TextRobotoL style={CommonStyle.titleText}>{CommonFunction.currencyFormat(this.state.selectedDeliveryAmount)}원</TextRobotoL>
                                </View>
                            </View>
                            <View style={styles.bottomBoxSubWrap} >
                                <View style={styles.bottomBoxLeftWrap}>
                                    <CustomTextR style={CommonStyle.titleText}>쿠폰/포인트 사용</CustomTextR>
                                </View>
                                <View style={styles.bottomBoxRightWrap}>
                                    <TextRobotoL style={CommonStyle.titleText}>{CommonFunction.currencyFormat(parseInt(this.state.formUsePoint)+parseInt(this.state.formUseCoupon))}원</TextRobotoL>
                                </View>
                            </View>
                            <View style={styles.bottomBoxSubWrap} >
                                <View style={[styles.bottomBoxLeftWrap,{flexDirection:'row'}]}>
                                    <CustomTextR style={CommonStyle.titleText}>적립포인트</CustomTextR>
                                    <TouchableOpacity 
                                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                        style={styles.tooltipWrap}        
                                    >
                                        <Tooltip popover={this.renderTooltip('reward')} width={SCREEN_WIDTH*0.8} height={120} backgroundColor="#ccc" skipAndroidStatusBar={true}>
                                            <Icon2 name="questioncircleo" size={PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16)} color="#bbb" />
                                        </Tooltip>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.bottomBoxRightWrap}>
                                    {
                                        (this.state.selectedRewardAmount-this.state.formUsePoint-this.state.formUseCoupon)*this.state.userRate > 0 
                                        ?
                                        <TextRobotoM style={CommonStyle.titleText}>
                                        {CommonFunction.currencyFormat((this.state.selectedRewardAmount-this.state.formUsePoint-this.state.formUseCoupon)*this.state.userRate)}원
                                        </TextRobotoM>
                                        :
                                        <TextRobotoM style={CommonStyle.titleText}>0원</TextRobotoM>
                                    }
                                </View>
                            </View>
                            <View style={[styles.bottomBoxSubWrap,{marginTop:10,paddingTop:10,borderTopWidth:1,borderTopColor:DEFAULT_COLOR.base_background_color}]} >
                                <View style={styles.bottomBoxLeftWrap}>
                                    <CustomTextR style={CommonStyle.titleText}>최종결제금액</CustomTextR>
                                </View>
                                <View style={styles.bottomBoxRightWrap}>
                                    <TextRobotoB style={CommonStyle.titleText}>{CommonFunction.currencyFormat(this.state.seletedSettleAmount)}원</TextRobotoB>
                                </View>
                            </View>
                        </View>                        
                    </ToggleBox>
                    <View style={styles.termLineWrap} />  
                    <TouchableOpacity
                        style={{flex:1,flexDirection:'row',paddingHorizontal:20,paddingVertical:10,backgroundColor:'#fff'}}
                        onPress={()=>this.setState({isOpen05 : !this.state.isOpen05})}
                    >
                        <View style={{flex:5}}>
                            <CustomTextB style={CommonStyle.titleText}>결제 수단</CustomTextB>
                        </View>
                        <View style={{flex:1,justifyContent:'center',alignItems:'flex-end'}}>
                            <Icon
                                name={this.state.isOpen05 ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                                color={"#555"}
                                size={PixelRatio.roundToNearestPixel(30)}
                            />
                        </View>
                    </TouchableOpacity>
                    {
                    this.state.isOpen05 ?
                    this.state.seletedSettleAmount > 0 ?
                    <View style={{paddingVertical:5,backgroundColor:'#fff'}} >
                        <View style={styles.formWarp2}>
                            <View style={styles.formTitleWrap}>
                                <CustomTextR style={CommonStyle.titleText}>결제수단 선택</CustomTextR>
                            </View>
                            <View style={{paddingVertical:5}}>
                            {
                            mockData2.map((item, index) => {  
                                return (
                                    <View key={index} style={styles.boxSubWrap3}>
                                        <View style={styles.detailLeftWrap}>
                                            <CheckBox 
                                                containerStyle={{padding:0,margin:0}}   
                                                iconType={'FontAwesome'}
                                                checkedIcon={<Image source={RADIOON_ON} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                                uncheckedIcon={<Image source={RADIOON_OFF} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                                checkedColor={DEFAULT_COLOR.base_color}                          
                                                checked={this.state.settleMethode === item.code}
                                                size={PixelRatio.roundToNearestPixel(15)}
                                                onPress={() => this.setState({settleMethode : item.code})}
                                            />
                                        </View>
                                        <TouchableOpacity 
                                            onPress={() => this.setState({settleMethode : item.code})}    
                                            style={[styles.detailRightWrap,{flex:7}]}
                                        >
                                            <CustomTextR style={CommonStyle.titleText}>{item.name}</CustomTextR>    
                                        </TouchableOpacity>
                                    </View>
                                )
                            })}
                            </View>  
                        </View>
                        {this.state.settleMethode === 'vbank' &&
                        <View style={[styles.formWarp2,{minHeight:75,marginBottom:10}]}>
                            <View style={styles.formTitleWrap}>
                                <CustomTextR style={CommonStyle.titleText}>입금자명</CustomTextR>
                                <CustomTextR style={CommonStyle.requiredText}></CustomTextR>
                            </View>
                            <View style={styles.formDataWrap}>
                                <TextInput       
                                    value={this.state.formAccountName}                             
                                    style={[CommonStyle.inputBlank,CommonStyle.defaultOneWayForm]}
                                    placeholder={'이름입력'}
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}
                                    onChangeText={text=>this.setState({formAccountName:text})}
                                    multiline={false}
                                    clearButtonMode='always'
                                />
                            </View>  
                            <View style={styles.formTitleWrap}>
                                <CustomTextR style={CommonStyle.titleText}>환불계좌</CustomTextR>
                                <CustomTextR style={CommonStyle.requiredText}></CustomTextR>
                            </View>
                            <View style={[styles.formTitleWrap,{marginBottom:10,flexDirection:'row'}]}>     
                                <DropBoxIcon />                          
                                <SelectType
                                    isSelectSingle
                                    style={CommonStyle.unSelectedBox}
                                    selectedTitleStyle={CommonStyle.selectBoxText}
                                    colorTheme={DEFAULT_COLOR.base_color_666}
                                    popupTitle="은행선택"
                                    title={'은행선택'}
                                    cancelButtonText="취소"
                                    selectButtonText="선택"
                                    data={this.state.bankArray}
                                    onSelect={data => {
                                        this.selectFilter(data)
                                    }}
                                    onRemoveItem={data => {
                                        this.state.bankArray[0].checked = true;
                                    }}
                                    initHeight={SCREEN_HEIGHT * 0.7}
                                />
                            </View>
                            <View style={styles.formDataWrap}>
                                <TextInput       
                                    value={this.state.formRefundAccountName}                             
                                    style={[CommonStyle.inputBlank,CommonStyle.defaultOneWayForm]}
                                    placeholder={'수신자명'}
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}
                                    onChangeText={text=>this.setState({formRefundAccountName:text})}
                                    multiline={false}
                                    clearButtonMode='always'
                                />
                            </View>  
                            <View style={styles.formDataWrap}>
                                <TextInput       
                                    value={this.state.formRefundAccount}                             
                                    style={[CommonStyle.inputBlank,CommonStyle.defaultOneWayForm]}
                                    placeholder={'계좌번호'}
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}
                                    onChangeText={text=>this.setState({formRefundAccount:text})}
                                    multiline={false}
                                    clearButtonMode='always'
                                />
                            </View>  
                        </View>
                        }
                    </View>
                    :
                    <View style={{paddingVertical:5,backgroundColor:'#fff'}} >
                        <View style={styles.formWarp2}>
                            <View style={styles.formTitleWrap}>
                                <CustomTextR style={CommonStyle.titleText}>결제수단 선택</CustomTextR>
                            </View>
                            <View style={{paddingVertical:5}}>
                                <View style={styles.boxSubWrap3}>                                   
                                    <TouchableOpacity 
                                        onPress={() => this.setState({settleMethode : 'point'})}    
                                        style={[styles.detailRightWrap,{flex:7}]}
                                    >
                                        <CustomTextR style={CommonStyle.titleText}>포인트결제</CustomTextR>    
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                    :
                    null
                    }
                    <View style={styles.termLineWrap} />  
                    <View style={{paddingVertical:5,backgroundColor:'#fff'}} >
                        <View style={styles.formWarp2}>
                            <View style={styles.formTitleWrap}>
                                <CustomTextR style={CommonStyle.titleText}>미출고시 조치방법</CustomTextR>
                                <TouchableOpacity 
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                    style={styles.tooltipWrap}        
                                >
                                    <Tooltip popover={this.renderTooltip('not')} width={SCREEN_WIDTH*0.5} height={90} backgroundColor="#ccc" skipAndroidStatusBar={true}>
                                        <Icon2 name="questioncircleo" size={PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16)} color="#bbb" />
                                    </Tooltip>
                                </TouchableOpacity>  
                            </View>
                            <View style={{paddingVertical:5}}>
                            {
                                mockData3.map((item, index) => {  
                                    return (
                                        <View key={index} style={styles.boxSubWrap3}>
                                            <View style={styles.detailLeftWrap}>
                                                <CheckBox 
                                                    containerStyle={{padding:0,margin:0}}   
                                                    iconType={'FontAwesome'}
                                                    checkedIcon={<Image source={RADIOON_ON} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                                    uncheckedIcon={<Image source={RADIOON_OFF} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                                    checkedColor={DEFAULT_COLOR.base_color}                          
                                                    checked={this.state.refundMethode === item.code}
                                                    size={PixelRatio.roundToNearestPixel(15)}                                    
                                                    onPress={() => this.setState({refundMethode : item.code})}
                                                />
                                            </View>
                                            <TouchableOpacity 
                                                onPress={() => this.setState({refundMethode : item.code})}
                                                style={[styles.detailRightWrap,{flex:7}]}
                                            >
                                                <CustomTextR style={CommonStyle.titleText}>{item.name}</CustomTextR>    
                                            </TouchableOpacity>
                                        </View>
                                    )
                                })
                                }
                            </View>
                        </View>
                    </View>
                    <View style={styles.termLineWrap} />  
                    <View style={styles.formWarp2} >
                        <View style={{paddingVertical:10,marginTop:20}}>
                            <CustomTextB style={styles.menuTitleText3}>개인정보 수집/제공</CustomTextB>    
                        </View>
                        <TouchableOpacity onPress={() => this.setState({agreeCheck:!this.state.agreeCheck})} style={{paddingVertical:5,flexDirection:'row'}}>
                            <View style={{width:30}}>
                                <CheckBox 
                                    containerStyle={{padding:0,margin:0}}   
                                    iconType={'FontAwesome'}
                                    checkedIcon={<Image source={CHECKNOX_ON} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                    uncheckedIcon={<Image source={CHECKNOX_OFF} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                    checkedColor={DEFAULT_COLOR.base_color}                          
                                    checked={this.state.agreeCheck}
                                    size={PixelRatio.roundToNearestPixel(30)}                                    
                                    onPress={() => this.setState({agreeCheck:!this.state.agreeCheck})}
                                />
                            </View>
                            <View style={{flex:1,paddingLeft:10}}>
                                <CustomTextR style={CommonStyle.titleText}>결제 진행시 필수 동의</CustomTextR>    
                            </View>
                        </TouchableOpacity>
                        <View style={{paddingVertical:5,flexDirection:'row'}}>
                            <View style={{flex:5,paddingLeft:40}}>
                                <CustomTextR style={CommonStyle.titleText}>개인정보 수집 이용 동의</CustomTextR>    
                            </View>
                            <TouchableOpacity 
                                style={styles.agreeWrap}
                                onPress={()=>this.setState({showModal2:true})}
                            >
                                <Image
                                    source={require('../../../assets/icons/btn_next.png')}
                                    resizeMode={"contain"}
                                    style={CommonStyle.defaultIconImage20}
                                />
                            </TouchableOpacity>
                        </View>
                        {
                            this.state.settleMethode === 'vbank' &&
                            <View style={{paddingTop:10,paddingLeft:5}}>
                                <CustomTextR style={[styles.menuTitleText,{color:'#4e4e4e'}]}>입금 확인 이후 주문이 완료됩니다.</CustomTextR>    
                            </View>
                        }
                    </View>
                    <FooterScreen contentHeight={20} screenProps={this.props} /> 
                    <View style={[CommonStyle.blankArea,{backgroundColor:DEFAULT_COLOR.base_background_color}]}></View>
                    { 
                        this.state.moreLoading &&
                        <View style={CommonStyle.moreWrap}>
                            <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} />
                        </View>
                    }
                </ScrollView>   
                <View style={CommonStyle.scrollFooterWrap}>
                    {
                        this.state.isSettleComplete ?
                        <View style={styles.scrollFooterLeftWrap2}>
                            <CustomTextB style={styles.scrollFooterText2}>주문완료</CustomTextB>
                        </View>
                        :
                        <TouchableOpacity 
                            style={CommonStyle.scrollFooterLeftWrap}
                            onPress={()=>this.actionOrder()}
                        >
                            <CustomTextB style={CommonStyle.scrollFooterText}>결제하기</CustomTextB>
                        </TouchableOpacity>
                    }
                </View>
                <Modal
                    //onBackdropPress={this._closeCouponModal}
                    animationType="slide"
                    //transparent={true}
                    onRequestClose={() => {this._closeCouponModal()}}                        
                    style={{justifyContent: 'flex-end',margin: 0}}
                    useNativeDriver={true}
                    animationInTiming={300}
                    animationOutTiming={300}
                    hideModalContentWhileAnimating                    
                    isVisible={this.state.showCouponModal}
                >
                    <Animated.View style={[styles.modalContainer,{ height: this.animatedHeight3 }]}>
                        <PopLayerCoupon screenState={this.state} screenProps={this.props} />
                    </Animated.View>
                </Modal> 
                <Modal
                    onBackdropPress={this.closeModal}
                    animationType="slide"
                    //transparent={true}
                    onRequestClose={() => {
                        this.closeModal()
                    }}                        
                    style={{justifyContent: 'flex-end',margin: 0}}
                    useNativeDriver={true}
                    animationInTiming={300}
                    animationOutTiming={300}
                    hideModalContentWhileAnimating                    
                    isVisible={this.state.showModal}
                >
                    <Animated.View style={[styles.modalContainer,{ height: this.animatedHeight }]}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            indicatorStyle={'white'}
                        >
                            <View style={styles.titleWrap}>
                                <TouchableOpacity 
                                    onPress={()=> this.closeModal()}
                                    hitSlop={{left:10,right:5,top:10,bottom:10}}
                                    style={{position:'absolute',top:0,right:20,width:22,height:22}}
                                >                        
                                    <Image
                                        source={require('../../../assets/icons/btn_close.png')}
                                        resizeMode={"contain"}
                                        style={CommonStyle.defaultIconImage}
                                    />
                                </TouchableOpacity>
                                <View style={{height:40,width:'80%',paddingLeft:20,flexDirection:'row',alignItems:'center'}}>
                                    <CustomTextM style={CommonStyle.titleText15}>배송지선택</CustomTextM>
                                    <CustomTextM style={CommonStyle.titleText15}>   </CustomTextM>
                                    <CustomTextR style={CommonStyle.ttileText}>등록지 총 {CommonFunction.currencyFormat(this.state.deliveryList.length)}개</CustomTextR>
                                </View>
                            </View>   
                            <View >       
                            {
                                this.state.deliveryList.length === 0 ?
                                <View style={styles.modalDefaultWrap}>
                                    <CustomTextR style={CommonStyle.ttileText}>등록된 배송지가 없습니다.</CustomTextR>
                                </View>
                                :
                                this.state.deliveryList.map((item, index) => {  
                                    return (
                                    <TouchableOpacity 
                                        key={index}  style={this.state.orderSeq === index ? styles.modalSelectedWrap : styles.modalDefaultWrap} 
                                        onPress={() => this.checkItem(index)}
                                    >
                                        <CheckBox 
                                            containerStyle={{padding:0,margin:0}}   
                                            iconType={'FontAwesome'}
                                            checkedIcon={<Image source={CHECKNOX_ON} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                            uncheckedIcon={<Image source={CHECKNOX_OFF} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                            checkedColor={DEFAULT_COLOR.base_color}                          
                                            checked={this.state.orderSeq === index ?true:false}
                                            size={PixelRatio.roundToNearestPixel(15)}                                    
                                            onPress={() => this.checkItem(index)}
                                        />
                                        <CustomTextR style={CommonStyle.titleText2}>{item.address} {item.address_detail}</CustomTextR>
                                    </TouchableOpacity>
                                    )
                                })
                            }    
                            </View> 
                            <View style={styles.bottomWrap}>
                                <TouchableOpacity 
                                    onPress={()=> this.closeModal()}
                                    style={styles.bottomDataWrap}
                                >
                                    <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#9f9f9f'}}>취소</CustomTextM>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={()=>this.btnchoiceDelivery(this.state.orderSeq)}
                                    style={[styles.bottomDataWrap,{backgroundColor:DEFAULT_COLOR.base_color}]}
                                >
                                    <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#fff'}}>선택</CustomTextM>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </Animated.View>
                </Modal>   
                <Modal
                    onBackdropPress={this.closeModal2}
                    animationType="fadeout"
                    //transparent={true}
                    onRequestClose={() => {
                        this.closeModal2()
                    }}                        
                    style={{justifyContent: 'flex-end',margin: 0}}
                    useNativeDriver={true}
                    animationInTiming={300}
                    animationOutTiming={300}
                    hideModalContentWhileAnimating                    
                    isVisible={this.state.showModal2}
                >
                    <Animated.View style={[styles.modalContainer,{ height: this.animatedHeight2 }]}>
                        <View style={{height:60,justifyContent:'flex-end',alignItems:'flex-end',borderBottomColor:'#ccc',borderBottomWidth:1}}>
                            <TouchableOpacity 
                                onPress={()=> this.closeModal2()}
                                hitSlop={{left:10,right:5,top:10,bottom:10}}
                                style={{position:'absolute',bottom:10,right:10,width:22,height:22}}
                            >
                                <Image
                                    source={require('../../../assets/icons/btn_close.png')}
                                    resizeMode={"contain"}
                                    style={CommonStyle.checkboxIcon}
                                />
                            </TouchableOpacity>
                        </View>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            indicatorStyle={'white'}
                        >
                            <UseYakwanScreen />
                        </ScrollView>
                    </Animated.View>
                </Modal>             
            </SafeAreaView>
        );
        }
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : "#fff"
    },
    tooltipWrap : {
        justifyContent:'center',alignItems:'center',position:'absolute',right:0,top :0, bottom:0,width:20
    },
    deliveryWrap : {
        flex:1,paddingHorizontal:20,paddingVertical:5
    },
    deliveryDataWrap : {
        borderWidth:1,borderColor:DEFAULT_COLOR.base_color,flexDirection:'row'
    },
    deliveryAddressWrap : {
        flex:3,justifyContent:'center',paddingHorizontal:10,paddingVertical : Platform.OS === 'ios' ? 10 :0
    },
    deliveryButtonWrap: {
        flex:1,justifyContent:'center',alignItems:'flex-end',paddingRight:5
    },
    scrollFooterLeftWrap2 : {
        flex:1,height:DEFAULT_CONSTANTS.BottomHeight,backgroundColor:DEFAULT_COLOR.base_background_color,justifyContent:'center',alignItems:'center'
    },
    scrollFooterText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)
    },
    popLayerWrap : {
        width:SCREEN_WIDTH*0.9,height:SCREEN_HEIGHT*0.6,backgroundColor:'transparent',margin:0,padding:0
    },
    fixedUpButton : {
        position:'absolute',bottom:50,right:20,width:50,height:50,borderColor:'#ccc',borderWidth:1,borderRadius:25,alignItems:'center',justifyContent:'center',zIndex:10
    },
    defaultWrap:{
        flex:1,borderTopWidth:1,borderTopColor:DEFAULT_COLOR.input_border_color,backgroundColor : "#fff",justifyContent:'center',paddingHorizontal:20,backgroundColor:DEFAULT_COLOR.input_bg_color,paddingVertical:15
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    agreeWrap : {
        flex:1,alignItems:'flex-end',justifyContent:'center',paddingRight:20
    },
    topRepeatWrap : {
        marginHorizontal:10,paddingVertical:10,justifyContent:'center',alignItems:'center',borderWidth:1,borderColor:DEFAULT_COLOR.base_color
    },
    bottomCancleWrap : {
        marginHorizontal:10,paddingVertical:10,justifyContent:'center',alignItems:'center',backgroundColor:DEFAULT_COLOR.base_color
    },
    mainTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)
    },
    termLineWrap : {
        flex:1,
        paddingVertical:5,
        backgroundColor:'#f5f6f8'
    },
    toggleBoxWrap : {
        backgroundColor: '#fff', borderBottomWidth: 0,paddingHorizontal:10
    },
    boxWrap : {
        flex:1,
        flexDirection:'row',    
        flexGrow:1,    
        paddingHorizontal:20,paddingVertical:15,
        backgroundColor:'#f5f6f8',
        borderBottomWidth:1,
        borderBottomColor : DEFAULT_COLOR.input_border_color
    },
    boxSubWrap : {
        flex:1,
        backgroundColor:'#fff',
        paddingHorizontal:10,
        borderBottomWidth:1,
        borderBottomColor : DEFAULT_COLOR.input_border_color
    },
    itemTitleWrap : {
        flex:1,padding:10,borderBottomColor:'#efefef',borderBottomWidth:1
    },
    itemDataWrap : {
        flex:1,flexDirection:'row',flexGrow:1,  alignItems: 'center', padding:10
    },
    formWarp : {
        flex:1,paddingHorizontal:20,paddingVertical:5,marginTop:10,borderTopWidth:1,borderTopColor:DEFAULT_COLOR.base_background_color
    },
    formWarp2 : {
        flex:1,paddingHorizontal:20
    },
    formTitleWrap : {
        height:30,paddingVertical:5,flexDirection:'row',marginTop:5
    },
    formDataWrap : {
        height:40,paddingVertical:5
    },
    boxSubWrap2 : {
        flex:1,  
        flexDirection:'row',
        backgroundColor:'#fff',
        paddingHorizontal:20,paddingVertical:5,
        justifyContent: 'center',
    },
    unitWrap : {
        flex:1,flexDirection:'row',alignItems:'center'
    },
    boxSubWrap3 : {
        flex:1,  
        flexDirection:'row',    
        backgroundColor:'#fff',
        paddingHorizontal:0,paddingVertical:5,
        justifyContent: 'center',
    },
    dataSubWrap : {
        height:40,
        flexDirection:'row',    
        flexGrow:1,    
        paddingHorizontal:20,paddingVertical:5,
        alignItems: 'center',        
    },
    boxCenterWrap : {
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    boxLeftWrap : {
        flex:5,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center'
    },
    boxRightWrap : {
        flex:1,        
        justifyContent:'center',
        alignItems:'flex-end'
    },
    detailLeftWrap : {
        flex:1,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center'
    },
    detailRightWrap : {
        flex:3,        
        justifyContent:'center',
        paddingLeft:10
    },
    detailRightWrap2 : {       
        justifyContent:'center',
        paddingLeft:10,flex:1,flexDirection:'row',alignItems:'flex-end',justifyContent:'center'
    },
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize25)
    },
    menuText888 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),color:'#888'
    },
    menuTitleText3 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20)
    },
    menuTitleText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#fff'
    },
    menuTitleSubText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#111'
    },
    dataTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)
    },
    dataTitleTextBank : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize5)
    },
    dataTitleText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#666'
    },
    bottomBoxSubWrap : {
        height:40,
        flexDirection:'row',
        paddingHorizontal:20,paddingVertical: 5
    },
    bottomBoxLeftWrap : {
        flex:1,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center'
    },
    bottomBoxRightWrap : {
        flex:2,        
        justifyContent:'center',
        alignItems:'flex-end'
    },
    titleWrap : {
        flex:0.5,justifyContent:'center',borderBottomColor:'#ccc',borderBottomWidth:1
    },
    ballWarp : {
        marginTop: 0,width: 50,height: 15,borderRadius: 10,padding:5,borderWidth:0.5,borderColor:'#ebebeb',
        ...Platform.select({
            ios: {
              shadowColor: "#ccc",
              shadowOpacity: 0.5,
              shadowRadius: 2,
              shadowOffset: {
                height: 0,
                width: 0.1
             }
           },
            android: {
              elevation: 5
           }
         })
    },
    ballStyle : {
        width: 24,height: 24,borderRadius: 12,backgroundColor:'#fff',
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
        paddingHorizontal:20,paddingVertical:15,flexDirection:'row'
    },
    modalDefaultWrap : {
        paddingHorizontal:20,paddingVertical:15,flexDirection:'row',alignItems:'center'
    },
    modalSelectedWrap : {
        paddingHorizontal:20,paddingVertical:15,backgroundColor:'#f4f4f4',flexDirection:'row',alignItems:'center'
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
        userToken : state.GlabalStatus.userToken
    };
}
function mapDispatchToProps(dispatch) {
    return {        
        _saveUserToken:(str)=> {
            dispatch(ActionCreator.saveUserToken(str))
        },
        _saveNonUserToken:(str)=> {
            dispatch(ActionCreator.saveNonUserToken(str))
        }
    };
}


export default connect(mapStateToProps,mapDispatchToProps)(OrderDetailScreen);