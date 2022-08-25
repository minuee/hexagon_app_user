import React, { Component } from 'react';
import {SafeAreaView,Image,View,KeyboardAvoidingView,ScrollView,PixelRatio,Dimensions,TouchableOpacity,BackHandler,StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {Input,Overlay} from 'react-native-elements';
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
import CustomConfirm from '../../Components/CustomConfirm';
import Loader from '../../Utils/Loader';
import { apiObject } from "../Apis";


class AuthCheckScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading : true,            
            member_pk : 0,
            userTel : null,
            authCode : null,
            isResult : false,
            isResultMsg : ""
            
        }
    }
   

    UNSAFE_componentWillMount() {
        if ( !CommonUtil.isEmpty(this.props.extraData.params.screenData)) {  
            this.setState({
                authCode : this.props.extraData.params.screenData.authCode,
                userTel: this.props.extraData.params.screenData.userTel,
                member_pk : this.props.extraData.params.screenData.member_pk,
            })
        }else{
            CommonFunction.fn_call_toast('잘못된 접근입니다..',2000);
            this.props.navigation.goBack(null)
        }
        
    }

    componentDidMount() {      
        setTimeout(
            () => {            
                this.setState({loading:false})
            },500
        )
    }

    componentWillUnmount(){         
    }

    sendAuthCode = async() => {
        CommonFunction.fn_call_toast('인증코드를 다시 발송하였습니다.',2000);
    }

    nextMove = async() => {
        this.props.navigation.navigate('PassWordResetStack',{
            screenData: {
                authCode : this.state.authCode,
                userTel: this.state.userTel,
                member_pk : this.state.member_pk,
            }
        });
    }

    checkAuthCode = async() => {
        if ( !CommonUtil.isEmpty(this.state.formAuthCode)) {
            if ( this.state.formAuthCode ===  this.state.authCode ) {
                this.nextMove()
            }else{
                this.setState({
                    isResult :  true,
                    isResultMsg : "잘못된 인증번호입니다"
                })
            }
        }
    }

    render() {
        return(
            <SafeAreaView style={ styles.container }>
                <KeyboardAvoidingView style={{paddingVertical:10}} behavior={Platform.OS === 'ios' ? "padding" : 'height'}  enabled> 
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    indicatorStyle={'white'}
                    scrollEventThrottle={16}
                    keyboardDismissMode={'on-drag'}      
                    style={{width:'100%'}}
                >
                    <View style={styles.middleWarp}>
                        <View style={styles.middleDataWarp}>
                            <View style={{justifyContent:'center',alignItems:'center'}}>
                                <Image
                                    source={require('../../../assets/icons/icon_lock.png')}
                                    resizeMode={"contain"}
                                    style={{width:PixelRatio.roundToNearestPixel(48),height:PixelRatio.roundToNearestPixel(48)}}
                                />
                            </View>
                            <View style={{marginVertical:15}}>
                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),color:DEFAULT_COLOR.base_color_666}}>휴대폰으로 전송된 인증 코드를 입력하세요</CustomTextR>
                            </View>
                            <View style={{marginVertical:15}}>
                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color_666}}>회원님의 계정에 등록된 휴대폰으로 인증 코드를 전송했습니다. <CustomTextB>{CommonFunction.fn_dataDecode(this.state.userTel)}</CustomTextB>으로 전송된 6자리 코드를 입력하세요</CustomTextR>
                            </View>
                            {/*
                            <TouchableOpacity 
                                style={{marginVertical:15,justifyContent:'center',alignItems:'center'}}
                                onPress={()=>this.sendAuthCode()}
                            >
                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),color:'#8b37fe'}}>새 코드 요청하기</CustomTextR>
                            </TouchableOpacity>
                            */}
                            <Input   
                                value={this.state.formUserID}
                                placeholder="6자리 인증코드"
                                placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                inputContainerStyle={styles.inputContainerStyle}
                                inputStyle={styles.inputStyle}
                                clearButtonMode={'always'}
                                onChangeText={value => this.setState({formAuthCode:value,isResult:false})}
                            />
                            {
                                ( this.state.isResult && !CommonUtil.isEmpty(this.state.formAuthCode)) &&
                                <View style={{padding:10}}>
                                    <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),color:'#c53915'}}>{this.state.isResultMsg}</CustomTextR>
                                </View>
                                
                            }
                        </View>
                        <View style={styles.middleDataWarp2}>
                            <TouchableOpacity 
                                onPress={()=>this.checkAuthCode()}
                                style={CommonUtil.isEmpty(this.state.formAuthCode) ? styles.buttonWrapOff : styles.buttonWrapOn }
                            >
                                <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize17),color:'#fff'}}>다음</CustomTextM>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                </KeyboardAvoidingView>
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
    middleWarp : {
        flex:1,        
        justifyContent:'center',        
        marginHorizontal:30,marginBottom:10,
    },
    middleDataWarp : {
        flex:1.5,
        justifyContent:'flex-start',
        marginTop:30
    },
    middleDataWarp2 : {
        flex:1,
        justifyContent:'flex-start',
    },
    titleWrap : {
        flex:1,justifyContent:'flex-end',paddingLeft:20
    },
    titleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),color:DEFAULT_COLOR.base_color_666
    },
    inputContainerStyle : {
        backgroundColor:'#fff',margin:0,padding:0,height:45
    },
    inputStyle :{ 
        margin:0,paddingLeft: 10,color: DEFAULT_COLOR.base_color_666,fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16)
    },
    buttonWrapOn : {
        backgroundColor:'#0059a9',padding:10,marginHorizontal:15,justifyContent:'center',alignItems:'center',borderRadius:25
    },
    buttonWrapOff : {
        backgroundColor:'#ccc2e6',padding:10,marginHorizontal:15,justifyContent:'center',alignItems:'center',borderRadius:25
    },
    forgetenWrap : {
        flex:1,justifyContent:'flex-start',alignItems:'center',marginHorizontal:30
    },
    forgetenText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),color:'#0059a9'
    }
});


function mapStateToProps(state) {
    return {
        userToken : state.GlabalStatus.userToken
    };
}

export default connect(mapStateToProps,null)(AuthCheckScreen);