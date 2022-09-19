import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,ImageBackground,Dimensions,RefreshControl, PixelRatio,Image,TouchableOpacity,Alert} from 'react-native';
import 'moment/locale/ko'
import  moment  from  "moment";
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-community/async-storage';
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
import CheckConnection from '../../Components/CheckConnection';
import FooterScreen from '../../Components/FooterScreen';
import Loader from '../../Utils/Loader';
import { apiObject } from "../Apis";

const iconEvent = require('../../../assets/icons/icon_event.png');
const iconEventterm = require('../../../assets/icons/icon_eventterm.png');
const iconEventlimit = require('../../../assets/icons/icon_eventlimit.png');

const bannerWidth = SCREEN_WIDTH-40;
const bannerHeight = (( SCREEN_WIDTH-40 ) * 1024 ) / 450;
class EventScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            moreLoading : false,
            eventList : [],
        }
    }

    getBaseData = async(eventList=[]) => {
        if ( eventList.length === 0 ) {
            let returnCode = {code:9998};
            try {            
                const activeDate =  moment().unix();
                
                const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/event/list/now';
                const token = this.props.userToken.apiToken;
                let sendData = null;
                returnCode = await apiObject.API_getPageList(this.props,url,token,sendData);          
                console.log('returnCode',returnCode.data.eventList)   
                if ( returnCode.code === '0000'  ) {
                    this.setState({
                        eventList : returnCode.data.eventList.filter((info) => (CommonUtil.isEmpty(info.end_dt) || info.end_dt > activeDate) )
                    })
                }else{
                    CommonFunction.fn_call_toast('이벤트 조회중 처리중 오류가 발생하였습니다.',2000);
                }
                this.setState({moreLoading:false,loading:false})
            }catch(e){
                console.log('e',e)   
                this.setState({loading:false,moreLoading : false})
            }
        }else{
            this.setState({loading:false,moreLoading : false})
        }
    }
    
    async UNSAFE_componentWillMount() {
        await this.getBaseData();

        this.props.navigation.addListener('focus', () => {        
            this.getBaseData(this.state.eventList)
            this.setState({orderSeq : 'new'})
        })
    }

    componentDidMount() {
        
    }


    handleOnScroll (event) {             
        if ( event.nativeEvent.contentOffset.y >= 200 ) {
            //this.setState({showTopButton : true}) 
        }else{
            //this.setState({showTopButton : false}) 
         }

        let paddingToBottom = 1;
        paddingToBottom += event.nativeEvent.layoutMeasurement.height;                            
        if (event.nativeEvent.contentOffset.y + paddingToBottom >= event.nativeEvent.contentSize.height) {            
            //this.scrollEndReach();
        }
    }

    scrollEndReach = () => {       
       
    }
    refreshingData = async() => {
    }

    moveDetail = (item) => {
        //console.log('moveDetail',item)   
        this.props.navigation.navigate('EventProductStack',{
            screenTitle:item.title,
            screenData:item
        })
    }

    logout = () => {
        Alert.alert(
            "슈퍼바인더 로그아웃",      
            "정말로 로그아웃하시겠습니까?",
            [
                {text: '네', onPress: () => this.logoutAction()},
                {text: '아니오', onPress: () => console.log('Cancle')},
                
            ],
            { cancelable: true }
        ) 
    }

    logoutAction = async() => {
        await AsyncStorage.removeItem('autoLoginData');
        this.props._saveUserToken({});
        setTimeout(() => {
            this.props.navigation.popToTop();
        }, 500);
       
    }

    renderEventGubun = (data) => {
        switch(data.event_gubun) {
            case 'TERM' : return '기간할인이벤트';break;
            case 'LIMIT' : return '한정이벤트';break;
            case 'SALE' : return '할인이벤트';break;
            default : return '할인이벤트';break;
        }
    }

    renderEventTerm = (data) => {
        switch(data.event_gubun) {
            case 'TERM' : return  `기간: ${CommonFunction.convertUnixToDate(data.start_dt,"YYYY.MM.DD")}~${CommonFunction.convertUnixToDate(data.end_dt,"YYYY.MM.DD HH:mm")}`;break;
            case 'LIMIT' : return `기간: ${CommonFunction.convertUnixToDate(data.start_dt,"YYYY.MM.DD HH:mm")}`;break;
            case 'SALE' : return `기간: ${CommonFunction.convertUnixToDate(data.start_dt,"YYYY.MM.DD HH:mm")}`;break;
            default : return `기간: ${CommonFunction.convertUnixToDate(data.start_dt,"YYYY.MM.DD HH:mm")}`;break;
        }
    }

    refreshingData = async() => {    
        await this.setState({moreLoading:true})        
        await this.getBaseData()
       
    }
    render() {
        if ( this.state.loading ) {
            return (
                <SafeAreaView style={ styles.container }>
                    <CheckConnection />
                    <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} /> 
                </SafeAreaView> 
            )
        }else { 
        return(
            <SafeAreaView style={ styles.container }>
                <CheckConnection />
                <ScrollView
                    ref={(ref) => {
                        this.ScrollView = ref;
                    }}
                    showsVerticalScrollIndicator={false}
                    indicatorStyle={'white'}
                    scrollEventThrottle={16}
                    keyboardDismissMode={'on-drag'}
                    onScroll={e => this.handleOnScroll(e)}
                    onMomentumScrollEnd = {({nativeEvent}) => { 
                        
                    }}
                    refreshControl={
                        <RefreshControl
                          refreshing={this.state.moreLoading}
                          onRefresh={this.refreshingData}
                        />
                    }
                    onScrollEndDrag ={({nativeEvent}) => { 
                        
                    }}                        
                    style={{width:'100%'}}
                    
                >
                    <View style={styles.eventWrap}>
                    {
                        this.state.eventList.length === 0 ? 
                        <View style={CommonStyle.emptyWrap} >
                            <CustomTextR style={CommonStyle.dataText}>이벤트 준비중입니다.</CustomTextR>
                        </View>
                        :
                        this.state.eventList.map((item, index) => {  
                            if ( !CommonUtil.isEmpty(item.event_img)) {
                                return (
                                    <TouchableOpacity 
                                        key={index} 
                                        style={styles.iconEvent2} 
                                        onPress={()=>this.moveDetail(item)}
                                    >
                                        <FastImage
                                            //source={agentMaker}                        
                                            //resizeMode='cover'
                                            //style={styles.markerAgentWrap}
                                            source={{uri:DEFAULT_CONSTANTS.defaultImageDomain+item.event_img}}       
                                            resizeMode={FastImage.resizeMode.contain}
                                            style={{width:bannerWidth,minHeight:150}}
                                        />
                                    </TouchableOpacity>
                                )
                            }else{
                                if (item.event_gubun==='TERM' ) {
                                    return (
                                        <TouchableOpacity key={index} style={styles.iconEventterm} onPress={()=>this.moveDetail(item)}>
                                            <View style={styles.dataLeftWrap}>
                                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize17),color:'#222'}}>기간할인 이벤트</CustomTextR>

                                                <CustomTextB style={[styles.commonTitleText,{color:'#fff',lineHeight:25}]} numberOfLines={2} ellipsizeMode={'tail'}>{item.title}</CustomTextB>
                                                <CustomTextL style={CommonStyle.dataText} >
                                                    {this.renderEventTerm(item)}
                                                </CustomTextL>
                                            </View>
                                            <View style={styles.dataRightWrap}>
                                                <Image
                                                    source={iconEventterm}
                                                    resizeMode='contain'
                                                    style={CommonStyle.defaultIconImage70}
                                                
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    )

                                }else if (item.event_gubun==='LIMIT' ) {
                                    return (
                                        <TouchableOpacity key={index} style={styles.iconEventlimit} onPress={()=>this.moveDetail(item)}>
                                            <View style={styles.dataLeftWrap}>
                                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize17),color:'#db2364'}}>한정수량 이벤트</CustomTextR>

                                                <CustomTextB style={[styles.commonTitleText,{color:'#0a2364',lineHeight:30}]} numberOfLines={2} ellipsizeMode={'tail'}>{item.title}</CustomTextB>
                                                <CustomTextL style={CommonStyle.dataText} >
                                                    {this.renderEventTerm(item)}
                                                </CustomTextL>
                                            </View>
                                            <View style={styles.dataRightWrap}>
                                                <Image
                                                    source={iconEventlimit}
                                                    resizeMode='contain'
                                                    style={CommonStyle.defaultIconImage70}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }else {
                                    return (
                                        <TouchableOpacity key={index} style={styles.iconEvent} onPress={()=>this.moveDetail(item)}>
                                            <View style={styles.dataLeftWrap}>
                                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize17),color:'#db2364'}}>할인이벤트</CustomTextR>
                                                
                                                <CustomTextB style={[styles.commonTitleText,{color:'#ff313b',lineHeight:25}]} numberOfLines={2} ellipsizeMode={'tail'}>{item.title}</CustomTextB>
                                                <CustomTextL style={CommonStyle.dataText} >
                                                    {this.renderEventTerm(item)}
                                                </CustomTextL>
                                            </View>
                                            <View style={styles.dataRightWrap}>
                                                <Image
                                                    source={iconEvent}
                                                    resizeMode='contain'
                                                    style={CommonStyle.defaultIconImage70}
                                                />

                                            </View>
                                        
                                        </TouchableOpacity>
                                    )
                                }
                            }
                        })
                    } 
                    </View>

                    <View style={CommonStyle.blankArea}></View>
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
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : "#fff"
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    eventWrap : {
        flex:1,
        margin:20,
        //minHeight:SCREEN_HEIGHT*0.4
    },
    boxWrap : {
        flex:1,
        flexDirection:'row',    
        flexGrow:1,    
        paddingHorizontal:20,paddingVertical:10,
        backgroundColor:'#f5f6f8',
    },
    boxSubWrap : {
        flex:1,
        flexDirection:'row',     
        paddingHorizontal:0,
        minHeight:180,
        borderBottomWidth:1,
        borderBottomColor : DEFAULT_COLOR.input_border_color,
    },

    iconEvent : {
        flex:1,
        minHeight:100,
        flexDirection:'row',     
        padding:20,
        backgroundColor:'#f9f4f1',
        borderRadius:7,
        marginBottom:20
    },
    iconEvent2 : {
        flex:1,
        minHeight:100,        
        marginBottom:20
    },
    iconEventterm : {
        flex:1,
        minHeight:100,
        flexDirection:'row',     
        padding:20,
        backgroundColor:'#9fe4ba',
        borderRadius:7,
        marginBottom:20
    },
    iconEventlimit : {
        flex:1,
        minHeight:100,
        flexDirection:'row',     
        padding:20,
        backgroundColor:'#dbe5ff',
        borderRadius:7,
        marginBottom:20
    },
    dataLeftWrap : {
        flex:3,
        justifyContent:'flex-start',
    },
    dataRightWrap : {
        flex:1,     
        justifyContent:'center',
        alignItems:'center',
    },
    boxLeftWrap : {
        flex:2.5,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center'
    },
    commonTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),paddingVertical:4
    },
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),paddingRight:10
    },
    boxLeftWrap2 : {
        flex:1,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        
    },
    
    dataEndWrap : {
        flex:0.5,        
        justifyContent:'center',
        alignItems:'flex-end'
    },
    menuRemoveText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),color:'#777'
    },
});

function mapStateToProps(state) {
    return {
        userToken : state.GlabalStatus.userToken
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


export default connect(mapStateToProps,mapDispatchToProps)(EventScreen);