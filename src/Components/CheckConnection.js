
import React from 'react';
import {PixelRatio,View,StyleSheet,Text,Image,TouchableOpacity,Dimensions} from 'react-native';
import * as NetInfo from "@react-native-community/netinfo";
import {Button} from 'react-native-elements';
const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;

export default  class CheckConnection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isConnected : true,
        }
    }

    componentDidMount() {    
        NetInfo.addEventListener(this.handleConnectChange); 
    }
    UNSAFE_componentWillUnmount() { 
        NetInfo.removeEventListener(this.handleConnectChange)
    }
    handleConnectChange = state => {
        this.setState({isConnected:state.isConnected})
    }

    checkNetwork = async() => {
        if (Platform.OS === "android") {
            NetInfo.addEventListener(state => {                                
                this.setState({isConnected: state.isConnected});
            });
        }else{
            NetInfo.isConnected.addEventListener(
            "connectionChange",
                this.handleFirstConnectivityChange
            );
        }
        
    }

    handleFirstConnectivityChange = isConnected => {
        NetInfo.isConnected.removeEventListener(
          "connectionChange",
          this.handleFirstConnectivityChange
        );        
        this.setState({isConnected: isConnected});        
    };

    render () {
        if ( this.state.isConnected ) {
            return null;
        }else{
            return (
                <View style={ styles.container }>
                    <TouchableOpacity 
                        style={{flex:1,width:SCREEN_WIDTH,height:SCREEN_HEIGHT,justifyContent: 'center',alignItems: 'center'}} 
                        onPress={()=> this.forceUpdate()}>
                        <Image source={require('../../assets/icons/icon_network.png')} resizeMode='contain' style={{width:75,height:50}} />
                        <View style={{marginVertical:20,alignItems:'center',justifyContent:'center'}}>
                            <Text stlye={{paddingVertical:20,color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_large)}}>네트워크에 접속할 수 없습니다.</Text>
                            <Text style={styles.networkSubText}>네트워크 연결 상태를 확인해 주세요</Text>
                        </View>
                        <View>
                            <Button 
                                title=' 재시도 ' 
                                style={{borderColor:'#ccc'}}
                                onPress= {()=> this.checkNetwork()}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            )
        }
    }

}


const styles = StyleSheet.create({
    container: {
        position:'absolute',
        left:0,top:0,
        backgroundColor:'#fff',
        width : SCREEN_WIDTH,
        height :  SCREEN_HEIGHT-100,
        zIndex : 9999
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
});