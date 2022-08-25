import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Text,Dimensions,RefreshControl, PixelRatio,Image as NativeImage,TouchableOpacity, Platform,Animated,Alert,BackHandler} from 'react-native';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import Modal from 'react-native-modal';
import Image from 'react-native-image-progress';
import {CheckBox} from 'react-native-elements';
//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonStyle from '../../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoB,TextRobotoM,TextRobotoR} from '../../Components/CustomText';
import CommonFunction from '../../Utils/CommonFunction';
import CommonUtil from '../../Utils/CommonUtil';
import FooterScreen from '../../Components/FooterScreen';
const CHECKNOX_OFF = require('../../../assets/icons/check_off.png');
const CHECKNOX_ON = require('../../../assets/icons/check_on.png');
const ICON_CART = require('../../../assets/icons/icon_cart.png');
const ICON_ZZIM = require('../../../assets/icons/icon_zzim.png');
import Loader from '../../Utils/Loader';
import { apiObject } from "../Apis";

const orderSeq = [
    { id: 1, title : '인기상품순' , menu :'pop' },
    { id: 2, title : '신상품순' , menu :'new' },
    { id: 3, title : 'MD추천순' , menu :'md' },
    { id: 4, title : '가격 낮은순' , menu :'low' },
    { id: 5, title : '가격 높은순' , menu :'high' }
]
const DefaultPaginate = 10;
class ProductListScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            orderSeq : 'pop',
            tmpOrderSeq: 'pop',
            ismore :  false,
            productList : [],
            totalCount : 0,
            currentPage : 1
        }
    }
    
    moreDataUpdate = async( baseData , addData) => {     
        let newArray = await baseData.concat(addData.data.productList);  
        this.setState({            
            moreLoading : false,
            currentPage : addData.currentPage,
            loading : false,
            productList : newArray,
            ismore : parseInt(addData.currentPage) < parseInt(addData.lastPage) ? true : false
        })
    }

    getBaseData = async(category_pk,currentpage,morePage = false) => {
        console.log('this.state.currentPage',this.state.currentPage)
        let returnCode = {code:9998};
        try {           
            let orderSeq = this.state.orderSeq; 
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/product/list?is_use=true&category_pk=' + category_pk + '&page=' + currentpage + '&paginate='+DefaultPaginate + '&sortItem='+orderSeq ;            
            const token = this.props.userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_getPageList(this.props,url,token,sendData);
            console.log('ddddd',returnCode)
            if ( returnCode.code === '0000'  ) {
                if ( morePage ) {
                    this.moreDataUpdate(this.state.productList,returnCode )
                }else{
                    this.setState({
                        currentPage : returnCode.currentPage,
                        totalCount : returnCode.total,
                        productList : CommonUtil.isEmpty(returnCode.data.productList) ? [] : returnCode.data.productList,
                        ismore : parseInt(this.state.currentPage)  < parseInt(returnCode.lastPage) ? true : false
                    })
                }
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.',2000);
            }
            this.setState({moreLoading:false,loading:false})
        }catch(e){            
            this.setState({loading:false,moreLoading : false})
        }
    }
    async UNSAFE_componentWillMount() {        
        try{
            if ( !CommonUtil.isEmpty(this.props.extraData.params.screenData)) {
                this.setState({
                    categoryData : this.props.extraData.params.screenData,
                    category_pk : this.props.extraData.params.screenData.category_pk
                })
                if ( !CommonUtil.isEmpty(this.props.extraData.params.screenData.category_pk)) {
                    await this.getBaseData(this.props.extraData.params.screenData.category_pk,1,false);
                }
            }else{
                CommonFunction.fn_call_toast('잘못된 접근입니다.',2000);
                setTimeout(
                    () => {            
                        this.props.navigation.goBack(null);
                    },1000
                )
            }
        }catch(e) {
            console.log('eee',e)
        }
       
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);          
    }

    handleBackButton = () => {        
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);  
        this.props.navigation.goBack(null);                
        return true;
    };


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

    moveDetail = (item) => {
        if ( CommonUtil.isEmpty(this.props.userToken)) {
            Alert.alert(DEFAULT_CONSTANTS.appName, '로그인이 필요합니다.\n로그인 하시겠습니까',
            [
                {text: '확인', onPress: () => CommonUtil.moveLogin(this.props)},
                {text: '취소', onPress: () => console.log('취소')},
            ]);
            
        }else{
            this.props.navigation.navigate('ProductDetailStack',{
                screenData:item
            })
        }
    }

  
    animatedHeight = new Animated.Value(SCREEN_HEIGHT * 0.5);
    
    closeModalInforation = () => {
        this.props._fn_ToggleProduct(false)
    };

    checkItem = (item) => {
        this.setState({tmpOrderSeq:item.menu})
    }

    selectOrderSeq = async(mode) => {        
        await this.setState({orderSeq : mode})
        await this.getBaseData(this.state.category_pk,1,false)
        this.closeModalInforation()
    }
    addZzimAlert = (item) => {
        if ( CommonUtil.isEmpty(this.props.userToken)) {
            Alert.alert(DEFAULT_CONSTANTS.appName, '로그인이 필요합니다.\n로그인 하시겠습니까',
            [
                {text: '확인', onPress: () => CommonUtil.moveLogin(this.props)},
                {text: '취소', onPress: () => console.log('취소')},
            ]);
        }else{
            this.registZzim(item)
        }
    }

    registZzim = async (item) => {
        await this.setState({moreLoading:true})
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/bookmark/eachadd';
            const token = this.props.userToken.apiToken;
            let sendData = {
                member_pk : this.props.userToken.member_pk,
                product_pk : item.product_pk
            };
            returnCode = await apiObject.API_registCommon(this.props,url,token,sendData);
            if ( returnCode.code === '0000'  ) {
                let userZzimCount = CommonUtil.isEmpty(returnCode.totalCount) ? 0 : returnCode.totalCount ;
                this.props._fn_getUserZzimCount(userZzimCount);
                CommonFunction.fn_call_toast('찜리스트에 추가되었습니다',2000);
            }else{
                CommonFunction.fn_call_toast('오류가 발생하였111습니다, 잠시후 다시 이용해주세요',2000);
            }
            this.setState({moreLoading:false})
        }catch(e){            
            CommonFunction.fn_call_toast('오류가 발생하였습니다, 잠시후 다시 이용해주세요',2000);
            this.setState({moreLoading:false})
        }  
    }
    zzimInsertAgiain = () => {
        CommonFunction.fn_call_toast('준비중입니다.',2000);
    }
    addEachAlert = (item,idx) => {
        if ( CommonUtil.isEmpty(this.props.userToken)) {
            Alert.alert(DEFAULT_CONSTANTS.appName, '로그인이 필요합니다.\n로그인 하시겠습니까',
            [
                {text: '확인', onPress: () => CommonUtil.moveLogin(this.props)},
                {text: '취소', onPress: () => console.log('취소')},
            ]);
        }else{
            Alert.alert(DEFAULT_CONSTANTS.appName, '장바구니에서 추가하시겠습니까?',
            [
                {text: '확인', onPress: () => this.addCart(item,idx)},
                {text: '취소', onPress: () => console.log('취소')},
            ]);
        }
    }
    
    addCart = async(item) => {
        this.setState({moreLoading:true})
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/cart/eachadd';
            const token = this.props.userToken.apiToken;
            let sendData = {
                member_pk : this.props.userToken.member_pk,
                product_pk : item.product_pk,
                quantity : 1,
                unit_type : 'Each'
            };
            returnCode = await apiObject.API_registCommon(this.props,url,token,sendData);
            
            if ( returnCode.code == '0000'  ) {
                let userCartCount = CommonUtil.isEmpty(returnCode.data.totalCount) ? 0 : returnCode.data.totalCount ;
                this.props._fn_getUserCartCount(userCartCount);
                CommonFunction.fn_call_toast('장바구니에 추가되었습니다',2000);
            }else{
                CommonFunction.fn_call_toast('오류가 발생하였습니다, 잠시후 다시 이용해주세요',2000);
            }
            this.setState({moreLoading:false})
        }catch(e){            
            console.log('returnCode1',e)
            CommonFunction.fn_call_toast('오류가 발생하였습니다, 잠시후 다시 이용해주세요!',2000);
            this.setState({moreLoading:false})
        }
    }

    moveDetail3 = (item) => {
        if ( CommonUtil.isEmpty(this.props.userToken)) {
            Alert.alert(DEFAULT_CONSTANTS.appName, '로그인이 필요합니다.\n로그인 하시겠습니까',
            [
                {text: '확인', onPress: () => CommonUtil.moveLogin(this.props)},
                {text: '취소', onPress: () => console.log('취소')},
            ]);
        }else{
            if ( !CommonUtil.isEmpty(item.measure)) {
                this.props.navigation.navigate('ProductDetailStack',{
                    screenData:{product_pk : item.measure,product_name:item.measure_product_name}
                })
            }
        }
    }

    registAlarm = (item) => {
        if ( CommonUtil.isEmpty(this.props.userToken)) {
            Alert.alert(DEFAULT_CONSTANTS.appName, '로그인이 필요합니다.\n로그인 하시겠습니까',
            [
                {text: '확인', onPress: () => CommonUtil.moveLogin(this.props)},
                {text: '취소', onPress: () => console.log('취소')},
            ]);
            
        }else{
            Alert.alert(DEFAULT_CONSTANTS.appName, '입고시 알림을 받으시겠습니까?',
            [
                {text: '확인', onPress: () => this.actionRegistAlarm(item)},
                {text: '취소', onPress: () => console.log('취소')},
            ]);
        }
    }
   
    actionRegistAlarm = async (item) => {        
        await this.setState({moreLoading:true})
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/member/addalarm';
            const token = this.props.userToken.apiToken;
            let sendData = {
                member_pk : this.props.userToken.member_pk,
                product_pk : item.product_pk
            };
            returnCode = await apiObject.API_registCommon(this.props,url,token,sendData);
            if ( returnCode.code === '0000'  ) {                
                CommonFunction.fn_call_toast('알림리스트에 추가되었습니다',2000);
            }else{
                CommonFunction.fn_call_toast('오류가 발생하였습니다, 잠시후 다시 이용해주세요',2000);
            }
            this.setState({moreLoading:false})
        }catch(e){            
            CommonFunction.fn_call_toast('오류가 발생하였습니다, 잠시후 다시 이용해주세요.',2000);
            this.setState({moreLoading:false})
        }  
    }
    renderIcons = (idx, item ) => {        
        if ( !item.is_soldout ) {
            return (
                <>
                    <TouchableOpacity onPress={()=>this.addEachAlert(item,idx)} style={styles.cartIcoWrap}>
                        <NativeImage source={ICON_CART} resizeMode={"contain"} style={styles.icon_cart_image}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.addZzimAlert(item,idx)} style={styles.zzimIconWrap}>
                        <NativeImage source={ICON_ZZIM} resizeMode={"contain"} style={styles.icon_cart_image}/>
                    </TouchableOpacity>
                </>
            )
        }else {
            if ( item.measure ) {
                return (
                    <View style={styles.renderIconWrap}>
                        <View style={styles.renderIconDataWrap}>
                            <CustomTextB style={styles.menuTextWhite}>일시품절</CustomTextB>  
                        </View>
                        <View style={styles.renderIconTitleWrap}>
                            <TouchableOpacity style={styles.renderIconData} onPress={()=>this.registAlarm(item)}>
                                <Icon name="bells" size={CommonUtil.dpToSize(13)} color="#fff" />
                                <CustomTextB style={styles.menuTextWhite}>{"  "}입고알림</CustomTextB>  
                            </TouchableOpacity>
                        </View>                        
                        <View style={styles.renderIconDataWrap}>                        
                            <TouchableOpacity style={styles.renderIconData} onPress={()=>this.moveDetail3(item)}>
                                <Icon name="sync" size={CommonUtil.dpToSize(13)} color="#fff" />
                                <CustomTextB style={styles.menuTextWhite}>{"  "}대체상품</CustomTextB>  
                            </TouchableOpacity>
                        </View>                        
                    </View>
                )
            }else{
                return (
                    <View style={styles.renderIconWrap}>
                        <View style={styles.renderIconTitleWrap}>
                            <CustomTextB style={styles.menuTextWhite}>일시품절</CustomTextB>  
                        </View>
                        <View style={styles.renderIconDataWrap}>
                            <TouchableOpacity style={styles.renderIconData} onPress={()=>this.registAlarm(item)}>
                                <Icon name="bells" size={CommonUtil.dpToSize(13)} color="#fff" />
                                <CustomTextB style={styles.menuTextWhite}>{"  "}입고알림</CustomTextB>  
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            }
            
        }   
            
    }

    renderPriceInfo = (item) => {
        if ( !CommonUtil.isEmpty(this.props.userToken) ) {
            if (item.event_each_price > 0  ) {
                return (
                    <>
                    <TextRobotoR>
                        <TextRobotoR style={styles.percentText}>{((item.each_price/item.event_each_price*100)-100).toFixed(1)}{"%       "}</TextRobotoR>
                        <TextRobotoB style={styles.eventpriceText}>{CommonFunction.currencyFormat(item.event_each_price)}{"원 "}</TextRobotoB>
                    </TextRobotoR>
                    <TextRobotoR style={[styles.priceText,CommonStyle.fontStrike]}>{CommonFunction.currencyFormat(item.each_price)}{"원"}</TextRobotoR>
                    </>
                )
            }else{
                return (
                    <TextRobotoB style={styles.eventpriceText}>{CommonFunction.currencyFormat(item.each_price)}원</TextRobotoB>  
                )
            }
        }else{
            return null
        }
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
                    <View style={styles.dataWarp}>
                    {
                        this.state.productList.length === 0 ? 
                        <View style={styles.blankWrap}>
                            <CustomTextR style={styles.menuText}>상품을 준비중입니다.</CustomTextR>
                        </View>
                        :
                        this.state.productList.map((item, index) => {  
                        return (
                            <View key={index} style={styles.dataEachWarp}>
                                <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail(item)}>
                                    <View style={styles.thumbWrap}>
                                        { 
                                            !CommonUtil.isEmpty(item.thumb_img) ?
                                            <Image
                                                source={{uri:DEFAULT_CONSTANTS.defaultImageDomain+item.thumb_img}}
                                                resizeMode={"cover"}
                                                style={CommonStyle.fullWidthImage100}
                                            />
                                            :
                                            <Image
                                                source={require('../../../assets/icons/no_image.png')}
                                                resizeMode={"contain"}
                                                style={CommonStyle.defaultNoImage}
                                            />
                                        }
                                        {this.renderIcons(index,item)}
                                     </View>
                                    <View style={styles.textPadding}>
                                        <CustomTextR style={CommonStyle.titleText} numberOfLines={2} ellipsizeMode={'tail'}>{item.product_name}</CustomTextR>
                                        {this.renderPriceInfo(item)}
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )
                        })
                    } 
                    </View>
                    {
                        this.state.ismore &&
                        <View style={CommonStyle.moreButtonWrap}>
                            <TouchableOpacity 
                                onPress={() => this.getBaseData(this.state.category_pk,this.state.currentPage+1,true)}
                                style={CommonStyle.moreButton}
                            >
                            <CustomTextL style={CommonStyle.moreText}>더보기</CustomTextL>
                            </TouchableOpacity>
                        </View>
                    }
                    <View style={[CommonStyle.blankArea,{backgroundColor:DEFAULT_COLOR.default_bg_color}]}></View>
                    { 
                        this.state.moreLoading &&
                        <View style={CommonStyle.moreWrap}>
                            <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} />
                        </View>
                    }
                </ScrollView>   
                      {/** 인포메이션 모달 **/}
                <Modal
                    onBackdropPress={this.closeModalInforation}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => {
                        this.props._fn_ToggleProduct(false)
                    }}                        
                    style={{justifyContent: 'flex-end',margin: 0,backgroundColor:'transparent'}}
                    useNativeDriver={true}
                    animationInTiming={300}
                    animationOutTiming={300}
                    hideModalContentWhileAnimating 
                    isVisible={this.props.toggleproduct}
                >
                    <Animated.View style={[styles.modalContainer,{ height: this.animatedHeight }]}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            indicatorStyle={'white'}
                        > 
                            <View style={[styles.modalTitleWrap,{marginBottom:20}]} >
                                <View style={styles.modalLeftWrap}>
                                    <CustomTextB style={styles.menuTitleText}>정렬</CustomTextB>
                                </View>    
                            </View>     
                            <View >       
                            {
                                orderSeq.map((item, index) => {  
                                    return (
                                    <TouchableOpacity 
                                        onPress={() => this.checkItem(item,index)}
                                        key={index}  style={styles.modalTitleWrap} 
                                    >
                                        <View style={styles.modalLeftWrap}>
                                            <CustomTextR style={styles.menuTitleText}>{item.title}</CustomTextR>
                                        </View>
                                        <View style={styles.modalRightWrap}>
                                            <CheckBox 
                                                containerStyle={{padding:0,margin:0}}   
                                                iconType={'FontAwesome'}
                                                checkedIcon={<NativeImage source={CHECKNOX_ON} resizeMode='contain' style={styles.checkboxIcon} />}
                                                uncheckedIcon={<NativeImage source={CHECKNOX_OFF} resizeMode='contain' style={styles.checkboxIcon} />}
                                                checkedColor={DEFAULT_COLOR.base_color}                          
                                                checked={this.state.tmpOrderSeq === item.menu}
                                                size={PixelRatio.roundToNearestPixel(15)}                                    
                                                onPress={() => this.checkItem(item,index)}
                                                />
                                        </View>
                                    </TouchableOpacity>
                                    )
                                })
                            }    
                            </View> 
                            <View style={styles.bottomWrap}>
                                <TouchableOpacity 
                                    onPress={()=> this.closeModalInforation()}
                                    style={styles.bottomDataWrap}
                                >
                                    <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#9f9f9f'}}>취소</CustomTextM>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={()=>this.selectOrderSeq(this.state.tmpOrderSeq)}
                                    style={[styles.bottomDataWrap,{backgroundColor:DEFAULT_COLOR.base_color}]}
                                >
                                    <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#fff'}}>선택</CustomTextM>
                                </TouchableOpacity>
                                
                            </View>
                        </ScrollView>
                    </Animated.View>
                </Modal>
            </SafeAreaView>
        );
        }
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
    blankWrap : {
        flex:1,paddingVertical:SCREEN_HEIGHT/4,justifyContent:'center',alignItems:'center'
    },
    dataWarp : {
        flexDirection:'row',justifyContent:'space-between',flexWrap:'wrap',paddingHorizontal:15,paddingTop:15
    },
    dataEachWarp : {
        width:SCREEN_WIDTH/2-22,backgroundColor:'#fff',justifyContent:'center',alignItems:'center',marginBottom:15
    },
    fixedUpButton : {
        position:'absolute',bottom:80,right:20,width:50,height:50,backgroundColor:DEFAULT_COLOR.base_color,borderColor:'#ccc',borderWidth:1,borderRadius:25,alignItems:'center',justifyContent:'center',zIndex:10
    },
    boxSubWrap : {
        flex:1,
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
    menuText888 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),color:'#888'
    },
    priceText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#888'
    },
    eventpriceText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)
    },
    commonTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),paddingVertical:0,backgroundColor:'#ff0000'
    },
    menuText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingRight:10
    },
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),paddingRight:10
    },
    cartIcoWrap : {
        position:'absolute',top:SCREEN_WIDTH/3,right:10,width:30,height:30,borderRadius:20,justifyContent:'center',alignItems:'center'
    },
    zzimIconWrap : {
        position:'absolute',top:SCREEN_WIDTH/3,right:45,width:30,height:30,borderRadius:20,justifyContent:'center',alignItems:'center'
    },
    icon_cart_image : {
        width:CommonUtil.dpToSize(25*1.1),height:CommonUtil.dpToSize(25*1.1)
    },
    renderIconWrap : {
        position:'absolute',left:0,bottom:0,width:'100%',height:'100%',backgroundColor:'#555',opacity:0.6,zIndex:5,flex:1
    },
    renderIconTitleWrap : {
        flex:1,opacity:1,justifyContent:'center',alignItems:'center'
    },
    renderIconDataWrap : {
        flex:1,opacity:1,backgroundColor:'#000',justifyContent:'center',alignItems:'center'
    },
    renderIconData : {
        flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'
    },
    menuTextWhite : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#fff'
    },
    menuTextWhiteSmall : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),color:'#fff'
    },
    textPadding : {
        padding:10
    },
    thumbWrap : {
        alignItems:'center',justifyContent:'center',minWidth:SCREEN_WIDTH/2-20
    },
    percentText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),letterSpacing:-1,color:DEFAULT_COLOR.base_color
    },    
    modalContainer: {   
        zIndex : 10,     
        position :'absolute',
        left:0,        
        width:SCREEN_WIDTH,
        height: SCREEN_HEIGHT-200,
        paddingTop: 16,
        backgroundColor: '#fff'
    },
    modalTitleWrap : {
        paddingHorizontal:20,paddingVertical:Platform.OS === 'ios' ? 10 : 5,flexDirection:'row'
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
        toggleproduct: state.GlabalStatus.toggleproduct,
    };
}
function mapDispatchToProps(dispatch) {
    return {                
        _fn_ToggleProduct:(bool)=> {
            dispatch(ActionCreator.fn_ToggleProduct(bool))
        },
        _fn_getUserZzimCount : (num) => {
            dispatch(ActionCreator.fn_getUserZzimCount(num))
        },
        _fn_getUserCartCount : (num) => {
            dispatch(ActionCreator.fn_getUserCartCount(num))
        },
        _saveUserToken:(str)=> {
            dispatch(ActionCreator.saveUserToken(str))
        },
        _saveNonUserToken:(str) => {
            dispatch(ActionCreator.saveNonUserToken(str))
        },
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(ProductListScreen);