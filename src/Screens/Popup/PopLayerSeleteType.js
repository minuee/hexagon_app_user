import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Alert,Dimensions,PixelRatio,Image,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import {CheckBox,Input} from 'react-native-elements';
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR} from '../../Components/CustomText';
import CommonUtil from '../../Utils/CommonUtil';
import CommonFunction from '../../Utils/CommonFunction';

export default  class PopLayerSelectType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            isAllMode : null,
            
        }
    }

    UNSAFE_componentWillMount() {
        if ( !CommonUtil.isEmpty(this.props.screenState.formPopupType)) {
            this.setState({
                isAllMode : this.props.screenState.formPopupType
            })
        }
    }  
   
    selectMember = async() =>  {
        if ( CommonUtil.isEmpty(this.state.isAllMode)) {
            Alert.alert(
                "팝업창 유형선택",      
                "팝업창 유형을 선택해주세요",
                [
                    {text: 'OK', onPress: () => console.log('Cancle')},
                    
                ],
                { cancelable: true }
            )  
           
        }else{
            this.props.screenState.closepopLayer(this.state.isAllMode)
        }
        
    }

    setAlltime = (mode) => {
        this.setState({
            isAllMode : mode
        })
    }

   
    render() {
        return(
            <View style={ styles.container }>
                <View style={{flex:0.5,justifyContent:'center',alignItems:'center',borderBottomColor:'#ccc',borderBottomWidth:1}}>
                    <TouchableOpacity 
                        onPress={()=> this.props.screenState.closepopLayer()}
                        hitSlop={{left:10,right:5,top:10,bottom:10}}
                        style={{position:'absolute',top:0,right:0,width:22,height:22}}
                    >
                        <Image
                            source={require('../../../assets/icons/btn_close.png')}
                            resizeMode={"contain"}
                            style={{width:PixelRatio.roundToNearestPixel(25),height:PixelRatio.roundToNearestPixel(25)}}
                        />
                    </TouchableOpacity>
                    <View style={{height:35,width:'100%',paddingLeft:20}}>
                    <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#333'}}>팝업창 유형 선택</CustomTextM>
                    </View>
                </View>
                <View style={{flex:4}}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        indicatorStyle={'white'}
                    >
                        <View style={{flexDirection:'row',flexGrow:1,marginTop:10,paddingTop:10}}>
                            <CheckBox 
                                containerStyle={{padding:0,margin:0}}   
                                iconType={'FontAwesome'}
                                checkedIcon={<Image source={require('../../../assets/icons/checkbox_on.png')} />}
                                uncheckedIcon={<Image source={require('../../../assets/icons/checkbox_off.png')} />}
                                checkedColor='#00c7e5'                          
                                checked={this.state.isAllMode === 'A' ? true : false}
                                size={PixelRatio.roundToNearestPixel(15)}                                    
                                onPress={() => this.setAlltime('A')}
                            />
                            <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#000',lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20)}}>레이어 팝업창</CustomTextR>
                        </View>
                        <View style={{paddingHorizontal:20,marginBottom:20}}>
                            <Image
                                source={require('../../../assets/images/type_popup.png')}
                                resizeMode={"contain"}
                                //style={{width:SCREEN_WIDTH-40,height:SCREEN_WIDTH/4*3}}
                                style={{flex:1,height:200,aspectRatio: 1}}
                            />
                        </View> 

                        <View style={{flexDirection:'row',flexGrow:1,marginTop:10,paddingTop:10}}>
                            <CheckBox 
                                containerStyle={{padding:0,margin:0}}   
                                iconType={'FontAwesome'}
                                checkedIcon={<Image source={require('../../../assets/icons/checkbox_on.png')} />}
                                uncheckedIcon={<Image source={require('../../../assets/icons/checkbox_off.png')} />}
                                checkedColor='#00c7e5'                          
                                checked={this.state.isAllMode === 'B' ? true : false}
                                size={PixelRatio.roundToNearestPixel(15)}                                    
                                onPress={() => this.setAlltime('B')}
                            />
                            <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#000',lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20)}}>전면 팝업창</CustomTextR>
                        </View>
                        <View style={{paddingHorizontal:20,marginBottom:20}}>
                            <Image
                                source={require('../../../assets/images/type_fullscreen.png')}
                                resizeMode={"contain"}
                                //style={{width:SCREEN_WIDTH-40,height:SCREEN_WIDTH/4*3}}
                                style={{flex:1,height:200,aspectRatio: 1}}
                            />
                        </View> 
                       
                   </ScrollView>
                </View> 
                <View style={{flex:1,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                    <TouchableOpacity 
                        onPress={()=> this.props.screenState.closepopLayer()}
                        style={{width:80,backgroundColor:'#e1e1e1',justifyContent:'center',alignItems:'center',padding:5,marginRight:5}}
                    >
                        <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#9f9f9f'}}>취소</CustomTextM>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={()=>this.selectMember()}
                        style={{width:80,backgroundColor:DEFAULT_COLOR.base_color,justifyContent:'center',alignItems:'center',padding:5}}
                    >
                        <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#fff'}}>선택</CustomTextM>
                    </TouchableOpacity>
                    
                </View>                   
            </View>
        );
    }
}



const styles = StyleSheet.create({
    container: {
        flex:1
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        //backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputBlankNull : {
        borderWidth:1,borderColor:'#fff'
    },
    inputBlank : {
        borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color,borderRadius:5,backgroundColor:'#fff',marginVertical:7,height:41
    },
    boxAbsentWrap : {
        width:SCREEN_WIDTH/4,marginBottom:10
    }
});