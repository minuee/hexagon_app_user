import React, { Component } from 'react';
import {Animated,ScrollView,View,StyleSheet,Alert,Dimensions,PixelRatio,Image,TouchableOpacity,TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import Modal from 'react-native-modal';
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
import DaumPostcode from '../../Utils/DaumPostCode';
import Loader from '../../Utils/Loader';
import { apiObject } from "../Apis";

export default  class PopLayerAddress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            isAllMode : null,
            showModalDaum : false,
            formZipcode : null,
            formAddress : null,
            formAddressDetail : null,
            
        }
    }

    UNSAFE_componentWillMount() {
        if ( !CommonUtil.isEmpty(this.props.screenProps.userToken)) {
            this.setState({
                userToken : this.props.screenProps.userToken,loading:false
            });
        }else{
            CommonFunction.fn_call_toast('잘못된 접근입니다.',1000);
            setTimeout(
                () => {            
                this.props.screenState._closepopLayer();
                },1000
            )
        }
        
    }  

    registAddress = async() => { 
        this.setState({moreLoading:true,loading:true})
        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/member/delivery/regist';           
            const token = this.state.userToken.apiToken;
            let sendData = {
                member_pk : this.state.userToken.member_pk,
                address :  this.state.formAddress,
                addressDetail :  this.state.formAddressDetail,
                zipCode : this.state.formZipcode
            }             
            returnCode = await apiObject.API_registCommon(this.props.screenProps,url,token,sendData);            
            if ( returnCode.code === '0000'  ) {
                CommonFunction.fn_call_toast_top('등록되었습니다',1000,'center');
                setTimeout(
                    () => {            
                        this.props.screenState._closepopLayer(returnCode.data.delivery.delivery[0]);
                    },1000
                )
                this.props.screenState._closepopLayer(feedData);///이거 이상함
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.\n[ERR]' + returnCode.msg ,2000);
            }
            this.setState({moreLoading:false,loading:false})
        }catch(e){
            this.setState({loading:false,moreLoading : false})
        }
    }

 
    selectMember = async() =>  {
        if ( !CommonUtil.isEmpty(this.state.formZipcode) && !CommonUtil.isEmpty(this.state.formAddressDetail)) {
            Alert.alert(
                DEFAULT_CONSTANTS.appName,      
                "배송 주소지를 등록하시겠습니까?",
                [
                    {text: '확인', onPress: () => this.registAddress()},
                    {text: '취소', onPress: () => console.log('Cancle')},
                    
                ],
                { cancelable: true }
            )  
           
        }else{
            CommonFunction.fn_call_toast_top('주소를 입력해주세요',2000,'center');
            return false;
        }
    }

    animatedHeight = new Animated.Value(SCREEN_HEIGHT * 0.9);
    closeModalDaum = () => {
        this.setState({ showModalDaum: false });      
    };

    showModalDaum = () => {
        this.setState({showModalDaum: true})
    };
    setAddress = (data) => {
        this.setState({
            formZipcode : data.sigunguCode,
            formAddress : data.roadAddress
        });
        this.closeModalDaum();
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
                        onPress={()=> this.props.screenState._closepopLayer()}
                        hitSlop={{left:10,right:5,top:10,bottom:10}}
                        style={{position:'absolute',top:0,right:0,width:22,height:22}}
                    >
                        <Image
                            source={require('../../../assets/icons/btn_close.png')}
                            resizeMode={"contain"}
                            style={{width:PixelRatio.roundToNearestPixel(25),height:PixelRatio.roundToNearestPixel(25)}}
                        />
                    </TouchableOpacity>
                    <View style={{height:35,width:'60%',paddingLeft:20}}>
                        <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#333'}}> 새주소지 추가</CustomTextM>
                    </View>
                </View>
                <View style={styles.dataWarp}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        indicatorStyle={'white'}
                    >
                        <View style={styles.formWarp}>
                            <View style={styles.formTitleWrap}>
                                <CustomTextR style={CommonStyle.titleText}>우편번호</CustomTextR>
                                <CustomTextR style={CommonStyle.requiredText}></CustomTextR>
                            </View>
                            <TouchableOpacity 
                                onPress={()=>this.showModalDaum()}
                                style={[styles.formDataWrap,{flexDirection:'row'}]}
                            >
                                <View style={{flex:3,paddingRight:10}}>
                                    <TextInput   
                                        editable={false}     
                                        value={this.state.formZipcode}                            
                                        style={[CommonStyle.inputBlank,CommonStyle.defaultOneWayForm]}
                                        placeholder={'자동입력'}
                                        placeholderTextColor={DEFAULT_COLOR.base_color_666}
                                        onChangeText={text=>this.setState({formProductName:text})}
                                        multiline={false}
                                    />
                                </View>
                                <TouchableOpacity 
                                    onPress={()=>this.showModalDaum()}
                                    style={styles.addreessBtnWrap}
                                >
                                    <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),color:'#fff'}}>주소검색</CustomTextM>
                                </TouchableOpacity>
                            </TouchableOpacity>   
                            <View style={[styles.formTitleWrap,{marginTop:20}]}>
                                <CustomTextR style={CommonStyle.titleText}>주소</CustomTextR>
                                <CustomTextR style={CommonStyle.requiredText}></CustomTextR>
                            </View>
                            <View style={styles.formDataWrap}>
                                <TextInput     
                                    editable={false}     
                                    style={[CommonStyle.inputBlank,CommonStyle.defaultOneWayForm]}
                                    placeholder={'자동압력'}
                                    value={this.state.formAddress}
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}
                                    multiline={false}
                                />
                            </View>
                            <View style={[styles.formDataWrap,{marginTop:10}]}>
                                <TextInput                            
                                    style={[CommonStyle.inputBlank,CommonStyle.defaultOneWayForm]}
                                    placeholder={'나머지 주소를 입력해 주세요.'}
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}
                                    onChangeText={text=>this.setState({formAddressDetail:text})}
                                    multiline={false}
                                    clearButtonMode='always'
                                />
                            </View>
                        </View>
                   </ScrollView>
                </View> 
                <View style={styles.footerWrap}>
                    <TouchableOpacity 
                        onPress={()=> this.props.screenState._closepopLayer()}
                        style={styles.footerLeftWrap}
                    >
                        <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#9f9f9f'}}>취소</CustomTextM>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={()=>this.selectMember()}
                        style={styles.footerRightWrap}
                    >
                        <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#fff'}}>등록</CustomTextM>
                    </TouchableOpacity>
                </View>               
                <Modal
                    onBackdropPress={this.closeModalDaum}
                    style={{justifyContent: 'flex-end',margin: 0}}
                    useNativeDriver={true}
                    animationInTiming={300}
                    animationOutTiming={300}
                    hideModalContentWhileAnimating
                    isVisible={this.state.showModalDaum}>
                    <Animated.View style={[styles.modalContainer,{ height: this.animatedHeight }]}>
                        <View style={styles.postcodeWrapper}>
                            <CustomTextR style={styles.requestTitleText2}>
                                우편번호 찾기
                            </CustomTextR>
                            <TouchableOpacity 
                                onPress= {()=> this.closeModalDaum()}
                                style={{position:'absolute',top:0,right:15,width:30,height:30}}>
                                <Icon name="close" size={30} color="#555" />
                            </TouchableOpacity>
                        </View>
                        <View style={{flex:1}}>
                            <DaumPostcode                                 
                                jsOptions={{ animated: true }}
                                onSelected={(data) => this.setAddress(data)}
                            />
                        </View>
                    </Animated.View>
                </Modal>       
            </View>
        );
        }
    }
}



const styles = StyleSheet.create({
    container: {
        flex:1
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
    titleWrap : {
        flex:0.5,justifyContent:'center',alignItems:'center',borderBottomColor:'#ccc',borderBottomWidth:1
    },
    dataWarp : {
        flex:4
    },
    addreessBtnWrap : {
        flex:1,height:40,backgroundColor:'#808080',padding:5,justifyContent:'center',alignItems:'center',borderRadius:5
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
    postcodeWrapper : {
        paddingTop:5,paddingBottom:10,alignItems:'center',justifyContent:'center',borderBottomColor:'#ccc',borderBottomWidth:1
    },
    requestTitleText2 : {
        paddingLeft: 5, color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),letterSpacing:PixelRatio.roundToNearestPixel(-0.75)
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
        flex:1,paddingHorizontal:20,paddingVertical:5,marginTop:10,borderTopWidth:1,borderTopColor:DEFAULT_COLOR.base_background_color
    },
    formTitleWrap : {
        height:30,paddingVertical:5,flexDirection:'row',marginTop:5
    },
    formDataWrap : {
        height:40,paddingVertical:5
    },
});