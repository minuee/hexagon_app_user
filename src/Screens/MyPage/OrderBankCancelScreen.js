import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Alert,Dimensions,RefreshControl, PixelRatio,Image,TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import {CheckBox} from 'react-native-elements';
//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonStyle from '../../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoB,TextRobotoM,TextRobotoR,DropBoxIcon, TextRobotoL} from '../../Components/CustomText';
import Loader from '../../Utils/Loader';
import CommonUtil from '../../Utils/CommonUtil';
import CommonFunction from '../../Utils/CommonFunction';

class OrderCancelScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            showTopButton : false,
            orderBase : {},
        }
    }

    getCartData = async() => {
        let returnCode = {code:9998};
        const member_pk = !CommonUtil.isEmpty(this.props.userToken) ? this.props.userToken.member_pk : 0;
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/main/basedata/'+member_pk;
            const token = this.props.userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_getPageList(this.props,url,token,sendData);
            if ( returnCode.code === '0000'  ) {               
                this.props._fn_getUserCartCount(CommonUtil.isEmpty(returnCode.data.carttotalcount)?0:returnCode.data.carttotalcount);
                this.props._fn_getUserZzimCount(CommonUtil.isEmpty(returnCode.data.zzimtotalcount)?0:returnCode.data.zzimtotalcount);
                this.props._fn_getUserOrderingCount(CommonUtil.isEmpty(returnCode.data.orderingcount)?0:returnCode.data.orderingcount);
                this.props._fn_getUserPoint(CommonUtil.isEmpty(returnCode.data.remain_reward)?0:returnCode.data.remain_reward);
            }
            this.setState({loading:false})
        }catch(e){
            this.setState({moreLoading : false})
        }
    }

    async UNSAFE_componentWillMount() {
        //console.log('OrderCancelScreen.',this.props.extraData.params.screenData);

        if ( !CommonUtil.isEmpty(this.props.extraData.params.screenData)) {
            this.setState({orderBase:this.props.extraData.params.screenData})
            await this.getCartData();
        }else{
            CommonFunction.fn_call_toast('잘못된 접근입니다1.',1500);
            setTimeout(
                () => {            
                   this.props.navigation.goBack(null);
                },1500
            )
        }
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

    moveDetail = (nav,item) => {
        this.props.navigation.navigate('OrderDetailStack',{
            screenTitle:item
        })
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
                    //style={{flex:1,width:SCREEN_WIDTH}}
                >
                    <View style={{paddingVertical:15,justifyContent:'center',alignItems:'center',backgroundColor : "#fff"}}>
                        <Image
                            source={require('../../../assets/icons/check_ellipse_ic.png')}
                            resizeMode={"contain"}
                            style={{width:PixelRatio.roundToNearestPixel(40),height:PixelRatio.roundToNearestPixel(40)}}
                        /> 
                         <View style={{paddingVertical:15,justifyContent:'center',alignItems:'center'}}>
                            <CustomTextR style={styles.menuTitleText}>정상적으로 주문취소(환불요청)가 되었습니다.</CustomTextR>
                            <CustomTextR style={styles.dataText}>
                                환불계좌 : {this.state.orderBase.refund_bankname} {this.state.orderBase.refund_bankaccount} {this.state.orderBase.refund_accountname}
                            </CustomTextR>        
                         </View>
                       
                    </View>
                    <View style={styles.termLineWrap} />
                    <View style={{paddingVertical:15,backgroundColor:'#fff'}}>
                        <View style={styles.dataSubWrap}>
                            <View style={styles.detailLeftWrap}>
                                <CustomTextR style={styles.menuTitleSubText}>주문번호</CustomTextR>
                            </View>
                            <View style={styles.priceDetailRightWrap}>
                                <TextRobotoR style={CommonStyle.titleText}>{this.state.orderBase.order_no}</TextRobotoR>     
                            </View>
                        </View>
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
                            <View style={[styles.detailLeftWrap,{flex:1.5}]}>
                                <CustomTextR style={styles.menuTitleSubText}>포인트/쿠폰사용</CustomTextR>
                            </View>
                            <View style={styles.priceDetailRightWrap}>
                                <TextRobotoR style={CommonStyle.dataText}>{CommonFunction.currencyFormat(this.state.orderBase.coupon_amount+this.state.orderBase.point_amount)}원</TextRobotoR>     
                            </View>
                        </View>
                        <View style={styles.dataSubWrap}>
                            <View style={styles.detailLeftWrap}>
                                <CustomTextR style={styles.menuTitleSubText}>총 주문금액</CustomTextR>
                            </View>
                            <View style={styles.priceDetailRightWrap}>
                                <TextRobotoM style={CommonStyle.dataText}>{CommonFunction.currencyFormat(this.state.orderBase.total_amount)}원</TextRobotoM>     
                            </View>
                        </View>
                    </View>
                    <View style={styles.termLineWrap} />
                    <View style={{paddingVertical:15,backgroundColor:'#fff'}}>
                        <View style={styles.dataSubWrap}>
                            <View style={styles.detailLeftWrap}>
                                <CustomTextR style={styles.menuTitleSubText}>주문취소금액</CustomTextR>
                            </View>
                            <View style={styles.priceDetailRightWrap}>
                                <TextRobotoM style={CommonStyle.dataText15}>{CommonFunction.currencyFormat(this.state.orderBase.total_amount+this.state.orderBase.coupon_amount+this.state.orderBase.point_amount)}원</TextRobotoM>     
                            </View>
                        </View>
                    </View>  
                    <View style={styles.termLineWrap} />  
                    <View style={{padding:15,flexDirection:'row'}}>
                        <TouchableOpacity 
                            onPress={()=>this.props.navigation.goBack(null)}
                            style={styles.bottomCancleWrap}
                        >
                            <CustomTextB style={[styles.dataTitleText,{color:'#fff'}]}>주문 상세보기</CustomTextB>          
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={()=>this.props.navigation.popToTop()}
                            style={styles.bottomCancleWrap2}
                        >
                            <CustomTextB style={styles.dataTitleText}>쇼핑 계속하기</CustomTextB>          
                        </TouchableOpacity>   
                    </View>
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
    bottomCancleWrap : {
        flex:1,marginHorizontal:10,paddingVertical:Platform.OS === 'ios' ? 10 : 5,justifyContent:'center',alignItems:'center',backgroundColor:DEFAULT_COLOR.base_color
    },
    bottomCancleWrap2 : {
        flex:1,marginHorizontal:10,paddingVertical:Platform.OS === 'ios' ? 10 : 5,justifyContent:'center',alignItems:'center',borderWidth:1,borderColor:'#ccc',backgroundColor:'#fff'
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
        flexDirection:'row',    
        flexGrow:1,    
        paddingHorizontal:20,paddingVertical:15,
        alignItems: 'center',        
        borderBottomWidth:1,
        borderBottomColor : DEFAULT_COLOR.input_border_color
    },
    dataSubWrap : {
        flex:1,
        flexDirection:'row',    
        flexGrow:1,    
        paddingHorizontal:20,paddingVertical:5,
        alignItems: 'center',        
    },
    priceDetailRightWrap : {
        flex:3,        
        justifyContent:'center',alignItems:'flex-end',paddingRight:15
    },
    dataSubWrap2 : {
        flex:1,
        flexDirection:'row',    
        flexGrow:1,    
        paddingHorizontal:20,paddingVertical:15,
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
    },
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize25)
    },
    pointText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize10),color:DEFAULT_COLOR.base_color
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


export default connect(mapStateToProps,mapDispatchToProps)(OrderCancelScreen);