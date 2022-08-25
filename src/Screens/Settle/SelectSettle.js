import React, { useState,useContext,createContext } from 'react';
import {View,PixelRatio,TouchableOpacity,Dimensions,StyleSheet,Image
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const BASE_HEIGHY = Platform.OS === 'ios' ? 110 : 100;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextB,CustomTextR} from '../../Components/CustomText';
import CommonFunction from '../../Utils/CommonFunction';

const settleItems = [
    { index :1, title : '신용/체크카드' , icon : 30, code : 'card' ,seleced : true},
    { index :2, title : '무통장입금' , icon : 35 ,code : 'vbank',seleced : false},
    { index :3, title : '실시간계좌이체' , icon : 66,code : 'trans',seleced : false }    
]

const UserTokenContext = createContext({
    selectedMethod: '',
    setMethode: () => {}
});
  

const  ModalChagneMethode = (props) => {              
    console.log('ModalChagneMethode', props.screenState)
    const [selectedMethod, setMethode] = useState('');

    const renderImages = (data) => {
        switch(data) {
            case 'card' : return require('../../../assets/icons/icon_payment_card.png'); break;
            case 'vbank' : return require('../../../assets/icons/icon_payment_bank.png'); break;
            case 'trans' : return require('../../../assets/icons/icon_payment_realtime.png'); break;
            default : return require('../../../assets/icons/icon_payment_realtime.png'); break;
        }
    }
    
    return (
        <View style={styles.settleMethodeWrapper}>
            {settleItems.map((data, mindex) => {
            return (
                <TouchableOpacity 
                    style={data.code === selectedMethod ? styles.selectSettleMethode : styles.unselectSettleMethode} 
                    key={mindex}
                    onPress= {()=> {
                        setMethode(data.code);
                        props.screenState(data.code);
                    }}
                    >
                        <Image
                            source={renderImages(data.code)}
                            style={{width:'80%',height:35,marginBottom:10}}
                            resizeMode='contain'
                        />
                        <CustomTextR style={data.code === selectedMethod ? styles.selectSettleText : styles.unSelectSettleText }>{data.title}</CustomTextR>
                </TouchableOpacity>
                )
            })
            }  
        </View>
    )
}

const SelectSettle = (props) => {  
    const [selectedParentMethod, setParentMethode] = useState('');

    return (
        <View style={styles.container}>
            <View style={styles.postcodeWrapper}>
                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#494949'}}>결제하기</CustomTextR>  
                <TouchableOpacity 
                    onPress= {()=> props.screenState.closeModal()}
                    style={{position:'absolute',top:0,right:15,width:30,height:30}}>
                    <Icon name="close" size={30} color="#555" />
                </TouchableOpacity>
            </View>
            <View style={{flex:1,margin:15}}>
                <View style={{flex:0.2,paddingBottom:10}}>
                    <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#494949',paddingVertical:2}}>결제금액 : {CommonFunction.currencyFormat(props.screenState.selectedInfo.price)}</CustomTextR>                
                </View>
                <View style={{flex:1,paddingBottom:10}}>
                    <ModalChagneMethode screenState={setParentMethode}/>
                </View>
                <View style={{flex:1,paddingBottom:10}}>
                    <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#494949',paddingVertical:2}}>다시한 번 정보 확인 후 결제를 진행해주세요</CustomTextR>                
                </View>
            </View>

            <TouchableOpacity 
                style={{position:'absolute',right:0,bottom:0,width:SCREEN_WIDTH,height:50,backgroundColor:DEFAULT_COLOR.base_color,justifyContent:'center',alignItems:'center'}}
                onPress={()=> props.screenState.onPressCallPg(selectedParentMethod)}
            >
                <CustomTextB style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#fff'}}>결제하기</CustomTextB>
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {        
        flex: 1,        
    },
    postcodeWrapper : {
        paddingTop:5,paddingBottom:10,alignItems:'center',justifyContent:'center',borderBottomColor:'#ccc',borderBottomWidth:1
    },
    settleMethodeWrapper : {
        flex:1,flexDirection:'row',flexWrap:'wrap',padding:5
    },
    selectSettleMethode : {
        width:SCREEN_WIDTH/3-20,paddingVertical:10,alignItems:'center',justifyContent:'center',marginRight:5,marginBottom:5,borderWidth:1, borderColor:DEFAULT_COLOR.base_color,borderRadius:5
    },
    unselectSettleMethode : {
        width:SCREEN_WIDTH/3-20,paddingVertical:10,alignItems:'center',justifyContent:'center',marginRight:5,marginBottom:5,borderWidth:1, borderColor:'#ebebeb',borderRadius:5
    },
    selectSettleText : {
        color:DEFAULT_COLOR.base_color,fontWeight:'bold',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),letterSpacing:PixelRatio.roundToNearestPixel(-0.7)
    },
    unSelectSettleText : {
        color:'#222',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),letterSpacing:PixelRatio.roundToNearestPixel(-0.7)
    },

  
});

export default SelectSettle;