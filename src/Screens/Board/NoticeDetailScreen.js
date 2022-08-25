import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Text,Dimensions,PixelRatio,TouchableOpacity,Animated,Alert,BackHandler} from 'react-native';
import 'moment/locale/ko'
import  moment  from  "moment";
import Modal from 'react-native-modal';
import Image from 'react-native-image-progress';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
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
//HTML 
import HTMLConvert from '../../Utils/HtmlConvert/HTMLConvert';
const currentDate =  moment().format('YYYY.MM.DD HH:MM');

const mockData1 = [
    { id: 1, date : '2020.11.12', title : '신규주문 5,000원', point : 5600 , rate : 0.5},
    { id: 2, date : '2020.11.12', title : '친구초대', point : -5600 , rate : null},
    { id: 3, date : '2020.11.12', title : '친구초대', point : 5600 , rate : 0.5},
]
const CUSTOM_STYLES = {
    fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#494949'
};
const CUSTOM_RENDERERS = {};
const IMAGES_MAX_WIDTH = SCREEN_WIDTH - 50;
const DEFAULT_PROPS = {
    htmlStyles: CUSTOM_STYLES,
    renderers: CUSTOM_RENDERERS,
    imagesMaxWidth: IMAGES_MAX_WIDTH,
    onLinkPress: (evt, href) => { Linking.openURL(href); },
    debug: true
};


class NoticeDetailScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading : true,
            notice_pk : 0,
            noticeData : {}
        }
    }

    getBaseData = async(notice_pk) => {
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/notice/view/'+notice_pk;
            const token = this.props.userToken.apiToken;
            returnCode = await apiObject.API_getDetailDefault(this.props,url,token);          
            ////console.log('returnCode',returnCode)   
            if ( returnCode.code === '0000'  ) {
                this.setState({
                    noticeData : CommonUtil.isEmpty(returnCode.data.noticeDetail) ? [] : returnCode.data.noticeDetail
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
            ////console.log('e',e)   
            this.setState({loading:false,moreLoading : false})
        }
    }

    async UNSAFE_componentWillMount() {
        
        ////console.log('RewardDetailScreen',this.props.extraData.params.screenData.product_pk)
        if ( !CommonUtil.isEmpty(this.props.extraData.params.screenData)) {
            await this.getBaseData(this.props.extraData.params.screenData.notice_pk);
            this.setState({
                notice_pk : this.props.extraData.params.screenData.notice_pk
            })
        }else{
            CommonFunction.fn_call_toast('잘못된 접근입니다.',1500);
            setTimeout(
                () => {            
                   this.props.navigation.goBack(null);
                },1500
            )
        }

        this.props.navigation.addListener('focus', () => {  
            this.getBaseData(this.state.notice_pk)
        })

        this.props.navigation.addListener('blur', () => {            
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        })
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);          
    }

    handleBackButton = () => {        
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);  
        this.props.navigation.goBack(null);                
        return true;
    };

    fn_onChangeToggle = (bool) => {
        this.setState({switchOn1 : bool})
    }

    updateNotice = () => {
        this.props._fn_ToggleNoticeDetail(false)
        this.props.navigation.navigate('NoticeModifyStack',{
            screenData:this.state.noticeData
        })
    }

    deleteNotice = (mode) => {
        Alert.alert(
            "공지사항 삭제",      
            "정말로 삭제하시겠습니까?",
            [
                {text: 'OK', onPress: () => this.removeNotice()},
                {text: 'CANCEL', onPress: () => console.log('Cancle')},
                
            ],
            { cancelable: true }
        )  
    }

    removeNotice = async() => {
        this.setState({moreLoading:true})
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/notice/remove/'+this.state.notice_pk;
            const token = this.props.userToken.apiToken;
            let sendData = null;                
            returnCode = await apiObject.API_removeCommon(this.props,url,token,sendData);          
            ////console.log('returnCode',returnCode)   
            if ( returnCode.code === '0000'  ) {
                this.props._fn_ToggleNoticeDetail(false)
                CommonFunction.fn_call_toast('삭제되었습니다.',1500);
                setTimeout(
                    () => {            
                        this.props.navigation.goBack(null);
                    },1500
                )
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.\n[ERR]' + returnCode.msg ,2000);
            }
            this.setState({moreLoading:false,loading:false})
        }catch(e){
            //console.log('errrr',e)   
            this.setState({loading:false,moreLoading : false})
        }
    }

    animatedHeight = new Animated.Value(SCREEN_HEIGHT * 0.2);
    
    closeModalInforation = () => {
        this.props._fn_ToggleNoticeDetail(false)
    };

    render() {
        if ( this.state.loading ) {
            return (
                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} /> 
            )
        }else {  
            return(
                <SafeAreaView style={styles.container}>
                    <ScrollView
                        ref={(ref) => {
                            this.ScrollView = ref;
                        }}
                        showsVerticalScrollIndicator={false}
                        indicatorStyle={'white'}
                        scrollEventThrottle={16}
                        keyboardDismissMode={'on-drag'}
                        style={{width:'100%',flex:1}}
                    >
                    <View style={styles.defaultWrap2}>
                        <View style={styles.boxWrap}>
                            <CustomTextR style={styles.menuTitleText}>{this.state.noticeData.title}</CustomTextR>
                            <CustomTextL style={styles.menuTitleText2}>
                                {CommonFunction.convertUnixToDate(this.state.noticeData.start_dt,"YYYY.MM.DD H:m")}
                            </CustomTextL>
                        </View>
                    </View>
                    <View style={{flex:1,backgroundColor : "#fff"}}>
                        <View style={styles.thumbnailWrap}>
                            { !CommonUtil.isEmpty(this.state.noticeData.img_url) ?
                                <Image
                                    source={{uri:DEFAULT_CONSTANTS.defaultImageDomain+this.state.noticeData.img_url}}
                                    resizeMode={"contain"}
                                    style={CommonStyle.fullWidthImage}
                                />
                                :
                                <Image
                                    source={require('../../../assets/icons/no_image.png')}
                                    resizeMode={"contain"}
                                    style={CommonStyle.fullWidthImage}
                                />
                            }
                        </View>   
                    </View>
                    <View style={styles.defaultWrap}>
                        <View style={styles.boxWrap}>
                            <View style={{alignItems:'flex-start',minHeight:SCREEN_HEIGHT*0.2}}>
                                <HTMLConvert 
                                    {...DEFAULT_PROPS}
                                    html={this.state.noticeData.content}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={CommonStyle.blankArea}></View>
                    { this.state.moreLoading &&
                        <View style={CommonStyle.moreWrap}>
                            <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} />
                        </View>
                    }
                    </ScrollView>
                    {/** 인포메이션 모달 **/}
                <Modal
                    onBackdropPress={this.closeModalInforation}
                    animationType="slide"
                    //transparent={true}
                    onRequestClose={() => {
                        this.props._fn_ToggleNoticeDetail(false)
                    }}                        
                    style={{justifyContent: 'flex-end',margin: 0}}
                    useNativeDriver={true}
                    animationInTiming={300}
                    animationOutTiming={300}
                    hideModalContentWhileAnimating                    
                    isVisible={this.props.toggleNoticeDetail}
                >
                    <Animated.View style={[styles.modalContainer,{ height: this.animatedHeight }]}>
                        <View style={styles.modalContainer}>                            
                            <TouchableOpacity 
                                onPress={()=>this.updateNotice(1)}
                                style={{paddingHorizontal:20,paddingVertical:15}}
                            >
                                <CustomTextR style={styles.termText4}>공지사항 수정</CustomTextR>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={()=>this.deleteNotice()}
                                style={{paddingHorizontal:20,paddingVertical:15}}
                            >
                                <CustomTextR style={styles.termText4}>공지사항 삭제</CustomTextR>
                            </TouchableOpacity>
                        
                        </View>
                    </Animated.View>
                </Modal>
                </SafeAreaView>
            );
        }
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor : "#fff",
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    defaultWrap:{
        flex:1,borderTopWidth:1,borderTopColor:DEFAULT_COLOR.input_border_color,backgroundColor : "#fff",justifyContent:'center'
    },
    defaultWrap2:{
        flex:1,borderBottomWidth:1,borderBottomColor:DEFAULT_COLOR.input_border_color,backgroundColor : "#fff",justifyContent:'center'
    },
    thumbnailWrap : {
        paddingHorizontal:0,marginVertical:20,justifyContent:'center',alignItems:'center',overflow:'hidden'
    },
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),paddingRight:10
    },
    menuTitleText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingRight:10,color:'#343434'
    },
    termText4 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),paddingRight:10,color:'#343434'
    },
    ballStyle : {
        width: 28,height: 28,borderRadius: 14,backgroundColor:'#fff',
        
    },
    boxWrap : {
        paddingHorizontal:20,paddingVertical:10
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
});



function mapStateToProps(state) {
    return {
        userToken : state.GlabalStatus.userToken,
        toggleNoticeDetail : state.GlabalStatus.toggleNoticeDetail
    };
}

function mapDispatchToProps(dispatch) {
    return {        
        _saveUserToken:(str)=> {
            dispatch(ActionCreator.saveUserToken(str))
        },        
        _fn_ToggleNoticeDetail:(bool)=> {
            dispatch(ActionCreator.fn_ToggleNoticeDetail(bool))
        }
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(NoticeDetailScreen);