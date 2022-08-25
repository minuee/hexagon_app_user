import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Animated,Dimensions,PixelRatio,TouchableOpacity,Image,Linking,Alert} from 'react-native';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import 'moment/locale/ko'
import  moment  from  "moment";
import {Overlay,CheckBox} from 'react-native-elements';
import Modal from 'react-native-modal';

import Icon2 from 'react-native-vector-icons/Entypo';
Icon2.loadFont();
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
import CustomAlert from '../../Components/CustomAlert';
import { Platform } from 'react-native';
const CHECKNOX_OFF = require('../../../assets/icons/checkbox_off.png');
const CHECKNOX_ON = require('../../../assets/icons/checkbox_on.png');
import SlidingPanel from './SlidingPanel';




const HeaderNewContent = 100;
const IMAGE_HEIGHT = 250 ;
const HEADER_HEIGHT = Platform.OS === "ios" ? (CommonFunction.isIphoneX() ? 84 : 64 ) : 50 ;
const SCROLL_HEIGHT = IMAGE_HEIGHT - HEADER_HEIGHT + HeaderNewContent;
const THEME_COLOR = DEFAULT_CONSTANTS.baseColor;//"rgba(85,186,255, 1)";
const THEME_TEXT_COLOR = DEFAULT_COLOR.base_color_222;
const FADED_THEME_COLOR = "rgba(85,186,255, 0.8)";

const TAB_BAR_HEIGHT = CommonFunction.isIphoneX() ? 50 : 45;//Platform.OS === 'ios' ? 30 : 20;

const HEADER_BLANK = 50;
const CONTAINER_HEIGHT = SCREEN_HEIGHT*0.3;
const ChangePositionY = SCREEN_HEIGHT*0.8;
const ChangeLimitY = SCREEN_HEIGHT*0.8;

const orderSeq = [
    { id: 1, title : '낱개' , menu :'A' ,price : 1050 },
    { id: 2, title : '박스' , menu :'B' ,price : 8050 },
    { id: 3, title : '카톤' , menu :'C' ,price : 102000},
]




class ProductDetailScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading : true,
            showModal : false,
            showCartForm : false,
            productData : {},
            orderCount : 1,
            orderSeq : 'A',
            orderSetData : {title : '낱개' , menu :'A' ,price : 1050},
            moreSellerHeight : SCREEN_HEIGHT*0.4,
            bottombar3 : false,
            mockData1 : 
            { id: 1, icon : require('../../../assets/images/sample001.png'),name : '아릭스 수세미 1',child : [
                {id :1,price : 1000,unit : '낱개',count : 1,totalPrice : 1000},
                {id :2,price : 5800,unit : '박스',count : 1,totalPrice : 5800},
                {id :3,price : 150000,unit : '카톤',count : 1,totalPrice : 150000}
            ]},
            selectedArray : [],
            selectedTotalAmount : 0,
            //poplayer
            
        }
    }

    clickCancle = () => {
        this.setState({popLayerView : false})
    }
    showPopLayer = async() => {
        if ( this.state.selectedTotalAmount === 0 ) {
           CommonFunction.fn_call_toast('최소 1개이상 선택을 해주세요',2000);
        }else{
            this.setState({popLayerView : true})
        }
        
    } 
    closePopLayer = async() => {        
        this.setState({popLayerView : false})
        this.requestService();
    } 
    requestService = async() => {
        let tmpNumber = DEFAULT_CONSTANTS.CompanyInfoTel
        if ( !CommonUtil.isEmpty(tmpNumber)) {
            let phoneNumber = '';
            if (Platform.OS === 'android') { phoneNumber = `tel:${tmpNumber}`; }
            else {phoneNumber = `telprompt:${tmpNumber}`; }
            Linking.openURL(phoneNumber);
        }
    }


    UNSAFE_componentWillMount() {
        
        if ( !CommonUtil.isEmpty(this.props.extraData.params.screenData)) {
            this.setState({
                productData : this.props.extraData.params.screenData
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

    fn_onChangeToggle = (bool) => {
        this.setState({switchOn1 : bool})
    }

    orderCount = (mode) => {
        let orderCount = this.state.orderCount;
        if ( mode === 'minus') {
            if ( orderCount > 1 ) {
                this.setState({
                    orderCount : orderCount-1
                })
            }
        }else{
            this.setState({
                orderCount : orderCount+1
            })
        }
    }

    animatedHeight = new Animated.Value(SCREEN_HEIGHT * 0.5);
    
    closeModal = () => {
        this.setState({
            showModal :false
        })
    };

    checkItemModal = (item) => {
        this.setState({orderSeq:item.menu,orderSetData:item})
    }

    selectOrderSeq = async(mode) => {
        //console.log('selectOrderSeq',mode);
        this.closeModal();
    }

    openModal = async() => {
 
        if ( CommonUtil.isEmpty(this.props.userToken)) {
            Alert.alert('', '로그인이 필요합니다.\n로그인 하시겠습니까?',
            [
                {text: '확인', onPress: () => this.props.navigation.navigate('SignInStack', {screenData : {routeName: 'ProductDetailStack',routeIdx:1}})},
                {text: '취소', onPress: () => console.log('로그인 취소')},
            ]);
        }else{
            this.setState({showCartForm:true});
        }
        
    }

    pageScroll = (event) => {                    
        
        if ( event.nativeEvent.pageY <= HEADER_BLANK ) {
            this.setState({bottombar3 : true}) 
        }else{
            this.setState({bottombar3 : false}) 
        }
    }


    onAnimationEnd = (val) => {
        //console.log('onAnimationEnd', val);
    }

    onMoveTop2 = async(bool) =>{    
        //console.log('onMoveTop2', this.state.bottombar3)
        if ( this.state.bottombar3 === false && bool) {
            this.setState({bottombar3: true});
        }else if ( this.state.bottombar3 === true && bool === false) {
            this.setState({bottombar3: false});
        }
    }
    onMoveTop = async(scrollInfo) =>{      
        if ( scrollInfo.dy < 0 && scrollInfo.moveY < ChangeLimitY )  {
            if ( this.state.bottombar3 === false ) {                
                this.setState({bottombar3: true});
            }
            
        }else if ( scrollInfo.dy > 0 && scrollInfo.moveY  >= ChangeLimitY+50  ) {
            if ( this.state.bottombar3 ) {
                this.setState({bottombar3: false});
            }
        }
        
    }

    orderCount = async(mode,tindex) => {
        this.setState({moreLoading:true})
        let orderCount = this.state.mockData1.child[tindex].count;
        let orderPrice = this.state.mockData1.child[tindex].price;
        if ( mode === 'minus') {
            if ( orderCount > 1 ) {               
                this.state.mockData1.child[tindex].count = orderCount-1;
                this.state.mockData1.child[tindex].totalPrice = orderPrice*(orderCount-1);
            }
        }else{
            this.state.mockData1.child[tindex].count = orderCount+1;
            this.state.mockData1.child[tindex].totalPrice = orderPrice*(orderCount+1);
        }
        if ( this.state.selectedArray.length > 0 ) {
            let returnArray = await this.state.mockData1.child.filter((info) => info.checked === true); 
            //console.log('returnArray', returnArray);
            await this.calTotalAmount(returnArray);
        }
        
        setTimeout(
            () => {            
                this.setState({
                    moreLoading:false,
                })
            },500
        )
    }

    calTotalAmount = async(returnArray) => {
        ///console.log('calTotalAmount', returnArray);
        let selectedTotalAmount = 0;
        await returnArray.forEach(function(element,index,array){ 
            selectedTotalAmount = selectedTotalAmount + element.totalPrice;
        }); 
       
        await this.setState({
            selectedArray : returnArray,
            selectedTotalAmount : selectedTotalAmount,
        })

        this.setState({ moreLoading:false})
    }

    checkItem = async(index) => {
        this.setState({moreLoading:true})
        let tarketId = this.state.mockData1.child[index].id;
        let orderChecked = this.state.mockData1.child[index].checked;
        if ( CommonUtil.isEmpty(orderChecked) || orderChecked === false) {
            let returnArray = this.state.selectedArray;
            await returnArray.push({
                id : this.state.mockData1.child[index].id,
                totalPrice : this.state.mockData1.child[index].totalPrice,
                checked : true
            })
            this.state.mockData1.child[index].checked = true;
            await this.calTotalAmount(returnArray);
        }else{
            this.setState({allChecked : false })
            let returnArray = await this.state.selectedArray.filter((info) => info.id !== tarketId); 
            this.state.mockData1.child[index].checked = false;
            await this.calTotalAmount(returnArray);
        }
    }


    render() {
        if ( this.state.loading ) {
            return (
                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} /> 
            )
        }else {  
            const BottomCartOption = () => {        
                return (
                    <View style={[styles.bottomBuyTextContentWrapper,{height : this.state.moreSellerHeight}]}>
                       
                            { this.state.mockData1.child.map((titem, tindex) => {  
                                let isIndexOf = this.state.selectedArray.findIndex(                
                                    info => ( info.id === titem.id )
                                ); 
                                return (
                                <View style={[styles.unitDefaultWrap,{flexDirection:'row'}]} key={tindex}>
                                    <View style={styles.checkboxLeftWrap}>
                                        <CheckBox 
                                            containerStyle={{padding:0,margin:0}}   
                                            iconType={'FontAwesome'}
                                            checkedIcon={<Image source={CHECKNOX_ON} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                            uncheckedIcon={<Image source={CHECKNOX_OFF} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                            checkedColor={DEFAULT_COLOR.base_color}                          
                                            checked={isIndexOf != -1 ? true : false}
                                            size={PixelRatio.roundToNearestPixel(15)}                                    
                                            onPress={() => this.checkItem(tindex)}
                                        />
                                    </View>
                                    <View style={styles.bottomBoxSubWrap} >
                                        <View style={{flex:1,justifyContent:'center',paddingVertical:5}}>
                                            <CustomTextB style={styles.menuTitleText}>{titem.unit}</CustomTextB>
                                            <TextRobotoR style={styles.menuTitleText}>
                                                {CommonFunction.currencyFormat(titem.price)}원
                                            </TextRobotoR>
                                        </View>
                                    </View>                      
                                    <View style={styles.bottomBoxSubWrap2}>
                                        <TouchableOpacity style={styles.numberWrap} onPress={()=>this.orderCount('minus',tindex)}>
                                            <Image source={require('../../../assets/icons/btn_minus.png')} resizeMode={"contain"} style={styles.numberDataWrap} />
                                        </TouchableOpacity>
                                        <View style={styles.orderCountWrap}>
                                            <TextRobotoR style={styles.menuTitleText3}>
                                                {CommonFunction.currencyFormat(titem.count)}
                                            </TextRobotoR>
                                        </View>
                                        <TouchableOpacity style={styles.numberWrap} onPress={()=>this.orderCount('plus',tindex)}>
                                            <Image source={require('../../../assets/icons/btn_plus.png')} resizeMode={"contain"}style={styles.numberDataWrap}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                )
                                })
                            }
                            <View style={styles.totalPriceWrap} >
                                <View style={styles.boxLeftWrap2}>
                                    <CustomTextR style={styles.menuTitleText4}>선택 합계금액</CustomTextR>
                                </View>
                                <View style={styles.boxRightWrap2}>
                                    <TextRobotoM style={styles.menuTitleText4}>{CommonFunction.currencyFormat(this.state.selectedTotalAmount)}원</TextRobotoM>
                                </View>
                            </View>
                            <View style={[styles.defaultWrap]}>   
                                <TouchableOpacity 
                                    style={styles.scrollFooterLeftWrap}
                                    onPress={()=>this.showPopLayer()}
                                >
                                    <CustomTextB style={CommonStyle.scrollFooterText}>장바구니 담기</CustomTextB>
                                </TouchableOpacity> 
                            </View>
                       
                    </View>
                )
            }

            const alertContents =  
            (<View style={{flex:1,marginTop:10}}>
                <View style={{paddingTop:0}}>
                    <CustomTextB style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),color:'#494949'}}>
                        장바구니에 성공적으로 담겼습니다.
                    </CustomTextB>        
                </View> 
                <View style={{paddingTop:20}}>
                    <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),color:'#494949'}}>
                        장바구니 총액 : {CommonFunction.currencyFormat(this.state.selectedTotalAmount)}원
                    </CustomTextR>        
                </View>                        
            </View>);
            return(
                <SafeAreaView style={styles.container}>
                    {this.state.popLayerView && (
                        <View >
                            <Overlay
                                onBackdropPress={()=>this.clickCancle()}
                                isVisible={this.state.popLayerView}
                                windowBackgroundColor="rgba(0, 0, 0, 0.8)"
                                overlayBackgroundColor="tranparent"
                                containerStyle={{}}
                            >
                                <View style={{width:SCREEN_WIDTH*0.8,height:SCREEN_HEIGHT*0.3,backgroundColor:'transparent'}}>
                                    <CustomAlert screenState={{
                                        popLayerView : false,
                                        isCancelView : true,
                                        cancleText : '취소',
                                        okayText : '통화하기',
                                        alertTitle : DEFAULT_CONSTANTS.appName,
                                        alertBody : alertContents,
                                        clickCancle : this.clickCancle.bind(this),
                                        closePopLayer : this.closePopLayer.bind(this)}} 
                                    />
                                </View>
                                
                            </Overlay>
                        </View>
                    )}
                    <ScrollView
                        ref={(ref) => {
                            this.ScrollView = ref;
                        }}
                        showsVerticalScrollIndicator={false}
                        indicatorStyle={'white'}
                        scrollEventThrottle={16}
                        keyboardDismissMode={'on-drag'}
                        style={{width:'100%',flex:1}}
                    >
                    <View style={styles.defaultWrap}>
                        <View style={{paddingHorizontal:20,marginBottom:20}}>
                            <Image
                                source={require('../../../assets/images/sample002.png')}
                                resizeMode={"contain"}
                                style={{width:SCREEN_WIDTH-40,height:SCREEN_WIDTH/4*3}}
                            />
                        </View>     
                    </View>
                    <View style={CommonStyle.termLineWrap} />  
                    <View style={styles.defaultWrap}>                    
                        <View style={{marginBottom:20,paddingTop:15}}>
                            <CustomTextR style={[styles.menuTitleText,{paddingLeft:20}]}>
                                {this.state.productData.name}
                            </CustomTextR>
                        </View>
                        <View style={styles.boxWrap}>
                            <View style={styles.boxLeftWrap}>
                                <CustomTextR style={styles.menuTitleText}>낱개</CustomTextR>
                            </View>
                            <View style={styles.boxRightWrap}>
                                <CustomTextR style={styles.menuTitleText}>1,500원</CustomTextR>
                            </View>
                        </View>
                        <View style={styles.boxWrap}>
                            <View style={styles.boxLeftWrap}>
                                <CustomTextR style={styles.menuTitleText}>박스</CustomTextR>
                            </View>
                            <View style={styles.boxRightWrap}>
                                <CustomTextR style={styles.menuTitleText}>9,600원</CustomTextR>
                                <CustomTextR style={styles.menuTitleText2}>8개입/ 개당1,200원</CustomTextR>
                            </View>
                        </View>
                        <View style={styles.boxWrap}>
                            <View style={styles.boxLeftWrap}>
                                <CustomTextR style={styles.menuTitleText}>카톤</CustomTextR>
                            </View>
                            <View style={styles.boxRightWrap}>
                                <CustomTextR style={styles.menuTitleText}>100,000원</CustomTextR>
                                <CustomTextR style={styles.menuTitleText2}>100개입/ 개당1,000원</CustomTextR>
                            </View>
                        </View>
                    </View>
                    <View style={CommonStyle.termLineWrap} />  
                    <View style={{flex:1,marginVertical:2,paddingVertical:20,backgroundColor : "#fff",}}>
                        <View style={styles.boxWrap}>
                            <View style={styles.boxLeftWrap}>
                                <CustomTextR style={styles.menuTitleText}>판매단위</CustomTextR>
                            </View>
                            <View style={styles.boxRightWrap}>
                                <CustomTextR style={styles.menuTitleText}>낱개,박스,카톤</CustomTextR>
                            </View>
                        </View>
                        <View style={styles.boxWrap}>
                            <View style={styles.boxLeftWrap}>
                                <CustomTextR style={styles.menuTitleText}>사이즈</CustomTextR>
                            </View>
                            <View style={styles.boxRightWrap}>
                                <CustomTextR style={styles.menuTitleText}>8x6 cm</CustomTextR>
                            </View>
                        </View>
                        <View style={styles.boxWrap}>
                            <View style={styles.boxLeftWrap}>
                                <CustomTextR style={styles.menuTitleText}>제조사</CustomTextR>
                            </View>
                            <View style={styles.boxRightWrap}>
                                <CustomTextR style={styles.menuTitleText}>Arix</CustomTextR>
                            </View>
                        </View>
                        <View style={styles.boxWrap}>
                            <View style={styles.boxLeftWrap}>
                                <CustomTextR style={styles.menuTitleText}>재질</CustomTextR>
                            </View>
                            <View style={styles.boxRightWrap}>
                                <CustomTextR style={styles.menuTitleText}>연마석,나일론부직포,합성수지</CustomTextR>
                            </View>
                        </View>

                    </View>
                    <View style={CommonStyle.termLineWrap} />  

                    { this.state.moreLoading &&
                        <View style={CommonStyle.moreWrap}>
                            <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} />
                        </View>
                    }
                    <View style={[CommonStyle.blankArea,{backgroundColor:DEFAULT_COLOR.base_background_color}]}></View>
                    </ScrollView>
      
                    <SlidingPanel
                        headerLayoutHeight = {80}
                        headerLayout = { () =>
                            <View style={styles.bottomBuyTextWrapper3}>
                                <View style={styles.bottomBuyTextIconWraper}>
                                    <View style={styles.bottomBuyTextIcon}>
                                        <Icon2 name={this.state.bottombar3 ? "chevron-thin-down" : "chevron-thin-up"} size={15} color={DEFAULT_CONSTANTS.base_color_222} />
                                    </View>                        
                                </View>
                                <View style={styles.bottomBuyTextBodyWrapper}>
                                    <View style={styles.bottomBuyTextBody}>
                                        <View style={this.state.bottombar3 ? styles.buymotTextWrapCommon : styles.buymotTextWrapCommon2}>
                                            <CustomTextB style={{color:DEFAULT_COLOR.base_color_fff,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18)}}>장바구니 담기</CustomTextB>   
                                        </View>
                                    </View>
                                </View>
                            </View>
                        } 
                        slidingPanelLayoutHeight={SCREEN_HEIGHT*0.4}
                        AnimationSpeed={500}
                        allowAnimation={true}           
                        slidingPanelLayout = { () =>
                            <View style={styles.slidingPanelLayoutStyle}>
                                <BottomCartOption />
                            </View>
                        }
                        panelPosition={'bottom'}
                        onDragEnd={(event)=>this.pageScroll(event)}
                        onAnimationStop={()=>this.onAnimationEnd}
                        nowTopPosition={this.state.bottombar3}
                        setChangePosition={ChangePositionY}
                        onMoveTop={this.onMoveTop}
                        onMoveTop2={this.onMoveTop2}
                    />  
                   
                </SafeAreaView>
            );
        }
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor : "#fff",
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    blankArea : {
        flex:1,height:200,backgroundColor:'#fff'
    },
    cartWrap : {
        position:'absolute',right:0,bottom:0,width:SCREEN_WIDTH,height:200,backgroundColor:DEFAULT_COLOR.base_background_color,
        borderTopWidth:5,borderTopColor:'#ccc'
    },

    bottomBuyTextContentWrapper : {
        width:'100%',justifyContent: 'flex-start',alignItems: 'center',backgroundColor:'#fff',paddingHorizontal:15
    },  
    checkboxLeftWrap : {
        flex:0.3,        
        justifyContent:'center',
        alignItems:'center',
    },
    bottomBoxSubWrap : {
        flex:3,
        flexDirection:'row',    
        flexGrow:1,    
        paddingLeft:10,paddingVertical: 5
    },
    bottomBoxSubWrap2 : { 
        flex:3,paddingRight:15,paddingVertical:5,justifyContent:'center',alignItems:'center',flexDirection:'row',flexGrow:1
    },
    bottomBoxLeftWrap : {
        flex:5,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center'
    },
    bottomBoxRightWrap : {
        flex:1,        
        justifyContent:'center',
        alignItems:'flex-end'
    },
    menuTitleText3 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20)
    },
    menuTitleText4 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize17)
    },
    scrollFooterLeftWrap : {
        backgroundColor:DEFAULT_COLOR.base_color,justifyContent:'center',alignItems:'center',width:SCREEN_WIDTH,
        paddingVertical:10
    },
    defaultWrap : {
        flex:1,backgroundColor : "#fff"
    },
    unitDefaultWrap : {
        flex:0.8,maxHeight:SCREEN_HEIGHT*0.1,backgroundColor : "#fff"
    },
    totalPriceWrap : {
        flex:0.5,backgroundColor : "#f7f7f7",paddingVertical:5,flexDirection:'row'
    },
    totalPriceWrap2 : {
        flex:0.5,backgroundColor : DEFAULT_COLOR.baseColor,paddingVertical:5,justifyContent:'center',alignItems:'center'
    },
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),paddingRight:10
    },
    menuTitleText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#343434'
    },
    boxWrap : {
        marginBottom:20,flexDirection:'row'
    },
    boxLeftWrap : {
        flex:1,justifyContent:'center',paddingLeft:20
    },
    boxRightWrap : {
        flex:2,justifyContent:'center',alignItems:'flex-end',paddingRight:20
    },
    orderCountWrap : {
        width:SCREEN_WIDTH/5,height:PixelRatio.roundToNearestPixel(38),borderTopWidth:1,borderTopColor:'#ccc',borderBottomWidth:1,borderBottomColor:'#ccc',justifyContent:'center',alignItems:'center'
    },
    boxLeftWrap2 : {
        flex:1,        
        justifyContent:'center',
        alignItems:'center',
        paddingLeft:10
    },
    boxRightWrap2 : {
        flex:2,        
        justifyContent:'center',
        alignItems:'flex-end',paddingRight:25
    },
    numberWrap : {
        width:PixelRatio.roundToNearestPixel(38)
    },
    numberDataWrap : {
        width:PixelRatio.roundToNearestPixel(38),height:PixelRatio.roundToNearestPixel(38)
    },
    /**** bottom  ******/
    contentContainer: {
        flex : 1,
        alignItems: 'center',        
        //backgroundColor : 'transparent',
        bottom:0
    },
    buymotTextWrapCommon : {
        flex:3,flexDirection:'row',justifyContent: 'center',alignItems: 'center',backgroundColor : '#222'
    },
    buymotTextWrapCommon2 : {
        flex:3,flexDirection:'row',justifyContent: 'center',alignItems: 'flex-start',backgroundColor : '#222',paddingTop:5
    },
    buymotTextWrapCommonX : {
        flex:3,flexDirection:'row',justifyContent: 'center',alignItems: 'flex-start',backgroundColor : '#222',paddingTop:10
    },
    bottomBuyTextIconWraper : {
        width: '100%',height : 20,alignItems: 'center',justifyContent: 'center',textAlign: 'center',zIndex:2
    },
    bottomBuyTextIcon : {
        width:50,height:20,backgroundColor:'#fff',borderTopLeftRadius:10,borderTopRightRadius:10,alignItems:'center',justifyContent:'center',borderColor:'#ccc',borderWidth:1,paddingTop:5,borderBottomColor:'#fff',borderBottomWidth:1
    },
    bottomBuyTextWrapper3 : {
        width: SCREEN_WIDTH,height : 80,alignItems: 'center',justifyContent: 'center',textAlign: 'center'
    },
    bottomBuyTextWrapperOn3 : {
        width: SCREEN_WIDTH,height : 20,alignItems: 'center',justifyContent: 'center',textAlign: 'center'
    },
    bottomBuyTextBody :  {
        flex:1,flexDirection:'row',paddingTop:5
    },
    bottomBuyTextBodyLeft : {
        flex:1,alignItems:'center',justifyContent:'center',backgroundColor:'#303030'
    },
    bottomBuyTextBodyLeftText : {
        color:'#fff',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small)
    },
    bottomBuyTextBodyRight : {
        flex:1,alignItems:'center',justifyContent:'center',backgroundColor:DEFAULT_COLOR.lecture_base
    },
    headerLayoutStyle: {
        zIndex:5,
        width : SCREEN_WIDTH, 
        height: 30, 
        backgroundColor: DEFAULT_COLOR.lecture_base,
        justifyContent: 'center', 
        alignItems: 'center',
        overflow:'hidden'
    },
    headerLayoutStyleOn : {
        zIndex:10,
        width : SCREEN_WIDTH, 
        height: 30, 
        backgroundColor: 'transparent',
        justifyContent: 'center', 
        alignItems: 'center',
        //opacity:0.2,
        overflow:'hidden'
    },
    slidingPanelLayoutStyle: {
        zIndex:5,
        width:SCREEN_WIDTH, 
        height:SCREEN_HEIGHT*0.35, 
        backgroundColor: DEFAULT_COLOR.base_color_fff,
        overflow:'hidden'
    },
    bottomBuyTextBodyWrapper : {
        width: '100%',height:60,justifyContent: 'center',alignItems: 'center', backgroundColor : '#fff',
       ...Platform.select({
        ios: {
          shadowColor: "#222",
          shadowOpacity: 0.5,
          shadowRadius: 6.27,
          shadowOffset: {
            height: 5,
            width: 5
         }
       },
        android: {
          elevation: 15,
          backgroundColor : '#fff'
       }
     })
    },
    bottomBuyTextBodyWrapperOn : {
        width: '100%',height:20,justifyContent: 'center',alignItems: 'center', backgroundColor : '#fff',
       ...Platform.select({
        ios: {
          shadowColor: "#222",
          shadowOpacity: 0.5,
          shadowRadius: 6.27,
          shadowOffset: {
            height: 5,
            width: 5
         }
       },
        android: {
          elevation: 15,
          backgroundColor : '#fff'
       }
     })
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
    modalTitleWrap : {
        paddingHorizontal:20,paddingVertical:15,flexDirection:'row'
    },
    modalDefaultWrap : {
        paddingHorizontal:20,paddingVertical:Platform.OS === 'ios' ? 15 : 5,
    },
    modalSelectedWrap : {
        paddingHorizontal:20,paddingVertical:Platform.OS === 'ios' ? 15 : 5,backgroundColor:'#f4f4f4'
    },
    modalLeftWrap : {
        flex:1,justifyContent:'center'
    },
    modalRightWrap : {
        flex:1,justifyContent:'center',alignItems:'flex-end'
    },
    checkboxIcon : {
        width : PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize22),height:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize22)
    },
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)
    },
    bottomWrap : {
        height:60,justifyContent:'center',alignItems:'center',flexDirection:'row'
    },
    bottomDataWrap : {
        width:80,backgroundColor:'#e1e1e1',justifyContent:'center',alignItems:'center',padding:5,marginRight:5
    }
});


function mapStateToProps(state) {
    return {
        userToken : state.GlabalStatus.userToken,
    };
}
function mapDispatchToProps(dispatch) {
    return {        
        _saveUserToken:(str)=> {
            dispatch(ActionCreator.saveUserToken(str))
        },
        _saveNonUserToken:(str) => {
            dispatch(ActionCreator.saveNonUserToken(str))
        },
        _fn_getUserCartCount : (num) => {
            dispatch(ActionCreator.fn_getUserCartCount(num))
        },
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(ProductDetailScreen);