import React, { Component } from 'react';
import {Clipboard,ScrollView,View,StyleSheet,Text,Dimensions,Image,BackHandler,PixelRatio,TouchableOpacity, Linking,Platform,Animated,Share,Alert} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonStyle from '../../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR} from '../../Components/CustomText';

const mockData1  = [
    {
        id :1, question : '질문질문질문질문질문질문질문질문질문질문11?',answer : '답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변\n\n답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변.\n\n답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변.'
    },
    {
        id :2, question : '질문질문질문질문질문질문질문질문질문질문질문질문질문질문11?',answer : '답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변\n\n답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변.\n\n답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변.'
    },
    {
        id :3, question : '질문질문질문질문질문질문질문질문질문질문11?',answer : '답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변\n\n답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변.\n\n답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변.'
    },
    {
        id :4, question : '질문질문질문질문질문질문질문질문질문질문11?',answer : '답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변\n\n답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변.\n\n답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변.'
    },
    {
        id :5, question : '질문질문질문질문질문질문질문질문질문질문11?',answer : '답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변\n\n답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변.\n\n답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변답변.'
    }
]

export default  class FaqListScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {      
            loading : true,
            showTopButton : false,
            showModal : false,
            subMenu : true
        }
    }

    UNSAFE_componentWillMount() {
    }
    
    componentDidMount() {     
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);          
    }

    handleBackButton = () => {        
        this.props.navigation.goBack(null);                
        return true;
    };

    handleOnScroll (event) {             
        if ( event.nativeEvent.contentOffset.y >= 200 ) {
            this.setState({showTopButton : true}) 
        }else{
            this.setState({showTopButton : false}) 
        }

        let paddingToBottom = 1;
        paddingToBottom += event.nativeEvent.layoutMeasurement.height;                            
        if (event.nativeEvent.contentOffset.y + paddingToBottom >= event.nativeEvent.contentSize.height) {            
            //this.scrollEndReach();
        }
    }

    scrollEndReach = () => {
        if ( this.state.moreLoading === false && this.state.ismore) {            
            this.setState({moreLoading : true})
        }
    }

    upButtonHandler = () => {        
        this.ScrollView.scrollTo({ x: 0,  animated: true });
    };

    nextStep = async(data) => {
        this.props.navigation.navigate('MyTeamDetailStack',{
            screenTitle : '팀 상세',
            screenData : data
        })
    }

    render() {
        return(
            <View style={ styles.container }>
                { this.state.showTopButton &&
                    <TouchableOpacity style={styles.fixedUpButton} onPress={e => this.upButtonHandler()}>
                        <Icon name="up" size={25} color="#000" />
                    </TouchableOpacity>
                }
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
                    onScrollEndDrag ={({nativeEvent}) => { 
                    }}
                    style={{flex:1,width:SCREEN_WIDTH}}
                >
                    <View style={styles.topBoxWrap}>
                        <CustomTextM style={CommonStyle.titleText15}>자주 묻는 질문</CustomTextM>
                    </View> 
                    <View style={{flex:1,marginTop:10}}>
                        <View style={styles.boxWrap2}>
                            <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),color:'#7d7d7d'}}>준비중입니다.</CustomTextR>
                        </View>

                        {/* {
                            mockData1.map((data1, index1) => {  
                            return (
                                <View style={styles.boxWrap} key={index1}>
                                    <View style={{flex:1,padding:5}}>
                                        <CustomTextB style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),color:'#7d7d7d'}}>Q. {data1.question}</CustomTextB>
                                    </View>
                                    <View style={{flex:1,paddingVertical:5,paddingLeft:15}}>
                                        <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),color:'#7d7d7d'}}>A. {data1.answer}</CustomTextR>
                                    </View>
                                </View>
                            )
                            })
                        } */}
                    </View>
                    <View style={{flex:1,height:50,backgroundColor:'#fff'}}></View>
                </ScrollView>
               
            </View>
        );
    }
}

//Tmap연동 https://github.com/yhc002/TMapReactNativeApp
const styles = StyleSheet.create({
    container: {        
        flex: 1,        
        justifyContent: 'center',
        alignItems: 'center',
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
    fixedUpButton : {
        position:'absolute',bottom:60,right:20,width:40,height:40,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',zIndex:3,borderColor:'#ccc',borderWidth:1,borderRadius:20,opacity:0.5
    },
    topBoxWrap : {
        flex:1,
        flexDirection:'row',    
        flexGrow:1,    
        paddingHorizontal:20,
        paddingVertical:10,
        backgroundColor:'#f5f6f8',
        borderBottomWidth:1,
        borderBottomColor : DEFAULT_COLOR.input_border_color
    },
    boxWrap : {
        justifyContent:'center',borderWidth:0.5,borderColor:'#979797',borderRadius:5,padding:15,marginBottom:10,marginHorizontal:15,paddingVertical:10
    },
    boxWrap2 : {
        justifyContent:'center',padding:15,marginBottom:10,marginHorizontal:15,paddingVertical:10
    },
});