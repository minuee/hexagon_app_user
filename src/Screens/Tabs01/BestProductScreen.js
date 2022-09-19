import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Text,Dimensions,RefreshControl, PixelRatio,Image as NativeImage,TouchableOpacity, Platform,Animated,Alert} from 'react-native';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import Modal from 'react-native-modal';
import {CheckBox} from 'react-native-elements';
import Image from 'react-native-image-progress';
//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonStyle from '../../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoB,TextRobotoR} from '../../Components/CustomText';
import CommonFunction from '../../Utils/CommonFunction';
import CommonUtil from '../../Utils/CommonUtil';
import CheckConnection from '../../Components/CheckConnection';
import FooterScreen from '../../Components/FooterScreen';
const CHECKNOX_OFF = require('../../../assets/icons/check_off.png');
const CHECKNOX_ON = require('../../../assets/icons/check_on.png');
const ICON_CART = require('../../../assets/icons/icon_cart.png');
const ICON_ZZIM = require('../../../assets/icons/icon_zzim.png');

import { apiObject } from "../Apis";
import Loader from '../../Utils/Loader';
const orderSeq = [
    { id: 1, title : '인기상품순' , menu :'pop' },
    { id: 2, title : '신상품순' , menu :'new' },
    { id: 3, title : 'MD추천순' , menu :'md' },
    { id: 4, title : '낮은 가격순' , menu :'low' },
    { id: 5, title : '높은 가격순' , menu :'high' },
]
const DefaultPaginate = 10;
class BestProductScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : false,
            showTopButton :false,
            orderSeq : 'pop',
            tmpOrderSeq: 'pop',
            showModal : false,
            toggleproduct : this.props.toggleproduct,
            totalCount : 0,
            newArrivals : [],
            ismore :  false,
            currentPage : 1,
        }
    }

    moreDataUpdate = async( baseData , addData) => {     
        let newArray = await baseData.concat(addData.data.bestProductList);  
        this.setState({            
            moreLoading : false,
            loading : false,
            newArrivals : newArray,
            ismore : parseInt(returnCode.currentPage) < parseInt(addData.lastPage) ? true : false
        })
    }

    getBaseData = async(currentpage,morePage = false,newArrivals=[]) => {
        //console.log('ewArrivals.length',newArrivals.length) 
        if ( newArrivals.length === 0 ) {
            this.setState({moreLoading : true})
            let returnCode = {code:9998};
            let orderSeq = this.state.orderSeq;
            let currentpage2 = currentpage === 0 ? 1 : currentpage;
            try {            
                const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/home/bestlist?page=' + currentpage2 + '&paginate='+DefaultPaginate+ '&sortItem='+orderSeq ;
                const token = this.props.userToken.apiToken;
                let sendData = null;
                returnCode = await apiObject.API_getPageList(this.props,url,token,sendData);          
                //console.log('getBaseData',returnCode) 
                if ( returnCode.code === '0000'  ) {
                    
                    if ( morePage ) {
                        this.moreDataUpdate(this.state.newArrivals,returnCode )
                    }else{
                        this.setState({
                            currentPage : returnCode.currentPage,
                            totalCount : returnCode.total,
                            newArrivals : CommonUtil.isEmpty(returnCode.data.bestProductList) ? [] : returnCode.data.bestProductList,
                            ismore : parseInt(this.state.currentPage)  < parseInt(returnCode.lastPage) ? true : false
                        })
                    }
                }else{
                    CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.',2000);
                }

                this.setState({moreLoading:false,loading:false})
            }catch(e){
                console.log('e',e) 
                this.setState({loading:false,moreLoading : false})
            }
        }else{
            this.setState({loading:false,moreLoading : false})
        }
    }

    UNSAFE_componentWillMount() {
        this.getBaseData(1,false,this.state.newArrivals)
    }

    componentDidMount() {
    }

    handleOnScroll (event) {             
        if ( event.nativeEvent.contentOffset.y >= 200 ) {
            this.setState({showTopButton : true}) 
        }else{
            this.setState({showTopButton : false}) 
         }

        let paddingToBottom = 1;
        paddingToBottom += event.nativeEvent.layoutMeasurement.height;                            
        if (event.nativeEvent.contentOffset.y + paddingToBottom >= event.nativeEvent.contentSize.height) {            
            this.scrollEndReach();
        }
    }
    upButtonHandler = () => {        
        this.ScrollView.scrollTo({ x: 0,  animated: true });
    };
    scrollEndReach = () => {       
        if ( this.state.ismore && !this.state.moreLoading ){
            console.log('scrollEndReach2');
            this.getBaseData(this.state.currentPage+1,true)            
        }
    }
    refreshingData = async() => {
        this.getBaseData(1,false,this.state.newArrivals)
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

    animatedHeight = new Animated.Value(SCREEN_HEIGHT * 0.5);
    
    closeModal = () => {
        this.setState({showModal:false})
    };

    checkItem = (item) => {
        this.setState({tmpOrderSeq:item.menu})
    }

    selectOrderSeq = async(mode) => {
        //console.log('selectOrderSeq',mode);
        await this.setState({orderSeq : mode})
        await this.getBaseData(1,false)
        this.closeModal()
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
            //console.log('e',e)   
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
        await this.setState({moreLoading:true})
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
            if ( returnCode.code === '0000'  ) {
                let userCartCount = CommonUtil.isEmpty(returnCode.data.totalCount) ? 0 : returnCode.data.totalCount ;
                this.props._fn_getUserCartCount(userCartCount);
                CommonFunction.fn_call_toast('장바구니에 추가되었습니다',2000);
            }else{
                CommonFunction.fn_call_toast('오류가 발생하였습니다, 잠시후 다시 이용해주세요',2000);
            }
            this.setState({moreLoading:false})
        }catch(e){            
            CommonFunction.fn_call_toast('오류가 발생하였습니다, 잠시후 다시 이용해주세요',2000);
            this.setState({moreLoading:false})
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
            //console.log('e',e)   
            CommonFunction.fn_call_toast('오류가 발생하였습니다, 잠시후 다시 이용해주세요',2000);
            this.setState({moreLoading:false})
        }  
    }
    renderIcons = (idx, item ) => {
        if ( item.measure ) {
            return (
                <View style={styles.renderIconWrap}>
                    <View style={styles.renderIconTitleWrap}>
                        <CustomTextB style={styles.menuTextWhiteSmall}>일시품절</CustomTextB>  
                    </View>
                    <View style={styles.renderIconDataWrap}>
                        <TouchableOpacity style={styles.renderIconData} onPress={()=>this.registAlarm(item)}>
                            <Icon name="bells" size={CommonUtil.dpToSize(11)} color="#fff" />
                            <CustomTextR style={styles.menuTextWhiteSmall}>{"  "}입고알림</CustomTextR>  
                        </TouchableOpacity>
                    </View>
                    {item.measure > 0 &&
                    <View style={styles.renderIconDataWrap2}>
                        <TouchableOpacity style={styles.renderIconData} onPress={()=>this.moveDetail3(item)}>
                            <Icon name="sync" size={CommonUtil.dpToSize(11)} color="#fff" />                            
                            <CustomTextR style={styles.menuTextWhiteSmall}>{"  "}대체상품</CustomTextR>  
                        </TouchableOpacity>
                    </View>
                    }
                </View>
            )
        }else{
            return (
                <View style={styles.renderIconWrap}>
                    <View style={styles.renderIconTitleWrap}>
                        <CustomTextB style={styles.menuTextWhiteSmall}>일시품절</CustomTextB>  
                    </View>
                    <View style={styles.renderIconDataWrap}>
                        <TouchableOpacity style={styles.renderIconData} onPress={()=>this.registAlarm(item)}>
                            <Icon name="bells" size={CommonUtil.dpToSize(13)} color="#fff" />
                            <CustomTextR style={styles.menuTextWhiteSmall}>{"  "}입고알림</CustomTextR>  
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
    }

    renderSeqText = () => {
        switch ( this.state.orderSeq ) {
            case 'pop' : orderSeqText = "인기상품순";break;
            case 'new' : orderSeqText = "신상품순";break;
            case 'md' : orderSeqText = "MD추천순";break;
            case 'low' : orderSeqText = "낮은 가격순";break;
            case 'high' : orderSeqText = "높은 가격순";break;
            default : orderSeqText = "인기상품순";break;
        }
        return (
            <View style={{paddingHorizontal:10}}>
                <CustomTextB style={styles.menuTitleText2}>{orderSeqText}</CustomTextB>  
            </View>
        )
    }

    renderPriceInfo = (item) => {
        if ( !CommonUtil.isEmpty(this.props.userToken) ) {
            if (item.event_each_price > 0  ) {
                return (
                    <TextRobotoR>
                        <TextRobotoB style={styles.eventpriceText}>{CommonFunction.currencyFormat(item.event_each_price)}</TextRobotoB>
                        <CustomTextR style={CommonStyle.dataText}>{"원  "}</CustomTextR>
                        <TextRobotoR style={[styles.priceText,CommonStyle.fontStrike]}>{CommonFunction.currencyFormat(item.each_price)}{"원"}</TextRobotoR>
                    </TextRobotoR>
                )
            }else{
                return (
                    <TextRobotoB style={styles.eventpriceText}>{CommonFunction.currencyFormat(item.each_price)}
                    <CustomTextR style={CommonStyle.dataText}>{"원"}</CustomTextR></TextRobotoB>  
                )
            }
        }else{
            return null
        }
    }

    render() {
        if ( this.state.loading ) {
            return (
                <SafeAreaView style={ styles.container }>
                    <CheckConnection />
                    <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} /> 
                </SafeAreaView> 
            )
        }else { 
        return(
            <SafeAreaView style={ styles.container }>
                <CheckConnection />
                { 
                    this.state.showTopButton &&
                    <TouchableOpacity style={styles.fixedUpButton3} onPress={e => this.upButtonHandler()}>
                        <Icon name="up" size={25} color="#000" />
                    </TouchableOpacity>
                }
                <View style={styles.filterWarp}>
                    {
                    this.renderSeqText()}
                    <TouchableOpacity 
                        style={{paddingHorizontal:10}}
                        hitSlop={{left:10,right:10,top:10,bottom:10}} 
                        onPress={()=>this.setState({showModal:true,tmpOrderSeq:this.state.orderSeq})}
                    >
                        <NativeImage
                            source={require('../../../assets/icons/icon_filter.png')}
                            resizeMode={"contain"}
                            style={{width: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23), height: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23)}}
                        />
                    </TouchableOpacity>
                </View>
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
                        this.state.newArrivals.length === 0 ?
                        <View style={styles.blankWrap}>
                            <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#838383'}}>준비중입니다</CustomTextR>
                        </View>
                        :
                        this.state.newArrivals.map((item, index) => {  
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
                                                style={CommonStyle.fullWidthImage100}
                                            />
                                        }
                                        {item.is_soldout && this.renderIcons(index,item)}
                                    </View> 
                                    <View style={styles.contentWrap}>
                                        { 
                                            this.state.orderSeq === 'new' ?
                                            <View style={index < 3 ? styles.rankWrap : styles.rankWrap2}>
                                                <TextRobotoR style={styles.salesText}>NEW {index+1}</TextRobotoR>
                                            </View> 
                                            :
                                            <View style={index < 3 ? styles.rankWrap : styles.rankWrap2}>
                                                <TextRobotoR style={styles.salesText}>BEST {index+1}</TextRobotoR>
                                            </View> 
                                        }
                                        <View style={styles.textPadding}>
                                            <CustomTextR style={CommonStyle.titleText2}>[{item.category_name}]</CustomTextR>
                                            <CustomTextR style={CommonStyle.titleText} numberOfLines={2} ellipsizeMode={'tail'}>{item.product_name}</CustomTextR>
                                            {this.renderPriceInfo(item)}
                                        </View>                                        
                                        <TouchableOpacity onPress={()=>this.addEachAlert(item,index)}style={styles.cartIcoWrap}>
                                            <NativeImage source={ICON_CART} resizeMode={"contain"} style={styles.icon_cart_image} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={()=>this.addZzimAlert(item)}style={styles.zzimIconWrap}>
                                            <NativeImage source={ICON_ZZIM} resizeMode={"contain"} style={styles.icon_cart_image} />
                                        </TouchableOpacity>
                                    </View>                           
                                </TouchableOpacity>
                            </View>
                        )
                        })
                    } 
                    </View>
                    {/* {
                    this.state.ismore &&
                        <View style={CommonStyle.moreButtonWrap}>
                            <TouchableOpacity 
                                onPress={() => this.getBaseData(this.state.currentPage+1,true)}
                                style={CommonStyle.moreButton}
                            >
                            <CustomTextL style={CommonStyle.moreText}>더보기</CustomTextL>
                            </TouchableOpacity>
                        </View>
                    } */}
                    
                    <View style={[CommonStyle.blankArea,{backgroundColor:DEFAULT_COLOR.default_bg_color}]}></View>
                    { 
                        this.state.moreLoading &&
                        <View style={CommonStyle.moreWrap}>
                            <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} />
                        </View>
                    }
                </ScrollView>                   
                <Modal
                    onBackdropPress={this.closeModal}
                    animationType="slide"
                    //transparent={true}
                    onRequestClose={() => {this.closeModal()}}
                    style={{justifyContent: 'flex-end',margin: 0}}
                    useNativeDriver={true}
                    animationInTiming={300}
                    animationOutTiming={300}
                    hideModalContentWhileAnimating                    
                    isVisible={this.state.showModal}
                >
                    <Animated.View style={[styles.modalContainer,{ height: this.animatedHeight }]}>
                        <ScrollView showsVerticalScrollIndicator={false} indicatorStyle={'white'}>
                        <View style={styles.modalTitleWrap} >
                            <View style={styles.modalLeftWrap}>
                                <CustomTextB style={styles.menuTitleText}>정렬</CustomTextB>
                            </View>    
                        </View>     
                        <View>
                        {
                            orderSeq.map((item, index) => {  
                                return (
                                <TouchableOpacity onPress={() => this.checkItem(item,index)} key={index}  style={styles.modalTitleWrap}>
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
                            <TouchableOpacity onPress={()=> this.closeModal()} style={styles.bottomDataWrap}>
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
    thumbWrap : {
        flex:1.2,alignItems:'center',justifyContent:'center',borderRadius:10,overflow:'hidden'
    },
    contentWrap :{
        flex:3,paddingLeft:15
    },
    blankWrap : {
        flex:1,    
        paddingVertical:50,
        justifyContent:'center',
        alignItems:'center'
    },
    rankWrap : {
        width:50,height:25,justifyContent:'center',alignItems:'center',backgroundColor:'#0059a9',borderRadius:5
    },
    rankWrap2 : {
        width:50,height:25,justifyContent:'center',alignItems:'center',backgroundColor:'#000',borderRadius:5
    },
    salesText:{
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),color:'#fff'
    },
    fixedUpButton3 : {
        position:'absolute',bottom:20,right:20,width:50,height:50,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',zIndex:3,borderColor:'#ccc',borderWidth:1,borderRadius:25,opacity:0.5
    },
    filterWarp : {
       flexDirection:'row',justifyContent:'flex-end',alignItems:'center',paddingHorizontal:15,paddingVertical:15
    },
    dataWarp : {
        flex:1
    },
    dataEachWarp : {
        flex:1,backgroundColor:'#fff',justifyContent:'center',alignItems:'center',paddingBottom:15,paddingHorizontal:10
    },
    textPadding : {
        paddingHorizontal:0,paddingTop:5
    },
    fixedUpButton : {
        position:'absolute',bottom:80,right:20,width:50,height:50,backgroundColor:DEFAULT_COLOR.base_color,borderColor:'#ccc',borderWidth:1,borderRadius:25,alignItems:'center',justifyContent:'center',zIndex:10
    },
    boxSubWrap : {
        flex:1,paddingHorizontal:10,paddingVertical: 15,flexDirection:'row'
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
    priceText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#888'
    },
    eventpriceText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16)
    },
    menuText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingRight:10
    },
    menuText888 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),color:'#888'
    },
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),paddingRight:10
    },
    menuTitleText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),color:'#888'
    },
    cartIcoWrap : {
        position:'absolute',bottom:0,right:5,width:30,height:30,borderRadius:20,justifyContent:'center',alignItems:'center'
    },
    zzimIconWrap : {
        position:'absolute',bottom:0,right:45,width:30,height:30,borderRadius:20,justifyContent:'center',alignItems:'center'
    },
    icon_cart_image : {
        width:CommonUtil.dpToSize(25*1.2),height:CommonUtil.dpToSize(25*1.2)
    },
    renderIconWrap : {
        position:'absolute',left:0,bottom:0,width:'100%',height:'100%',backgroundColor:'#333',opacity:0.6,zIndex:5,flex:1
    },
    renderIconTitleWrap : {
        flex:1,opacity:1,justifyContent:'center',alignItems:'center'
    },
    renderIconDataWrap : {
        flex:1,flexDirection:'row',opacity:1,backgroundColor:'#000'
    },
    renderIconDataWrap2 : {
        flex:1,flexDirection:'row',opacity:1,backgroundColor:'#333'
    },
    renderIconData : {
        flex:1,flexDirection:'row',paddingVertical:7,justifyContent:'center',alignItems:'center'
    },
    menuTextWhite : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#fff'
    },
    menuTextWhiteSmall : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),color:'#fff'
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
        paddingHorizontal:20,paddingVertical:10,flexDirection:'row'
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
        _saveUserToken:(str)=> {
            dispatch(ActionCreator.saveUserToken(str))
        },
        _saveNonUserToken:(str)=> {
            dispatch(ActionCreator.saveNonUserToken(str))
        },
        _fn_getUserCartCount : (num) => {
            dispatch(ActionCreator.fn_getUserCartCount(num))
        },
        _fn_getUserZzimCount : (num) => {
            dispatch(ActionCreator.fn_getUserZzimCount(num))
        },
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(BestProductScreen);