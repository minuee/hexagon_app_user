import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Text,Dimensions,PixelRatio,TouchableOpacity,Image,Animated,Alert} from 'react-native';
import 'moment/locale/ko'
import  moment  from  "moment";
import Modal from 'react-native-modal';
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
//HTML 
import Collapsible from '../../Utils/Collapsible'
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

const mockData2 = `
ffd
fd
fd
fd
fdf
df
fd
fdfd
fd
`

class NoticeDetailScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading : true,
            switchOn1 : true,
            productData : {}
        }
    }

    UNSAFE_componentWillMount() {
        
        //console.log('RewardDetailScreen',this.props.extraData.params.screenData)
        if ( !CommonUtil.isEmpty(this.props.extraData.params.screenData)) {
            this.setState({
                productData : this.props.extraData.params.screenData
            })
        }

        // This works
        this.props.navigation.addListener('focus', (payload) => {            
            this.props._fn_ToggleNoticeDetail(false)
        })

        this.props.navigation.addListener('blur', (payload) => {            
            //console.log('blurblurblurblur')
        })
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


    updateNotice = () => {
        
        this.props.navigation.navigate('PopEventRegistStack',{
            screenData:this.state
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
        //this.props._fn_ToggleNoticeDetail(false)
        CommonFunction.fn_call_toast('삭제되었습니다.',1500);
        setTimeout(
            () => {            
                this.props.navigation.goBack(null);
            },1500
        )
    }

    stopPosting = () => {
        //this.props._fn_ToggleNoticeDetail(false)
        CommonFunction.fn_call_toast('준비중입니다.',1500);
    }

    animatedHeight = new Animated.Value(SCREEN_HEIGHT * 0.3);
    
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
                    <View style={styles.fixedTop}>
                        <Collapsible trigger={this.props.toggleNoticeDetail} >
                            <View style={styles.fixedDataWarp}>
                                <TouchableOpacity 
                                    onPress={()=>this.updateNotice()}
                                    style={{paddingVertical:5}}
                                >
                                    <CustomTextR style={styles.termText4}>수정</CustomTextR>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={()=>this.stopPosting()}
                                    style={{paddingVertical:5}}
                                >
                                    <CustomTextR style={styles.termText4}>중지</CustomTextR>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={()=>this.deleteNotice()}
                                    style={{paddingVertical:5}}
                                >
                                    <CustomTextR style={styles.termText4}>삭제</CustomTextR>
                                </TouchableOpacity>
                            </View>
                        </Collapsible>
                    </View>
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
                        <View style={styles.titleWrap}>
                            <View style={styles.boxWrap}>
                                <CustomTextR style={styles.menuTitleText}>전면 팝업창</CustomTextR>
                            </View>
                            <View style={styles.boxWrap}>
                                <CustomTextR style={styles.menuTitleText}>2020. 4. 27 00:00부터 적용</CustomTextR>
                            </View>
                        </View>
                        <View style={{flex:1,backgroundColor : "#fff"}}>
                            <View style={{paddingHorizontal:20,marginBottom:20}}>
                                <Image
                                    source={require('../../../assets/images/sample002.png')}
                                    resizeMode={"contain"}
                                    //style={{width:SCREEN_WIDTH-40,height:SCREEN_WIDTH/4*3}}
                                    style={{flex:1,height:SCREEN_WIDTH-40,aspectRatio: 1}}
                                />
                            </View> 
                        </View>                 
                   
                    </ScrollView>
                    <View style={styles.bottomButtonWrap}>
                        <TouchableOpacity 
                            style={styles.menuOnBox}
                            onPress={()=> this.stopPosting()}
                        >
                            <CustomTextB style={styles.menuOnText}>이벤트 중지</CustomTextB>
                        </TouchableOpacity> 
                    </View>
                    
                </SafeAreaView>
            );
        }
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : "#fff",
    },
    fixedTop : {
        position:'absolute',right:10,top:1,width:110,height:100,zIndex:10,justifyContent:'center'
    },
    fixedDataWarp : {
        flex:1,
        width:110,
        paddingLeft:20,
        borderWidth :2,
        borderColor : DEFAULT_COLOR.input_border_color,
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
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleWrap : {
        flex:1,borderTopWidth:1,borderTopColor:DEFAULT_COLOR.input_border_color,backgroundColor : "#fff",justifyContent:'center',paddingVertical:10
    },
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),paddingRight:10
    },
    menuTitleText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),paddingRight:10,color:'#343434'
    },
    bottomButtonWrap : {
        position:'absolute',right:0,bottom:0,width:SCREEN_WIDTH,height:DEFAULT_CONSTANTS.BottomHeight,backgroundColor:DEFAULT_COLOR.base_color,justifyContent:'center',alignItems:'center',flexDirection:'row',borderTopWidth:1, borderTopColor:DEFAULT_COLOR.base_color
    },
    termText4 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),paddingRight:10,color:'#343434'
    },
    ballStyle : {
        width: 28,height: 28,borderRadius: 14,backgroundColor:'#fff',
        
    },
    boxWrap : {
        paddingHorizontal:20,paddingVertical:5
    },
    menuOnBox : {
        flex:1,backgroundColor:DEFAULT_COLOR.base_color,justifyContent:'center',alignItems:'center'
    },
    menuOffBox : {
        flex:1,backgroundColor:'#fff',justifyContent:'center',alignItems:'center',height:'100%'
    },
    menuOnText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#fff'
    },
    menuOffText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color
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
        _fn_ToggleNoticeDetail:(bool)=> {
            dispatch(ActionCreator.fn_ToggleNoticeDetail(bool))
        }
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(NoticeDetailScreen);