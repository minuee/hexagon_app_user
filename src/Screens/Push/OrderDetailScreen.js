import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Alert,Dimensions,Linking, PixelRatio,Image,TouchableOpacity,Animated,Platform} from 'react-native';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import AsyncStorage from '@react-native-community/async-storage';
import Modal from 'react-native-modal';
import {Overlay,Input} from 'react-native-elements';
//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonStyle from '../../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import SelectType from "../../Utils/SelectType";
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoB,TextRobotoM,TextRobotoR,DropBoxIcon} from '../../Components/CustomText';
import CustomAlert from '../../Components/CustomAlert';
import Loader from '../../Utils/Loader';
import CommonUtil from '../../Utils/CommonUtil';
import CommonFunction from '../../Utils/CommonFunction';
import { apiObject } from "../Apis";
const alertContents = 
(<View style={{flex:1,marginTop:10}}>
    <View style={{paddingTop:20}}>
        <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),color:'#494949'}}>
           {DEFAULT_CONSTANTS.CompanyInfoTel}
        </CustomTextR>        
    </View>
</View>);
import ToggleBox from '../../Utils/ToggleBox';
const mockData1  = 
    {id : 1, date : '2020.11.11 13:59:45' ,title : '주문번호 20201101-D12341',price : 35000 , product : '수세미수세미외 1건' , status : '입금완료'};


class OrderDetailScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            showTopButton : false,
            showModal :false,
            popLayerView2 :false,
            bankCode : [],
            productData : [],
            orderBase : {},
            settleInfo : {},
            cartArray : [],
            csPhone : DEFAULT_CONSTANTS.CompanyInfoTel,
            csEmail : DEFAULT_CONSTANTS.CompanyInfoEmail,
            //poplayer
            popLayerView : false,
            isCancelView : true,
            cancleText : '취소',
            okayText : '통화하기',
            alertTitle : '슈퍼바인더 고객센터',
            alertBody : alertContents,
            clickCancle : this.clickCancle.bind(this),
            closePopLayer : this.closePopLayer.bind(this),

        }
    }

    clickCancle = () => {
        this.setState({popLayerView : false})
    }
    showPopLayer = async() => {
        this.setState({popLayerView : true})
    } 
    closePopLayer = async() => {        
        this.setState({popLayerView : false})
        this.requestService();
    } 
    requestService = async() => {
        let tmpNumber = DEFAULT_CONSTANTS.CompanyInfoTel
        if ( !CommonUtil.isEmpty(tmpNumber)) {
            let number = DEFAULT_CONSTANTS.CompanyInfoTel
            
            let phoneNumber = '';
            if (Platform.OS === 'android') { phoneNumber = `tel:${number}`; }
            else {phoneNumber = `telprompt:${number}`; }
            Linking.openURL(phoneNumber);
        }
    }

    checkStorageCode = async (arr) => {
        //console.log('BankCode',arr)  
        let newBankCode = [];
        await JSON.parse(arr).forEach(function(element,index,array){            
            if ( element.bankcode) {
                newBankCode.push({
                    id:index,
                    idx:element.bankidx,
                    name:element.bankname,
                    code:element.bankcode
                })
            }
        })
        await this.setState({bankCode: newBankCode});
    }

    getBaseData = async(order_pk) => {
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/order/view/' + order_pk;
            const token = this.props.userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_getPageList(this.props,url,token,sendData);          
            //console.log('OrderDetailScreenreturnCode',returnCode.data.product)   
            if ( returnCode.code === '0000'  ) {
                this.setState({
                    orderBase : returnCode.data.orderBase,
                    productData : returnCode.data.product,
                    settleInfo : returnCode.data.settleInfo,
                    loading:false,moreLoading : false})
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.',2000);
                this.setState({moreLoading:false,loading:false})
            }
        }catch(e){
            console.log('eee',e)
            this.setState({loading:false,moreLoading : false})
        }
    }

    async UNSAFE_componentWillMount() {
       
        const APPBaseInfo = await AsyncStorage.getItem('APPBaseInfo');
        if (!CommonUtil.isEmpty(APPBaseInfo)  ) {
            this.setState({
                csPhone : CommonUtil.onlyDigits(JSON.parse(APPBaseInfo).cs_phone),
                csEmail : CommonUtil.onlyDigits(JSON.parse(APPBaseInfo).cs_email),
            })
        }
        if ( !CommonUtil.isEmpty(this.props.extraData.params.screenData)) {
            await this.getBaseData(this.props.extraData.params.screenData.order_pk);   
            this.setState({
                order_pk : this.props.extraData.params.screenData.order_pk
            })
            const BankCode = await AsyncStorage.getItem('BankCode');
            if ( !CommonUtil.isEmpty(BankCode)) {
                this.checkStorageCode(BankCode);
                //console.log('BankCode',BankCode)  
            }
        }else{
            CommonFunction.fn_call_toast('잘못된 접근입니다..',2000);
            this.props.navigation.goBack(null)
        }

        this.props.navigation.addListener('focus', () => {            
            this.getBaseData(this.state.order_pk);   
        })

        
    }

    componentDidMount() {
       
    }


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

    upButtonHandler = () => {        
        this.ScrollView.scrollTo({ x: 0,  animated: true });
    };

    requestService = async() => {
        let tmpNumber = this.state.csPhone;
        if ( !CommonUtil.isEmpty(tmpNumber)) {
            let phoneNumber = '';
            if (Platform.OS === 'android') { phoneNumber = `tel:${tmpNumber}`; }
            else {phoneNumber = `telprompt:${tmpNumber}`; }
            Linking.openURL(phoneNumber);
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
                { this.state.showTopButton &&
                    <TouchableOpacity 
                        style={styles.fixedUpButton}
                        onPress={e => this.upButtonHandler()}
                    >
                        <Icon name="up" size={25} color="#000" />
                    </TouchableOpacity>
                }
              
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
                       <CustomTextR style={CommonStyle.titleText}>
                           {this.state.orderBase.order_no} ({this.state.orderBase.order_status_name})</CustomTextR>          
                    </View>
                    <View style={styles.defaultWrap}>
                        <CustomTextR style={CommonStyle.titleText}>주문 상품</CustomTextR>
                    </View>
                    <View style={{flex:1,paddingHorizontal:0}}>
                    {
                    this.state.productData.map((pitem, index) => {  
                        let item = pitem.product_info;
                        return (
                        <View key={index} style={styles.boxSubWrap}>
                            <View style={styles.itemTitleWrap}>
                                <CustomTextR style={styles.dataTitleText}>
                                    {pitem.product_name} <CustomTextR style={CommonStyle.requiredText2}>{pitem.event_limit_price > 0 && "  (한정판매 대상상품)"}</CustomTextR>
                                </CustomTextR>  
                            </View>
                            <View style={styles.itemDataWrap}>
                                <View style={styles.detailLeftWrap}>
                                { !CommonUtil.isEmpty(item.thumb_img) ?
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
                                pitem.product_info.child.map((titem, tindex) => {  
                                    return (
                                    <View style={styles.boxSubWrap2} key={tindex}>
                                        { titem.event_price > 0 ?
                                            <View style={styles.unitWrap}>
                                                <CustomTextR style={CommonStyle.priceText}>{CommonFunction.replaceUnitType(titem.unit_type)}  <CustomTextR style={[CommonStyle.priceText,CommonStyle.fontStrike]}>{CommonFunction.currencyFormat(titem.price)}원</CustomTextR> {CommonFunction.currencyFormat(titem.event_price)}원</CustomTextR>
                                                <CustomTextR style={CommonStyle.priceText}> 수량:{CommonFunction.currencyFormat(titem.quantity)}</CustomTextR>
                                            </View>
                                            :
                                            <View style={styles.unitWrap}>
                                                <CustomTextR style={CommonStyle.dataText}>{CommonFunction.replaceUnitType(titem.unit_type)}({CommonFunction.currencyFormat(titem.price)}원)</CustomTextR>
                                                <CustomTextR style={CommonStyle.dataText}> 수량:{CommonFunction.currencyFormat(titem.quantity)}</CustomTextR>
                                                
                                            </View>
                                        }
                                    </View>
                                    )
                                    })
                                }    
                                </View>
                            </View> 
                            <View style={[styles.itemTitleWrap,{alignItems:'flex-end',paddingRight:20}]}>
                                { item.eventTotalPrice > 0 ?
                                <TextRobotoM style={CommonStyle.titleText}>{"합계금액 : "}
                                <TextRobotoM style={[CommonStyle.dataText,CommonStyle.fontStrike]}>{CommonFunction.currencyFormat(item.totalPrice)}원</TextRobotoM> {CommonFunction.currencyFormat(item.eventTotalPrice)}원</TextRobotoM>
                                :
                                <TextRobotoM style={CommonStyle.titleText}>합계금액 : {CommonFunction.currencyFormat(item.totalPrice)}원</TextRobotoM>  
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
                        //expanded={true}
                        arrowColor={'#000'}
                        style={{backgroundColor: '#fff', borderBottomWidth: 0,paddingHorizontal:10}}
                        
                    >
                        <View style={{paddingVertical:15}}>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>주문자 명</CustomTextR>
                                </View>
                                <View style={styles.detailRightWrap}>
                                    <CustomTextR style={CommonStyle.dataText}>{this.state.orderBase.name}</CustomTextR>     
                                </View>
                            </View>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>휴대폰</CustomTextR>
                                </View>
                                <View style={styles.detailRightWrap}>
                                    <CustomTextR style={CommonStyle.dataText}>{CommonFunction.fn_dataDecode(this.state.orderBase.phone)}</CustomTextR>     
                                </View>
                            </View>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>이메일</CustomTextR>
                                </View>
                                <View style={styles.detailRightWrap}>
                                    <CustomTextR style={CommonStyle.dataText}>{CommonFunction.fn_dataDecode(this.state.orderBase.email)}</CustomTextR>     
                                </View>
                            </View>
                        </View>
                        
                    </ToggleBox>
                    <View style={styles.termLineWrap} />  
                    <ToggleBox 
                        label='배송 정보' 
                        value='' 
                        arrowColor={'#000'}
                        style={{backgroundColor: '#fff', borderBottomWidth: 0,paddingHorizontal:10}}
                    >
                        <View style={{paddingVertical:15}}>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>수신자명</CustomTextR>
                                </View>
                                <View style={styles.detailRightWrap}>
                                    <CustomTextR style={CommonStyle.dataText}>{this.state.orderBase.delivery_receiver}</CustomTextR>     
                                </View>
                            </View>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>휴대폰</CustomTextR>
                                </View>
                                <View style={styles.detailRightWrap}>
                                    <CustomTextR style={CommonStyle.dataText}>{CommonFunction.fn_dataDecode(this.state.orderBase.delivery_phone)}</CustomTextR>     
                                </View>
                            </View>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>주소</CustomTextR>
                                </View>
                                <View style={styles.detailRightWrap}>
                                    <CustomTextR style={CommonStyle.dataText}>{this.state.orderBase.delivery_address}</CustomTextR>     
                                </View>
                            </View>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>배송시{"\n"}요청사항</CustomTextR>
                                </View>
                                <View style={styles.detailRightWrap}>
                                    <CustomTextR style={CommonStyle.dataText}>{this.state.orderBase.delivery_memo}</CustomTextR>     
                                </View>
                            </View>
                        </View>                        
                    </ToggleBox>
                    <View style={styles.termLineWrap} />  
                    <ToggleBox 
                        label='결제 금액' 
                        value={CommonFunction.currencyFormat(this.state.orderBase.total_amount)+'원'} 
                        arrowColor={'#000'}
                        style={{backgroundColor: '#fff', borderBottomWidth: 0,paddingHorizontal:10}}
                    >
                        <View style={{paddingVertical:15}}>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>상품금액</CustomTextR>
                                </View>
                                <View style={styles.priceDetailRightWrap}>
                                    <TextRobotoR style={CommonStyle.dataText}>{CommonFunction.currencyFormat(this.state.orderBase.product_amount)}원</TextRobotoR>     
                                </View>
                            </View>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>상품할인금액</CustomTextR>
                                </View>
                                <View style={styles.priceDetailRightWrap}>
                                    <TextRobotoR style={CommonStyle.dataText}>{CommonFunction.currencyFormat(this.state.orderBase.discount_amount)}원</TextRobotoR>     
                                </View>
                            </View>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>배송비</CustomTextR>
                                </View>
                                <View style={styles.priceDetailRightWrap}>
                                    <TextRobotoR style={CommonStyle.dataText}>{CommonFunction.currencyFormat(this.state.orderBase.delivery_amount)}원</TextRobotoR>     
                                </View>
                            </View>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>포인트/쿠폰사용</CustomTextR>
                                </View>
                                <View style={styles.priceDetailRightWrap}>
                                    <TextRobotoR style={CommonStyle.dataText}>{CommonFunction.currencyFormat(this.state.orderBase.coupon_amount+this.state.orderBase.point_amount)}원</TextRobotoR>     
                                </View>
                            </View>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={styles.menuTitleSubText}>최종결제금액</CustomTextR>
                                </View>
                                <View style={styles.priceDetailRightWrap}>
                                    <TextRobotoM style={CommonStyle.dataText}>{CommonFunction.currencyFormat(this.state.orderBase.total_amount)}원</TextRobotoM>     
                                </View>
                            </View>
                        </View>                        
                    </ToggleBox>
                    <View style={styles.termLineWrap} />  
                    <ToggleBox 
                        label='결제 수단' 
                        value='' 
                        arrowColor={'#000'}
                        style={{backgroundColor: '#fff', borderBottomWidth: 0,paddingHorizontal:10}}
                    >
                        <View style={{paddingVertical:15}}>
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={CommonStyle.titleText}>결제수단</CustomTextR>
                                </View>
                                <View style={styles.detailRightWrap}>
                                    <CustomTextR style={CommonStyle.dataText}>
                                        {this.state.orderBase.settle_type_name}
                                    </CustomTextR>     
                                </View>
                            </View>
                            {this.state.orderBase.settle_type === 'card' &&
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={CommonStyle.titleText}>주문카드</CustomTextR>
                                </View>
                                <View style={styles.detailRightWrap}>
                                    <CustomTextR style={CommonStyle.dataText}>
                                        {this.state.settleInfo.card_name}{"  "} 
                                        {CommonUtil.cardMiddleMask(this.state.settleInfo.card_number,'*')}
                                    </CustomTextR>    
                                    
                                    <CustomTextR style={CommonStyle.dataText}>
                                        (
                                        {this.state.settleInfo.card_quota > 1 ?
                                        parseInt(this.state.settleInfo.card_quota-1)+'개월 할부'
                                        :'일시불'
                                        }
                                        )
                                    </CustomTextR>  
                                   
                                </View>
                            </View>
                            }
                            { this.state.orderBase.settle_type == 'vbank' ?
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={CommonStyle.titleText}>입금계좌</CustomTextR>
                                </View>
                                <View style={styles.detailRightWrap}>
                                    <CustomTextR style={CommonStyle.dataText}>
                                    {this.state.settleInfo.vbank_name}  {this.state.settleInfo.vbank_num}
                                    </CustomTextR>     
                                </View>
                            </View>
                            :
                            null
                            }
                            { (this.state.orderBase.settle_type === 'vbank'  && this.state.orderBase.order_status === 'WAIT' ) &&
                            <View style={styles.dataSubWrap}>
                                <View style={styles.detailLeftWrap}>
                                    <CustomTextR style={CommonStyle.titleText}>입금기한</CustomTextR>
                                </View>
                                <View style={styles.detailRightWrap}>
                                    { !CommonUtil.isEmpty(this.state.orderBase.income_limit_dt) &&
                                    <CustomTextR style={CommonStyle.dataText}>{CommonFunction.convertUnixToDate(this.state.orderBase.income_limit_dt,"YYYY.MM.DD")}</CustomTextR> 
                                    }  
                                </View>
                            </View>
                            }
                        </View>                        
                    </ToggleBox>
                    <View style={styles.termLineWrap} />  
                    <ToggleBox 
                        label='미출고시 조치방법' 
                        value='' 
                        arrowColor={'#000'}
                        style={{backgroundColor: '#fff', borderBottomWidth: 0,paddingHorizontal:10}}
                    >
                        <View style={{paddingVertical:15}}>
                            <View style={styles.dataSubWrap}>
                                {this.state.orderBase.refund_type === 'Cash' ?
                                <CustomTextR style={CommonStyle.dataText}>결제수단으로 환불</CustomTextR>
                                :
                                <CustomTextR style={CommonStyle.dataText}>결제수단으로 환불</CustomTextR>
                                }
                            </View>
                        </View>                       
                    </ToggleBox>
                    <View style={styles.termLineWrap} />
                    { this.state.orderBase.order_status === 'INCOME' && 
                    <View style={{padding:15}}>
                        <TouchableOpacity 
                            //onPress={()=>this.orderCancle()}
                            onPress={()=>this.cancleOrder()}
                            style={styles.bottomCancleWrap}
                        >
                            <CustomTextB style={[styles.dataTitleText,{color:'#fff'}]}>주문 취소</CustomTextB>          
                        </TouchableOpacity>
                        <View style={{padding:15}}>
                            <CustomTextR style={styles.dataTitleText2}>주문 취소는 배송 출발 이전에만 가능합니다.</CustomTextR>
                            <CustomTextR style={styles.dataTitleText2}>가상계좌로 입금된 경우, 환급정보가 필요합니다.</CustomTextR>  
                        </View>
                    </View>
                    }
                    <View style={{padding:15}}>
                        <TouchableOpacity
                            onPress={()=>this.requestService()}
                            hitSlop={{left:10,right:10,bottom:10,top:10}}
                        >
                            <CustomTextB style={[styles.dataTitleText2,{color:DEFAULT_COLOR.base_color}]}>고객센터 문의하기 {" >"}</CustomTextB>   
                        </TouchableOpacity>
                         
                    </View>
                    <View style={[CommonStyle.blankArea,{backgroundColor:'#f5f6f8'}]}></View>
                </ScrollView>              
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
    defaultWrap:{
        flex:1,borderTopWidth:1,borderTopColor:DEFAULT_COLOR.input_border_color,backgroundColor : "#fff",justifyContent:'center',paddingHorizontal:20,backgroundColor:DEFAULT_COLOR.input_bg_color,paddingVertical:15
    },
    itemTitleWrap : {
        flex:1,padding:10,borderBottomColor:'#efefef',borderBottomWidth:1
    },
    itemDataWrap : {
        flex:1,flexDirection:'row',flexGrow:1,  alignItems: 'center', padding:10
    },
    modalDefaultWrap : {
        paddingHorizontal:20,paddingVertical:15,
    },
    modalSelectedWrap : {
        paddingHorizontal:20,paddingVertical:15,backgroundColor:'#f4f4f4'
    },
    modalLeftWrap : {
        flex:1,justifyContent:'center'
    },
    modalRightWrap : {
        flex:1,justifyContent:'center',alignItems:'flex-end'
    },
    bottomWrap : {
        height:60,justifyContent:'center',alignItems:'center',flexDirection:'row'
    },
    bottomDataWrap : {
        width:80,backgroundColor:'#e1e1e1',justifyContent:'center',alignItems:'center',padding:5,marginRight:5
    },
    formWrap : {
        marginHorizontal:0,marginVertical:15,height:40
    },
    formTitleWrap : {
        position:'absolute',left:20,top:-15,width:'100%'
    },
    formTitleText : {
        color: DEFAULT_COLOR.base_color, fontSize: PixelRatio.roundToNearestPixel(10), fontWeight: '500', letterSpacing: -0.5
    },
    /**** Modal  *******/
    fixedUpButton : {
        position:'absolute',bottom:80,right:20,width:50,height:50,borderColor:'#ccc',borderWidth:1,borderRadius:25,alignItems:'center',justifyContent:'center',zIndex:10
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    topRepeatWrap : {
        marginHorizontal:10,paddingVertical:Platform.OS === 'ios' ? 10 : 5 ,justifyContent:'center',alignItems:'center',borderWidth:1,borderColor:DEFAULT_COLOR.base_color
    },
    bottomCancleWrap : {
        marginHorizontal:10,paddingVertical:Platform.OS === 'ios' ? 10 : 5,justifyContent:'center',alignItems:'center',backgroundColor:DEFAULT_COLOR.base_color
    },
    mainTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)
    },
    termLineWrap : {
        flex:1,
        paddingVertical:5,
        backgroundColor:'#f5f6f8'
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
    dataSubWrap : {
        flex:1,
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
        justifyContent:'center'
    },
    goodsDetailRightWrap : {
        flex:3,        
        justifyContent:'center',paddingLeft:10
    },
    priceDetailRightWrap : {
        flex:3,        
        justifyContent:'center',alignItems:'flex-end',paddingRight:15
    },
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize25)
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
    dataTitleText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#666'
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
        },
        _fn_getUserCartCount : (num) => {
            dispatch(ActionCreator.fn_getUserCartCount(num))
        },
    };
}


export default connect(mapStateToProps,mapDispatchToProps)(OrderDetailScreen);