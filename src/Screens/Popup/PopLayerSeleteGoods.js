import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Alert,Dimensions,PixelRatio,Image,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import {CheckBox,Input} from 'react-native-elements';
import LinearGradient from "react-native-linear-gradient";
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR} from '../../Components/CustomText';
import CommonUtil from '../../Utils/CommonUtil';
import CommonFunction from '../../Utils/CommonFunction';


export default  class PopLayerSelectGoods extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            selectedCategory : 1,
            topMenu  : [
                {index:1,title : '전체',code : 1},
                {index:2,title : '아릭스',code : 2},
                {index:3,title : '드라이막',code : 3},
                {index:4,title : '라코로나',code : 4},
                {index:5,title : '클린로직',code : 5}
            ],
            mockData1 : [
                { id: 1, icon : require('../../../assets/images/sample001.png'),name : '아릭스 수세미 1',price : 1000, pcode  : 2},
                { id: 2, icon : require('../../../assets/images/sample001.png'),name : '아릭스 수세미 2',price : 1200, pcode  : 2},
                { id: 3, icon : require('../../../assets/images/sample001.png'),name : '아릭스 수세미 3',price : 1300, pcode  : 3},
                { id: 4, icon : require('../../../assets/images/sample001.png'),name : '아릭스 수세미 4',price : 1400, pcode  : 4},
                { id: 5, icon : require('../../../assets/images/sample001.png'),name : '아릭스 수세미 5',price : 1500, pcode  : 5},
            ]
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
            this.props.screenState.closepopLayer2(this.state.isAllMode)
        }
        
    }

    selectSampleKeyword = async(item,idx) => {
        if ( item.code === 0) {

        }else{

        }
        this.setState({selectedCategory : item.index});
    }

    checkItem = (item,idx) => {
        //console.log('item',item),
        this.state.mockData1[item.id-1].checked = !item.checked;
        this.setState({loading:false})
     }
   
    render() {
        let mockData1 = this.state.selectedCategory === 1 ? this.state.mockData1 : this.state.mockData1.filter((info) => info.pcode === this.state.selectedCategory);  ;
        return(
            <View style={ styles.container }>
                <View style={{flex:0.4,justifyContent:'center',alignItems:'center',borderBottomColor:'#ccc',borderBottomWidth:1}}>
                    <TouchableOpacity 
                        onPress={()=> this.props.screenState.closepopLayer2()}
                        hitSlop={{left:10,right:5,top:10,bottom:20}}
                        style={{position:'absolute',top:0,right:0,width:30,height:30}}
                    >
                        <Image
                            source={require('../../../assets/icons/btn_close.png')}
                            resizeMode={"contain"}
                            style={{width:PixelRatio.roundToNearestPixel(25),height:PixelRatio.roundToNearestPixel(25)}}
                        />
                    </TouchableOpacity>
                    <View style={{width:'100%',paddingLeft:20}}>
                        <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#333'}}>이벤트 상품 선택</CustomTextM>
                    </View>
                </View>
                <View style={{flex:0.4,minHeight:10,justifyContent:'center',alignItems:'center',marginTop:5}}>
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    >
                    {
                        this.state.topMenu.map((xitem,xindex)=> {
                            return (
                                <View
                                    key={xindex}
                                    style={
                                        this.state.selectedCategory === xitem.index
                                            ? styles.sampleContainerOn
                                            : styles.sampleContainer
                                    }>
                                    <TouchableOpacity
                                        onPress={()=>this.selectSampleKeyword(xitem,xindex)}
                                        style={this.state.selectedCategory === xitem.index ? styles.sampleWrapperOn: styles.sampleWrapper}>
                                        {
                                            this.state.selectedCategory === xitem.index
                                                ?
                                                <CustomTextB
                                                    style={styles.smapleTextOn}>
                                                    {xitem.title}
                                                </CustomTextB>
                                                :
                                                <CustomTextR
                                                    style={styles.smapleText}>
                                                    {xitem.title}
                                                </CustomTextR>
                                        }
                                    </TouchableOpacity>
                                    <View style={
                                        this.state.selectedCategory === xitem.index
                                            ? styles.sampleBorderOn
                                            : styles.sampleBorder
                                    }>

                                    </View>
                                </View>
                            )
                            
                        })
                    }
                    </ScrollView>
                    <LinearGradient
                        colors={["rgba(255,255,255,1)", "rgba(255,255,255,0.5)", "rgba(255,255,255,0)"]}
                        locations={[0, 0.5, 1]}
                        style={{position: "absolute", height: "100%", width:30, right:0,bottom:2}}
                    />
                </View>
                <View style={{flex:4}}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        indicatorStyle={'white'}
                    >
                         
                        <View style={{width:SCREEN_WIDTH-50}}>
                            {
                            mockData1.map((item, index) => {  
                                return (
                                    <View key={index} style={styles.boxSubWrap}>
                                        <View style={styles.boxLeftWrap}>
                                            <CheckBox 
                                                containerStyle={{padding:0,margin:0}}   
                                                iconType={'FontAwesome'}
                                                checkedIcon={<Image source={require('../../../assets/icons/checkbox_on.png')} />}
                                                uncheckedIcon={<Image source={require('../../../assets/icons/checkbox_off.png')} />}
                                                checkedColor={DEFAULT_COLOR.base_color}                          
                                                checked={item.checked}
                                                size={PixelRatio.roundToNearestPixel(15)}                                    
                                                onPress={() => this.checkItem(item,index)}
                                            />
                                        </View>
                                        <View style={styles.boxLeftWrap}>
                                            <Image
                                                source={item.icon}
                                                resizeMode={"contain"}
                                                style={{width:PixelRatio.roundToNearestPixel(55),height:PixelRatio.roundToNearestPixel(55)}}
                                            />
                                            
                                        </View>
                                        <View style={styles.boxRightWrap}>
                                            <CustomTextR style={[styles.menuTitleText,{paddingLeft:20}]}>{item.name}</CustomTextR>
                                            <CustomTextR style={[styles.menuTitleText,{paddingLeft:20}]}>{CommonFunction.currencyFormat(item.price)}원</CustomTextR>
                                        </View>
                                       
                                    </View>
                                )
                            })
                        } 
                        </View>
                       
                   </ScrollView>
                </View> 
                <View style={{flex:1,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                    <TouchableOpacity 
                        onPress={()=> this.props.screenState.closepopLayer2()}
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
    },
    sampleContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    sampleContainerOn: {
        flex: 1,
        justifyContent: 'center',
    },
    sampleBorderOn: {
        alignSelf: 'center',
        width: '80%',
        height: 2,
        backgroundColor: DEFAULT_COLOR.base_color,
    },
    sampleBorder: {
        width: '100%',
        height: 1,
        backgroundColor: DEFAULT_COLOR.input_border_color,
    },
    sampleWrapper : {
        marginHorizontal:5,
        paddingVertical:10,
        paddingHorizontal:10,
        backgroundColor:'transparent',
    },
    sampleWrapperOn : {
        marginHorizontal:5,
        paddingVertical:10,
        paddingHorizontal:10,
        backgroundColor:'#fff',
    },
    smapleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),
        lineHeight: PixelRatio.roundToNearestPixel(7.1),
        letterSpacing: -0.95,
    },
    smapleTextOn : {
        color:DEFAULT_COLOR.base_color,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),
        lineHeight: PixelRatio.roundToNearestPixel(7.1),
        letterSpacing: -0.95,
    },
    itemWrap : {                
        marginHorizontal:10,        
        borderBottomWidth:1,
        borderBottomColor:'#ccc',
        marginVertical:10,        
        paddingVertical:10
    },

    fixedWriteButton : {
        position:'absolute',bottom:70,right:20,width:50,height:50,backgroundColor:'#222',alignItems:'center',justifyContent:'center',zIndex:2,borderColor:'#ccc',borderWidth:1,borderRadius:25,opacity:0.8
    },
    fixedWriteButton2 : {
        position:'absolute',bottom:70,right:20,width:50,height:50,backgroundColor:'#222',alignItems:'center',justifyContent:'center',zIndex:3,borderColor:'#ccc',borderWidth:1,borderRadius:25,
    },

    slideCommonWrap: {        
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal:5,
        marginVertical:2,
        paddingHorizontal:5,
        paddingVertical:7,
        backgroundColor:'#fff',
        borderWidth:1,
        borderColor:DEFAULT_COLOR.input_border_color,
        borderRadius:5
    },

    boxSubWrap : {
        flex:1,
        flexDirection:'row',    
        flexGrow:1,    
        paddingVertical: Platform.OS === 'android' ? 5 : 15,
        alignItems: 'center',        
        borderBottomWidth:1,
        borderBottomColor : DEFAULT_COLOR.input_border_color
    },
    boxLeftWrap : {
        flex:1,        
        justifyContent:'center',
        alignItems:'center'
    },
    boxRightWrap : {
        flex:5,        
        justifyContent:'center',
        alignItems:'flex-start'
    },
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),paddingRight:10
    },
});