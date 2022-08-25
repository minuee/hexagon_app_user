import React, { Component } from 'react';
import {SafeAreaView,Alert,Image,View,StyleSheet,PixelRatio,Dimensions,TouchableOpacity,ScrollView,Animated} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import Modal from 'react-native-modal';
import {Input} from 'react-native-elements';
//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR} from '../../Components/CustomText';
import CommonFunction from '../../Utils/CommonFunction';
import CommonUtil from '../../Utils/CommonUtil';
import { apiObject } from "../Apis";
class SignInComplete extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading : true,    
            showModal : false,
            formUserPhone : '',
            formMember_pk : 0
        }
    }
   

    UNSAFE_componentWillMount() {       
        //console.log('SignInComplete',this.props.screenState)     
        this.setState({
            formUserPhone : this.props.screenState.formCompanyTel,
            formMember_pk : this.props.screenState.formMember_pk
        })
    }

    animatedHeight = new Animated.Value(SCREEN_HEIGHT * 0.3);
    closeModal = () => {
        this.setState({ showModal: false });      
    };

    showModal = () => {
        this.setState({showModal: true})
    };

    updateAction = async() => {

        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/member/modify/phone';
            const token = this.props.userToken.apiToken;
            let md5Tel = CommonFunction.fn_dataEncode(this.state.formUserPhone.replace("-",""));
           
            let sendData = {
                member_pk : this.state.formMember_pk,
                phone : md5Tel
            }
            //console.log('sendData',sendData)   
            returnCode = await apiObject.API_patchCommon(this.props,url,token,sendData);          
            ///console.log('returnCode',returnCode)   
            if ( returnCode.code === '0000'  ) {
                CommonFunction.fn_call_toast('정상적으로 수정되었습니다.' ,1500);
                this.timeout = setTimeout(
                    () => {
                    this.closeModal();
                    },1500
                ); 
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.\n[ERR]' + returnCode.msg ,2000);
            }
            this.setState({moreLoading:false,loading:false})
        }catch(e){
            console.log('errrr',e)   
            this.setState({loading:false,moreLoading : false})
        }
    }
    updatePhone = () => {
        //console.log('111',CommonUtil.isEmpty(this.state.formUserPhone))
        if ( CommonUtil.isEmpty(this.state.formUserPhone) ) {
            Alert.alert(
                DEFAULT_CONSTANTS.appName,      
                "변경할 전화번호를 입력해주세요",
                [
                    {text: '확인', onPress: () => console.log('Cancle')},
                ],
                { cancelable: true }
            )  
        }else{
            if ( this.state.formUserPhone == this.state.userTel ) {
                Alert.alert(
                    DEFAULT_CONSTANTS.appName,      
                    "현재 전화번호와 같습니다",
                    [
                        {text: '확인', onPress: () => console.log('Cancle')},
                    ],
                    { cancelable: true }
                )  
            }else{
                Alert.alert(
                    DEFAULT_CONSTANTS.appName,      
                    "전화번호를 수정하시겠습니까?",
                    [
                        {text: '확인', onPress: () => this.updateAction()},
                        {text: '취소', onPress: () => console.log('Cancle')},
                        
                    ],
                    { cancelable: true }
                )  
            }
        }
    }

    render() {
        return(
            <SafeAreaView style={ styles.container }>   
                <View style={{height:80,paddingHorizontal:30,paddingTop:20}}>
                    <TouchableOpacity
                        onPress={()=>this.props.screenProps.navigation.popToTop()}
                    >
                        <Image
                            source={require('../../../assets/icons/btn_close2.png')}
                            resizeMode={"contain"}
                            style={{width:PixelRatio.roundToNearestPixel(25),height:PixelRatio.roundToNearestPixel(25)}}
                        />
                    </TouchableOpacity>
                    <View style={{position:'absolute',right:10,top:0,height:70,width:100,justifyContent:'flex-end'}}>
                        <TouchableOpacity 
                            onPress={() => this.props.screenState.nonUserLogin()}
                            style={styles.buttonWrapOn2}
                        >
                            <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),color:DEFAULT_COLOR.base_color}}>둘러보기</CustomTextM>
                        </TouchableOpacity>
                    </View>
                    
                </View>     
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    indicatorStyle={'white'}
                    scrollEventThrottle={16}
                    keyboardDismissMode={'on-drag'}      
                    style={{width:'100%'}}
                >
                     <View style={styles.middleWarp}>
                        <View style={[styles.middleDataWarp,{borderBottomWidth:0,marginBottom:20}]}>
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>
                                    {this.props.screenState.formCompanyName} {this.props.screenState.formCeoName}님!{"\n"}
                                    회원가입 요청 감사드립니다.
                                </CustomTextR>
                            </View>
                            <View style={{flex:1,paddingHorizontal:20,paddingVertical:10}}>
                                <CustomTextR style={styles.titleText2}>회원가입시 입력한 아래의 전화번호로 인증 전화가 발신됩니다. 전화를 통한 인증 완료후 회원가입이 완료됩니다. 회원가입 이전에도 우측상단 아이콘을 누르시면 브랜드와 제품을 간단히 둘러보실 수 있습니다.</CustomTextR>
                            </View>
                        </View>                    
                        <View style={styles.middleDataWarp2}>
                            <CustomTextR style={styles.defaultText}>전화번호<CustomTextR style={{color:'#797979'}}>{" - "}미인증</CustomTextR></CustomTextR>
                            <CustomTextR style={styles.defaultText}></CustomTextR>
                            <CustomTextR style={styles.defaultText}>{this.props.screenState.formCompanyTel}</CustomTextR>
                            <CustomTextR style={styles.defaultText}></CustomTextR>
                            <TouchableOpacity onPress={() => this.showModal()}>
                                <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),color:DEFAULT_COLOR.base_color}}>수정하기</CustomTextM>
                            </TouchableOpacity>
                            
                           
                        </View>
                        <View style={[styles.middleDataWarp,{borderBottomWidth:0,marginTop:20}]}>                            
                            <View style={{flex:1,paddingHorizontal:20,paddingVertical:10}}>
                                <CustomTextR style={styles.titleText2}>전화인증은 순차적으로 발신되며 최대 7일까지 소요될 수 있음을 안내드립니다.</CustomTextR>
                            </View>
                        </View>  
                    </View>
                </ScrollView>       
                <Modal
                    //onBackdropPress={this.closeModal}
                    style={{justifyContent: 'flex-end',margin: 0}}
                    useNativeDriver={true}
                    animationInTiming={300}
                    animationOutTiming={300}
                    hideModalContentWhileAnimating
                    isVisible={this.state.showModal}>
                    <Animated.View style={[styles.modalContainer,{ height: this.animatedHeight }]}>
                        <View style={styles.postcodeWrapper}>
                            <CustomTextR style={styles.requestTitleText2}>
                                전화번호 수정
                            </CustomTextR>
                            <TouchableOpacity 
                                onPress= {()=> this.closeModal()}
                                style={{position:'absolute',top:0,right:15,width:30,height:30}}>
                                <Icon name="close" size={30} color="#555" />
                            </TouchableOpacity>
                        </View>
                        <View style={{flex:1}}>
                            <View style={styles.middleWarp}>
                                <View style={styles.dataInputWrap}>
                                    <Input   
                                        keyboardType={'number-pad'}
                                        value={this.state.formUserPhone}
                                        placeholder="전화번호"
                                        placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                        inputContainerStyle={[styles.inputContainerStyle]}
                                        inputStyle={styles.inputStyle}
                                        clearButtonMode={'always'}
                                        onChangeText={value => this.setState({formUserPhone:value})}
                                    />
                                </View>
                                <View style={styles.dataInputWrap}>
                                    <TouchableOpacity 
                                        onPress={() => this.updatePhone()}
                                        style={styles.buttonWrapOn}
                                    >
                                        <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize17),color:'#fff'}}>수정</CustomTextM>
                                    </TouchableOpacity>
                                </View>
                                                              
                            </View>
                        </View>
                    </Animated.View>
                </Modal>   
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
        marginHorizontal:20,marginBottom:10,
        marginTop:30
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
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),color:DEFAULT_COLOR.base_color_000
    },
    titleText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),color:DEFAULT_COLOR.base_color_666
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
    },
    middleDataWarp2 : {
        flex:1,
        justifyContent:'center',
        borderRadius:15,borderColor:'#fff',borderWidth:1,
        paddingVertical:10,
        marginHorizontal:20,
        paddingHorizontal : 20,
        backgroundColor:'#fff',
        ...Platform.select({
            ios: {
              shadowColor: "#555",
              shadowOpacity: 0.5,
              shadowRadius: 2,
              shadowOffset: {
                height: 1,
                width: 1
             }
           },
            android: {
              elevation: 5
           }
         })
    },
    buttonWrapOn2 : {
        backgroundColor:'#fff',justifyContent:'center',alignItems:'center',borderRadius:30,borderWidth:0,borderColor:DEFAULT_COLOR.base_color,paddingVertical:5,
        ...Platform.select({
            ios: {
              shadowColor: "#555",
              shadowOpacity: 0.5,
              shadowRadius: 2,
              shadowOffset: {
                height: 1,
                width: 1
             }
           },
            android: {
              elevation: 5
           }
         })
    },
    mainTopWrap : {
        height:60,justifyContent:'center',marginHorizontal:30
    },
    mainTopText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20),color:DEFAULT_COLOR.base_color_000
    },
    middleWarp : {
        paddingVertical:10,
        justifyContent:'center',
        marginHorizontal:30,marginBottom:10,
        backgroundColor:'#fff'
    },
    middleDataWarp : {
        flex:1,
        justifyContent:'center',
        borderBottomColor:DEFAULT_COLOR.input_border_color,borderBottomWidth:1
    },
 
    titleWrap : {
        flex:1,justifyContent:'flex-end',height:45,paddingLeft:20
    },
    titleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color_000
    },
    titleText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),color:DEFAULT_COLOR.base_color_666
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
    /** PostCode  ****/
    postcodeWrapper : {
        paddingTop:5,paddingBottom:10,alignItems:'center',justifyContent:'center',borderBottomColor:'#ccc',borderBottomWidth:1
    },
    requestTitleText2 : {
        paddingLeft: 5, color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),letterSpacing:PixelRatio.roundToNearestPixel(-0.75)
    },
});


function mapStateToProps(state) {
    return {
        userToken : state.GlabalStatus.userToken
    };
}

export default connect(mapStateToProps,null)(SignInComplete);