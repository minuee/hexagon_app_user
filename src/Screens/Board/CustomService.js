import React, { Component } from 'react';
import {Clipboard,ScrollView,View,StyleSheet,Text,Dimensions,Image,BackHandler,PixelRatio,TouchableOpacity, Linking,Platform,Share,Alert, ImageBackground} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR} from '../../Components/CustomText';
import CommonUtil from '../../Utils/CommonUtil';

export default class CustomService extends Component {
    constructor(props) {
        super(props);
        this.state = {      
            loading : true,
            showTopButton : false,
            showModal : false,
        };
              
    }

    UNSAFE_componentWillMount() {      
        
        // This works
        this.props.navigation.addListener('focus', () => {            
            BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
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
        this.props.navigation.goBack(null);                
        return true;
    };


    handleOnScroll (event) {             
       
    }

    scrollEndReach = () => {
       
    }

   
    upButtonHandler = () => {        
        this.ScrollView.scrollTo({ x: 0,  animated: true });
    };

 
    callRequest = () => {
        let tmpNumber = DEFAULT_CONSTANTS.CompanyInfoTel
        if ( !CommonUtil.isEmpty(tmpNumber)) {
            let phoneNumber = '';
            if (Platform.OS === 'android') { phoneNumber = `tel:${tmpNumber}`; }
            else {phoneNumber = `telprompt:${tmpNumber}`; }
            Linking.openURL(phoneNumber);
        }
    }
    render() {
        return(
            
            <View style={ styles.container }>
                { this.state.showTopButton &&
                    <TouchableOpacity 
                        style={styles.fixedUpButton}
                        onPress={e => this.upButtonHandler()}
                    >
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
       
                    <View style={{flex:1,marginTop:20}}>
                        <ImageBackground
                            source={require('../../../assets/images/introduce_2.png')}
                            resizeMode='contain'
                            style={{width:SCREEN_WIDTH,height:SCREEN_WIDTH/360*208}}
                        />
                        <View style={{position:'absolute',left:20,top:10,width:'60%',height:'100%'}}>
                            <CustomTextL style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20),color:'#494949'}}>안녕하세요{"\n"}
                                <CustomTextB style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20),color:DEFAULT_COLOR.base_color}}>헥사곤</CustomTextB>입니다.
                            </CustomTextL>
                        </View>
                    </View>
                    <View style={{flex:1,marginHorizontal:20}}>
                        <View style={{flex:1,alignItems:'center',justifyContent:'center',paddingVertical:20}}>
                            <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#363636'}}>헥사곤은 고객님의 소중한 의견을 기다립니다.</CustomTextM>
                        </View>
                        
                        <View style={{flex:1,alignItems:'center',justifyContent:'center',paddingVertical:10}}>
                            <CustomTextL style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#363636'}}>문의사항이 있을시 하단의 문의하기 버튼을 통해 연락주세요!</CustomTextL>
                        </View>
                    </View>
                    <View style={{flex:1,height:50,backgroundColor:'#fff'}}></View>
                </ScrollView>
                
                <TouchableOpacity 
                    style={{position:'absolute',right:0,bottom:0,width:SCREEN_WIDTH,height:DEFAULT_CONSTANTS.BottomHeight,backgroundColor:DEFAULT_COLOR.base_color,justifyContent:'center',alignItems:'center'}}
                    onPress={() => this.callRequest()}
                >
                    <CustomTextB style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#fff'}}>문의하기 </CustomTextB>
                </TouchableOpacity>
            </View>
        );
    }
}


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

    boxWrap : {
        width:'100%',justifyContent:'center',alignItems:'center',borderWidth:1,borderColor:'#979797',borderRadius:15,paddingVertical:15,marginBottom:5
    },
    selectBoxWrap : {
        width:'100%',justifyContent:'center',alignItems:'center',borderWidth:1,borderColor:DEFAULT_COLOR.base_color,borderRadius:15,paddingVertical:15,marginBottom:5
    },

    defaultFont : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#3e3e3e'
    },

    selectedFont : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:DEFAULT_COLOR.base_color
    }
    
   
    
});

