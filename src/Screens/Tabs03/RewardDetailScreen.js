import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Text,Dimensions,PixelRatio,TouchableOpacity} from 'react-native';
import 'moment/locale/ko'
import  moment  from  "moment";
import Clipboard from '@react-native-community/clipboard'
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

const currentDate =  moment().format('YYYY.MM.DD HH:MM');

const mockData1 = [
    { id: 1, date : '2020.11.12', title : '신규주문 5,000원', point : 5600 , rate : 0.5},
    { id: 2, date : '2020.11.12', title : '친구초대', point : -5600 , rate : null},
    { id: 3, date : '2020.11.12', title : '친구초대', point : 5600 , rate : 0.5},
]

export default  class RewardDetailScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading : true,
            rewardData : {}
        }
    }

    UNSAFE_componentWillMount() {
        
        //console.log('RewardDetailScreen',this.props.extraData.params.screenData)
        if ( !CommonUtil.isEmpty(this.props.extraData.params.screenData)) {
            this.setState({
                rewardData : this.props.extraData.params.screenData
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


    clipboardCode = ( code ) => {
        Clipboard.setString(code);        
        CommonFunction.fn_call_toast('복사되었습니다.', 2000);
    }

    render() {
        if ( this.state.loading ) {
            return (
                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} /> 
            )
        }else {  
            return(
                <SafeAreaView style={ styles.container }>
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
                    
                    <View style={styles.mainWrap}>
                        <View style={[styles.boxWrap,{marginTop:15}]}>
                            <View style={styles.boxDataWarp}>
                                <CustomTextB style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize17),color:DEFAULT_COLOR.base_color_666}}>{this.state.rewardData.username}</CustomTextB>
                            </View>
                            <View style={styles.boxDataWarp}>
                                <View style={styles.codeBoxWrap}>
                                    <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize28),color:'#3272ff'}}>{this.state.rewardData.userCode}</CustomTextM>
                                </View>
                            </View>                            
                            <View style={styles.boxDataWarp}>
                                <TouchableOpacity
                                    onPress={()=>this.clipboardCode(this.state.rewardData.userCode)} 
                                    style={styles.codeCopyBoxWrap}
                                >
                                    <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize17),color:'#fff'}}>코드복사</CustomTextM>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={styles.mainWrap2}>
                        <View style={styles.boxWrap}>
                            <View style={{paddingVertical:5,alignItems:'center',justifyContent:'center'}}>
                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#000'}}>초대 적립금 현황</CustomTextR>
                            </View>
                            <View style={{paddingVertical:5,alignItems:'center',justifyContent:'center'}}>
                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20),color:'#000'}}>{CommonFunction.currencyFormat(this.state.rewardData.sales*0.05)}원</CustomTextR>
                            </View>
                        </View>
                    </View>
                    <View style={styles.mainWrap2}>
                        <View style={[styles.boxWrap,{padding:0}]}>
                            {
                            mockData1.map((item, index) => {  
                                return (
                                    <View style={styles.historyBoxWrap} key={index}>
                                        <View style={{flex:1,paddingVertical:5}}>
                                            <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#000'}}>{item.date}</CustomTextR>
                                        </View>
                                        <View style={{flexDirection:'row',paddingVertical:5}}>
                                            <View style={{flex:1,justifyContent:'center'}}>
                                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#000'}}>{item.title}</CustomTextR>
                                            </View>
                                            <View style={{flex:1,justifyContent:'center',alignItems:'flex-end'}}>
                                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#000'}}>{CommonFunction.currencyFormat(item.point)} 원</CustomTextR>
                                                { !CommonUtil.isEmpty(item.rate) &&
                                                <CustomTextR style={styles.dataText3}>{item.rate}%</CustomTextR>
                                                }
                                            </View>
                                        </View>
                                    </View>
                                )
                            })
                            }
                            
                        </View>
                    </View>
                    </ScrollView>
                </SafeAreaView>
            );
        }
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainWrap : {        
        marginHorizontal : 15,marginVertical:5
    },
    mainWrap2 : {        
        marginVertical:5
    },
    boxWrap : {
        padding:15,backgroundColor:'#fff',minHeight:60,marginBottom:10,borderRadius:5,
        ...Platform.select({
            ios: {
              shadowColor: "#ccc",
              shadowOpacity: 0.5,
              shadowRadius: 2,
              shadowOffset: {
                height: 0,
                width: 0.1
             }
           },
            android: {
              elevation: 5
           }
         })
    },
    boxText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),color:'#000'
    },
    boxDataWarp : {
        paddingVertical:5,justifyContent:'center',alignItems:'center'
    },
    codeBoxWrap : {
        flex:1,maxWidth:SCREEN_WIDTH/2,padding:10,justifyContent:'center',alignItems:'center',borderWidth:1,borderColor:'#3272ff'
    },
    codeCopyBoxWrap: {
        flex:1,maxWidth:SCREEN_WIDTH/2,paddingVertical:10,paddingHorizontal:20,justifyContent:'center',alignItems:'center',borderWidth:1,borderColor:'#0059a9',backgroundColor:'#0059a9'
    },
    historyBoxWrap : {
        paddingVertical:10,paddingHorizontal:20,borderBottomWidth:1,borderBottomColor:DEFAULT_COLOR.input_border_color
    },
    dataText3 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),color:'#7f7f7f'
    },
});