import React, { Component } from 'react';
import {ScrollView,View,StyleSheet,Text,Dimensions,Image,PixelRatio,TouchableOpacity, } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
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
import { apiObject } from "../Apis";

class CouponListScreen extends Component {
    
    constructor(props) {
        super(props);
        this.state = {      
            loading : true,
            couponList : [],
            
        };
    }

    getBaseData = async(member_pk) => {
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/order/memberinfo/' + member_pk ;
            const token = this.props.userToken.apiToken;
            returnCode = await apiObject.API_getDetailDefault(this.props,url,token);      
            //console.log('returnCode',returnCode.data.userDetail.coupon)    
            if ( returnCode.code === '0000'  ) {
                this.setState({
                    memberidx : member_pk,
                    couponList : !CommonUtil.isEmpty(returnCode.data.userDetail.coupon)?returnCode.data.userDetail.coupon:[],
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
            //console.log('errr',e) 
            this.setState({loading:false,moreLoading : false})
            CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.',1000);
            setTimeout(
                () => {            
                    this.props.navigation.goBack(null);
                },1000
            )
        }
    }

    async UNSAFE_componentWillMount() {
        await this.getBaseData(this.props.userToken.member_pk);
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

    nextStep = async(data) => {
        this.props.navigation.navigate('MyTeamDetailStack',{
            screenTitle : '팀 상세',
            screenData : data
        })
        
    }

    render() {
        if ( this.state.loading ) {
            return (
                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} /> 
            )
        }else {  
        return(
            
            <View style={ styles.container }>
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
                    style={{flex:1,width:SCREEN_WIDTH}}
                >
                    <View style={styles.topBoxWrap}>
                        <CustomTextM style={CommonStyle.titleText15}>나의 쿠폰({this.state.couponList.length})</CustomTextM>
                    </View> 
                    <View style={{flex:1,marginTop:10}}>
                       
                        {
                            this.state.couponList.length === 0 ?

                            <View style={CommonStyle.blankWrap}>
                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#838383'}}>사용가능한 쿠폰이 없습니다.</CustomTextR>
                            </View>
                            :
                            this.state.couponList.map((item, index1) => {  
                            return (
                                <View style={styles.boxWrap} key={index1}>
                                    <View style={{flex:1,backgroundColor:DEFAULT_COLOR.base_color,paddingVertical:5,paddingLeft:15}}>
                                        <CustomTextR style={styles.pointText2}>발행일 : {CommonFunction.convertUnixToDate(item.reg_dt,"YYYY.MM.DD")} </CustomTextR>
                                    </View>
                                    <View style={{flex:1,padding:20,justifyContent:'center',alignItems:'center'}}>
                                        <CustomTextM style={styles.boxText}>
                                            {CommonFunction.currencyFormat(item.price)}원 할인
                                        </CustomTextM>
                                        <CustomTextM style={styles.pointText}>
                                           ( {CommonFunction.convertUnixToDate(item.reg_dt,"YYYY.MM.DD")} ~ {CommonFunction.convertUnixToDate(item.end_dt,"YYYY.MM.DD")} )
                                        </CustomTextM>
                                    </View>
                                </View>
                            )
                        })
                        }
                    </View>
                    
                    <View style={{flex:1,height:50,backgroundColor:'#fff'}}></View>
                </ScrollView>
               
            </View>
        );
        }
    }
}


//Tmap연동 https://github.com/yhc002/TMapReactNativeApp
const styles = StyleSheet.create({
    container: {        
        flex: 1,        
        justifyContent: 'center',
        alignItems: 'center',
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
    fixedUpButton : {
        position:'absolute',bottom:60,right:20,width:40,height:40,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',zIndex:3,borderColor:'#ccc',borderWidth:1,borderRadius:20,opacity:0.5
    },
    topBoxWrap : {
        flex:1,
        flexDirection:'row',    
        flexGrow:1,    
        paddingHorizontal:20,
        paddingVertical:10,
        backgroundColor:'#f5f6f8',
        borderBottomWidth:1,
        borderBottomColor : DEFAULT_COLOR.input_border_color
    },
    boxWrap : {
        justifyContent:'center',borderWidth:0.5,borderColor:'#979797'
        ,padding:0,marginBottom:10,marginHorizontal:20
    },
    boxText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20),color:'#111'
    },
    pointText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize10),color:'#888'
    },
    pointText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),color:'#fff'
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


export default connect(mapStateToProps,mapDispatchToProps)(CouponListScreen);