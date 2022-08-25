import React from 'react';
import { SafeAreaView,View,ScrollView,Dimensions,StyleSheet,ImageBackground,StatusBar, Platform,TouchableOpacity,PixelRatio,Image,ActivityIndicator,BackHandler,Animated } from 'react-native';
import 'moment/locale/ko'
import  moment  from  "moment";
import Modal from 'react-native-modal';
import {connect} from 'react-redux';
import ActionCreator from '../../../Ducks/Actions/MainActions';
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../../Constants';
import CommonStyle from '../../../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
import CommonFunction from '../../../Utils/CommonFunction'
import CommonUtil from '../../../Utils/CommonUtil';
import OrderDetail from '../../Order/OrderDetail';
import Loader from '../../../Utils/Loader';
import { apiObject } from "../../Apis";

import {CustomText, CustomTextR, CustomTextB, CustomTextM, CustomTextL, TextRobotoM, TextRobotoB, TextRobotoR} from '../../../Components/CustomText';
const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");
import { resultStyles, resultSuccessStyles, resultFailureStyles } from '../styles';
const { wrapper, title, listContainer, list, label, value } = resultStyles;
const startDateText =  moment().subtract(-3, 'd').format('YYYY년 MM월 DD일');
class PayResultScreen extends React.Component {
    constructor(props) {
        super(props);     
        this.state = {
            loading : true,
            moreLoading :false,
            showModal : false,
            paymentInformation : {
                vbank_code : '000',
                vbank_name :'shinhan',
                vbank_holder : 'dddd',
                vbank_num :11111111
            },
            response : this.props.extraData.response,
            settleData : null,
            information : {
                buyer_addr :'ddd',
                buyer_name :'ghd',
                buyer_email :'eee',
                buyer_postcode : 11111,
                buyer_tel :'telk',
                pay_method : 'vbank'
            },
            closeModal : this.closeModal.bind(this)
        }
    }

    async UNSAFE_componentWillMount() {         
        //console.log('rUNSAFE_componentWillMountesponse',this.props.extraData)
        //console.log('settleData',this.props.extraData.settleData)
        if ( this.props.extraData.settleData.pay_method === 'point' ) {
            //console.log('this.props.extraData.response.pay_method3',this.props.extraData.settleData.pay_method)
            this.setState({
                settleData : this.props.extraData.settleData,
                information : this.props.extraData.settleData.information
            })
            
            setTimeout(
                () => {            
                    this.updateSettleInformation();
                },500
            )
        }else{
            if ( (this.props.extraData.response.imp_success === 'true' ||  this.props.extraData.response.imp_success === true ) && this.props.extraData.response.imp_uid )  {
                this.setState({
                    settleData : this.props.extraData.settleData,
                    information : this.props.extraData.settleData.information
                })
                await this.refreshTextBookInfo(this.props.extraData.response.imp_uid)
            }else{
            CommonFunction.fn_call_toast('정상적으로 결제가 이루어지지 않았습니다.\n잠시 뒤에 다시 이용해주세요',2000);
            }
        }
        
        this.props.navigation.addListener('focus', () => {            
            BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        })

        this.props.navigation.addListener('blur', () => {            
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        })
    } 

