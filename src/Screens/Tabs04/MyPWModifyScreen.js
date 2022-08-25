import React, { Component } from 'react';
import {SafeAreaView,Image,View,StyleSheet,PixelRatio,Dimensions,TouchableOpacity,BackHandler} from 'react-native';
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
import { apiObject } from "../Apis";
import Loader from '../../Utils/Loader';

class MyPWModifyScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading : true,            
            formNowPassword : null,
            formNewPassword : null,
            formNewPassword2 : null,
            isResult : false,
            isResultMsg : "",
            member_pk : 0
        }
    }
   

    UNSAFE_componentWillMount() {       
        this.setState({
            member_pk : this.props.userToken.member_pk
        })
       
    }

    componentDidMount() {      
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton); 
        setTimeout(
            () => {            
                this.setState({loading:false})
            },500
        )
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);          
    }

    handleBackButton = () => {      
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);                 
        this.props.navigation.goBack(null);                
        return true;
    };

    resetAuthCode = async() => {
        if ( !CommonUtil.isEmpty(this.state.formNewPassword) && !CommonUtil.isEmpty(this.state.formNewPassword2) ) {
            if ( this.state.formNewPassword ===  this.state.formNewPassword2 ) {
                this.setState({moreLoading:true,isResultMsg:''})
                let returnCode = {code:9998};     
                try {            
                    const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/salesman/modify/pass/'+this.state.member_pk;
                    const token = this.props.userToken.apiToken;
                    let sendData = {
                        nowPassword : this.state.formNowPassword,
                        newPassword : this.state.formNewPassword
                    }
                    returnCode = await apiObject.API_patchCommon(this.props,url,token,sendData);          
                    if ( returnCode.code === '0000'  ) {
                        CommonFunction.fn_call_toast('정상적으로 수정되었습니다.',1500)
                        setTimeout(() => {
                            this.props.navigation.goBack();
                        }, 1500);
                    }else if ( returnCode.code === '1002'  ) {
                        CommonFunction.fn_call_toast('현재 비밀번호를 맞지 않습니다.',1500)
                        this.setState({
                            isResult :  true,
                            formNowPassword : '',
                            isResultMsg : "현재 비밀번호를 맞지 않습니다."
                        })
                    }else{
                        CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.\n[ERR]' + returnCode.msg ,2000);
                    }
                    this.setState({moreLoading:false,loading:false})
                }catch(e){
                    console.log('errrr',e)   
                    this.setState({loading:false,moreLoading : false})
                }
            }else{
                this.setState({
                    isResult :  true,
                    isResultMsg : "비밀번호가 일치하지 않습니다."
                })
            }
        }
    }

    nextMove = async() => {
        this.props.navigation.navigate('AuthCheckStack',{
            screenData: {
                formUserID : this.state.formUserID
            }
        });
    }

    render() {
        return(
            <SafeAreaView style={ styles.container }>               
                <View style={styles.middleWarp}>
                    <View style={styles.middleDataWarp}>
                        <View style={styles.boxWrap}>
                            <View style={styles.imageWrap}>
                                <Image
                                    source={require('../../../assets/icons/icon_key.png')}
                                    resizeMode={"contain"}
                                    style={{width:PixelRatio.roundToNearestPixel(22),height:PixelRatio.roundToNearestPixel(22)}}
                                />
                            </View>
                            <View style={styles.formBoxWrap}>
                                <Input   
                                    secureTextEntry={true}
                                    value={this.state.formNowPassword}
                                    placeholder="현재 비밀번호"
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={styles.inputContainerStyle}
                                    inputStyle={styles.inputStyle}
                                    clearButtonMode={'always'}
                                    onChangeText={value => this.setState({formNowPassword:value,isResult:false})}
                                />  
                            </View>
                        </View>
                        <View style={styles.boxWrap}>
                            <View style={styles.imageWrap}>
                                <Image
                                    source={require('../../../assets/icons/icon_key.png')}
                                    resizeMode={"contain"}
                                    style={{width:PixelRatio.roundToNearestPixel(22),height:PixelRatio.roundToNearestPixel(22)}}
                                />
                            </View>
                            <View style={styles.formBoxWrap}>
                                <Input   
                                    secureTextEntry={true}
                                    value={this.state.formNewPassword}
                                    placeholder="새 비밀번호"
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={styles.inputContainerStyle}
                                    inputStyle={styles.inputStyle}
                                    clearButtonMode={'always'}
                                    onChangeText={value => this.setState({formNewPassword:value,isResult:false})}
                                />  
                            </View>
                        </View>
                        <View style={styles.boxWrap}>
                            <View style={styles.imageWrap}>
                                <Image
                                    source={require('../../../assets/icons/icon_key.png')}
                                    resizeMode={"contain"}
                                    style={{width:PixelRatio.roundToNearestPixel(22),height:PixelRatio.roundToNearestPixel(22)}}
                                />
                            </View>
                            <View style={styles.formBoxWrap}>
                                <Input   
                                    secureTextEntry={true}
                                    value={this.state.formNewPassword2}
                                    placeholder="새 비밀번호 확인"
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={styles.inputContainerStyle}
                                    inputStyle={styles.inputStyle}
                                    clearButtonMode={'always'}
                                    onChangeText={value => this.setState({formNewPassword2:value,isResult:false})}
                                />  
                            </View>
                        </View>
                        { 
                            !CommonUtil.isEmpty(this.state.isResultMsg) &&
                            <View style={{paddingHorizontal:10}}>
                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#c53915'}}>
                                    {this.state.isResultMsg}
                                </CustomTextR>
                            </View>
                        }
                        {
                            ( !CommonUtil.isEmpty(this.state.formNowPassword) && !CommonUtil.isEmpty(this.state.formNewPassword) && !CommonUtil.isEmpty(this.state.formNewPassword2)) &&
                            <View style={{paddingHorizontal:10}}>
                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),color:'#c53915'}}>{this.state.isResultMsg}</CustomTextR>
                            </View>
                        }
                        <TouchableOpacity 
                            onPress={()=>this.resetAuthCode()}
                            style={(!CommonUtil.isEmpty(this.state.formNowPassword) && !CommonUtil.isEmpty(this.state.formNewPassword) && !CommonUtil.isEmpty(this.state.formNewPassword2) ) ? styles.buttonWrapOn : styles.buttonWrapOff }
                        >
                            <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize17),color:'#fff'}}>변경하기</CustomTextM>
                        </TouchableOpacity>
                    </View>
                </View>
                { 
                    this.state.moreLoading &&
                    <View style={CommonStyle.moreWrap}>
                        <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} />
                    </View>
                }
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
        marginTop:30
    },
    middleDataWarp : {
        flex:1,
        justifyContent:'flex-start',
    },
    middleDataWarp2 : {
        flex:2,
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
        backgroundColor:'#0059a9',padding:10,marginHorizontal:15,justifyContent:'center',alignItems:'center',borderRadius:25,marginTop:50
    },
    buttonWrapOff : {
        backgroundColor:'#ccc2e6',padding:10,marginHorizontal:15,justifyContent:'center',alignItems:'center',borderRadius:25,marginTop:50
    },
    forgetenWrap : {
        flex:1,justifyContent:'flex-start',alignItems:'center',marginHorizontal:30
    },
    forgetenText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),color:'#0059a9'
    },
    boxWrap : {
        flexDirection:'row',height:50,alignItems:'center',marginTop:20
    },
    imageWrap : {
        alignItems:'center',paddingBottom:20
    },
    formBoxWrap : {
        flex:2,paddingLeft:10
    }
});


function mapStateToProps(state) {
    return {
        userToken : state.GlabalStatus.userToken
    };
}

export default connect(mapStateToProps,null)(MyPWModifyScreen);