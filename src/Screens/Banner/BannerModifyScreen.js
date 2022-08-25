import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,KeyboardAvoidingView,Dimensions,PixelRatio,TouchableOpacity,Image,Animated,Alert,TextInput} from 'react-native';
import 'moment/locale/ko'
import  moment  from  "moment";
import Modal from 'react-native-modal';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import ImagePicker from 'react-native-image-crop-picker';
//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonStyle from '../../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,DropBoxIcon, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR} from '../../Components/CustomText';
import CommonFunction from '../../Utils/CommonFunction';
import CommonUtil from '../../Utils/CommonUtil';
import SelectType from "../../Utils/SelectType";
import Loader from '../../Utils/Loader';

const currentDate =  moment().format('YYYY.MM.DD HH:MM');

const mockData1 = [
    { id: 1, name : '1', code:1, checked : true},
    { id: 2, name : '2', code:2, checked : false},
    { id: 3, name : '3', code:3, checked : false},
    { id: 4, name : '4', code:4, checked : false},
    { id: 5, name : '5', code:5, checked : false},
   
]

class BannerModifyScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading : true,
            switchOn1 : true,
            productData : {},
            formBannerTitle : "",
            formBannerContents : '',            
            formBannerSeq : 1,

        }
    }

    UNSAFE_componentWillMount() {
        
        //console.log('RewardDetailScreen',this.props.extraData.params.screenData.icon)
        if ( !CommonUtil.isEmpty(this.props.extraData.params.screenData)) {
            this.setState({
                productData : this.props.extraData.params.screenData,
                formBannerTitle : this.props.extraData.params.screenData.title,
                formBannerContents : this.props.extraData.params.screenData.content,      
                formBannerSeq : this.props.extraData.params.screenData.seq,
            })
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

    fn_onChangeToggle = (bool) => {
        this.setState({switchOn1 : bool})
    }

    updateNotice = () => {
        this.props._fn_ToggleNoticeDetail(false)
        this.props.navigation.navigate('NoticeModifyStack',{
            screenData:this.state
        })
    }

    selectFilter = async(mode,filt) => {     
        //console.log('filt',filt) 
        switch(mode) {
            case 'maker' :
                this.setState({
                    formMakerCode:mockData1[filt-1].code,
                    formMakerName:mockData1[filt-1].name
                });break;           
            default : console.log('');
        }
    }


    deleteNotice = (mode) => {
        Alert.alert(
            "이벤트배너 삭제",      
            "정말로 삭제하시겠습니까?",
            [
                {text: 'OK', onPress: () => this.removeNotice()},
                {text: 'CANCEL', onPress: () => console.log('Cancle')},
                
            ],
            { cancelable: true }
        )  
    }

    removeNotice = async() => {
        this.props._fn_ToggleBannerDetail(false)
        CommonFunction.fn_call_toast('삭제되었습니다.',1500);
        setTimeout(
            () => {            
                this.props.navigation.goBack(null);
            },1500
        )
    }

    changeProfile = async(cropit, circular = false, mediaType = 'photo') => {
        
        ImagePicker.openPicker({
            width: 900,
            height: 900,
            multiple:false,
            cropping: true,
            cropperCircleOverlay: circular,
            sortOrder: 'none',
            compressImageMaxWidth: 1000,
            compressImageMaxHeight: 1000,
            compressImageQuality: 1,
            compressVideoPreset: 'MediumQuality',
            includeExif: true,
            cropperStatusBarColor: 'white',
            cropperToolbarColor: 'white',
            cropperActiveWidgetColor: 'white',
            cropperToolbarWidgetColor: '#3498DB',
            loadingLabelText:'처리중...',
            forceJpg:true
        })
          .then((response) => {
            //console.log('received image2', response);
            this.setState({
                profileimage : response.path,
                image: {
                    uri: response.path,
                    width: response.width,
                    height: response.height,
                    mime: response.mime,
                },
                images: null,
            });
            this.awsimageupload(
                {
                    type : response.mime === undefined ? 'jpg' :  response.mime,
                    uri : response.path, 
                    height:response.height,
                    width:response.width,
                    fileSize:response.size,
                    fileName:response.modificationDate
                });
          })
          .catch((e) => {
            //console.log(e);
            CommonFunction.fn_call_toast('이미지 선택을 취소하였습니다.',2000)
            //Alert.alert(e.message ? e.message : e);
          });
    }

    animatedHeight = new Animated.Value(SCREEN_HEIGHT * 0.1);
    
    closeModalInforation = () => {
        this.props._fn_ToggleBannerDetail(false)
    };

    cancleRegist = () => {
        Alert.alert(
            "배너수정 취소",      
            "배너수정을 취소하시겠습니까?",
            [
                {text: 'OK', onPress: () => this.props.navigation.goBack(null)},
                {text: 'CANCEL', onPress: () => console.log('Cancle')},
                
            ],
            { cancelable: true }
        )  
    }
    updateData = async() => {
        CommonFunction.fn_call_toast('준비중입니다.',2000);
    }
    render() {
        if ( this.state.loading ) {
            return (
                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} /> 
            )
        }else {  
            return(
                <SafeAreaView style={styles.container}>
                    <KeyboardAvoidingView style={{paddingVertical:0}} behavior="height" enabled> 
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
                        <View style={{flex:1,backgroundColor:'#fff',padding:15}}>
                            <TouchableOpacity 
                                style={{paddingHorizontal:5,justifyContent:'center',alignItems:'center'}} 
                                onPress={()=>this.changeProfile(true,true)}
                            >                               
                                { !CommonUtil.isEmpty(this.state.productData.icon) ?
                                    <Image
                                        source={require('../../../assets/images/sample008.png')}
                                        resizeMode={"contain"}
                                        style={{flex:1,width:SCREEN_WIDTH*0.95,aspectRatio: 1}}
                                        //style={{flex:1,width:null,height:null,resizeMode:'contain',aspectRatio: 1}}
                                    />
                                    :
                                    <Image
                                        source={require('../../../assets/icons/no_image.png')}
                                        resizeMode={"contain"}
                                        style={{width:PixelRatio.roundToNearestPixel(97),height:PixelRatio.roundToNearestPixel(97)}}
                                    />
                                }                               
                            </TouchableOpacity>
                            <View style={{paddingHorizontal:5,paddingVertical:10,marginTop:10,flexDirection:'row'}}>
                                <CustomTextR style={CommonStyle.titleText}>제목</CustomTextR>
                                <CustomTextR style={CommonStyle.requiredText2}>{'*'}</CustomTextR>
                            </View>
                            <View style={{paddingHorizontal:5}}>
                                <TextInput          
                                    placeholder={'공지 제목을 입력해주세요'}
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                           
                                    style={[styles.inputBlank,CommonStyle.defaultOneWayForm]}
                                    value={this.state.formBannerTitle}
                                    onChangeText={text=>this.setState({formBannerTitle:text})}
                                    multiline={false}
                                    clearButtonMode='always'
                                />
                            </View> 
                            <View style={{paddingHorizontal:5,paddingVertical:10,marginTop:10,flexDirection:'row'}}>
                                <CustomTextR style={CommonStyle.titleText}>내용</CustomTextR>
                                <CustomTextR style={CommonStyle.requiredText2}>{'*'}</CustomTextR>
                            </View>
                            <View style={{paddingHorizontal:5}}>
                                <TextInput         
                                    placeholder={'공지 내용을 입력해주세요'}
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                           
                                    style={[
                                        styles.inputBlank,
                                        {
                                            height:100,width:'100%',paddingTop: 5,paddingBottom: 5,paddingLeft: 5,paddingRight: 5,textAlignVertical: 'top',textAlign:'left',fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)
                                        }]}
                                    value={this.state.formBannerContents}
                                    onChangeText={text=>this.setState({formBannerContents:text})}
                                    multiline={true}
                                    clearButtonMode='always'
                                />
                            </View>
                            <View style={{paddingHorizontal:5,paddingVertical:10,marginTop:5,flexDirection:'row'}}>
                                <CustomTextR style={CommonStyle.titleText}>배너 순서 설정</CustomTextR>
                                
                            </View>
                            <View style={{paddingHorizontal:5,flexDirection:'row'}}>     
                                <DropBoxIcon />                          
                                <SelectType
                                    isSelectSingle
                                    style={CommonStyle.unSelectedBox}
                                    selectedTitleStyle={CommonStyle.selectBoxText}
                                    colorTheme={DEFAULT_COLOR.base_color_666}
                                    popupTitle="순서설정"
                                    title={'순서설정'}
                                    cancelButtonText="취소"
                                    selectButtonText="선택"
                                    data={mockData1}
                                    onSelect={data => {
                                        this.selectFilter('maker',data)
                                    }}
                                    onRemoveItem={data => {
                                        mockData1[0].checked = true;
                                    }}
                                    initHeight={SCREEN_HEIGHT * 0.5}
                                />
                            </View>

                        </View>
                        
                        <View style={CommonStyle.blankArea}></View>
                        { this.state.moreLoading &&
                            <View style={CommonStyle.moreWrap}>
                                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} />
                            </View>
                        }
                    </ScrollView>
                    </KeyboardAvoidingView> 
                    <View style={CommonStyle.bottomButtonWrap}>
                        <TouchableOpacity 
                            style={CommonStyle.bottomRightBox}
                            onPress={()=>this.cancleRegist()}
                        >
                            <CustomTextB style={CommonStyle.bottomMenuOnText}>취소</CustomTextB>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={CommonStyle.bottomLeftBox}
                            onPress={()=>this.updateData()}
                        >
                            <CustomTextB style={CommonStyle.bottomMenuOffText}>수정</CustomTextB>
                        </TouchableOpacity>
                    </View> 
                    {/** 인포메이션 모달 **/}
                    <Modal
                        onBackdropPress={this.closeModalInforation}
                        animationType="slide"
                        //transparent={true}
                        onRequestClose={() => {
                            this.props._fn_ToggleBannerDetail(false)
                        }}                        
                        style={{justifyContent: 'flex-end',margin: 0}}
                        useNativeDriver={true}
                        animationInTiming={300}
                        animationOutTiming={300}
                        hideModalContentWhileAnimating                    
                        isVisible={this.props.toggleBannerDetail}
                    >
                        <Animated.View style={[styles.modalContainer,{ height: this.animatedHeight }]}>
                            <View style={styles.modalContainer}>  
                                {/*                   
                                <TouchableOpacity 
                                    onPress={()=>this.updateNotice(1)}
                                    style={{paddingHorizontal:20,paddingVertical:15}}
                                >
                                    <CustomTextR style={styles.termText4}>이벤트배너 수정</CustomTextR>
                                </TouchableOpacity>
                                */}
                                <TouchableOpacity 
                                    onPress={()=>this.deleteNotice()}
                                    style={{paddingHorizontal:20,paddingVertical:15}}
                                >
                                    <CustomTextR style={styles.termText4}>이벤트배너 삭제</CustomTextR>
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
        flex:1,            
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
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),paddingRight:10
    },
    menuTitleText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),paddingRight:10,color:'#343434'
    },

    ballStyle : {
        width: 28,height: 28,borderRadius: 14,backgroundColor:'#fff',
        
    },
    boxWrap : {
        paddingHorizontal:20,paddingVertical:10
    },
    inputBlank : {
        borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color,borderRadius:5,backgroundColor:'#fff'
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
        toggleBannerDetail : state.GlabalStatus.toggleBannerDetail
    };
}

function mapDispatchToProps(dispatch) {
    return {                
        _fn_ToggleBannerDetail:(bool)=> {
            dispatch(ActionCreator.fn_ToggleBannerDetail(bool))
        }
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(BannerModifyScreen);