    componentDidMount () {    
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton); 
    }

    handleBackButton = () => {     
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);               
        return true;
    };
    
    refreshTextBookInfo = async(uid) => {
        if ( uid && this.props.extraData.settleData.iamPortTokenKey) {
            fetch(DEFAULT_CONSTANTS.iamPortAPIDomain + '/payments/' + uid + '?_token='+this.props.extraData.settleData.iamPortTokenKey,{
                method: "GET"
            })
            .then(response => response.json())
            .then(responseJson => {
                //console.log(' refreshTextB333ookInfo()', responseJson)
                if ( responseJson.code !== -1 ) {
                    this.setState({            
                        paymentInformation : responseJson.response,
                        loading:false
                    });        
                    //결제정보를 업데이트 한다
                    //console.log(' refreshTextBookInfo success', this.props.extraData.settleData.information.productInfo)
                    this.updateSettleInformation(responseJson.response)
                }else{
                    this.failCallAPi()
                }
                
            })
            .catch(error => {
                console.log('login error333 => ', error);
                this.failCallAPi()
            });
        }else{
            this.failCallAPi();
        }
    }

    failCallAPi = () => {
        let message = "처리중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요";
        let timesecond = 1000;
        CommonFunction.fn_call_toast(message,timesecond);
        this.setState({
            loading:false
        }); 
        setTimeout(
            () => {            
                this.props.navigation.popToTop()
            },1000
        )
        
    }

    updateSettleInformation = async (tsettleData = null ) => {
        //console.log(' tsettleData()', tsettleData)
        //console.log(' screenData()', this.state.settleData)
        this.setState({moreLoading:true})
        let returnCode = {code:9998};     

        //console.log(' orderBase',this.state.settleData.information);
        //console.log(' orderDetail',this.state.settleData.information)
        //console.log(' orderProduct',this.state.settleData.information.productInfo)
        //console.log(' cart_array',this.state.settleData.information.cartList)
        //console.log(' usePoint',this.state.settleData.information.formUsePoint)
        //console.log(' useCoupon',this.state.settleData.information.useCouponData)
        const baseData = this.state.settleData;
        const baseInfo = this.state.settleData.information;
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/order/regist';
            // console.log('url',url) 
            const token = this.props.userToken.apiToken;
            let md5Tel = CommonUtil.isEmpty(baseInfo.formUserPhone) ? null : CommonFunction.fn_dataEncode(baseInfo.formUserPhone.replace("-",""));
            let sendData = {
                memberIdx : this.props.userToken.member_pk,
                orderBase : {
                    settle_type : baseData.pay_method,
                    merchant_uid : baseData.merchant_uid,
                    order_status : baseData.pay_method === 'vbank' ? 'WAIT' : 'INCOME',
                    product_amount : baseInfo.selectedTotalAmount,
                    reward_point : parseInt(baseInfo.selectedRewardAmount),
                    reward_rate : baseInfo.userRate,
                    discount_amount : baseInfo.selectedTotalDiscount,
                    total_amount : baseInfo.seletedSettleAmount,
                    coupon_amount : baseInfo.formUseCoupon,
                    point_amount : baseInfo.formUsePoint,
                    delivery_amount : baseInfo.selectedDeliveryAmount,
                    income_dt : baseData.pay_method === 'vbank' ? null : moment().unix(),
                    agent_code : baseInfo.formSalesManCode,
                    refund_type : baseInfo.refundMethode,
                    delivery_address_pk : baseInfo.formAddressPk, 
                    delivery_address : baseInfo.formAddressData.address + baseInfo.formAddressData.address_detail,
                    delivery_receiver : baseInfo.formUserName,
                    delivery_phone : md5Tel,
                    delivery_memo :baseInfo.formUserMemo,
                    income_limit_dt : moment().subtract(-3, 'd').unix(),
                    vbank_accountname :  baseInfo.formAccountName,
                    refund_accountname :  baseInfo.formRefundAccountName,
                    refund_bankcode :baseInfo.formRefundBankCode,
                    refund_bankname :baseInfo.formRefundBankName,
                    refund_bankaccount :baseInfo.formRefundAccount,
                    member_info : //baseInfo.userInfo 
                    {
                        user_id:baseInfo.userInfo.user_id,
                        member_pk:baseInfo.userInfo.member_pk,
                        name:baseInfo.userInfo.name,
                        email:baseInfo.userInfo.email,
                        phone:baseInfo.userInfo.phone,
                        is_salesman:baseInfo.userInfo.is_salesman,
                        gradeCode:baseInfo.userInfo.gradeCode,
                        gradeName:baseInfo.userInfo.gradeName
                    }
                },
                orderDetail : tsettleData,
                orderProduct : baseInfo.productInfo,
   
                cart_array : baseInfo.cartList,
                usePoint : baseInfo.formUsePoint,
                useCoupon : baseInfo.useCouponData,
                //{"coupon_pk": 37, "member_pk": 35, "price": 10000}
            } 
            //console.log('sendData',sendData) 
            returnCode = await apiObject.API_registCommon(this.props,url,token,sendData);
            //console.log('returnCode',returnCode) 
            //
            if ( returnCode.code === '0000'  ) {
                CommonFunction.fn_call_toast('정상적으로 주문이 완료되었습니다.',2000);
                /* let userCartCount = CommonUtil.isEmpty(returnCode.data.cartTotalCount) ? 0 : returnCode.data.cartTotalCount ;
                let orderingcount = CommonUtil.isEmpty(returnCode.data.orderingcount) ? 0 : returnCode.data.orderingcount ;
                this.props._fn_getUserCartCount(userCartCount);
                this.props._fn_getUserOrderingCount(orderingcount); */

                this.props._fn_getUserCartCount(CommonUtil.isEmpty(returnCode.data.carttotalcount)?0:returnCode.data.carttotalcount);
                this.props._fn_getUserZzimCount(CommonUtil.isEmpty(returnCode.data.zzimtotalcount)?0:returnCode.data.zzimtotalcount);
                this.props._fn_getUserOrderingCount(CommonUtil.isEmpty(returnCode.data.orderingcount)?0:returnCode.data.orderingcount);
                this.props._fn_getUserPoint(CommonUtil.isEmpty(returnCode.data.remain_reward)?0:returnCode.data.remain_reward);

            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.\n[ERR]' + returnCode.msg ,2000);
                setTimeout(
                    () => {            
                        this.props.navigation.popToTop()
                    },2000
                )
            }
            
            this.setState({moreLoading:false,loading:false})
        }catch(e){
            console.log('eeeee',e) 
            this.setState({loading:false,moreLoading : false})
        }
        
    }

    backScreen = () => {
        //console.log('this.state.information.retunrScreen',this.props.extraData.settleData.information.retunrScreen)
        if ( !CommonUtil.isEmpty(this.props.extraData.settleData.information.retunrScreen)) {
            
            this.props.navigation.replace(this.props.extraData.settleData.information.retunrScreen,{
                articleInfo : this.props.extraData.settleData.information.articleInfo,
                articleidx : this.props.extraData.settleData.information.articleidx,
            });
                      
        }else{
            this.props.navigation.popToTop();
        }
    }

    animatedHeight = new Animated.Value(SCREEN_HEIGHT*0.9);
    showModal = () => {
        this.setState({showModal : true})
    }
    closeModal = () => {
        this.setState({showModal : false})
    }

    render() {
        if ( this.state.loading ) {
            return (
                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} /> 
            )
        }else {
            const { imp_success, success } = this.state.response;      
            const isSuccess = !(imp_success === 'false' || imp_success === false || success === 'false' || success === false);
            //const { icon, btn, btnText, btnIcon } = isSuccess ? resultSuccessStyles : resultFailureStyles;
            return (
                <SafeAreaView style={ styles.container }>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        indicatorStyle={'white'}
                        scrollEventThrottle={16}
                        style={{backgroundColor:'#fff',minHeight:SCREEN_HEIGHT-100}}
                    >
                        <View style={styles.topWrapper}>
                            <View style={styles.titleHeaderInfo}>                    
                                <View style={styles.commoneTopWrap}>
                                    <View style={{paddingVertical:10}}>
                                        <Image 
                                            source={require('../../../../assets/icons/check_ellipse_ic.png')}
                                            resizeMode={'contain'}
                                            style={{width:PixelRatio.roundToNearestPixel(40),height:PixelRatio.roundToNearestPixel(40)}}
                                        />
                                    </View>
                                    <View style={{paddingVertical:5}}>
                                        <CustomTextR style={styles.resultText}>{`주문을  ${isSuccess ? '완료' : '실패'}하였습니다`}
                                        </CustomTextR>
                                    </View>
                                    { this.state.settleData.settleMethodeCode === 'vbank' &&
                                    <View style={{paddingVertical:10}}>
                                        <CustomTextR style={{color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),letterSpacing:PixelRatio.roundToNearestPixel(-0.6)}}>아래의 무통장입금 정보를 확인하여
                                        </CustomTextR>
                                        <CustomTextR style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),textDecorationLine:'underline',letterSpacing:PixelRatio.roundToNearestPixel(-0.6)}}>
                                            {startDateText}(주문일로부터 3일내)까지
                                        </CustomTextR>
                                        <CustomTextR style={{color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),letterSpacing:PixelRatio.roundToNearestPixel(-0.6)}}>입금해주시기 바랍니다.
                                        </CustomTextR>
                                    </View>
                                    }  
                                </View>
                            </View>
                        </View>
                        <View style={styles.termLineWrap} /> 
                        { this.state.settleData.settleMethodeCode === 'vbank'  && 
                        <View>
                            <View style={styles.middleWrapper}>
                                <CustomTextB style={styles.vbankTitleText}>무통장 입금정보</CustomTextB>
                                <View style={styles.commonLines} />  
                                <View style={styles.vbankDataWrap}>
                                    <View style={styles.vbankLeftWrap} >
                                        <CustomTextR style={styles.defaultFont1}>예금주</CustomTextR>
                                    </View> 
                                    <View style={styles.vbankRightWrap} >
                                        <CustomTextM style={styles.defaultFont1}>{this.state.paymentInformation.vbank_holder}</CustomTextM>
                                    </View>                
                                </View>
                                <View style={{flex:1,flexDirection:'row',paddingVertical:10}}>
                                    <View style={styles.vbankLeftWrap} >
                                        <CustomTextR style={styles.defaultFont1}>은행</CustomTextR>
                                    </View> 
                                    <View style={styles.vbankRightWrap} >
                                        <CustomTextM style={styles.defaultFont1}>{this.state.paymentInformation.vbank_name}</CustomTextM>
                                    </View>                
                                </View>
                                <View style={{flex:1,flexDirection:'row',paddingVertical:10}}>
                                    <View style={styles.vbankLeftWrap} >
                                        <CustomTextR style={styles.defaultFont1}>계좌번호</CustomTextR>
                                    </View> 
                                    <View style={styles.vbankRightWrap} >
                                        <CustomTextM style={styles.defaultFont1}>{this.state.paymentInformation.vbank_num}</CustomTextM>
                                    </View>                
                                </View>
                            </View>
                        </View>  
                        }
                        <View style={styles.termLineWrap} /> 

                        <View style={styles.middleWrapper}>
                            <CustomTextB style={styles.vbankTitleText}>주문내역</CustomTextB>
                            <View style={styles.commonLines} />  
                            <View style={styles.vbankDataWrap}>
                                <View style={styles.vbankLeftWrap} >
                                    <CustomTextR style={styles.defaultFont1}>주문번호</CustomTextR>
                                </View> 
                                <View style={styles.orderRightWrap} >
                                    <CustomTextM style={styles.defaultFont1}>{this.state.settleData.merchant_uid}</CustomTextM>
                                </View>                
                            </View>
                            <View style={styles.vbankDataWrap}>
                                <View style={styles.vbankLeftWrap} >
                                    <CustomTextR style={styles.defaultFont1}>상품금액</CustomTextR>
                                </View> 
                                <View style={styles.orderRightWrap} >
                                <TextRobotoR style={styles.defaultFont1}>{CommonFunction.currencyFormat(this.state.information.selectedTotalAmount)} 원</TextRobotoR>
                                </View>                
                            </View>
                            <View style={styles.vbankDataWrap}>
                                <View style={styles.vbankLeftWrap} >
                                    <CustomTextR style={styles.defaultFont1}>할인금액</CustomTextR>
                                </View> 
                                <View style={styles.orderRightWrap} >
                                    <TextRobotoR style={styles.defaultFont1}>{CommonFunction.currencyFormat(this.state.information.selectedTotalDiscount)} 원</TextRobotoR>
                                </View>                
                            </View>
                            <View style={styles.vbankDataWrap}>
                                <View style={styles.vbankLeftWrap} >
                                    <CustomTextR style={styles.defaultFont1}>배송비</CustomTextR>
                                </View> 
                                <View style={styles.orderRightWrap} >
                                    <TextRobotoR style={styles.defaultFont1}>{CommonFunction.currencyFormat(this.state.information.selectedDeliveryAmount)} 원</TextRobotoR>
                                </View>                
                            </View>
                            <View style={styles.vbankDataWrap}>
                                <View style={styles.vbankLeftWrap} >
                                    <CustomTextR style={styles.defaultFont1}>포인트/쿠폰사용</CustomTextR>
                                </View> 
                                <View style={styles.orderRightWrap} >
                                    <TextRobotoR style={styles.defaultFont1}>{CommonFunction.currencyFormat(parseInt(this.state.information.formUsePoint)+parseInt(this.state.information.formUseCoupon))} 원</TextRobotoR>
                                </View>                
                            </View>
                            <View style={styles.vbankDataWrap}>
                                <View style={styles.vbankLeftWrap} >
                                    <CustomTextR style={styles.defaultFont1}>총 결제금액</CustomTextR>
                                </View> 
                                <View style={styles.orderRightWrap} >
                                    <TextRobotoB style={styles.defaultFont1}>{CommonFunction.currencyFormat(this.state.information.seletedSettleAmount)} 원</TextRobotoB>
                                </View>                
                            </View>
                           
                        </View>
                        <View style={CommonStyle.blankArea}></View>
                        { this.state.moreLoading &&
                            <View style={CommonStyle.moreWrap}>
                                <Loader screenState={{isLoading:this.state.moreLoading,color:DEFAULT_COLOR.base_color}} />
                            </View>
                        }
                          
                    </ScrollView>
                    
                    <View style={CommonStyle.scrollFooterWrap}>
                        <TouchableOpacity 
                           style={CommonStyle.scrollFooterLeftWrap}
                            onPress={()=> this.showModal()}
                        >
                            <CustomTextB style={styles.menuOnText}>주문상세보기</CustomTextB>
                        </TouchableOpacity>
                        <TouchableOpacity 
                           style={CommonStyle.scrollFooterRightWrap}
                            onPress={()=> this.props.navigation.popToTop()}
                        >
                            <CustomTextB style={styles.menuOffText}>쇼핑계속하기</CustomTextB>
                        </TouchableOpacity>
                    </View> 
                    <Modal
                        //onBackdropPress={this.closeModal}
                        animationType="slide"
                        //transparent={true}
                        onRequestClose={() => {
                            //this.closeModal()
                        }}                        
                        style={{justifyContent: 'flex-end',margin: 0}}
                        useNativeDriver={true}
                        animationInTiming={300}
                        animationOutTiming={300}
                        hideModalContentWhileAnimating                    
                        isVisible={this.state.showModal}
                    >
                        <Animated.View style={[styles.modalContainer,{ height: this.animatedHeight }]}>
                            <OrderDetail screenState={this.state} screenProps={this.props} />
                        </Animated.View>
                    </Modal>    
                </SafeAreaView>
                )
            }
        }
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            //alignItems: 'center',
            backgroundColor : '#fff',
        },
        termLineWrap : {
            flex:1,
            paddingVertical:5,
            backgroundColor:DEFAULT_COLOR.base_background_color
        },
        loadingWrap : {
            flex: 1,width:'100%',backgroundColor : "#fff",textAlign: 'center',alignItems: 'center',justifyContent: 'center'
        },
        loadingText : {
            color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small)
        },
        resultText : {
            color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20),letterSpacing:PixelRatio.roundToNearestPixel(-1)
        },
        vbankDataWrap : {
            flex:1,flexDirection:'row',paddingVertical:10
        },
        vbankTitleText : {
            color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),letterSpacing:PixelRatio.roundToNearestPixel(-0.75)
        },
        vbankLeftWrap : {flex :1},
        vbankRightWrap : {flex:3,alignItems:'flex-end'},
        orderLeftWrap : {flex :1},
        orderRightWrap : {flex:2,alignItems:'flex-end'},
        commonLines : {
            height:1,width:'100%',backgroundColor:DEFAULT_COLOR.base_color_ccc,marginVertical:10
        },
        IndicatorContainer : {
            flex: 1,
            width:'100%',
            backgroundColor : '#fff',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
        },
        topWrapper : {
            alignItems : 'center',
            justifyContent : 'center',
            paddingVertical:20,
        },
        middleWrapper : {
            flex:1,
            paddingVertical:30,
            paddingHorizontal:30
        },    
        titleHeaderInfo : {
            flex:1,
            width:SCREEN_WIDTH - 20,
            backgroundColor : 'transparent',
        },
        commoneTopWrap : {
            borderTopStartRadius : 20,
            borderTopEndRadius : 20,        
            backgroundColor : 'transparent',
            alignItems:'center',
        },
            defaultFont1 : {
            color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),letterSpacing:PixelRatio.roundToNearestPixel(-0.75)
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
    })

