import React, { Component } from 'react';
import {SafeAreaView,Image,View,StyleSheet,PixelRatio,Dimensions,TouchableOpacity,ScrollView,Alert,Animated} from 'react-native';
import Modal from 'react-native-modal';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import {Input} from 'react-native-elements';
import ImagePicker from 'react-native-image-picker'
import ImageViewer from 'react-native-image-zoom-viewer';
import 'moment/locale/ko'
import  moment  from  "moment";
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
import Loader from '../../Utils/Loader';
import { apiObject } from "../Apis";

class MyIDModifyScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            showModal : false,
            formMemberPk : 0,
            formUserID : '',
            formCeoName : null,
            formCompanyEmail : null,
            formCompanyName : null,
            formCompanyTel : null,
            formBusinessCondition : null,
            formBusinessSector : null,
            formBusinessAddress : null,
            formRecommUserCode : null,
            thumbnail_img : null,
            newImage : null,
            thisImages : [],
            imageIndex: 0,
            isImageViewVisible: false,
        }
    }

    getBaseData = async(member_pk) => {

        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/member/view/'+member_pk;
            const token = this.props.userToken.apiToken;
            returnCode = await apiObject.API_getDetailDefault(this.props,url,token);      
            if ( returnCode.code === '0000'  ) {
                this.setState({
                    userData : CommonUtil.isEmpty(returnCode.data.userDetail) ? [] : returnCode.data.userDetail,
                    formMemberPk : member_pk,
                    formUserID : returnCode.data.userDetail.user_id,
                    formCeoName : returnCode.data.userDetail.company_ceo,
                    formCompanyEmail : CommonFunction.fn_dataDecode(returnCode.data.userDetail.email),
                    formCompanyName : returnCode.data.userDetail.name,
                    formCompanyTel : CommonFunction.fn_dataDecode(returnCode.data.userDetail.phone),
                    formBusinessCondition : returnCode.data.userDetail.company_type,
                    formBusinessSector : returnCode.data.userDetail.company_class,
                    formBusinessAddress : returnCode.data.userDetail.company_address,
                    thumbnail_img : !CommonUtil.isEmpty(returnCode.data.userDetail.img_url) ? returnCode.data.userDetail.img_url : null
                })
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.',1500);
                setTimeout(
                    () => {            
                       this.props.navigation.goBack(null);
                    },1500
                )
            }
            this.setState({moreLoading:false,loading:false})
        }catch(e){
            this.setState({loading:false,moreLoading : false})
        }
    }    

    async UNSAFE_componentWillMount() {
      await this.getBaseData(this.props.userToken.member_pk);
    }
    componentDidMount() {
    }
    UNSAFE_componentWillUnmount() {       
    }
    registData = async() => {
        this.setState({moreLoading:true})
        let  thumbnail_new = {data:null};
        if ( !CommonUtil.isEmpty(this.state.newImage)) {
            try {
                thumbnail_new = await CommonUtil.SingleImageUpload(this.props.userToken.apiToken,this.state.newImage,'etc');
            }catch(e) {
                this.setState({loading:false,moreLoading : false})
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.',2000);
                return;
            }
        }
        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/member/modify/'+this.state.formMemberPk;
            const token = this.props.userToken.apiToken;
            let md5Tel = CommonFunction.fn_dataEncode(this.state.formCompanyTel.replace("-",""));
            let md5Email = CommonFunction.fn_dataEncode(this.state.formCompanyEmail);
            let sendData = {
                company_type : this.state.formBusinessCondition,
                company_class : this.state.formBusinessSector,
                company_address : this.state.formBusinessAddress,
                company_zipcode : null,
                company_ceo : this.state.formCeoName,
                company_phone : md5Tel,
                email : md5Email,
                img_url : !CommonUtil.isEmpty(thumbnail_new.data) ? thumbnail_new.data : this.state.thumbnail_img,
            }
            returnCode = await apiObject.API_updateCommon(this.props,url,token,sendData);          
            if ( returnCode.code === '0000'  ) {
                CommonFunction.fn_call_toast('정상적으로 수정되었습니다.' ,2000);
                this.timeout = setTimeout(
                    () => {
                    this.props.navigation.goBack(null);
                    },
                    2000
                ); 
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.\n[ERR]' + returnCode.msg ,2000);
            }
            this.setState({moreLoading:false,loading:false})
        }catch(e){            
            this.setState({loading:false,moreLoading : false})
        }
    }

    actionOrder = async() => {
        Alert.alert(
            DEFAULT_CONSTANTS.appName,
            "계정정보를 수정하시겠습니까?",
            [
                {text: '네', onPress: () =>  this.registData()},
                {text: '아니오', onPress: () => console.log('Cancle')},
                
            ],
            { cancelable: true }
        )  
    }
    updateData = () => {
        if ( CommonUtil.isEmpty(this.state.formBusinessSector)) {
            CommonFunction.fn_call_toast('업종을 입력해주세요',2000);return true;  
        }else if ( CommonUtil.isEmpty(this.state.formBusinessCondition)) {
            CommonFunction.fn_call_toast('업태를 입력해주세요',2000);return true;    
        }else if ( CommonUtil.isEmpty(this.state.formBusinessAddress)) {
            CommonFunction.fn_call_toast('회사주소정보를 입력해주세요',2000);return true;  
        }else if ( CommonUtil.isEmpty(this.state.formCeoName)) {
            CommonFunction.fn_call_toast('대표자명을 입력해주세요',2000);return true;  
        }else if ( CommonUtil.isEmpty(this.state.formCompanyEmail)) {
            CommonFunction.fn_call_toast('이메일를 입력해주세요',2000);return true;  
        }else if ( CommonUtil.isEmpty(this.state.formCompanyTel)) {
            CommonFunction.fn_call_toast('연락처를 입력해주세요',2000);return true;        
        }else{
           this.actionOrder()
        }
    }

    localcheckfile = () => {
        const options = {
            noData: true,
            title : '이미지 선택',
            takePhotoButtonTitle : '카메라 찍기',
            chooseFromLibraryButtonTitle:'이미지 선택',
            cancelButtonTitle : '취소'
        }
        ImagePicker.showImagePicker(options, response => {
            try {
                if( response.type.indexOf('image') != -1) {
                    if (response.uri) {                        
                        if ( parseInt((response.fileSize)/1024/1024) > 50 ) {
                            CommonFunction.fn_call_toast('이미지 용량이 50MB를 초과하였습니다',2000)
                            return;
                        }else{
                            let fileName = response.fileName;
                            if ( CommonUtil.isEmpty(fileName)) {
                                let spotCount = response.uri.split('.').length-1;
                                let pathExplode = response.uri.split('.') 
                                fileName = Platform.OS + moment().unix() + '.'+pathExplode[spotCount];
                            }                            
                            this.setState({
                                thumbnail_img : response.uri,
                                newImage : {
                                    type : response.type === undefined ? 'image/jpeg' :  response.type,
                                    uri : response.uri, 
                                    size:response.fileSize,
                                    name:fileName
                                }
                            })
                        }
                    }
                }else{
                    CommonFunction.fn_call_toast('정상적인 이미지 파일이 아닙니다.',2000)
                    return;
                }
            }catch(e){
                console.log("eerorr ", e)        
            }
        })
    }

    setImages = async(data) => {
        let selectedFilterCodeList = [];   
        await data.forEach(function(element,index,array){            
            selectedFilterCodeList.push({url:element.url,freeHeight:true});
        });
        return selectedFilterCodeList;
    }
    setImageGallery = async( data, idx ) => {
        if ( data.length > 0 ) {
            let returnArray = await this.setImages(data)
            this.setState({
                imageIndex: idx-1,
                thisImages : returnArray
            })
            this.setState({isImageViewVisible: true})
        }
    }

    render() {
        const ImageFooter = ({ imageIndex, imagesCount }) => (
            <View style={styles.footerRoot}>
                <CustomTextL style={styles.footerText}>{`${imageIndex + 1} / ${imagesCount}`}</CustomTextL>
            </View>
        )
        if ( this.state.loading ) {
            return (
                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} /> 
            )
        }else {
        return(
            <SafeAreaView style={ styles.container }>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    indicatorStyle={'white'}
                    scrollEventThrottle={16}
                    keyboardDismissMode={'on-drag'}      
                    style={{width:'100%'}}
                >
                    <View style={styles.mainTopWrap}>
                        <CustomTextM style={styles.mainTopText}>사업자 정보</CustomTextM>
                    </View>
                    <View style={styles.middleWarp}>
                        <View style={[styles.middleDataWarp,{}]}>                            
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>상호명</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap}>
                                <Input   
                                    disabled={true}
                                    value={this.state.formCompanyName}
                                    placeholder="상호명을 입력하세요"
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={[styles.inputContainerStyle]}
                                    inputStyle={styles.inputStyle}
                                    //clearButtonMode={'always'}
                                    onChangeText={value => this.setState({formCompanyName:value})}
                                />
                            </View>                            
                        </View>
                        <View style={[styles.middleDataWarp,{}]}>                            
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>사업자등록번호</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap}>
                                <Input   
                                    disabled={true}
                                    value={this.state.formUserID}
                                    placeholder="숫자만입력)"
                                    keyboardType={'number-pad'}
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={styles.inputContainerStyle}
                                    inputStyle={styles.inputStyle}
                                    //clearButtonMode={'always'}
                                    onChangeText={value => this.setState({formUserID:value})}
                                />
                            </View>                            
                        </View>
                        <View style={styles.middleDataWarp}>
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>업종</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap}>
                                <Input  
                                     disabled={true} 
                                    value={this.state.formBusinessSector}
                                    placeholder="사업자등록증을 참고하세요"
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={styles.inputContainerStyle}
                                    inputStyle={styles.inputStyle}
                                    //clearButtonMode={'always'}
                                    onChangeText={value => this.setState({formBusinessSector:value})}
                                />
                            </View>
                        </View>
                        <View style={styles.middleDataWarp}>
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>업태</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap}>
                                <Input  
                                    disabled={true} 
                                    value={this.state.formBusinessCondition}
                                    placeholder="사업자등록증을 참고하세요"
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={styles.inputContainerStyle}
                                    inputStyle={styles.inputStyle}
                                    //clearButtonMode={'always'}
                                    onChangeText={value => this.setState({formBusinessCondition:value})}
                                />
                            </View>
                        </View>
                        <View style={styles.middleDataWarp}>
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>주소</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap}>
                                <Input   
                                    disabled={true}
                                    value={this.state.formBusinessAddress}
                                    placeholder="b"
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={styles.inputContainerStyle}
                                    inputStyle={styles.inputStyle}
                                    //clearButtonMode={'always'}
                                    onChangeText={value => this.setState({formBusinessAddress:value})}
                                />
                            </View>
                        </View>                       
                    </View>

                    <View style={styles.mainTopWrap}>
                        <CustomTextM style={styles.mainTopText}>대표자 정보</CustomTextM>
                    </View>
                    <View style={styles.middleWarp}>
                        <View style={[styles.middleDataWarp,{}]}>                            
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>대표자명</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap}>
                                <Input   
                                    value={this.state.formCeoName}
                                    placeholder="상호명을 입력하세요"
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={[styles.inputContainerStyle]}
                                    inputStyle={styles.inputStyle}
                                    clearButtonMode={'always'}
                                    onChangeText={value => this.setState({formCeoName:value})}
                                />
                            </View>                            
                        </View>
                        <View style={[styles.middleDataWarp,{}]}>                            
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>전화번호</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap}>
                                <Input   
                                    value={this.state.formCompanyTel}
                                    placeholder="회원가입 인증전화 받을 전화번호 입력"
                                    keyboardType={'number-pad'}
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={styles.inputContainerStyle}
                                    inputStyle={styles.inputStyle}
                                    clearButtonMode={'always'}
                                    onChangeText={value => this.setState({formCompanyTel:value})}
                                />
                            </View>                            
                        </View>
                        <View style={styles.middleDataWarp}>
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>대표자 E-mail</CustomTextR>
                            </View>
                            <View style={styles.dataInputWrap}>
                                <Input   
                                    keyboardType={'email-address'}
                                    value={this.state.formCompanyEmail}
                                    placeholder="계산서발행 확인용 이메일을 입력하세요"
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                            
                                    inputContainerStyle={styles.inputContainerStyle}
                                    inputStyle={styles.inputStyle}
                                    clearButtonMode={'always'}
                                    onChangeText={value => this.setState({formCompanyEmail:value})}
                                />
                            </View>
                        </View>                                        
                    </View>

                    <View style={styles.middleWarp}>
                        <View style={[styles.middleDataWarp,{borderBottomWidth:0}]}>
                            <View style={styles.titleWrap}>
                                <CustomTextR style={styles.titleText}>사업자 등록증 업로드</CustomTextR>
                            </View>
                           
                        </View>      
                        {
                            !CommonUtil.isEmpty(this.state.thumbnail_img) ?
                            <TouchableOpacity
                                onPress={() => this.setImageGallery([{url: DEFAULT_CONSTANTS.defaultImageDomain + this.state.thumbnail_img}], 1)}
                                style={styles.middleDataWarp2}
                            >   
                                <Image
                                    source={{uri: DEFAULT_CONSTANTS.defaultImageDomain + this.state.thumbnail_img}}
                                    resizeMode={"contain"}
                                    style={{width:PixelRatio.roundToNearestPixel(100),height:PixelRatio.roundToNearestPixel(145)}}
                                />
                            </TouchableOpacity>
                            :
                            <View style={styles.middleDataWarp2}> 
                                <Image
                                    source={require('../../../assets/icons/no_image.png')}
                                    resizeMode={"contain"}
                                    style={{width:PixelRatio.roundToNearestPixel(97),height:PixelRatio.roundToNearestPixel(150)}}
                                />
                            </View>
                        }              
                    </View>
                    <View style={[CommonStyle.blankArea,{backgroundColor:DEFAULT_COLOR.default_bg_color}]}></View>
                    { 
                        this.state.moreLoading &&
                        <View style={CommonStyle.moreWrap}>
                            <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} />
                        </View>
                    }
                    
                </ScrollView>
                <View style={CommonStyle.scrollFooterWrap}>
                    <TouchableOpacity 
                        style={CommonStyle.scrollFooterLeftWrap}
                        onPress={()=>this.updateData()}
                    >
                        <CustomTextB style={CommonStyle.scrollFooterText}>정보 수정</CustomTextB>
                    </TouchableOpacity>
                        
                </View> 
                <Modal 
                    visible={this.state.isImageViewVisible} transparent={true}
                    onRequestClose={() => this.setState({ isImageViewVisible: false })}
                    style={{margin:0,padding:0}}
                >
                    <ImageViewer      
                        //glideAlways
                        imageUrls={this.state.thisImages}
                        index={this.state.imageIndex}
                        enableSwipeDown={true}
                        useNativeDriver={true}
                        saveToLocalByLongPress={true}
                        //controls={true}
                        //animationType="fade"
                        //visible={this.state.isImageViewVisible}
                        //renderFooter={this.renderFooter}
                        renderIndicator={this.renderIndicator}
                        onSwipeDown={() => this.setState({ isImageViewVisible: false })}
                        renderFooter={(currentIndex) => (
                            <ImageFooter imageIndex={currentIndex} imagesCount={this.state.thisImages.length} />
                        )}
                    />
                </Modal>
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
    mainTopInfoWrap : {
        height:30,justifyContent:'center',alignItems:'center',marginTop:20
    },
    mainTopInfoText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color_666
    },
    mainTopWrap : {
        height:60,justifyContent:'center',marginHorizontal:30
    },
    mainTopText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20),color:DEFAULT_COLOR.base_color_000
    },
    middleWarp : {
        flex:1,        
        justifyContent:'center',
        marginHorizontal:20,marginBottom:10,
        backgroundColor:'#fff',
        borderColor:DEFAULT_COLOR.input_border_color,borderWidth:1,borderRadius:17
    },
    middleDataWarp : {
        flex:1,
        justifyContent:'center',
        borderBottomColor:DEFAULT_COLOR.input_border_color,borderBottomWidth:1
    },
    middleDataWarp2 : {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:10,paddingHorizontal:30
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
    dataInputWrap : {
        flex:1,height:55
    },
    inputContainerStyle : {
        backgroundColor:'#fff',margin:0,padding:0,height:45,borderWidth:1,borderColor:'#fff'
    },
    inputStyle :{ 
        margin:0,paddingLeft: 10,color: DEFAULT_COLOR.base_color_666,fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16)
    },
    buttonWrapOn : {
        backgroundColor:'#0059a9',paddingVertical:10,paddingHorizontal:25,justifyContent:'center',alignItems:'center',borderRadius:25
    },
    buttonWrapOn2 : {
        backgroundColor:'#fff',paddingVertical:5,marginHorizontal:15,justifyContent:'center',alignItems:'center',borderRadius:25,borderWidth:1,borderColor:DEFAULT_COLOR.base_color
    },
    buttonWrapOff : {
        backgroundColor:'#ccc2e6',padding:10,marginHorizontal:15,justifyContent:'center',alignItems:'center',borderRadius:25
    },
    footerWrap : {
        flex:1,marginHorizontal:30,marginBottom:10,
    },
    footerDataWrap : {
        flex:1,justifyContent:'flex-end',flexDirection:'row',paddingLeft:10,marginTop:20
    },
    imageStyle : {
        width:PixelRatio.roundToNearestPixel(100),height:PixelRatio.roundToNearestPixel(200)
    },
    footer: {
        width :SCREEN_WIDTH,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    footerText: {
        fontSize: 16,
        color: '#FFF',
        textAlign: 'center',
    },
    footerRoot: {
        height: 64,
        paddingHorizontal:50,
        backgroundColor: "#00000077",
        alignItems: "center",
        justifyContent: "center"
    },
    footerText: {
        fontSize: 17,
        color: "#FFF"
    }
    
    
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
        }
    };
}


export default connect(mapStateToProps,mapDispatchToProps)(MyIDModifyScreen);