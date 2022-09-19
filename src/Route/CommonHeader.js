import React from 'react';
import {StyleSheet,SafeAreaView,Platform,Image,View,TouchableOpacity,Dimensions,StatusBar,Text,ScrollView,Animated,PixelRatio,TextInput,BackHandler} from 'react-native';
import { Overlay } from 'react-native-elements';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import {connect} from 'react-redux';
import ActionCreator from '../Ducks/Actions/MainActions';

const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");
const LOGO_IMAGE = require('../../assets/icons/logo.png');
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../Constants';
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
import CommonFunction from '../Utils/CommonFunction';

const BASE_HEIGHY = Platform.OS === 'android' ? 100 : CommonFunction.isIphoneX() ? 150 : 110;

class CommonHeader extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            showModal : false,
            headerHeight : BASE_HEIGHY,
        } 
    }

    static navigationOptions = () => {
        return {
            header: null
        };
    };
  
    async UNSAFE_componentWillMount() {
    }
    
    componentDidMount() {
        
    }

    UNSAFE_componentWillUnmount() { 
    
    }
    onLayoutHeader = (evt ) => {
        
        //console.log('height',evt.nativeEvent.layout.height);
        this.setState({headerHeight : evt.nativeEvent.layout.height});
    }
    render() {
        return (
           <SafeAreaView style={styles.Rootcontainer} onLayout={(e)=>this.onLayoutHeader(e)}>

                <View style={styles.container}>
                    <TouchableOpacity 
                        style={{flex:1,justifyContent:'center'}}
                    >
                        <Image 
                            source={require('../../assets/icons/icon_user_on.png')}
                            resizeMode={'contain'}
                            style={{width:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize22),height:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize22)}}
                        />               
                    </TouchableOpacity>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <Image
                            source={LOGO_IMAGE}
                            resizeMode={"contain"}
                            style={Platform.OS === 'android' ? {height:50} : {height:'80%'}}
                        />
                    </View>
                    <TouchableOpacity 
                        style={{flex:1,justifyContent:'center',alignItems:'flex-end'}}
                    >
                        <Image 
                            source={require('../../assets/icons/icon_cart.png')}
                            resizeMode={'contain'}
                            style={{width:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize22),height:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize22)}}
                        />               
                    </TouchableOpacity>
   
                </View>
           </SafeAreaView>
       )        
    }
}




const styles = StyleSheet.create({
    /**** Modal  *******/
    modalContainer: {   
        elevation : 2,
        zIndex : 9999,
        position :'absolute',
        left:-1,
        //top : BASE_HEIGHY,
        width:SCREEN_WIDTH,
        height: SCREEN_HEIGHT-200,
        paddingTop: 16,
        backgroundColor: '#fff',
        borderBottomColor : '#ccc',
        borderBottomWidth:0.5
    },

    modalContainer2: {   
        zIndex : 9999,
        position :'absolute',
        width:SCREEN_WIDTH,
        paddingTop: 16,
        backgroundColor: '#fff',
        borderBottomColor : '#ccc',
        borderBottomWidth:0.5
    },
    Rootcontainer: {
      flex: 1,      
      //justifyContent: 'center',
      //alignItems: 'center',      
      height : 100,
      zIndex : 9999,
      overflow:'hidden',
      width:SCREEN_WIDTH,
      marginLeft: Platform.OS === 'android' ? -15 : 0 ,      
      //backgroundColor:'#ff0000'
    },
    container : {  
        height : 44,
        paddingHorizontal:20,
        paddingVertical:3,
        width:'100%',
        flexDirection:'row'
    },
    inputText: {
        width: '90%',
        //padding: 0,
        //paddingVertical: Platform.OS === 'ios' ? 16 : 10,
        paddingVertical: 5,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),
        letterSpacing: -0.7,
        justifyContent: 'center',
        alignItems: 'center',
        
      },
      boxWrap : {
        width:SCREEN_WIDTH/7,justifyContent:'center',alignItems:'center',
        borderWidth:0.3,borderColor:'#091e4b',borderRadius:3,padding:4
      },

      fileterBoxWrap : {
        width:SCREEN_WIDTH/6,justifyContent:'center',alignItems:'center',
        borderWidth:0.3,borderColor:'#a3a3a3',borderRadius:3,padding:4,backgroundColor:'#a3a3a3',margin:2
      },
      fileterUnBoxWrap : {
        width:SCREEN_WIDTH/6,justifyContent:'center',alignItems:'center',
        borderWidth:0.3,borderColor:'#a3a3a3',borderRadius:3,padding:5,backgroundColor:'#fff',margin:2
      },
      filterUnBoxText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize9),color:'#adadad'
      },
      filterBoxText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize9),color:'#fff'
      }
      
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
        }
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(CommonHeader);
