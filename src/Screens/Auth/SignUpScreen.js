import React, { Component } from 'react';
import {SafeAreaView,Image,View,StyleSheet,PixelRatio,Dimensions,TouchableOpacity,StatusBar,Linking,KeyboardAvoidingView,ScrollView,Platform} from 'react-native';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import {Input,Overlay,CheckBox} from 'react-native-elements';
import jwt_decode from "jwt-decode";
import * as NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
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
import CustomAlert from '../../Components/CustomAlert';
import { apiObject } from "../Apis";
import Loader from '../../Utils/Loader';
import NetworkDisabled from '../../Components/NetworkDisabled';

const RADIOON_OFF = require('../../../assets/icons/checkbox_off.png');
const RADIOON_ON = require('../../../assets/icons/checkbox_on.png');

const alertContents = 
(<View style={{flex:1,marginTop:10}}>
    <View style={{paddingTop:10}}>
        <CustomTextB style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),color:'#000'}}>
            회원가입이 어려우신가요?{"\n"}상담연결
        </CustomTextB>       
    </View> 
    <View style={{paddingTop:20}}>
        <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),color:'#494949'}}>
            {DEFAULT_CONSTANTS.CompanyInfoTel}
        </CustomTextR>        
    </View>                        
</View>);

class SignupScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            thisUUID : null,
            loading : true,
            formUserID : '',
            formPassword : '',
            isAutoLogin : false,
            //poplayer
            popLayerView : false,
            isCancelView : true,
            cancleText : '취소',
            okayText : '통화하기',
            alertTitle : '슈퍼바인더 고객센터',
            alertBody : alertContents,
            clickCancle : this.clickCancle.bind(this),
            closePopLayer : this.closePopLayer.bind(this)
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
            let number = DEFAULT_CONSTANTS.CompanyInfoTel;
            
            let phoneNumber = '';
            if (Platform.OS === 'android') { phoneNumber = `tel:${number}`; }
            else {phoneNumber = `telprompt:${number}`; }
            Linking.openURL(phoneNumber);
        }
    }

 
    
    async UNSAFE_componentWillMount() {
        
        if ( !CommonUtil.isEmpty(this.props.rootState)) {
            if ( !CommonUtil.isEmpty(this.props.rootState.thisUUID)) {
                this.setState({
                    thisUUID : this.props.rootState.thisUUID
                })
            }
        }
        this.messageListener();
        if ( __DEV__ ) {
            this.setState({
                formUserID : '1234567891',
                formPassword : 'hexagon12!@'
            })
        }
        if ( !CommonUtil.isEmpty(this.props.rootState.pushRouteName) && this.props.rootState.pushRouteIdx > 0 ) {
            this.movePushPage(this.props.rootState.pushRouteName,this.props.rootState.pushRouteIdx)
        }
    }

    movePushPage = async(routeName,routeIdx) => {
        if ( routeName === 'OrderDetailStack') {
            this.props.navigation.navigate(routeName,{
                screenData : {order_pk : routeIdx }
            });
        }else if ( routeName === 'NoticeDetailStack') {
            this.props.navigation.navigate(routeName,{
                screenData : {notice_pk : routeIdx }
            })
        }else if ( routeName === 'ProductDetailStack') {            
        }        
    }

    messageListener = async () => {
        //백그라운드에서 푸시를 받으면 호출됨 
        messaging().setBackgroundMessageHandler(async remoteMessage => {
            const { title, body } = remoteMessage.notification;
            const { routeIdx, routeName } = remoteMessage.data;
            this.setState({
                fcmTitle :  title,
                fcmbody : body,
                pushRouteName : routeName,
                pushRouteIdx :routeIdx
            })
            if ( !CommonUtil.isEmpty(routeName) && routeIdx > 0 ) {
                this.movePushPage(routeName,routeIdx)
            }
        });
    }   

    componentDidMount() {    
        if (Platform.OS === 'android') {
            Linking.getInitialURL().then(url => {
                if(url) this.getNavigateInfo(url); //
            });
        }else{
            Linking.addEventListener('url', this.handleOpenURL);
        }   
        NetInfo.addEventListener(this.handleConnectChange); 
    }
    UNSAFE_componentWillUnmount() { 
        Linking.removeEventListener('url', this.handleOpenURL);
        NetInfo.removeEventListener(this.handleConnectChange)
    }

    handleOpenURL = (event) => { //이벤트 리스너.
        this.getNavigateInfo(event.url);
    }
    handleConnectChange = state => {
        this.setState({isConnected:state.isConnected,loading:false})
    }

    getNavigateInfo = (url) =>{        
        const basepaths = url.split('?'); // 쿼리스트링 관련한 패키지들을 활용하면 유용합니다.
        const paths = basepaths[1].split('|'); // 쿼리스트링 관련한 패키지들을 활용하면 유용합니다.
        if ( paths[0] === 'shareJoin') {
             if ( !CommonUtil.isEmpty(paths[1])) {
                const shareMember = paths[1].split('=');
                if ( !CommonUtil.isEmpty( shareMember[1])) {
                    this.setState({
                        shareMember : shareMember[1]
                    })
                }
            }
        }else{
            let arrayParams = [];
            if(paths.length>1){ //파라미터가 있다
              const params= paths[1].split('&');
              let id;
              for(let i=0; i<params.length; i++){
                //let param = params[i].split('=');// [0]: key, [1]:value
                let nextData = params[i].replace('=',':');
                arrayParams.push(nextData)
              }
               this.props.navigationProps.navigate(paths[0],arrayParams)
            }
        }        
    }

    setLoginToken = async(token) => {
        let jwtObject = await jwt_decode(token);
        const loginInfo = {
            user_id : jwtObject.user_id,
            user_pw : this.state.formPassword,
            member_pk : jwtObject.member_pk,
            name : jwtObject.name,
            email : jwtObject.email,
            phone : jwtObject.phone,
            is_salesman : jwtObject.is_salesman,
            gradeRate : jwtObject.grade_rate,
            gradeCode : jwtObject.grade_code,
            gradeName : jwtObject.grade_name,
            apiToken : token,
            uuid : this.state.thisUUID
        }
        await this.props._saveUserToken(loginInfo);
        await AsyncStorage.setItem('autoLoginData',this.state.isAutoLogin ? JSON.stringify(loginInfo) : '');   
        setTimeout(() => {
            this.props._saveNonUserToken({
                uuid : this.state.thisUUID
            });
        }, 500);        
    }

    joinForm = () => {
        this.props.navigation.navigate('SignInStack',{
            screenData : {thisUUID : this.state.thisUUID }
        })
    }

    loginForm = async() => {
        if ( CommonUtil.isEmpty(this.state.formUserID)) {
            CommonFunction.fn_call_toast('아이디(이메일)을 입력해주세요',2000);
            return true;
        }else if ( CommonUtil.isEmpty(this.state.formPassword)) {
            CommonFunction.fn_call_toast('비밀번호를 입력해주세요',2000);
            return true;
        }else{
            await this.props._fn_getUserCartCount(0);
            this.apioginCheck()          
        }
    }

    setDeviceData = async(token) => {
        let jwtObject = await jwt_decode(token);
        let returnCode = {code:9998};     
        try {            
            const url2 = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/member/device/' + jwtObject.member_pk;
            let sendData = {
                device_id  : this.props.rootState.thisUUID,
                device_model : this.props.rootState.deviceModel,
                os_type:Platform.OS,
                push_token:this.props.rootState.fcmToken
            }
            returnCode = await apiObject.API_updateCommon(this.props,url2,token,sendData);
            return returnCode;
        }catch(e){
            //console.log('e',e)   
            return returnCode;
        }
    }

    apioginCheck = async() => {
        this.setState({moreLoading:true})
        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/auth/signin';
            let sendData = {
                user_id : this.state.formUserID,
                password : this.state.formPassword
            }
            returnCode = await apiObject.API_authLogin(url,sendData);          
            if ( returnCode.code === '0000'  ) {
                let returnCode2 = await this.setDeviceData(returnCode.token);
                if ( returnCode2.code === '0000' ) {
                    this.setLoginToken(returnCode.token);
                }else{
                    CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다..',2000);
                }
            }else if ( returnCode.code === '1003' ) {
                CommonFunction.fn_call_toast('승인전이거나 사용중지된 아이디입니다\n관리팀에게 문의하세요',2000);
            }else if ( returnCode.code === '1014' ) {
                CommonFunction.fn_call_toast('가입한 아이디정보가 없습니다',2000);
            }else if ( returnCode.code === '1015' ) {
                CommonFunction.fn_call_toast('비밀번호가 맞지 않습니다.',2000);
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.',2000);
            }
            this.setState({moreLoading:false,loading:false})
        }catch(e){
            console.log('errrrr',e)  
            this.setState({loading:false,moreLoading : false})
        }
    }


    nonUserLogin = async() => {
        await this.props._fn_getUserCartCount(0);
        this.props._saveNonUserToken({
            uuid : this.state.thisUUID
        });
        setTimeout(() => {
            this.props.navigation.popToTop();
        }, 500);
        
    }

    clearInputText = field => {
        this.setState({[field]: ''});
    };

    checkItem = async(bool) => {
        this.setState({isAutoLogin:!bool})
    }
    render() {
        if ( this.state.loading ) {
            return (
                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} /> 
            )
        }else {
        return(
            <SafeAreaView style={ styles.container }>
                {!this.state.isConnected && <NetworkDisabled />}
                <KeyboardAvoidingView style={{paddingVertical:10}} behavior={Platform.OS === 'ios' ? "padding" : 'height'}  enabled> 
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    indicatorStyle={'white'}
                    scrollEventThrottle={16}
                    keyboardDismissMode={'on-drag'}      
                    style={{width:'100%'}}
                >
                { Platform.OS == 'android' && <StatusBar backgroundColor={'#fff'} translucent={false}  barStyle="dark-content" />}
                {this.state.popLayerView && (
                    <View >
                        <Overlay
                            onBackdropPress={()=>this.clickCancle()}
                            isVisible={this.state.popLayerView}
                            windowBackgroundColor="rgba(0, 0, 0, 0.8)"
                            overlayBackgroundColor="tranparent"
                            containerStyle={{}}
                        >
                            <View style={{width:SCREEN_WIDTH*0.8,height:SCREEN_HEIGHT*0.3,backgroundColor:'transparent'}}>
                                <CustomAlert screenState={this.state} />
                            </View>
                            
                        </Overlay>
                    </View>
                )}
                    <View style={styles.mainTopWrap}>
                        <CustomTextM style={styles.mainTopText}>회원이신가요?</CustomTextM>
                    </View>
                    <View style={styles.middleWarp}>
                        <View style={[styles.middleDataWarp,{}]}>
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>아이디</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap}>
                                <Input   
                                    value={this.state.formUserID}
                                    keyboardType={'number-pad'}
                                    placeholder="아이디(사업자등록번호 -없이입력)"
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={styles.inputContainerStyle}
                                    inputStyle={styles.inputStyle}
                                    clearButtonMode={'always'}
                                    onChangeText={value => this.setState({formUserID:value.trim()})}
                                />
                                {( Platform.OS === 'android' && this.state.formUserID !== '' ) && (
                                    <TouchableOpacity 
                                        hitSlop={{left:10,right:10,bottom:10,top:10}}
                                        style={{position: 'absolute', right: 20}} 
                                        onPress={() => this.clearInputText('formUserID')}
                                    >
                                        <Image source={require('../../../assets/icons/btn_remove.png')} style={CommonStyle.defaultIconImage20} />
                                    </TouchableOpacity>
                                    )
                                }
                            </View>
                            <View style={styles.memoryWrap}>
                                <CustomTextR style={CommonStyle.dataText}>자동로그인</CustomTextR>
                                <View style={styles.memoryRightWrap}>
                                    <CheckBox 
                                        containerStyle={{padding:0,margin:0}}   
                                        iconType={'FontAwesome'}
                                        checkedIcon={<Image source={RADIOON_ON} style={CommonStyle.checkboxIcon} />}
                                        uncheckedIcon={<Image source={RADIOON_OFF} style={CommonStyle.checkboxIcon} />}
                                        checkedColor={DEFAULT_COLOR.base_color}                          
                                        checked={this.state.isAutoLogin}
                                        size={PixelRatio.roundToNearestPixel(15)}                                    
                                        onPress={() => this.checkItem(this.state.isAutoLogin)}
                                    />
                                </View> 
                            </View>
                        </View>
                        <View style={styles.middleDataWarp}>
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>비밀번호</CustomTextR>
                            </View>
                            <View style={{flex:1}}>
                                <Input   
                                    secureTextEntry={true}
                                    value={this.state.formPassword}
                                    placeholder="비밀번호를 입력하세요"
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={styles.inputContainerStyle}
                                    inputStyle={styles.inputStyle}
                                    clearButtonMode={'always'}
                                    onChangeText={value => this.setState({formPassword:value.trim()})}
                                />
                                {( Platform.OS === 'android' && this.state.formPassword !== '' )  && (
                                <TouchableOpacity 
                                    hitSlop={{left:10,right:10,bottom:10,top:10}}
                                    style={{position: 'absolute', right: 20}} 
                                    onPress={() => this.clearInputText('formPassword')}
                                >
                                    <Image source={require('../../../assets/icons/btn_remove.png')} style={CommonStyle.defaultIconImage20} />
                                </TouchableOpacity>
                                )}
                            </View>
                        </View>
                       
                        <TouchableOpacity style={styles.middleDataWarp2}>
                            <TouchableOpacity 
                                onPress={()=>this.loginForm()}
                                style={(CommonUtil.isEmpty(this.state.formUserID) && CommonUtil.isEmpty(this.state.formPassword) ) ? styles.buttonWrapOff : styles.buttonWrapOn }
                            >
                                <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize17),color:'#fff'}}> 로그인</CustomTextM>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.forgetenWrap}>
                        <TouchableOpacity 
                            onPress={()=>this.props.navigation.navigate('FindIDStack',{
                                screenData: {
                                    formUserID : this.state.formUserID,
                                    formPassword : this.state.formPassword
                                }
                            })}
                        >
                            <CustomTextR style={styles.forgetenText}>비밀번호를 잊으셨나요?</CustomTextR>
                        </TouchableOpacity>
                        
                    </View>
                    <View style={styles.footerWrap}>
                        <View style={{alignItems:'flex-start',width:'80%'}}>
                            <CustomTextR style={styles.forgetenText}>처음이신가요?</CustomTextR>
                        </View>
                        <View style={styles.footerDataWrap}>
                            <View style={styles.middleDataWarp2}>
                                <TouchableOpacity 
                                    onPress={()=>this.joinForm()}
                                    style={styles.buttonWrapOn2}
                                >
                                    <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize17),color:DEFAULT_COLOR.base_color}}>회원가입</CustomTextM>
                                </TouchableOpacity>
                            </View>
                            <View style={{position:'absolute',right:-20,top:5,height:60,width:100,justifyContent:'center',alignItems:'center'}}>
                                <TouchableOpacity 
                                    onPress={()=>this.showPopLayer()}
                                    hitSlop={{left:10,right:10,top:0,bottom:10}}
                                >
                                <Image
                                    source={require('../../../assets/icons/btn_call.png')}
                                    resizeMode={"contain"}
                                    style={{width:PixelRatio.roundToNearestPixel(60),height:PixelRatio.roundToNearestPixel(60)}}
                                />
                                </TouchableOpacity>
                            </View>
                        </View>    
                        <TouchableOpacity 
                            style={{flex:1}}
                            onPress={()=>this.nonUserLogin()}
                        >
                            <CustomTextR style={styles.forgetenText}>비회원 둘러보기</CustomTextR>
                        </TouchableOpacity>                
                    </View>
                    <View style={styles.footerWrap2}>
                        <CustomTextR style={styles.titleText2}>브랜드 및 제품을 입점해 보세요</CustomTextR>
                        <CustomTextR style={styles.titleText2}>입점 및 제휴문의</CustomTextR>
                        <CustomTextR style={styles.titleText2}>대표번호 : 02-545-8509</CustomTextR>
                        <CustomTextR style={styles.titleText2}>이메일 : ask_any_q@hexagonti.com</CustomTextR>
                    </View>  
                    { this.state.moreLoading &&
                        <View style={CommonStyle.moreWrap}>
                            <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} />
                        </View>
                    }
                    <View style={[CommonStyle.blankArea,{backgroundColor : "#f5f7fc"}]}></View>
                </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
        }
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : "#f5f7fc",
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainTopWrap : {
        height:80,justifyContent:'center',marginHorizontal:40,marginTop:30
    },
    mainTopText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20),color:DEFAULT_COLOR.base_color_666
    },
    middleWarp : {
        flex:1,        
        justifyContent:'center',
        marginHorizontal:30,marginBottom:10,
        backgroundColor:'#fff',
        borderColor:DEFAULT_COLOR.input_border_color,borderWidth:1,borderRadius:17
    },
    middleDataWarp : {
        flex:1,
        justifyContent:'center',
        borderBottomColor:DEFAULT_COLOR.input_border_color,borderBottomWidth:1
    },
    dataInputWrap : {
        flex:1,height:55
    },
    middleDataWarp2 : {
        flex:1,
        justifyContent:'center',
        paddingVertical:20,paddingHorizontal:10
    },
    middleDataWarp3 : {
        flex:0.5,
        flexDirection:'row',
        alignItems:'center',
        paddingVertical:5,paddingHorizontal:10
    },
    titleWrap : {
        flex:1,justifyContent:'flex-end',height:45,paddingLeft:20
    },
    memoryWrap : {
        flex:1,flexDirection:'row',flexGrow:1,justifyContent:'center',paddingLeft:20,paddingVertical:10
    },
    memoryRightWrap : {
        flex:1
    },
    titleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),color:DEFAULT_COLOR.base_color_666
    },
    titleText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),color:DEFAULT_COLOR.base_color_666
    },
    inputContainerStyle : {
        backgroundColor:'#fff',margin:0,padding:0,height:45,borderWidth:1,borderColor:'#fff'
    },
    inputStyle :{ 
        margin:0,paddingLeft: 10,color: DEFAULT_COLOR.base_color_666,fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16)
    },
    buttonWrapOn : {
        backgroundColor:'#0059a9',padding:10,marginHorizontal:15,justifyContent:'center',alignItems:'center',borderRadius:25
    },
    buttonWrapOn2 : {
        backgroundColor:'#fff',paddingVertical:5,marginHorizontal:15,justifyContent:'center',alignItems:'center',borderRadius:25,borderWidth:1,borderColor:DEFAULT_COLOR.base_color
    },
    buttonWrapOff : {
        backgroundColor:'#ccc2e6',padding:10,marginHorizontal:15,justifyContent:'center',alignItems:'center',borderRadius:25
    },
    forgetenWrap : {
        flex:0.2,justifyContent:'flex-start',alignItems:'center',marginHorizontal:30
    },
    forgetenText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),color:'#0059a9'
    },
    footerWrap : {
        flex:1,justifyContent:'flex-end',alignItems:'center',marginHorizontal:30,paddingVertical:50
    },
    footerDataWrap : {
        width:'100%',        
        justifyContent:'center',
        marginHorizontal:30,
        marginVertical:15,
        backgroundColor:'#fff',
        borderColor:DEFAULT_COLOR.input_border_color,borderWidth:1,borderRadius:17
    },
    footerWrap2 : {
        flex:0.5,alignItems:'center'
    },
});


function mapStateToProps(state) {
    return {
        userToken : state.GlabalStatus.userToken,
        userNonToken : state.GlabalStatus.userNonToken,
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


export default connect(mapStateToProps,mapDispatchToProps)(SignupScreen);