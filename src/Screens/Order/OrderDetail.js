import React, { Component } from 'react';
import {SafeAreaView,Alert,Image,View,StyleSheet,PixelRatio,Dimensions,TouchableOpacity,ScrollView,Animated} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonStyle from '../../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoM,TextRobotoL,TextRobotoR} from '../../Components/CustomText';
import CommonFunction from '../../Utils/CommonFunction';
import CommonUtil from '../../Utils/CommonUtil';

class OrderDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading : true,    
            showModal : false,
            userTel : '01062880183',
            formUserPhone : ''
        }
    }
   
    UNSAFE_componentWillMount() {       
        
    }

    renderUnitPrice = (item,titem,tindex) => {
        if ( item.isHaveCarton && item.isHaveCartonPrice > 0 ) {
            if ( titem.unit_type === 'Each') {
                return (
                    <TextRobotoL style={[CommonStyle.dataText,{lineHeight:16}]}>
                        {CommonFunction.currencyFormat(item.isHaveCartonPrice)}
                        <CustomTextR style={CommonStyle.dataText}>{"원"}</CustomTextR>
                    </TextRobotoL>
                )

            }else if ( titem.unit_type === 'Box') {
                return (
                    <TextRobotoL style={[CommonStyle.dataText,{lineHeight:16}]}>
                        {CommonFunction.currencyFormat(item.isHaveCartonPrice*item.box_unit)}
                        <CustomTextR style={CommonStyle.dataText}>{"원"}</CustomTextR>
                    </TextRobotoL>
                )
            }else{
                return (
                    <TextRobotoL style={CommonStyle.dataText}>
                        {CommonFunction.currencyFormat(titem.price)}{"원"}
                    </TextRobotoL>
                )
            }
        }else  if ( item.isHaveBox && item.isHaveBoxPrice > 0 ) {
            if ( titem.unit_type === 'Each') {
                return (
                    <TextRobotoL style={[CommonStyle.dataText,{lineHeight:16}]}>
                        {CommonFunction.currencyFormat(item.isHaveBoxPrice)}
                        <CustomTextR style={CommonStyle.dataText}>{"원"}</CustomTextR>
                    </TextRobotoL>
                )

            }else{
                return (
                    <TextRobotoL style={CommonStyle.dataText}>
                        {CommonFunction.currencyFormat(titem.price)}{"원"}
                    </TextRobotoL>
                )
            }
        }else{
            return (
                <TextRobotoL style={CommonStyle.dataText}>
                    {CommonFunction.currencyFormat(titem.price)}
                    <CustomTextR style={CommonStyle.dataText}>{"원"}</CustomTextR>
                </TextRobotoL>
            )

        }
    }

    render() {
        return(
            <SafeAreaView style={ styles.container }>   
                <View style={styles.topWrap}>
                    <View style={{flex:5,justifyContent:'center'}}>    
                        <CustomTextR style={CommonStyle.titleText}>주문 {this.props.screenState.settleData.merchant_uid} 
                        </CustomTextR>                    
                    </View>
                    <TouchableOpacity
                        onPress={()=>this.props.screenState.closeModal()}
                        style={{flex:1,alignItems:'flex-end'}}
                    >
                        <Image
                            source={require('../../../assets/icons/btn_close2.png')}
                            resizeMode={"contain"}
                            style={CommonStyle.checkboxIcon}
                        />
                    </TouchableOpacity>
                </View>     
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    indicatorStyle={'white'}
                    scrollEventThrottle={16}
                    keyboardDismissMode={'on-drag'}      
                    style={{width:'100%'}}
                >
                     <View style={styles.middleWarp}>
                        <View style={styles.defaultWrap}>
                            <CustomTextR style={CommonStyle.titleText15}>주문 상품</CustomTextR>
                        </View>
                        <View style={{flex:1,paddingHorizontal:0}}>
                        {
                        this.props.screenState.information.selectedArray.map((item, index) => {  
                        return (
                            <View key={index} style={styles.topBoxSubWrap}>
                                <View style={styles.itemTitleWrap}>
                                    <CustomTextR style={styles.dataTitleText}>{item.product_name}</CustomTextR>  
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
                                    item.child.map((titem, tindex) => {  
                                        return (
                                        <View style={styles.boxSubWrap2} key={tindex}>
                                            { titem.event_price > 0 ?
                                            <View style={styles.unitWrap}>
                                                <CustomTextR style={CommonStyle.priceText}>{CommonFunction.replaceUnitType(titem.unit_type)}  <CustomTextR style={[CommonStyle.priceText,CommonStyle.fontStrike]}>{CommonFunction.currencyFormat(titem.price)}원</CustomTextR> {" "} {CommonFunction.currencyFormat(titem.event_price)}원</CustomTextR>
                                                <CustomTextR style={CommonStyle.priceText}> 수량:{CommonFunction.currencyFormat(titem.quantity)}</CustomTextR>
                                            </View>
                                            :
                                            <View style={styles.unitWrap}>
                                                <CustomTextR style={CommonStyle.dataText}>{CommonFunction.replaceUnitType(titem.unit_type)}
                                                    ({this.renderUnitPrice(item,titem,tindex)})
                                                </CustomTextR>
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
                                    { 
                                        item.eventTotalPrice > 0 ?
                                        <CustomTextR style={CommonStyle.titleText}>{"합계금액 : "}
                                            <TextRobotoR style={[CommonStyle.priceText,CommonStyle.fontStrike]}>
                                                {CommonFunction.currencyFormat(item.totalPrice)}
                                            </TextRobotoR> 
                                            {" "} {CommonFunction.currencyFormat(item.eventTotalPrice)}원
                                        </CustomTextR>
                                        :
                                        <CustomTextR style={CommonStyle.titleText}>
                                            합계금액 : {CommonFunction.currencyFormat(item.totalPrice)}
                                        </CustomTextR>  
                                    }
                                </View>                           
                            </View>
                        )})
                        }
                        </View>
                        <View style={styles.defaultWrap}>
                            <CustomTextR style={CommonStyle.titleText15}>결제 정보</CustomTextR>
                        </View>
                        <View style={styles.formWarp}>
                            <View style={styles.bottomBoxSubWrap} >
                                <View style={styles.formTitleWrap}>
                                    <CustomTextR style={styles.dataText}>상품금액</CustomTextR>
                                </View>
                                <View style={styles.formDataWrap2}>
                                    <TextRobotoM style={styles.dataTitleText}>{CommonFunction.currencyFormat(this.props.screenState.information.selectedTotalAmount)} 원</TextRobotoM>
                                </View>   
                            </View>
                            <View style={styles.bottomBoxSubWrap} >
                                <View style={styles.formTitleWrap}>
                                    <CustomTextR style={styles.dataText}>상품할인금액</CustomTextR>
                                </View>
                                <View style={styles.formDataWrap2}>
                                    <TextRobotoM style={styles.dataTitleText}>{CommonFunction.currencyFormat(this.props.screenState.information.selectedTotalDiscount)} 원</TextRobotoM>
                                </View>
                            </View>
                            <View style={styles.bottomBoxSubWrap} >
                                <View style={styles.formTitleWrap}>
                                    <CustomTextR style={styles.dataText}>배송비</CustomTextR>
                                </View>
                                <View style={styles.formDataWrap2}>
                                    <TextRobotoM style={styles.dataTitleText}>{CommonFunction.currencyFormat(this.props.screenState.information.selectedDeliveryAmount)} 원</TextRobotoM>
                                </View>
                            </View>
                            <View style={styles.bottomBoxSubWrap} >
                                <View style={styles.formTitleWrap}>
                                    <CustomTextR style={styles.dataText}>포인트/쿠폰사용</CustomTextR>
                                </View>
                                <View style={styles.formDataWrap2}>
                                    <TextRobotoM style={styles.dataTitleText}>{CommonFunction.currencyFormat(parseInt(this.props.screenState.information.formUsePoint)+parseInt(this.props.screenState.information.formUseCoupon))} 원</TextRobotoM>
                                </View>
                            </View>
                            <View style={styles.bottomBoxSubWrap} >
                                <View style={styles.formTitleWrap}>
                                    <CustomTextR style={styles.dataText}>최종결제금액</CustomTextR>
                                </View>
                                <View style={styles.formDataWrap2}>
                                    <TextRobotoM style={styles.dataTitleText}>{CommonFunction.currencyFormat(this.props.screenState.information.seletedSettleAmount)} 원</TextRobotoM>
                                </View>
                            </View>
                        </View>    
                        <View style={styles.defaultWrap}>
                            <CustomTextR style={CommonStyle.titleText15}>배송 정보</CustomTextR>
                        </View>
                        <View style={styles.formWarp}>
                            <View style={styles.bottomBoxSubWrap} >
                                <View style={styles.formTitleWrap}>
                                    <CustomTextR style={styles.dataText}>받는분</CustomTextR>
                                </View>
                                <View style={styles.formDataWrap}>
                                    <CustomTextR style={CommonStyle.dataText}>{this.props.screenState.paymentInformation.buyer_name}</CustomTextR>
                                </View>   
                            </View>
                            <View style={styles.bottomBoxSubWrap} >
                                <View style={styles.formTitleWrap}>
                                    <CustomTextR style={styles.dataText}>휴대폰</CustomTextR>
                                </View>
                                <View style={styles.formDataWrap}>
                                    <CustomTextR style={CommonStyle.dataText}>{this.props.screenState.paymentInformation.buyer_tel}</CustomTextR>
                                </View>
                            </View>
                            <View style={styles.bottomBoxSubWrap} >
                                <View style={styles.formTitleWrap}>
                                    <CustomTextR style={styles.dataText}>주소</CustomTextR>
                                </View>
                                <View style={styles.formDataWrap}>
                                    <CustomTextR style={CommonStyle.dataText}>
                                        {this.props.screenState.information.formAddressData.address}{" "}
                                        {this.props.screenState.information.formAddressData.address_detail}{" ["}
                                        {this.props.screenState.information.formAddressData.zipcode}{"]"}
                                    </CustomTextR>
                                </View>
                            </View>
                            <View style={styles.bottomBoxSubWrap} >
                                <View style={styles.formTitleWrap}>
                                    <CustomTextR style={styles.dataText}>요청사항</CustomTextR>
                                </View>
                                <View style={styles.formDataWrap}>
                                    <CustomTextR style={CommonStyle.dataText}>{this.props.screenState.information.formUserMemo}</CustomTextR>
                                </View>
                            </View>
                        </View>     
                        <View style={styles.defaultWrap}>
                            <CustomTextR style={CommonStyle.titleText15}>결제 수단</CustomTextR>
                        </View> 
                        <View style={styles.formWarp}>
                            <View style={styles.bottomBoxSubWrap} >
                                <View style={styles.formTitleWrap}>
                                    <CustomTextR style={styles.dataText}>결제방법</CustomTextR>
                                </View>
                                <View style={styles.formDataWrap}>
                                    <CustomTextR style={CommonStyle.dataText}>{this.props.screenState.settleData.settleMethodeName}</CustomTextR>
                                </View>   
                            </View>
                            { this.props.screenState.settleData.settleMethodeCode === 'vbank' &&
                            <View style={styles.bottomBoxSubWrap} >
                                <View style={styles.formTitleWrap}>
                                    <CustomTextR style={styles.dataText}>입금자명</CustomTextR>
                                </View>
                                <View style={styles.formDataWrap}>
                                    <CustomTextR style={CommonStyle.dataText}>{this.props.screenState.paymentInformation.buyer_name}</CustomTextR>
                                </View>
                            </View>
                            }
                            { this.props.screenState.settleData.settleMethodeCode === 'vbank' &&
                            <View style={styles.bottomBoxSubWrap} >
                                <View style={styles.formTitleWrap}>
                                    <CustomTextR style={styles.dataText}>입금계좌</CustomTextR>
                                </View>
                                <View style={styles.formDataWrap}>
                                    <CustomTextR style={CommonStyle.dataText}>
                                    {this.props.screenState.paymentInformation.vbank_holder} 
                                    </CustomTextR>
                                    <CustomTextR style={CommonStyle.dataText}>
                                    {this.props.screenState.paymentInformation.vbank_name}
                                    </CustomTextR>
                                    <CustomTextR style={CommonStyle.dataText}>
                                    {this.props.screenState.paymentInformation.vbank_num}
                                    </CustomTextR>
                                </View>
                            </View>    
                            }    
                            { this.props.screenState.settleData.settleMethodeCode === 'vbank' &&
                            <View style={styles.bottomBoxSubWrap} >
                                <View style={styles.formTitleWrap}>
                                    <CustomTextR style={styles.dataText}>환불입금계좌</CustomTextR>
                                </View>
                                <View style={styles.formDataWrap}>
                                    <CustomTextR style={CommonStyle.dataText}>
                                    {this.props.screenState.information.formRefundBankName} 
                                    </CustomTextR>
                                    <CustomTextR style={CommonStyle.dataText}>
                                    {this.props.screenState.information.formRefundAccountName}
                                    </CustomTextR>
                                    <CustomTextR style={CommonStyle.dataText}>
                                    {this.props.screenState.information.formRefundAccount}
                                    </CustomTextR>
                                </View>
                            </View>    
                            }     
                            { this.props.screenState.settleData.settleMethodeCode === 'card' &&
                                <View style={styles.bottomBoxSubWrap} >
                                <View style={styles.formTitleWrap}>
                                    <CustomTextR style={styles.dataText}>카드정보</CustomTextR>
                                </View>
                                <View style={styles.formDataWrap}>
                                    <CustomTextR style={CommonStyle.dataText}>
                                        {this.props.screenState.paymentInformation.card_name} {CommonUtil.isEmpty(this.props.screenState.paymentInformation.card_number) ? '' : CommonUtil.cardMiddleMask(this.props.screenState.paymentInformation.card_number,'*')}
                                    </CustomTextR>
                                </View>
                            </View>
                            }                   
                        </View>     
                        <View style={styles.defaultWrap}>
                            <CustomTextR style={CommonStyle.titleText15}>미출고시 조치방법</CustomTextR>
                        </View>  
                        <View style={styles.formWarp}>
                            <View style={styles.bottomBoxSubWrap} >
                                <View style={styles.formDataWrap}>
                                    <CustomTextR style={CommonStyle.dataText}>
                                        {this.props.screenState.information.refundMethode === 'Cash' ? DEFAULT_CONSTANTS.return_CashTitle : DEFAULT_CONSTANTS.return_ProductTitle}
                                    </CustomTextR>
                                </View>   
                            </View>
                        </View>   
                    </View>
                    <View style={CommonStyle.blankArea}></View>
                </ScrollView>       
            </SafeAreaView>
        );
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : "#fff",
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    defaultWrap:{
        flex:1,borderTopWidth:1,borderTopColor:DEFAULT_COLOR.input_border_color,backgroundColor : "#fff",justifyContent:'center',paddingHorizontal:20,backgroundColor:DEFAULT_COLOR.input_bg_color,paddingVertical:10
    },
    itemTitleWrap : {
        flex:1,padding:10,borderBottomColor:'#efefef',borderBottomWidth:1
    },
    itemDataWrap : {
        flex:1,flexDirection:'row',flexGrow:1,  alignItems: 'center', padding:10
    },
    topWrap : {
        height:60,paddingHorizontal:20,paddingTop:20,flexDirection:'row',borderBottomColor:DEFAULT_COLOR.input_border_color,borderBottomWidth:1
    },
    middleWarp : {
        flex:1,        
        justifyContent:'center',        
        marginHorizontal:0,marginBottom:10
    },
    middleDataWarp : {
        flex:1,
        justifyContent:'flex-start',
    },
    defaultText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),color:'#000'
    },
    titleWrap : {
        flex:1,justifyContent:'flex-end',paddingLeft:20
    },
    titleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),color:DEFAULT_COLOR.base_color_000
    },
    titleText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),color:DEFAULT_COLOR.base_color_666
    },
    unitWrap : {
        flex:1,flexDirection:'row',alignItems:'center'
    },
    topBoxSubWrap : {
        flex:1,
        backgroundColor:'#fff',
        paddingHorizontal:10,
        borderBottomWidth:1,
        borderBottomColor : DEFAULT_COLOR.input_border_color
    },
    boxSubWrap : {
        flex:1,
        flexDirection:'row',    
        flexGrow:1,    
        backgroundColor:'#fff',
        paddingHorizontal:10,paddingVertical:10,
        alignItems: 'center',        
        borderBottomWidth:1,
        borderBottomColor : DEFAULT_COLOR.input_border_color
    },
    boxSubWrap2 : {
        flex:1,
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
        paddingLeft:20
    },
    dataTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)
    },
    dataTitleTextBank : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize5)
    },
    formWarp : {
        flex:1,paddingHorizontal:20,paddingVertical:5
    },
    bottomBoxSubWrap : {
        flexDirection:'row',paddingVertical: 5,
        borderBottomWidth:1,borderBottomColor:DEFAULT_COLOR.input_border_color
    },
    formTitleWrap : {
        flex:1,paddingVertical:5,justifyContent:'center'
    },
    formDataWrap : {
        flex:2,paddingVertical:5,justifyContent:'center'
    },
    formDataWrap2 : {
        flex:2,paddingVertical:5,justifyContent:'center',alignItems:'flex-end',paddingRight:10
    },
    
});


function mapStateToProps(state) {
    return {
        userToken : state.GlabalStatus.userToken
    };
}

export default connect(mapStateToProps,null)(OrderDetail);