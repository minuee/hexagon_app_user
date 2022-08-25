import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,PixelRatio,Dimensions,TouchableOpacity,BackHandler} from 'react-native';
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

class FindIDScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading : false, 
            moreLoading :false,           
            formUserID : null,
            AuthCode : null,
            testUserID : "",
            userTel : null,
            isResult : false,
            isResultMsg : "",
            member_pk : 0
        }
    }
   

    UNSAFE_componentWillMount() {    
        if ( __DEV__ ) {   
            this.setState({ formUserID : '1234567891'})
        }
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

    checkAuthCode = async() => {
        if ( !CommonUtil.isEmpty(this.state.formUserID)) {

            this.setState({moreLoading:true})
            let returnCode = {code:9998};     
            let sixdigitsrandom = await Math.floor(100000 + Math.random() * 900000);
            this.setState({AuthCode : sixdigitsrandom})
            try {            
                const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/member/check?user_id=' + this.state.formUserID + '&auth_code=' + sixdigitsrandom;
                const token = null;
                returnCode = await apiObject.API_getDetailDefault(this.props,url,token);          
                //console.log('returnCode',returnCode) ;
                if ( returnCode.code === '0000'  ) {
                    this.sendAuthCode(sixdigitsrandom,returnCode.returnData )
                    //this.nextMove(returnCode.returnData);
                }else if ( returnCode.code === '1014'  ) {
                    CommonFunction.fn_call_toast('등록된 정보가 없는 계정입니다.' ,2000);
                }else if ( returnCode.code === '1099'  ) {
                    CommonFunction.fn_call_toast('SMS발송에러가 발생하였습니다. 관리팀에 문의해주세요.' ,2000);
                }else if ( returnCode.code === '1003'  ) {
                    CommonFunction.fn_call_toast('사용중지된 계정입니다. 관리팀에 문의해주세요.' ,2000);
                }else{
                    CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.\n[ERR]' + returnCode.msg ,2000);
                }
                
                this.setState({moreLoading:false,loading:false})
            }catch(e){
                //console.log('errrr',e);
                this.setState({loading:false,moreLoading : false})
            }
        }else{
            CommonFunction.fn_call_toast('사업자등록번호를 입력하세요.' ,2000);
            return;

        }
    }

    sendAuthCode = async(acode , item) => {
        const toPhoneNum = await CommonFunction.fn_dataDecode(item.userTel);
        const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/send/sms';
        const token = null;
        const sendData = {
            form_phone : toPhoneNum,
            form_code : acode
        }
        returnCode = await apiObject.API_registCommon(this.props,url,token,sendData);          
        //console.log('returnCode',returnCode) ;
        if ( returnCode.code === '0000' ) {
            this.nextMove(item);
        }else if ( returnCode.code === '1099'  ) {
            CommonFunction.fn_call_toast('SMS발송에러가 발생하였습니다. 관리팀에 문의해주세요.' ,2000);
            return;
        }else if ( returnCode.code === '1003'  ) {
            CommonFunction.fn_call_toast('사용중지된 계정입니다. 관리팀에 문의해주세요.' ,2000);
            return;
        }else{
            CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.\n[ERR]' + returnCode.msg ,2000);
            return;
        }
    }

    nextMove = async(item) => {
        this.props.navigation.navigate('AuthCheckStack',{
            screenData: {
                member_pk : item.member_pk,
                authCode : item.authCode,
                userTel: item.userTel
            }
        });
    }

    render() {
        return(
            <SafeAreaView style={ styles.container }>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    indicatorStyle={'white'}
                    scrollEventThrottle={16}
                    keyboardDismissMode={'on-drag'}      
                    style={{width:'100%'}}
                >
               <View style={{height:80,justifyContent:'center',marginHorizontal:40,marginTop:30}}>
                    <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),color:DEFAULT_COLOR.base_color_666}}>계정 검색을 위해 회원님의 사업자등록번호를 입력하세요</CustomTextR>
                </View>
                <View style={styles.middleWarp}>
                    <View style={styles.middleDataWarp}>
                        <Input   
                            value={this.state.formUserID}
                            placeholder="사업자등록번호 -없이입력하세요"
                            placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                            inputContainerStyle={styles.inputContainerStyle}
                            inputStyle={styles.inputStyle}
                            clearButtonMode={'always'}
                            onChangeText={value => this.setState({formUserID:value.trim(),isResult:false})}
                        />
                        {
                            ( this.state.isResult && !CommonUtil.isEmpty(this.state.formUserID)) &&
                            <View style={{paddingHorizontal:10}}>
                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),color:'#c53915'}}>{this.state.isResultMsg}</CustomTextR>
                            </View>
                            
                        }
                    </View>
                    <View style={styles.middleDataWarp}>
                        <TouchableOpacity 
                            onPress={()=>this.checkAuthCode()}
                            style={CommonUtil.isEmpty(this.state.formUserID) ? styles.buttonWrapOff : styles.buttonWrapOn }
                        >
                            <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize17),color:'#fff'}}>다음</CustomTextM>
                        </TouchableOpacity>
                    </View>

                    
                    
                </View>
                { this.state.moreLoading &&
                    <View style={CommonStyle.moreWrap}>
                        <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} />
                    </View>
                }
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
    middleWarp : {
        flex:5,
        minHeight : SCREEN_HEIGHT/2,
        justifyContent:'center',        
        marginHorizontal:30,marginBottom:10,
        
        
    },
    middleDataWarp : {
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

export default connect(mapStateToProps,null)(FindIDScreen);