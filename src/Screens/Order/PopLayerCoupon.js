import React, { Component } from 'react';
import {Animated,ScrollView,View,StyleSheet,Alert,Dimensions,PixelRatio,Image,TouchableOpacity,ImageBackground} from 'react-native';
import 'moment/locale/ko'
import  moment  from  "moment";
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonStyle from '../../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR} from '../../Components/CustomText';
import CommonUtil from '../../Utils/CommonUtil';
import CommonFunction from '../../Utils/CommonFunction';
import { apiObject } from "../Apis";
import Loader from '../../Utils/Loader';
export default  class PopLayerCoupon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            couponList : [],
            checkedCoupon : {},
            checkedCouponpk : 0,
            useCouponData : {}
        }
    }

    getBaseData = async(member_pk) => {

        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/coupon/list/ing?page=1&paginate=100&member_pk=' + member_pk;
            const token = this.props.screenProps.userToken.apiToken;            
            let sendData = null;
            returnCode = await apiObject.API_getPageList(this.props.screenProps,url,token,sendData);
            if ( returnCode.code === '0000'  ) {
                this.setState({
                    couponList : CommonUtil.isEmpty(returnCode.data.validCouponList) ? [] : returnCode.data.validCouponList
                })
            }
            this.setState({moreLoading:false,loading:false})
        }catch(e){            
            this.setState({loading:false,moreLoading : false})
        }
    }

    async UNSAFE_componentWillMount() {
        await this.setState({
            useCouponData : this.props.screenState.useCouponData,
            checkedCouponpk : this.props.screenState.useCouponData.coupon_pk
        })
        await this.getBaseData(this.props.screenProps.userToken.member_pk);
    }

    registAddress =async() => {
        setTimeout(
            () => {            
                this.props.screenState._closeCouponModal(this.state.checkedCoupon,'update');
            },500
        )
    }
   
    selectMember = async() =>  {
        if ( !CommonUtil.isEmpty(this.state.checkedCoupon) ) {
            Alert.alert(
                DEFAULT_CONSTANTS.appName,      
                "해당 쿠폰을 사용하시겠습니까?",
                [
                    {text: '네', onPress: () => this.registAddress()},
                    {text: '아니오', onPress: () => console.log('Cancle')},
                ],
                { cancelable: true }
            )  
        }else{
            this.props.screenState._closeCouponModal(null,'update');
        }
    }

    checkedIten = async(item) => {        
        if ( this.state.checkedCouponpk ===  item.coupon_pk) {
            this.setState({checkedCouponpk :  0,checkedCoupon : {}})
        }else{
            this.setState({checkedCouponpk :  item.coupon_pk,checkedCoupon : item})
        }
    }

    renderRestDays = (end_dt) => {
        if ( !CommonUtil.isEmpty(end_dt)) {
            return (
                CommonFunction.convertUnixToRestDate(end_dt-moment().unix())
            )
        }else {
            return null
        }
    }

    render() {
        if ( this.state.loading ) {
            return (
                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} /> 
            )
        }else { 
        return(
            <View style={ styles.container }>
                <View style={styles.titleWrap}>
                    <TouchableOpacity 
                        onPress={()=> this.props.screenState._closeCouponModal()}
                        hitSlop={{left:10,right:5,top:10,bottom:10}}
                        style={{position:'absolute',top:0,right:20,width:22,height:22}}
                    >                        
                        <Image
                            source={require('../../../assets/icons/btn_close.png')}
                            resizeMode={"contain"}
                            style={CommonStyle.defaultIconImage}
                        />
                    </TouchableOpacity>
                    <View style={{height:35,width:'80%',paddingLeft:20,flexDirection:'row',alignItems:'center'}}>
                        <CustomTextM style={CommonStyle.titleText15}>쿠폰선택</CustomTextM>
                        <CustomTextM style={CommonStyle.titleText15}>   </CustomTextM>
                        <CustomTextR style={CommonStyle.ttileText}>사용가능한 쿠폰 / 총 {CommonFunction.currencyFormat(this.state.couponList.length)}개</CustomTextR>
                    </View>
                </View>
                <View style={styles.dataWarp}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        indicatorStyle={'white'}
                    >
                        <View style={styles.formWarp}>
                        {
                        this.state.couponList.length === 0 ? 
                            <View style={styles.emptyWrap} >
                                <CustomTextR style={CommonStyle.dataText}>사용가능한 쿠폰이 없습니다.</CustomTextR>
                            </View>
                        :
                        <View style={styles.couponListWRap}>
                            <View style={{paddingHorizontal:20,paddingVertical:5}} />
                            {
                                this.state.couponList.map((item, index) => {  
                                return (
                                    <TouchableOpacity 
                                        key={index}  
                                            style={this.state.checkedCouponpk === item.coupon_pk ? styles.modalSelectedWrap : styles.modalDefaultWrap} 
                                            onPress={() => this.checkedIten(item,index)}
                                    >
                                        <ImageBackground
                                                source={require('../../../assets/images/bg_coupon2.png')}
                                                resizeMode='stretch'
                                                style={{flexDirection:'row',width:SCREEN_WIDTH-40,height:SCREEN_WIDTH/5,flexDirection:'row'}}
                                        >
                                            <View style={{flex:1,paddingLeft:10,paddingTop:10}}>                                                
                                                    <CustomTextR style={CommonStyle.dataText16White}>{CommonFunction.currencyFormat(item.price)}</CustomTextR>
                                            
                                            </View>
                                            <View style={{flex:1,justifyContent:'flex-end',alignItems:'flex-end',paddingRight:15,paddingBottom:10}}>
                                                <CustomTextR style={CommonStyle.dataTextWhite}>사용기한:{CommonFunction.convertUnixToDate(item.end_dt,"YYYY.MM.DD")}</CustomTextR>
                                                <CustomTextR style={CommonStyle.dataTextWhite}>남은일자 : {this.renderRestDays(item.end_dt)}</CustomTextR>
                                            </View>
                                        
                                        </ImageBackground>
                                    </TouchableOpacity>
                                )
                            })
                        }
                        </View>
                        }
                        </View>
                    </ScrollView>
                </View>
                <View style={styles.footerWrap}>
                    <TouchableOpacity 
                        onPress={()=> this.props.screenState._closeCouponModal()}
                        style={styles.footerLeftWrap}
                    >
                        <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#9f9f9f'}}>취소</CustomTextM>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={()=>this.selectMember()}
                        style={styles.footerRightWrap}
                    >
                        <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#fff'}}>선택</CustomTextM>
                    </TouchableOpacity>
                    
                </View>    
            </View>
        );
        }
    }
}