function mapStateToProps(state) {
    return {
        userToken: state.GlabalStatus.userToken,
    };
}
function mapDispatchToProps(dispatch) {
    return {        
        _saveUserToken:(str)=> {
            dispatch(ActionCreator.saveUserToken(str))
        },
        _fn_getUserCartCount : (num) => {
            dispatch(ActionCreator.fn_getUserCartCount(num))
        },
        _fn_getUserOrderingCount : (num) => {
            dispatch(ActionCreator.fn_getUserOrderingCount(num))
        },
        _fn_getUserZzimCount : (num) => {
            dispatch(ActionCreator.fn_getUserZzimCount(num))
        },
        _fn_getUserPoint : (num) => {
            dispatch(ActionCreator.fn_getUserPoint(num))
        },
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(PayResultScreen);
/* 
tsettleData() {"amount": 6500, "apply_num": null, "bank_code": null, "bank_name": null, "buyer_addr": null, "buyer_email": "111fdjkf@nate.com", "buyer_name": "민누이 주식회사", "buyer_postcode": null, "buyer_tel": "0838340803", "cancel_amount": 0, "cancel_history": [], "cancel_reason": null, "cancel_receipt_urls": [], "cancelled_at": 0, "card_code": null, "card_name": null, "card_number": null, "card_quota": 0, "card_type": null, "cash_receipt_issued": false, "channel": "mobile", "currency": "KRW", "custom_data": null, "customer_uid": null, "customer_uid_usage": null, "escrow": false, "fail_reason": null, "failed_at": 0, "imp_uid": "imp_694067882726", "merchant_uid": "mid_1612947067632", "name": "Test1611276668", "paid_at": 0, "pay_method": "vbank", "pg_id": "tlgdacomxpay", "pg_provider": "uplus", "pg_tid": "tlgda2021021017512690160", "receipt_url": "http://pgweb.dacom.net:7085/pg/wmp/etc/jsp/Receipt_Link.jsp?mertid=tlgdacomxpay&tid=tlgda2021021017512690160&authdata=74cd376add8d9abe1292d61ec4dd0a0c", "started_at": 1612947067, "status": "ready", "user_agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148", "vbank_code": "088", "vbank_date": 1613141999, "vbank_holder": "이크레디트", "vbank_issued_at": 1612947086, "vbank_name": "신한", "vbank_num": "X3790127821223"}
[Wed Feb 10 2021 17:55:44.915]  LOG       screenData() {"amount": 6500, "app_scheme": "kr.co.hexagonadmin", "buyer_email": "111fdjkf@nate.com", "buyer_name": "민누이 주식회사", "buyer_tel": "0838340803", "escrow": false, "iamPortTokenKey": "496e31dec2e7db1dae9eda7a944a6a9a33e64adb", "information": {"TextUserCode": "PUPRUX", "canUsePount": "100000", "cartList": [[Object]], "formAddressData": {"address": "충청북도 괴산군 괴산읍", "address_detail": "31", "is_main": true, "member_pk": 35, "memberdelivery_pk": 40, "zipcode": "00000"}, "formAddressPk": 40, "formRefundAccount": "111111111111", "formRefundBankCode": "011", "formRefundBankName": "농협", "formSalesManCode": "A001", "formUseCoupon": 0, "formUsePoint": 0, "formUserEmail": null, "formUserMemo": "TESTTTTTT", "formUserName": "민누이 주식회사", "formUserPhone": "0838340803", "memberidx": "35", "productInfo": [[Object]], "refundMethode": "Cash", "selectedArray": [[Object]], "selectedDeliveryAmount": 5500, "selectedTotalAmount": 1000, "selectedTotalDiscount": 0, "seletedSettleAmount": 6500, "settleMethode": 3, "useCouponData": {}, "useCouponIdx": 0, "userInfo": {"apiToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjEifQ.eyJ1c2VyX2lkIjoiMTIzNDU2Nzg5IiwibWVtYmVyX3BrIjoiMzUiLCJuYW1lIjoi66-864iE7J20IOyjvOyLne2ajOyCrCIsImVtYWlsIjoiRmlVQzRwS3FNWkIyNjlNSGtJQmVLM2c5enE2K0g4bGI4RGp4NUloWnRvQT0iLCJwaG9uZSI6IjNQWVhWeWN6MzY2cWl0QWdWN0hGNlE9PSIsImlzX3NhbGVzbWFuIjpmYWxzZSwiZ3JhZGVfY29kZSI6IkJyb256ZSIsImdyYWRlX25hbWUiOiLruIzroaDspogiLCJpYXQiOjE2MTI5NDQ3MzMsImV4cCI6MTYxMjk4NzkzMywiYXVkIjoiMzUiLCJpc3MiOiJzdXBlcmJpbmRlciIsInN1YiI6InN1cGVyYmluZGVyIiwianRpIjoiMzUifQ.-EYkk_2Dv2SlFS24LH9jsKQC9YYE-8p4xy5-YHXm4eg", "email": "FiUC4pKqMZB269MHkIBeK3g9zq6+H8lb8Djx5IhZtoA=", "gradeCode": "Bronze", "gradeName": "브론즈", "is_salesman": false, "member_pk": "35", "name": "민누이 주식회사", "phone": "3PYXVycz366qitAgV7HF6Q==", "user_id": "123456789"}}, "m_redirect_url": "http://localhost/iamport", "merchant_uid": "mid_1612947067632", "name": "Test1611276668", "notice_url": "", "pay_method": "vbank", "pg": "uplus", "resultScreen": "PaymentResultStack", "settleLimitDate": "20210212", "settleMethodeCode": "vbank", "settleMethodeName": "무통장입금", "vbank_due": "20210212"}
[Wed Feb 10 2021 17:55:44.920]  LOG       orderBase {"TextUserCode": "PUPRUX", "canUsePount": "100000", "cartList": [{"cart_pk": 141}], "formAddressData": {"address": "충청북도 괴산군 괴산읍", "address_detail": "31", "is_main": true, "member_pk": 35, "memberdelivery_pk": 40, "zipcode": "00000"}, "formAddressPk": 40, "formRefundAccount": "111111111111", "formRefundBankCode": "011", "formRefundBankName": "농협", "formSalesManCode": "A001", "formUseCoupon": 0, "formUsePoint": 0, "formUserEmail": null, "formUserMemo": "TESTTTTTT", "formUserName": "민누이 주식회사", "formUserPhone": "0838340803", "memberidx": "35", "productInfo": [{"checked": true, "child": [Array], "id": "67", "product_name": "Test1611276668", "product_pk": "67", "quantity": 1, "thumb_img": "/public/product/1611276697275_s1.jpg", "totalPrice": 1000}], "refundMethode": "Cash", "selectedArray": [{"checked": true, "child": [Array], "id": "67", "product_name": "Test1611276668", "product_pk": "67", "quantity": 1, "thumb_img": "/public/product/1611276697275_s1.jpg", "totalPrice": 1000}], "selectedDeliveryAmount": 5500, "selectedTotalAmount": 1000, "selectedTotalDiscount": 0, "seletedSettleAmount": 6500, "settleMethode": 3, "useCouponData": {}, "useCouponIdx": 0, "userInfo": {"apiToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjEifQ.eyJ1c2VyX2lkIjoiMTIzNDU2Nzg5IiwibWVtYmVyX3BrIjoiMzUiLCJuYW1lIjoi66-864iE7J20IOyjvOyLne2ajOyCrCIsImVtYWlsIjoiRmlVQzRwS3FNWkIyNjlNSGtJQmVLM2c5enE2K0g4bGI4RGp4NUloWnRvQT0iLCJwaG9uZSI6IjNQWVhWeWN6MzY2cWl0QWdWN0hGNlE9PSIsImlzX3NhbGVzbWFuIjpmYWxzZSwiZ3JhZGVfY29kZSI6IkJyb256ZSIsImdyYWRlX25hbWUiOiLruIzroaDspogiLCJpYXQiOjE2MTI5NDQ3MzMsImV4cCI6MTYxMjk4NzkzMywiYXVkIjoiMzUiLCJpc3MiOiJzdXBlcmJpbmRlciIsInN1YiI6InN1cGVyYmluZGVyIiwianRpIjoiMzUifQ.-EYkk_2Dv2SlFS24LH9jsKQC9YYE-8p4xy5-YHXm4eg", "email": "FiUC4pKqMZB269MHkIBeK3g9zq6+H8lb8Djx5IhZtoA=", "gradeCode": "Bronze", "gradeName": "브론즈", "is_salesman": false, "member_pk": "35", "name": "민누이 주식회사", "phone": "3PYXVycz366qitAgV7HF6Q==", "user_id": "123456789"}}
[Wed Feb 10 2021 17:55:44.920]  LOG       orderDetail {"TextUserCode": "PUPRUX", "canUsePount": "100000", "cartList": [{"cart_pk": 141}], "formAddressData": {"address": "충청북도 괴산군 괴산읍", "address_detail": "31", "is_main": true, "member_pk": 35, "memberdelivery_pk": 40, "zipcode": "00000"}, "formAddressPk": 40, "formRefundAccount": "111111111111", "formRefundBankCode": "011", "formRefundBankName": "농협", "formSalesManCode": "A001", "formUseCoupon": 0, "formUsePoint": 0, "formUserEmail": null, "formUserMemo": "TESTTTTTT", "formUserName": "민누이 주식회사", "formUserPhone": "0838340803", "memberidx": "35", "productInfo": [{"checked": true, "child": [Array], "id": "67", "product_name": "Test1611276668", "product_pk": "67", "quantity": 1, "thumb_img": "/public/product/1611276697275_s1.jpg", "totalPrice": 1000}], "refundMethode": "Cash", "selectedArray": [{"checked": true, "child": [Array], "id": "67", "product_name": "Test1611276668", "product_pk": "67", "quantity": 1, "thumb_img": "/public/product/1611276697275_s1.jpg", "totalPrice": 1000}], "selectedDeliveryAmount": 5500, "selectedTotalAmount": 1000, "selectedTotalDiscount": 0, "seletedSettleAmount": 6500, "settleMethode": 3, "useCouponData": {}, "useCouponIdx": 0, "userInfo": {"apiToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjEifQ.eyJ1c2VyX2lkIjoiMTIzNDU2Nzg5IiwibWVtYmVyX3BrIjoiMzUiLCJuYW1lIjoi66-864iE7J20IOyjvOyLne2ajOyCrCIsImVtYWlsIjoiRmlVQzRwS3FNWkIyNjlNSGtJQmVLM2c5enE2K0g4bGI4RGp4NUloWnRvQT0iLCJwaG9uZSI6IjNQWVhWeWN6MzY2cWl0QWdWN0hGNlE9PSIsImlzX3NhbGVzbWFuIjpmYWxzZSwiZ3JhZGVfY29kZSI6IkJyb256ZSIsImdyYWRlX25hbWUiOiLruIzroaDspogiLCJpYXQiOjE2MTI5NDQ3MzMsImV4cCI6MTYxMjk4NzkzMywiYXVkIjoiMzUiLCJpc3MiOiJzdXBlcmJpbmRlciIsInN1YiI6InN1cGVyYmluZGVyIiwianRpIjoiMzUifQ.-EYkk_2Dv2SlFS24LH9jsKQC9YYE-8p4xy5-YHXm4eg", "email": "FiUC4pKqMZB269MHkIBeK3g9zq6+H8lb8Djx5IhZtoA=", "gradeCode": "Bronze", "gradeName": "브론즈", "is_salesman": false, "member_pk": "35", "name": "민누이 주식회사", "phone": "3PYXVycz366qitAgV7HF6Q==", "user_id": "123456789"}}
[Wed Feb 10 2021 17:55:44.921]  LOG       orderProduct [{"checked": true, "child": [[Object]], "id": "67", "product_name": "Test1611276668", "product_pk": "67", "quantity": 1, "thumb_img": "/public/product/1611276697275_s1.jpg", "totalPrice": 1000}]
[Wed Feb 10 2021 17:55:44.923]  LOG       cart_array [{"cart_pk": 141}]
[Wed Feb 10 2021 17:55:44.924]  LOG       usePoint 0
[Wed Feb 10 2021 17:55:44.924]  LOG       useCoupon {}
*/