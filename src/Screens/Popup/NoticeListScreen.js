import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Text,Dimensions,RefreshControl, PixelRatio,Image,TouchableOpacity, Platform,Animated} from 'react-native';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import Modal from 'react-native-modal';
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

const mockData1 = [
    { id: 1, icon : require('../../../assets/images/sample008.png'),title : '공지공지공지공지공지공지공지공지공지공지',date : '2020.12.03 11:30',content:'22222222',seq:1},
    { id: 2, icon : require('../../../assets/images/sample004.png'),title : '공지공지공지공지공지공지공지공지공지공지',date : '2020.12.03 11:30',content:'22222222',seq:2},
    { id: 3, icon : require('../../../assets/images/sample007.png'),title : '공지공지공지공지공지공지공지공지공지공지',date : '2020.12.03 11:30',content:'22222222',seq:3},
]

const mockData2 = [
    { id: 1, icon : require('../../../assets/images/sample006.png'),title : '공지공지공지공지공지공지공지공지공지공지',date : '2020.12.03 11:30',content:'22222222',seq:4},
    { id: 2, icon : require('../../../assets/images/sample003.png'),title : '공지공지공지공지공지공지공지공지공지공지',date : '2020.12.03 11:30',content:'22222222',seq:5},
]

class NoticeListScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : false,
           
        }
    }

    UNSAFE_componentWillMount() {
      
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

    moveDetail = (item,gubun) => {
        this.props.navigation.navigate('PopupNoticeDetailStack',{
            screenData:item,mode:gubun
        })
    }


    addSchedule = () => {
        //CommonFunction.fn_call_toast('준비중입니다.',2000);
        this.props.navigation.navigate('PopNoticeRegistStack');
    }


    render() {
        return(
            <SafeAreaView style={ styles.container }>
                
                <TouchableOpacity 
                    style={styles.fixedUpButton}
                    onPress={e => this.addSchedule()}
                >
                    <CustomTextL style={{color:'#fff',fontSize:PixelRatio.roundToNearestPixel(35)}}>+</CustomTextL>
                </TouchableOpacity>
                
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
                            refreshing={this.state.loading}
                            onRefresh={this.refreshingData}
                        />
                    }
                    onScrollEndDrag ={({nativeEvent}) => { 
                        
                    }}                        
                    style={{width:'100%'}}
                    
                >
                    <View style={styles.boxWrap}>
                        <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)}}>현재</CustomTextM>
                        
                    </View> 
                    {
                        mockData1.map((item, index) => {  
                            return (
                                <View key={index} style={{backgroundColor:'#fff'}}>
                                    <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail(item,'ing')}>
                                        <View style={styles.boxLeftWrap}>
                                            <Image
                                                source={item.icon}
                                                resizeMode={"contain"}
                                                style={{flex:1,width:'90%',aspectRatio: 1}}
                                            />
                                        </View>
                                        <View style={styles.boxRightWrap}>
                                            <CustomTextR 
                                                numberOfLines={1} ellipsizeMode={'tail'}
                                                style={[styles.menuTitleText,{paddingLeft:20}]}
                                            >{item.title}</CustomTextR>
                                            <CustomTextR 
                                                numberOfLines={1} ellipsizeMode={'tail'}
                                                style={[styles.menuTitleText2,{paddingLeft:20}]}
                                            >{item.content}</CustomTextR>
                                            
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )
                        })
                    } 

                    <View style={styles.boxWrap}>
                        <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)}}>지난</CustomTextM>
                        
                    </View> 
                    {
                        mockData2.map((item, index) => {  
                            return (
                                <View key={index} style={{backgroundColor:'#fff'}}>
                                    <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail(item,'old')}>
                                        <View style={styles.boxLeftWrap}>
                                            <Image
                                                source={item.icon}
                                                resizeMode={"contain"}
                                                style={{wflex:1,width:'90%',aspectRatio: 1}}
                                            />
                                        </View>
                                        <View style={styles.boxRightWrap}>
                                            <CustomTextR 
                                                numberOfLines={1} ellipsizeMode={'tail'}
                                                style={[styles.menuTitleText,{paddingLeft:20}]}
                                            >{item.title}</CustomTextR>
                                            <CustomTextR 
                                                numberOfLines={1} ellipsizeMode={'tail'}
                                                style={[styles.menuTitleText2,{paddingLeft:20}]}
                                            >{item.content}</CustomTextR>
                                            
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )
                        })
                    } 
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



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : "#f5f6f8"
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fixedUpButton : {
        position:'absolute',bottom:80,right:20,width:50,height:50,backgroundColor:DEFAULT_COLOR.base_color,borderColor:'#ccc',borderWidth:1,borderRadius:25,alignItems:'center',justifyContent:'center',zIndex:10
    },
    boxWrap : {
        flex:1,
        flexDirection:'row',    
        flexGrow:1,    
        paddingHorizontal:20,
        paddingVertical:10,
        backgroundColor:'#f5f6f8',
        borderBottomWidth:1,
        borderBottomColor : DEFAULT_COLOR.input_border_color
    },
    boxSubWrap : {
        flex:1,
        flexDirection:'row',    
        flexGrow:1,    
        paddingHorizontal:20,paddingVertical: Platform.OS === 'android' ? 5 : 15,
        alignItems: 'center',        
        borderBottomWidth:1,
        borderBottomColor : DEFAULT_COLOR.input_border_color
    },
    boxLeftWrap : {
        flex:1,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    boxRightWrap : {
        flex:2,        
        alignItems:'flex-start',
        minHeight:100
    },
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),paddingRight:10
    },
    menuTitleText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingRight:10
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
    };
}


export default connect(mapStateToProps,null)(NoticeListScreen);