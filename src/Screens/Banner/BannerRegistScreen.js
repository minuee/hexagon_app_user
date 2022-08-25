import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Text,Dimensions,RefreshControl,PixelRatio,Image,TouchableOpacity,BackHandler,TextInput,KeyboardAvoidingView,Animated,Alert} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import 'moment/locale/ko'
import  moment  from  "moment";
import ImagePicker from 'react-native-image-crop-picker';
//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonStyle from '../../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR,DropBoxIcon} from '../../Components/CustomText';
import CommonUtil from '../../Utils/CommonUtil';
import CommonFunction from '../../Utils/CommonFunction';
import SelectType from "../../Utils/SelectType";
import Loader from '../../Utils/Loader';

const mockData1 = [
    { id: 1, name : '1', code:1, checked : true},
    { id: 2, name : '2', code:2, checked : false},
    { id: 3, name : '3', code:3, checked : false},
    { id: 4, name : '4', code:4, checked : false},
    { id: 5, name : '5', code:5, checked : false},
   
]
const currentDate =  moment().add(0, 'd').format('YYYY-MM-DD');
const minDate =  moment().add(1, 'd').format('YYYY-MM-DD');
const maxDate =  moment().add(60, 'd').format('YYYY-MM-DD');

class BannerRegistScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading : true,
            showModal : false,
            showModalType : 1,
            moreloading : false,
            imageUrl : null,
            formBannerTitle : null,
            formBannerContents : '',
            formBannerSeq : 1,
        }
    }

    UNSAFE_componentWillMount() {
      
        this.setState({
            formBannerTitle : "",
            formBannerContents : '',            
            formBannerSeq : 1,
          
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

  
    animatedHeight = new Animated.Value(SCREEN_HEIGHT * 0.5);
    closeModal = () => {
        this.setState({ showModal: false });
      
    };
    showModal = (mode) => {
        this.setState({ 
            showModal: true,
            showModalType : mode
        })
    };

    bannerRegist = async() => {
        CommonFunction.fn_call_toast('준비중입니다.',2000);
    }


    cancleRegist = () => {
        Alert.alert(
            "배너등록 취소",      
            "배너등록을 취소하시겠습니까?",
            [
                {text: 'OK', onPress: () => this.props.navigation.goBack(null)},
                {text: 'CANCEL', onPress: () => console.log('Cancle')},
                
            ],
            { cancelable: true }
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

    render() {
        if ( this.state.loading ) {
            return (
                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} /> 
            )
        }else {        
            return(
                <View style={ styles.container }>
                    <KeyboardAvoidingView style={{paddingVertical:0}} behavior="padding" enabled> 
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
                        <View style={{flex:1,backgroundColor:'#fff'}}>
                            <View style={{backgroundColor:'#e4e4e4',padding:15}}>
                                <TouchableOpacity 
                                    onPress={()=>this.changeProfile(true,true)}
                                    style={{flex:1,justifyContent:'center',alignItems:'center'}} 
                                >
                                { !CommonUtil.isEmpty(this.state.imageUrl) ?
                                    <Image
                                        source={{uri:this.state.imageUrl}}
                                        resizeMode={"contain"}
                                        style={{width:PixelRatio.roundToNearestPixel(97),height:PixelRatio.roundToNearestPixel(97)}}
                                    />
                                    :
                                    <Image
                                        source={require('../../../assets/icons/no_image.png')}
                                        resizeMode={"contain"}
                                        style={{width:PixelRatio.roundToNearestPixel(97),height:PixelRatio.roundToNearestPixel(97)}}
                                    />
                                }
                                </TouchableOpacity>
                            </View>
                            <View style={{paddingHorizontal:15,paddingVertical:10,marginTop:15,flexDirection:'row'}}>
                                <CustomTextR style={CommonStyle.titleText}>제목</CustomTextR>
                                <CustomTextR style={CommonStyle.requiredText2}>{'*'}</CustomTextR>
                            </View>
                            <View style={{paddingHorizontal:15}}>
                                <TextInput          
                                    placeholder={'배너 제목을 입력해주세요'}
                                    placeholderTextColor={DEFAULT_COLOR.base_color_666}                           
                                    style={[styles.inputBlank,CommonStyle.defaultOneWayForm]}
                                    value={this.state.formBannerTitle}
                                    onChangeText={text=>this.setState({formBannerTitle:text})}
                                    multiline={false}
                                    clearButtonMode='always'
                                />
                            </View> 
                            <View style={{paddingHorizontal:15,paddingVertical:10,marginTop:10,flexDirection:'row'}}>
                                <CustomTextR style={CommonStyle.titleText}>내용</CustomTextR>
                                <CustomTextR style={CommonStyle.requiredText2}>{'*'}</CustomTextR>
                            </View>
                            <View style={{paddingHorizontal:15}}>
                                <TextInput         
                                    placeholder={'배너 설명문구 작성'}
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
                            <View style={{paddingHorizontal:15,paddingVertical:10,flexDirection:'row',marginTop:5,}}>
                                <CustomTextR style={CommonStyle.titleText}>배너순서 설정</CustomTextR>
                               
                            </View>
                            <View style={{paddingHorizontal:15,flexDirection:'row'}}>     
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
                            onPress={()=>this.bannerRegist()}
                        >
                            <CustomTextB style={CommonStyle.bottomMenuOffText}>등록</CustomTextB>
                        </TouchableOpacity>
                    </View>                    
                   
                </View>
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
    selectBoxText  : {
        color:DEFAULT_COLOR.base_color_666,
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),
        lineHeight: DEFAULT_TEXT.fontSize20 * 1,
    },
    selectedTabText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),color:DEFAULT_COLOR.base_color
    },
    unSelectedTabText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),color:'#808080'
    },
    inputBlank : {
        borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color,borderRadius:5,backgroundColor:'#fff'
    },
    unSelectedBox : {
        borderRadius:5,borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color,paddingVertical:5,paddingHorizontal:10,backgroundColor:'#fff'
    },
    canBoxWrap : {
        flex:1,flexDirection:'row',backgroundColor:'#fff',paddingVertical:10,paddingHorizontal:20,borderTopWidth:1,borderTopColor:'#ccc'
    },
    uncanBoxWrap : {
        flex:1,flexDirection:'row',backgroundColor:'#e1e1e1',paddingVertical:10,paddingHorizontal:20,borderTopWidth:1,borderTopColor:'#ccc'
    },
    tdWrap1 : {
        flex:0.5,justifyContent:'center',alignItems:'center'
    },
    tdWrap2  :{
        flex:2,justifyContent:'center',alignItems:'center'
    },
    tdWrap3 : {
        flex:3,justifyContent:'center',alignItems:'center'
    },
    tdWrap4 : {
        flex:1,justifyContent:'center',alignItems:'center'
    },
    boxLeftWrap : {
        flex:1,        
        justifyContent:'center',
        alignItems:'center'
    },
    boxRightWrap : {
        flex:5,        
        justifyContent:'center',
        alignItems:'flex-start'
    },

});


function mapStateToProps(state) {
    return {
        userToken : state.GlabalStatus.userToken
    };
}

export default connect(mapStateToProps,null)(BannerRegistScreen);