const styles = StyleSheet.create({
    container: {
        flex:1
    },
    modalDefaultWrap : {
        paddingHorizontal:10,paddingVertical:15,flexDirection:'row',borderBottomColor:DEFAULT_COLOR.input_border_color,borderBottomWidth:1
    },
    modalSelectedWrap : {
        paddingHorizontal:10,paddingVertical:15,backgroundColor:DEFAULT_COLOR.base_color,flexDirection:'row',borderBottomColor:DEFAULT_COLOR.input_border_color,borderBottomWidth:1
    },
    /**** Modal  *******/
    modalContainer: {   
        zIndex : 10,     
        position :'absolute',
        left:0,
        width:SCREEN_WIDTH,
        height: SCREEN_HEIGHT-200,
        paddingTop: 16,
        backgroundColor: '#fff'
    },
    titleWrap : {
        flex:0.5,justifyContent:'center',borderBottomColor:'#ccc',borderBottomWidth:1
    },
    dataWarp : {
        flex:4
    },
    footerWrap : {
        flex:1,justifyContent:'center',alignItems:'center',flexDirection:'row'
    },
    footerLeftWrap : {
        width:80,backgroundColor:'#e1e1e1',justifyContent:'center',alignItems:'center',padding:5,marginRight:5
    },
    footerRightWrap:{
        width:80,backgroundColor:DEFAULT_COLOR.base_color,justifyContent:'center',alignItems:'center',padding:5
    },
    
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputBlankNull : {
        borderWidth:1,borderColor:'#fff'
    },
    inputBlank : {
        borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color,borderRadius:5,backgroundColor:'#fff',marginVertical:7,height:41
    },
    boxAbsentWrap : {
        width:SCREEN_WIDTH/4,marginBottom:10
    },
    formWarp : {
        flex:1,paddingHorizontal:10,paddingVertical:5,marginTop:0,borderTopWidth:1,borderTopColor:DEFAULT_COLOR.base_background_color
    },
    couponListWRap : {
        flex:1,
    },
    formTitleWrap : {
        height:30,paddingVertical:5,flexDirection:'row',marginTop:5
    },
    formDataWrap : {
        height:40,paddingVertical:5
    },
});