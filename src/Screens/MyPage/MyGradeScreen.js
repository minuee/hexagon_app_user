import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Text,Dimensions,PixelRatio,TouchableOpacity,Image,ImageBackground} from 'react-native';
import 'moment/locale/ko'
import  moment  from  "moment";
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonStyle from '../../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR, TextRobotoL} from '../../Components/CustomText';
import Loader from '../../Utils/Loader';
import CommonUtil from '../../Utils/CommonUtil';
import CommonFunction from '../../Utils/CommonFunction';
import { apiObject } from "../Apis";
const mockData1  = [
    {
       id : 1, title : "Bronze", icon : require('../../../assets/icons/level_bronze.png'),condition : '회원가입시/기본',rate:'0.5%',coupon: '',delivery:'5,500원',free_amount : '1회구매시 150만원이상 무료'
    },
    {
        id : 2, title : "Silver", icon : require('../../../assets/icons/level_silver.png'),condition : '이전3개월 300만원이상 구매시',rate:'1.0%',coupon: '최초1회 5만원',delivery:'5,500원',free_amount : '1회구매시 100만원이상 무료'
    },
    {
        id : 3, title : "Gold", icon : require('../../../assets/icons/level_gold.png'),condition : '이전3개월 500만원이상 구매시',rate:'1.5%',coupon: '최초1회 10만원',delivery:'',free_amount : '무료'
    },
    {
        id : 4, title : "Plantinum", icon : require('../../../assets/icons/level_platinum.png'),condition : '이전3개월 900만원이상 구매시',rate:'2.0%',coupon: '최초1회 20만원',delivery:'',free_amount : '무료'
    },
   

]

class MyGradeScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading : true,
            userData : {},
            couponCount : 0,
            orderInfo : [],
            selectGrade : 0,
            leftPixel : 20,
            leftPixel2 : 21,
        }
    }

    getBaseData = async(member_pk) => {
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/member/mygrade/' + member_pk;
            const token = this.props.userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_getDetailDefault(this.props,url,token,sendData);          
            //console.log('MyGradeScreen',returnCode.data) ;
            if ( returnCode.code === '0000'  ) {
                let selectGrade = 1;
                if (returnCode.data.myGrade.grade_code === 'Silver' ) {
                    selectGrade = 2;
                }else if (returnCode.data.myGrade.grade_code === 'Gold' ) {
                    selectGrade = 3;
                }else if (returnCode.data.myGrade.grade_code === 'Plantinum' ) {
                    selectGrade = 4;
                }else{
                    selectGrade = 1;
                }
                this.setState({
                    couponCount :  !CommonUtil.isEmpty(returnCode.data.couponCount) ? returnCode.data.couponCount : 0,
                    selectGrade : selectGrade,
                    userData : returnCode.data.myGrade,
                    orderInfo : !CommonUtil.isEmpty(returnCode.data.myGrade.order_info) ? returnCode.data.myGrade.order_info : [],
                    loading:false,moreLoading : false
                })
                this.changGradeView(selectGrade);
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.',2000);
                this.setState({moreLoading:false,loading:false})
            }
        }catch(e){
            //console.log('eee',e)
            this.setState({loading:false,moreLoading : false})
        }
    }

    async UNSAFE_componentWillMount() {
        if ( !CommonUtil.isEmpty(this.props.userToken.member_pk)) {
            await this.getBaseData(this.props.userToken.member_pk);   
        }else{
            CommonFunction.fn_call_toast('잘못된 접근입니다.',1500);
            setTimeout(
                () => {            
                   this.props.navigation.goBack(null);
                },1500
            )
        }
    }

    componentDidMount() {
    }

    componentWillUnmount(){        
    }

    changGradeView = async(grade) => {
        if ( grade === 1 ) {
            await this.setState({
                selectGrade : 1,
                leftPixel : 20 ,
                leftPixel2 : 21 ,
            })
        }else{
            let intervalData = parseInt(SCREEN_WIDTH/5+5);
            await this.setState({
                selectGrade : grade,
                leftPixel : ((grade-1)*intervalData)+21,
                leftPixel2 : ((grade-1)*intervalData)+22,
            })
        }
    }

    moveCouponDetail = () => {
        this.props.navigation.navigate('CouponListStack')
    }
    moveDetail = (item) => {
        this.props.navigation.navigate('OrderDetailStack',{
            screenTitle:item.order_pk,
            screenData:item
        })
    }
    renderInformation = (grade) => {
        let gradeInfo = mockData1.filter((info) =>  info.id === grade);
        let gradeName='브론즈';
        switch(grade) {
            case 1 : gradeName='브론즈';break;
            case 2 : gradeName='실버';break;
            case 3 : gradeName='골드';break;
            case 4 : gradeName='플래티넘';break;
            default : gradeName='브론즈';break;
        }
        if ( !CommonUtil.isEmpty(gradeInfo)) {
            return ( 
                <View>
                    <CustomTextB style={styles.tooltipTitleText}>
                        {gradeName}달성 조건
                    </CustomTextB>
                    <CustomTextR style={styles.tooltipText} />
                    <CustomTextR style={styles.tooltipText}>
                        {gradeInfo[0].condition}
                    </CustomTextR>
                    <View style={{marginTop:10,paddingVertical:10,borderTopWidth:1,borderTopColor:DEFAULT_COLOR.input_border_color}}>
                        <CustomTextB style={styles.tooltipTitleText}>
                            등급헤택
                        </CustomTextB>
                        <CustomTextR style={styles.tooltipText} />
                        <CustomTextR style={styles.tooltipText}>
                            적립율  {gradeInfo[0].rate}{"\n"}
                            {!CommonUtil.isEmpty(gradeInfo[0].coupon) && "쿠폰 "+gradeInfo[0].coupon}{"\n"}
                            배송비  {gradeInfo[0].delivery} {gradeInfo[0].free_amount}{"\n"}
                        </CustomTextR>
                    </View>
                </View>
              ) 
        }else{
            return null
        }
    }

    renderGradeImage = ( grade ) => {
        switch(grade) {
            case 'Bronze' :
                return (
                    <ImageBackground
                        source={require('../../../assets/icons/grade_bronze.png')}
                        resizeMode={"contain"}
                        style={{width:SCREEN_WIDTH/3,height:SCREEN_WIDTH/3}}
                    />
                );break;
            case 'Silver' :
                return (
                    <ImageBackground
                        source={require('../../../assets/icons/grade_silver.png')}
                        resizeMode={"contain"}
                        style={{width:SCREEN_WIDTH/3,height:SCREEN_WIDTH/3}}
                    />
                );break;
                case 'Gold' :
            return (
                <ImageBackground
                    source={require('../../../assets/icons/grade_gold.png')}
                    resizeMode={"contain"}
                    style={{width:SCREEN_WIDTH/3,height:SCREEN_WIDTH/3}}
                />
            );break;
            case 'Platinum' :
            return (
                <ImageBackground
                    source={require('../../../assets/icons/grade_platinum.png')}
                    resizeMode={"contain"}
                    style={{width:SCREEN_WIDTH/3,height:SCREEN_WIDTH/3}}
                />
            );break;
            default :
            return (
                <ImageBackground
                    source={require('../../../assets/icons/grade_bronze.png')}
                    resizeMode={"contain"}
                    style={{width:70,height:70}}
                />
            );break;
        }
    } 


    renderHistoryPrice = (item) => {
        return (
            <TextRobotoR style={styles.pointText2}>
            { item.total_amount-item.total_nonamount-item.coupon_amount-item.point_amount-item.total_valamount < 0 ? 0 : CommonFunction.currencyFormat(item.total_amount-item.total_nonamount-item.coupon_amount-item.point_amount-item.total_valamount)}원 <TextRobotoR style={[styles.pointText2,{color:'#888'}]}>({CommonFunction.currencyFormat(item.total_amount-item.total_nonamount)}-{CommonFunction.currencyFormat(item.coupon_amount+item.point_amount+item.total_valamount)})</TextRobotoR>
            </TextRobotoR>
        )
    }

    render() {
        if ( this.state.loading ) {
            return (
                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} /> 
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
                        style={{width:'100%'}}
                    >
                   
                    <View style={[styles.mainWrap,{marginTop:15}]}>
                        <View style={styles.boxWrap}>
                            <View style={{paddingVertical:5,justifyContent:'center',alignItems:'center'}}>
                                <CustomTextB style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#000'}}>현재등급</CustomTextB>
                                <View style={{paddingVertical:15}}>
                                    {this.renderGradeImage(this.state.userData.grade_code)}
                                </View>
                                
                            </View>
                            <View style={styles.topTailWarp}>
                                <CustomTextR style={CommonStyle.dataText}>
                                    등급기간 : {CommonFunction.convertUnixToDate(CommonFunction.convertDateToUnix(this.state.userData.now_grade_start),"YYYY년 MM월 DD일")} ~ {CommonFunction.convertUnixToDate(CommonFunction.convertDateToUnix(this.state.userData.now_grade_end),"YYYY년 MM월 DD일")}
                                </CustomTextR>
                                <CustomTextR style={CommonStyle.dataText}>
                                    {CommonFunction.convertUnixToDate(CommonFunction.convertDateToUnix(this.state.userData.now_grade_end),"YYYY년 MM월 DD일")} 이후 등급산정이 됩니다.
                                </CustomTextR>
                            </View>
                            {!CommonUtil.isEmpty(this.state.userData.grade_term_start) &&          
                            <View style={[styles.topTailWarp,{paddingTop:10}]}>
                                <CustomTextR style={CommonStyle.dataText}>
                                    산정기간 : {CommonFunction.convertUnixToDate(CommonFunction.convertDateToUnix(this.state.userData.grade_term_start),"YYYY년 MM월 DD일")} ~ {CommonFunction.convertUnixToDate(CommonFunction.convertDateToUnix(this.state.userData.grade_term_end),"YYYY년 MM월 DD일")}
                                </CustomTextR>
                                <CustomTextR style={CommonStyle.dataText}>
                                    최근 3개월간 구매총액  : {CommonFunction.currencyFormat(this.state.userData.grade_amount)}
                                </CustomTextR>
                            </View>
                            }
                            
                            
                            {this.state.orderInfo.length > 0 ?
                            <View style={styles.topTailWarp}>
                                <CustomTextR style={CommonStyle.dataText}>최근 3개월간의 구매내역 </CustomTextR>
                                <CustomTextR style={styles.pointText}>(상품금액-할인금액-부가세-쿠폰/포인트금액, 비적립대상 제외)</CustomTextR>
                                <View style={styles.historyWrap}>
                                    <View style={styles.historyLeftWrap}>
                                        <CustomTextR style={styles.pointText2}>결제일 </CustomTextR>
                                    </View>
                                    <View style={styles.historyRightWrap}>
                                        <CustomTextR style={styles.pointText2}>구매금액 </CustomTextR>
                                    </View>
                                </View>
                                {
                                this.state.orderInfo.map((item, index) => {  
                                    return (
                                    <TouchableOpacity 
                                        onPress={()=>this.moveDetail(item)}
                                        style={styles.historyDataWrap} key={index}
                                    >
                                        <View style={styles.historyLeftWrap2}>
                                            {!CommonUtil.isEmpty(item.send_dt) ?
                                            <CustomTextR style={styles.pointText2}>{CommonFunction.convertUnixToDate(item.send_dt,"YYYY.MM.DD")} </CustomTextR>
                                            :
                                            null
                                            }
                                        </View>
                                        <View style={styles.historyRightWrap2}>
                                            {this.renderHistoryPrice(item)}
                                        </View>
                                    </TouchableOpacity>
                                    )
                                })
                                }
                            </View>
                            :
                            <View style={styles.topTailWarp}>
                                <CustomTextR style={CommonStyle.dataText}>구매내역이 아직 없습니다.</CustomTextR>
                            </View>
                            }
                            <View style={{padding:5}}>
                                <CustomTextR style={[styles.pointText,{color:'#888'}]}>순발주총금액과 등급심사결과는 발주에 따른 결제완료후 익일 반영됩니다.</CustomTextR>
                            </View>
                        </View>
                    </View>
                    {/*
                    <View style={[styles.mainWrap,{marginTop:5}]}>
                        <TouchableOpacity 
                            onPress={()=>this.moveCouponDetail()}
                            style={[styles.boxWrap,{minHeight:30,alignItems:'center'}]}
                        >
                            <CustomTextR style={CommonStyle.dataText}>나의 쿠폰[현재 : {this.state.couponCount}개] </CustomTextR>
                        </TouchableOpacity>
                    </View>
                    */}
                    <View style={styles.mainWrap}>
                        <View style={styles.boxWrap}>
                            <View style={styles.devideWarp}>
                            {
                                mockData1.map((item, index1) => {  
                                    return (
                                        <TouchableOpacity 
                                            onPress={()=>this.changGradeView(item.id)}
                                            key={index1} style={styles.devideDataWrap} 
                                        >
                                            <View style={{paddingVertical:10}}>
                                                <CustomTextB style={this.state.selectGrade === item.id ?styles.selectedText : styles.unSelectedText}>
                                                    {item.title}
                                                </CustomTextB>
                                            </View>
                                            <View style={{paddingVertical:10}}>
                                                <Image
                                                    source={item.icon}
                                                    resizeMode={"contain"}
                                                    style={{width:27,height:27}}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                            </View>
                            <View style={{padding:10}}>
                                <View style={styles.box}>
                                    <View style={[styles.triangle,{left:this.state.leftPixel}]} />
                                    <View style={[styles.triangle2,{left:this.state.leftPixel2}]} />
                                    <View style={styles.boxInfoWrap}>
                                        {this.renderInformation(this.state.selectGrade)}
                                    </View>
                                </View>
                            </View>
                           
                        </View>
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
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tooltipTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),letterSpacing:-0.5,color : '#494949'
    },
    tooltipText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),letterSpacing:-0.5,color : '#494949'
    },
    boxInfoWrap : {
        padding:20
    },
    box: {
        width: SCREEN_WIDTH*0.8,
        height: 200,
        backgroundColor: "#fff",
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius:5
    },
    triangle: {
        width: 10,
        height: 10,
        position: "absolute",
        top: -10,
        left: 20,
        borderLeftWidth: 10,
        borderLeftColor: "transparent",
        borderRightWidth: 10,
        borderRightColor: "transparent",
        borderBottomWidth: 10,
        borderBottomColor: "#ccc"
    },
    triangle2: {
        width: 10,
        height: 10,
        position: "absolute",
        top: -10,
        left: 21,
        borderLeftWidth: 9,
        borderLeftColor: "transparent",
        borderRightWidth: 9,
        borderRightColor: "transparent",
        borderBottomWidth: 9,
        borderBottomColor: "#fff"
    },
    devideWarp : {
        flex:1,flexDirection:'row'
    },
    devideDataWrap : {
        flex:1,justifyContent:'center',alignItems:'center'
    },
    selectedText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),color:'#000',letterSpacing:-1
    },
    unSelectedText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),color:'#ccc',letterSpacing:-1
    },
    mainWrap : {        
        marginHorizontal : 15,marginVertical:5
    },
    boxWrap : {
        padding:15,backgroundColor:'#fff',minHeight:60,marginBottom:10,borderRadius:5,
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
    boxText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),color:'#000'
    },
    topTailWarp : {
        marginHorizontal:0,paddingVertical:15,paddingHorizontal:5,borderTopWidth:1,borderTopColor:DEFAULT_COLOR.input_border_color,borderBottomWidth:1,borderBottomColor:DEFAULT_COLOR.input_border_color,justifyContent:'center'
    },
    pointText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize10),color:DEFAULT_COLOR.base_color
    },
    pointText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11)
    },
    historyWrap : {
        flexDirection:'row',backgroundColor:'#efefef',marginTop:15,padding:5,borderWidth:0.5,borderColor:'#ccc',
    },
    historyLeftWrap : {
        flex:1.3,justifyContent:'center',alignItems:'center'
    },
    historyRightWrap : {
        flex:3,justifyContent:'center',alignItems:'center'
    },
    historyDataWrap : {
        flexDirection:'row',padding:5,borderBottomWidth:0.5,borderBottomColor:'#ccc',
    },
    historyLeftWrap2 : {
        flex:1.3,alignItems:'center',justifyContent:'center'
    },
    historyRightWrap2 : {
        flex:3,justifyContent:'center'
    },
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


export default connect(mapStateToProps,mapDispatchToProps)(MyGradeScreen);