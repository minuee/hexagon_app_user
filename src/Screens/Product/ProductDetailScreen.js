import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Animated,Dimensions,PixelRatio,TouchableOpacity,Image as NativeImage,Linking,Alert,ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import Modal from 'react-native-modal';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import FastImage from 'react-native-fast-image';
import {Overlay,CheckBox} from 'react-native-elements';
import Image from 'react-native-image-progress';

import ImageViewer from 'react-native-image-zoom-viewer';
//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonStyle from '../../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR, CustomTextB, TextRobotoB,TextRobotoM,TextRobotoR,CustomTextL} from '../../Components/CustomText';
import CommonFunction from '../../Utils/CommonFunction';
import CommonUtil from '../../Utils/CommonUtil';
import Loader from '../../Utils/Loader';
import CustomAlert from '../../Components/CustomAlert';
import { Platform } from 'react-native';
const CHECKNOX_OFF = require('../../../assets/icons/checkbox_off.png');
const CHECKNOX_ON = require('../../../assets/icons/checkbox_on.png');
const HEADER_CLOSE_IMAGE = require('../../../assets/icons/btn_close.png');
import { apiObject } from "../Apis";

const HEADER_BLANK = 50;
const ChangeLimitY = SCREEN_HEIGHT*0.8;

class ProductDetailScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading : true,
            showModal : false,
            showTopButton :false,
            showCartForm : false,
            productData : {},
            orderCount : 1,
            orderSeq : 'Each',
            orderSetData : {title : '낱개' , menu :'Each' ,price : 1050},
            moreSellerHeight : SCREEN_HEIGHT*0.4,
            bottombar3 : false,
            selectedArray : [],
            option : [],
            selectedTotalAmount : 0,
            detail_img1_width : 0,
            detail_img1_height : 0,
            detail_img1_width_origin : 0,
            detail_img1_height_origin : 0,
            detail_img2_width : 0,
            detail_img2_height : 0,
            detail_img3_width : 0,
            detail_img3_height : 0,
            detail_img4_width : 0,
            detail_img4_height : 0,

            thisImages : [],
            imageIndex: 0,
            isImageViewVisible: false,
        }
    }

    clickCancle = () => {
        this.setState({selectedArray : [],selectedTotalAmount:0,popLayerView : false})
    }
    showPopLayer = async() => {
        if ( this.state.selectedTotalAmount === 0 ) {
           CommonFunction.fn_call_toast('최소 1개이상 선택을 해주세요',2000);
        }else{
            let optionList = [];
            const product_pk = this.state.product_pk
            await this.state.selectedArray.forEach(function(element,index,array){ 
                optionList.push({
                    product_pk : product_pk,
                    unit_type : element.unit_type,
                    quantity : element.count
                });
            })
            this.registCart(optionList)
            
        }
        
    } 
    closePopLayer = async() => {        
        this.setState({selectedArray : [],selectedTotalAmount:0,popLayerView : false})
        this.props.navigation.navigate('CartStack')        
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

    registCart = async(newChild) => { 
        this.setState({moreLoading:true,loading:true})
        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/cart/arrayadd';           
            const token = this.props.userToken.apiToken;
            let sendData = {
                member_pk : this.props.userToken.member_pk,
                product_pk :  this.state.product_pk,
                data_array : newChild
            }
            returnCode = await apiObject.API_registCommon(this.props,url,token,sendData);            
            if ( returnCode.code === '0000'  ) {
                this.setState({popLayerView : true,moreLoading:false,loading:false});
                this.props._fn_getUserCartCount(returnCode.data.totalCount)
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.\n[ERR]' + returnCode.msg ,2000);
                this.setState({moreLoading:false,loading:false})
            }
        }catch(e){            
            this.setState({loading:false,moreLoading : false})
        }
    }
   
    getBaseData = async(product_pk) => {
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/product/view/'+product_pk;
            const token = this.props.userToken.apiToken;
            returnCode = await apiObject.API_getDetailDefault(this.props,url,token);
            if ( returnCode.code === '0000'  ) {
                let productDetail = returnCode.data.productDetail;
                let childData = [];
                if ( returnCode.data.productDetail.each_price > 0 ) {
                    childData.push({
                        id :1,price : productDetail.event_each_price,unit : '낱개',unit_type :'Each',count : 1,price : productDetail.each_price, event_price : productDetail.event_each_price,event_stock : productDetail.event_each_stock
                    })
                }
                if ( returnCode.data.productDetail.box_price > 0 ) {
                    childData.push({
                        id :2,price : returnCode.data.productDetail.event_box_price,unit : '박스',unit_type :'Box',count : 1,price : productDetail.box_price, event_price : productDetail.event_box_price,event_stock : productDetail.event_box_stock
                    })
                }
                if ( returnCode.data.productDetail.carton_price > 0 ) {
                    childData.push({
                        id :3,price : returnCode.data.productDetail.event_carton_price,unit : '카톤',unit_type :'Carton',count : 1,price : productDetail.carton_price, event_price : productDetail.event_carton_price,event_stock : productDetail.event_carton_stock
                    })
                }

                this.setState({
                    productData : CommonUtil.isEmpty(returnCode.data.productDetail) ? [] : returnCode.data.productDetail,
                    option : childData
                })
                this.setDetailImages(returnCode.data.productDetail);
                
            }else{
                this.setState({moreLoading:false,loading:false})
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.',1500);
                setTimeout(
                    () => {            
                       this.props.navigation.goBack(null);
                    },1500
                )
            }
            
        }catch(e){
            console.log('eeee',e)
            this.setState({loading:false,moreLoading:false})
        }
    }

    setDetailImages = async(data) => {
        console.log('data.detail_img1',data.detail_img1)
        let count = 0;
        let detail_img1_height = 100;
        let detail_img1_width = 100;
        let detail_img2_height = 100;
        let detail_img2_width = 100;
        let detail_img3_height = 100;
        let detail_img3_width = 100;
        let detail_img4_height = 100;
        let detail_img4_width = 100;
        
        if ( !CommonUtil.isEmpty( data.detail_img1)) {
            const img1 = DEFAULT_CONSTANTS.defaultImageDomain+data.detail_img1;
            await NativeImage.getSize(img1, (width, height) => { 
                //console.log('ddd0',width + ' - ' + height); 
                detail_img1_height = height;
                detail_img1_width = width;
                this.setState({
                    detail_img1_height_origin : (SCREEN_WIDTH-20) * detail_img1_height/detail_img1_width,
                    detail_img1_width_origin : SCREEN_WIDTH-20,
                    detail_img1_height : (SCREEN_WIDTH-20) * detail_img1_height/detail_img1_width
                })
            });
            count++;
        }
        if ( !CommonUtil.isEmpty( data.detail_img2)) {
            const img2 = DEFAULT_CONSTANTS.defaultImageDomain+data.detail_img2;
            await NativeImage.getSize(img2, (width, height) => {                 
                detail_img2_height = height;
                detail_img2_width = width;
                this.setState({
                    detail_img2_height : (SCREEN_WIDTH-20) * detail_img2_height/detail_img2_width
                })
            });
            count++;
        }
        if ( !CommonUtil.isEmpty( data.detail_img3)) {
            const img3 = DEFAULT_CONSTANTS.defaultImageDomain+data.detail_img3;
            await NativeImage.getSize(img3, (width, height) => { 
                //console.log(width + ' - ' + height); 
                detail_img3_height = height;
                detail_img3_width = width;
                this.setState({
                    detail_img3_height : (SCREEN_WIDTH-20) * detail_img3_height/detail_img3_width
                })
            });
            count++;
        }
        if ( !CommonUtil.isEmpty( data.detail_img4)) {
            const img4 = DEFAULT_CONSTANTS.defaultImageDomain+data.detail_img4;
            await NativeImage.getSize(img4, (width, height) => { 
                //console.log(width + ' - ' + height); 
                detail_img4_height = height;
                detail_img4_width = width;
                this.setState({
                    detail_img4_height : (SCREEN_WIDTH-20) * detail_img4_height/detail_img4_width
                })
            });
            count++;
        }
        
        if ( count > 0 && detail_img1_height != 0 ) {
            
            setTimeout(() => {
                //console.log('ddd1',Platform.OS, detail_img1_height); 
                //console.log('ddd2',detail_img1_width); 
                //console.log('ddd3',(SCREEN_WIDTH-20) * detail_img1_height/detail_img1_width); 
                this.setState({
                    detail_img1_height : (SCREEN_WIDTH-20) * detail_img1_height/detail_img1_width,
                    detail_img2_height : (SCREEN_WIDTH-20) * detail_img2_height/detail_img2_width,
                    detail_img3_height : (SCREEN_WIDTH-20) * detail_img3_height/detail_img3_width,
                    detail_img4_height : (SCREEN_WIDTH-20) * detail_img4_height/detail_img4_width,
                    moreLoading : false,
                    loading : false
                })
            }, 1200);
            
            
        }else{
            this.setState({
                moreLoading : false,
                loading : false
            })
        }
    }

    async UNSAFE_componentWillMount() {        
        if ( !CommonUtil.isEmpty(this.props.extraData.params.screenData)) {
            await this.getBaseData(this.props.extraData.params.screenData.product_pk);
            this.setState({
                product_pk : this.props.extraData.params.screenData.product_pk
            })
        }else{
            CommonFunction.fn_call_toast('잘못된 접근입니다.',1500);
            setTimeout(
                () => {            
                   this.props.navigation.goBack(null);
                },1500
            )
        }

        this.props.navigation.addListener('focus', () => {              
            this.getBaseData(this.state.product_pk)
        })

        this.props.navigation.addListener('blur', () => {            
           
        })
    }

    componentDidMount() {
    }

    componentWillUnmount(){            
    }

    fn_onChangeToggle = (bool) => {
        this.setState({switchOn1 : bool})
    }

    animatedHeight = new Animated.Value(SCREEN_HEIGHT * 0.5);
    
    closeModal = () => {
        this.setState({showModal :false})
    };

    checkItemModal = (item) => {
        this.setState({orderSeq:item.menu,orderSetData:item})
    }

    selectOrderSeq = async(mode) => {        
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

    handleOnScroll (event) {             
        if ( event.nativeEvent.contentOffset.y >= 200 ) {
            this.setState({showTopButton : true}) 
        }else{
            this.setState({showTopButton : false}) 
         }

        let paddingToBottom = 1;
        paddingToBottom += event.nativeEvent.layoutMeasurement.height;                            
        if (event.nativeEvent.contentOffset.y + paddingToBottom >= event.nativeEvent.contentSize.height) {            
            //this.scrollEndReach();
        }
    }
    upButtonHandler = () => {        
        this.ScrollView.scrollTo({ x: 0,  animated: true });
    };

    onAnimationEnd = (val) => {        
    }

    onMoveTop2 = async(bool) =>{
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

    _orderCount = async(mode,idx,item) => {        
        let orderCount = this.state.option[idx].count;
        if ( mode === 'minus') {
            if ( orderCount > 1 ) {               
                this.state.option[idx].count = orderCount-1;
            }
        }else{
            if ( item.event_stock > 0  && item.event_price> 0 ) {
                if ( parseInt(orderCount +1) > item.event_stock ) {
                    CommonFunction.fn_call_toast('해당상품은 판매수량이 제한되어 있습니다.',1500)
                    return;
                }
            }
            this.state.option[idx].count = orderCount+1;
        }
        if ( this.state.selectedArray.length > 0 ) {            
            let returnArray = await this.state.option.filter((info) => info.checked === true); 
            await this.calTotalAmount(returnArray);
        }
        
        setTimeout(
            () => {            
                this.setState({moreLoading:false})
            },500
        )
    }

    calTotalAmount = async(returnArray) => {
        this.setState({moreLoading:true})
        let selectedTotalAmount = 0;
        await returnArray.forEach(function(element,index,array){ 
            let sumPrice = element.event_price > 0 ? element.event_price  : element.price
            selectedTotalAmount = selectedTotalAmount + (sumPrice*element.count);
        });
        await this.setState({
            selectedArray : returnArray,
            selectedTotalAmount : selectedTotalAmount,
        })
        this.setState({ moreLoading:false})
    }

    checkItem = async(idx,item) => {
        this.setState({moreLoading:true})
        if ( CommonUtil.isEmpty(item.checked) || item.checked === false) {
            let returnArray = this.state.selectedArray;
            await returnArray.push({
                count : item.count,
                id : item.id,
                price : item.price,
                event_price : item.event_price,
                unit_type : item.unit_type,
                checked : true
            })
            this.state.option[idx].checked = true;
            await this.calTotalAmount(returnArray);
        }else{
            this.setState({allChecked : false })
            let returnArray = await this.state.selectedArray.filter((info) => info.id !== item.id); 
            this.state.option[idx].checked = false;
            await this.calTotalAmount(returnArray);
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
            CommonFunction.fn_call_toast('오류가 발생하였습니다, 잠시후 다시 이용해주세요',2000);
            this.setState({moreLoading:false})
        }  
    }

    moveDetail3 = async(item) => {        
        if ( CommonUtil.isEmpty(this.props.userToken)) {
            Alert.alert(DEFAULT_CONSTANTS.appName, '로그인이 필요합니다.\n로그인 하시겠습니까',
            [
                {text: '확인', onPress: () => CommonUtil.moveLogin(this.props)},
                {text: '취소', onPress: () => console.log('취소')},
            ]);
        }else{
            this.props.navigation.navigate('ProductDetailStack2',{
                screenData:{product_pk : item.measure,product_name:item.measure_product_name}
            })
        }
        
    }

    getDetailSize = async(img) => {

    }

    enterCount = () => {
        return (            
            this.state.productData.is_soldout ? 
            <View style={styles.defaultWrap}>
                <View style={styles.scrollFooterLeftWrap2}>
                    <CustomTextB style={CommonStyle.scrollFooterText}>품절된 상품입니다.</CustomTextB>
                </View>
                <View style={styles.renderIconDataWrap}>
                    <TouchableOpacity style={styles.renderIconData} onPress={()=>this.registAlarm(this.state.productData)}>
                        <Icon name="bells" size={16} color="#fff" />
                        <CustomTextR style={styles.menuTextWhite}> 입고알림</CustomTextR>  
                    </TouchableOpacity>
                    {
                        this.state.productData.measure > 0 &&
                        <TouchableOpacity style={styles.renderIconData} onPress={()=>this.moveDetail3(this.state.productData)}>
                            <Icon name="sync" size={16} color="#fff" />
                            <CustomTextR style={styles.menuTextWhite}> 대체상품</CustomTextR>  
                        </TouchableOpacity>
                    }
                </View>
            </View>
            :
            <View>                            
            { 
                this.state.option.map((titem, tindex) => {  
                    let isIndexOf = this.state.selectedArray.findIndex(                
                        info => ( info.id === titem.id )
                    ); 
                    return (
                    <View style={[styles.defaultWrap,{flexDirection:'row'}]} key={tindex}>
                        <View style={styles.checkboxLeftWrap}>
                            <CheckBox 
                                iconType={'FontAwesome'}
                                checkedIcon={<NativeImage source={CHECKNOX_ON} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                uncheckedIcon={<NativeImage source={CHECKNOX_OFF} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                checkedColor={DEFAULT_COLOR.base_color}
                                checked={isIndexOf != -1 ? true : false}
                                size={CommonUtil.dpToSize(15)}                                    
                                onPress={() => this.checkItem(tindex,titem)}
                            />
                        </View>
                        <View style={styles.bottomBoxLeftSubWrap} >
                            <View style={{flex:1,justifyContent:'center',paddingVertical:5}}>
                                
                                { 
                                    titem.event_price > 0 ?
                                    <>
                                        <View style={styles.unitWrap}>
                                            <CustomTextB style={CommonStyle.dataText}>{titem.unit}</CustomTextB>
                                            <View style={styles.percentWrap}>
                                                <TextRobotoR style={styles.salesText2}>
                                                    {Math.round(100-(titem.event_price /titem.price*100))}%
                                                </TextRobotoR>
                                            </View>
                                        </View>
                                        <TextRobotoB style={CommonStyle.dataText}>
                                            {CommonFunction.currencyFormat(titem.event_price)}
                                            <CustomTextR style={CommonStyle.dataText}>{"원  "}</CustomTextR>
                                            <TextRobotoR style={[CommonStyle.priceText,CommonStyle.fontStrike]}>
                                                {CommonFunction.currencyFormat(titem.price)}
                                                <CustomTextR style={CommonStyle.priceText}>원</CustomTextR>
                                            </TextRobotoR>
                                        </TextRobotoB>
                                    </>
                                    :
                                    <>
                                        <CustomTextB style={CommonStyle.dataText}>{titem.unit}</CustomTextB>
                                        <TextRobotoR style={CommonStyle.dataText}>
                                            {CommonFunction.currencyFormat(titem.price)}원
                                        </TextRobotoR>
                                    </>
                                }
                            </View>
                        </View>                      
                        <View style={styles.bottomBoxRightSubWrap}>
                            <TouchableOpacity style={styles.numberWrap} onPress={()=>this._orderCount('minus',tindex,titem)}>
                                <NativeImage source={require('../../../assets/icons/btn_minus.png')} resizeMode={"contain"} style={styles.numberDataWrap} />
                            </TouchableOpacity>
                            <View style={styles.orderCountWrap}>
                                <TextRobotoR style={CommonStyle.dataText15}>
                                    {CommonFunction.currencyFormat(titem.count)}
                                </TextRobotoR>
                            </View>
                            <TouchableOpacity style={styles.numberWrap} onPress={()=>this._orderCount('plus',tindex,titem)}>
                                <NativeImage source={require('../../../assets/icons/btn_plus.png')} resizeMode={"contain"}style={styles.numberDataWrap}
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
                    <View style={styles.boxRightWrap3}>
                        <TextRobotoM style={styles.menuTitleText4}>{CommonFunction.currencyFormat(this.state.selectedTotalAmount)}원</TextRobotoM>
                    </View>
                </View>
                <View style={[styles.defaultWrap,{minHeight:80}]}>   
                    <TouchableOpacity style={styles.scrollFooterLeftWrap} onPress={()=>this.showPopLayer()}>
                        <CustomTextB style={CommonStyle.scrollFooterText20}>장바구니 담기</CustomTextB>
                    </TouchableOpacity> 
                </View>
            </View>            
        )
    }
    setImages = async() => {
        let selectedFilterCodeList = [];
        console.log('eddddd',this.state.detail_img1_height_origin)
        console.log('eddddd',this.state.detail_img1_width_origin)
        if ( !CommonUtil.isEmpty(this.state.productData.detail_img1) ) {
            selectedFilterCodeList.push({
                url : DEFAULT_CONSTANTS.defaultImageDomain + this.state.productData.detail_img1,
                freeHeight:true,
                freeWidth:true,
                width:this.state.detail_img1_width_origin,
                height:this.state.detail_img1_height_origin
            });
        }  
        if ( !CommonUtil.isEmpty(this.state.productData.detail_img2) ) {
            selectedFilterCodeList.push({
                url : DEFAULT_CONSTANTS.defaultImageDomain + this.state.productData.detail_img2,
                freeHeight:true,freeWidth:true
            });
        }  
        if ( !CommonUtil.isEmpty(this.state.productData.detail_img3) ) {
            selectedFilterCodeList.push({
                url : DEFAULT_CONSTANTS.defaultImageDomain + this.state.productData.detail_img3,
                freeHeight:true
            });
        }  
        if ( !CommonUtil.isEmpty(this.state.productData.detail_img4) ) {
            selectedFilterCodeList.push({
                url : DEFAULT_CONSTANTS.defaultImageDomain + this.state.productData.detail_img4,
                freeHeight:true
            });
        }        
        return selectedFilterCodeList;
    }
    setImageGallery = async( idx ) => {
        let returnArray = await this.setImages()
        this.setState({
            imageIndex: idx,
            thisImages : returnArray,
            isImageViewVisible : true
        })        
    }

    closePopUp = () => {
        this.setState({isImageViewVisible: false,thisImages:[],imageIndex : null})
    }
    render() {
        const ImageFooter = ({ imageIndex, imagesCount }) => (
            <View style={styles.footerRoot}>
                <View style={styles.footerLeftRoot}>
                    <CustomTextL style={styles.footerText}>{`${imageIndex + 1} / ${imagesCount}`}</CustomTextL>
                </View>
                <TouchableOpacity 
                    hitSlop={{left:10,right:10,bottom:10,top:10}}
                    style={styles.footerRightRoot}
                    onPress={()=>this.closePopUp()}
                >
                    <Image source={HEADER_CLOSE_IMAGE} style={CommonStyle.defaultIconImage30} />
                </TouchableOpacity>
            </View>
        )
        if ( this.state.loading ) {
            return (
                <ActivityIndicator animating={this.state.loading} color={DEFAULT_COLOR.base_color} />
            )
        }else {  

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
                <View style={styles.container}>
                    { this.state.showTopButton &&
                        <TouchableOpacity style={styles.fixedUpButton3}onPress={e => this.upButtonHandler()}>
                            <Icon name="up" size={25} color="#000" />
                        </TouchableOpacity>
                    }
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
                                        isCenter : true,
                                        cancleText : '쇼핑계속하기',
                                        okayText : '장바구니이동',
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
                        onScroll={e => this.handleOnScroll(e)}
                    >
                    <View style={styles.defaultWrap}>
                        <View style={styles.thumbnailWrap}>
                            { !CommonUtil.isEmpty(this.state.productData.thumb_img) ?
                                <Image
                                    source={{uri:DEFAULT_CONSTANTS.defaultImageDomain+this.state.productData.thumb_img}}
                                    //resizeMode={"contain"}
                                    style={CommonStyle.fullWidthHeightImage}
                                />
                                :
                                <Image
                                    source={require('../../../assets/icons/no_image.png')}
                                    resizeMode={"contain"}
                                    style={CommonStyle.fullWidthHeightImage}
                                />
                            }
                        </View>     
                    </View>
                    <View style={styles.defaultWrap}>                    
                        <View style={{paddingVertical:10}}>
                            <CustomTextR style={[styles.menuTitleText,{paddingLeft:20}]}>
                                {this.state.productData.product_name}{this.state.productData.is_soldout && <CustomTextR style={styles.menuRedText}> (품절)</CustomTextR>}
                            </CustomTextR>
                        </View>
                        <View style={styles.blockWrap}>
                            <CustomTextR style={[styles.menuTitleText,{paddingLeft:20}]}>판매가격</CustomTextR>
                        </View>
                        <View style={styles.boxWrap}>
                            <View style={styles.boxLeftWrap}>
                                <CustomTextR style={styles.menuTitleText}>낱개</CustomTextR>
                            </View>
                            <View style={styles.boxRightWrap2}>
                                <TextRobotoB style={CommonStyle.dataText15}>
                                    {CommonFunction.currencyFormat(this.state.productData.each_price)}
                                    <CustomTextR style={CommonStyle.dataText15}>원</CustomTextR>
                                </TextRobotoB>
                            </View>
                        </View>
                        { this.state.productData.box_price > 0 &&  
                        <View style={styles.boxWrap}>
                            <View style={styles.boxLeftWrap}>
                                <CustomTextR style={styles.menuTitleText}>박스</CustomTextR>
                            </View>
                            <View style={styles.boxRightWrap2}>
                                <TextRobotoB style={CommonStyle.dataText15}>
                                    {CommonFunction.currencyFormat(this.state.productData.box_price)}
                                    <CustomTextR style={CommonStyle.dataText15}>원{" / "}</CustomTextR>                                    
                                    {CommonFunction.currencyFormat(this.state.productData.box_unit)}
                                    <CustomTextR style={CommonStyle.dataText15}>개입</CustomTextR>
                                </TextRobotoB>
                                <TextRobotoB style={CommonStyle.dataText15}>
                                    <CustomTextR style={CommonStyle.dataText15}>{"개당 "}</CustomTextR>
                                    {CommonFunction.currencyFormat(this.state.productData.box_price/this.state.productData.box_unit)}
                                    <CustomTextR style={CommonStyle.dataText15}>원</CustomTextR>
                                </TextRobotoB>
                            </View>
                        </View>
                        }
                        { this.state.productData.carton_price > 0 &&  
                        <View style={styles.boxWrap}>
                            <View style={styles.boxLeftWrap}>
                                <CustomTextR style={styles.menuTitleText}>카톤</CustomTextR>
                            </View>
                            <View style={styles.boxRightWrap2}>
                                <TextRobotoB style={CommonStyle.dataText15}>
                                    {CommonFunction.currencyFormat(this.state.productData.carton_price)}
                                    <CustomTextR style={CommonStyle.dataText15}>원{" / "}</CustomTextR>                                    
                                    {CommonFunction.currencyFormat(this.state.productData.carton_unit)}
                                    <CustomTextR style={CommonStyle.dataText15}>개입</CustomTextR>
                                </TextRobotoB>
                                <TextRobotoB style={CommonStyle.dataText15}>
                                    <CustomTextR style={CommonStyle.dataText15}>{"개당 "}</CustomTextR>
                                    {CommonFunction.currencyFormat(this.state.productData.carton_price/this.state.productData.carton_unit)}
                                    <CustomTextR style={CommonStyle.dataText15}>원</CustomTextR>
                                </TextRobotoB>
                            </View>
                        </View>
                        }
                        { ( this.state.productData.event_each_price > 0 || this.state.productData.event_box_price > 0 || this.state.productData.event_carton_price > 0 ) &&  
                        <View style={styles.blockWrap}>
                            <CustomTextR style={[styles.menuTitleText,{paddingLeft:20}]}>이벤트 판매가격</CustomTextR>
                        </View>
                        }
                        { this.state.productData.event_each_price > 0 &&  
                        <View style={styles.boxWrap}>
                            <View style={styles.boxLeftWrap}>
                                <CustomTextR style={styles.menuTitleText}>낱개</CustomTextR>
                            </View>
                            <View style={styles.boxRightWrap2}>
                                <TextRobotoB style={CommonStyle.dataText15}>
                                    {CommonFunction.currencyFormat(this.state.productData.event_each_price)}
                                    <CustomTextR style={CommonStyle.dataText15}>원</CustomTextR>
                                </TextRobotoB>                                
                            </View>
                        </View>
                        }
                        { 
                            this.state.productData.event_box_price > 0 &&  
                            <View style={styles.boxWrap}>
                                <View style={styles.boxLeftWrap}>
                                    <CustomTextR style={styles.menuTitleText}>박스</CustomTextR>
                                </View>
                                <View style={styles.boxRightWrap2}>
                                    <TextRobotoB style={CommonStyle.dataText15}>
                                        {CommonFunction.currencyFormat(this.state.productData.event_box_price)}
                                        <CustomTextR style={CommonStyle.dataText15}>원{" / "}</CustomTextR>                                    
                                        {CommonFunction.currencyFormat(this.state.productData.event_box_unit)}
                                        <CustomTextR style={CommonStyle.dataText15}>개입</CustomTextR>
                                    </TextRobotoB>
                                    <TextRobotoB style={CommonStyle.dataText15}>
                                        <CustomTextR style={CommonStyle.dataText15}>{"개당 "}</CustomTextR>
                                        {CommonFunction.currencyFormat(this.state.productData.event_box_price/this.state.productData.event_box_unit)}
                                        <CustomTextR style={CommonStyle.dataText15}>원</CustomTextR>
                                    </TextRobotoB>
                                </View>
                            </View>
                        }
                        { 
                            this.state.productData.event_carton_price > 0 &&  
                            <View style={styles.boxWrap}>
                                <View style={styles.boxLeftWrap}>
                                    <CustomTextR style={styles.menuTitleText}>카톤</CustomTextR>
                                </View>
                                <View style={styles.boxRightWrap2}>
                                    <TextRobotoB style={CommonStyle.dataText15}>
                                        {CommonFunction.currencyFormat(this.state.productData.event_carton_price)}
                                        <CustomTextR style={CommonStyle.dataText15}>원{" / "}</CustomTextR>                                    
                                        {CommonFunction.currencyFormat(this.state.productData.event_carton_unit)}
                                        <CustomTextR style={CommonStyle.dataText15}>개입</CustomTextR>
                                    </TextRobotoB>
                                    <TextRobotoB style={CommonStyle.dataText15}>
                                        <CustomTextR style={CommonStyle.dataText15}>{"개당 "}</CustomTextR>
                                        {CommonFunction.currencyFormat(this.state.productData.event_carton_price/this.state.productData.event_carton_unit)}
                                        <CustomTextR style={CommonStyle.dataText15}>원</CustomTextR>
                                    </TextRobotoB>
                                </View>
                            </View>
                        }
                    </View>
                    <View style={CommonStyle.termLineWrap} />                    
                    {this.enterCount()}  
                    <View style={CommonStyle.termLineWrap80} />
                    <View style={{flex:1,marginVertical:2,paddingVertical:20,backgroundColor : "#fff",}}>
                        <View style={styles.boxWrap}>
                            <View style={styles.boxLeftWrap}>
                                <CustomTextR style={styles.menuTitleText}>판매단위</CustomTextR>
                            </View>
                            <View style={styles.boxRightWrap}>
                                <CustomTextR style={CommonStyle.dataText15}>
                                    {this.state.productData.each_price > 0 && '낱개'}
                                    {this.state.productData.box_price > 0 && ',박스'}
                                    {this.state.productData.carton_price > 0 && ',카톤'}
                                </CustomTextR>
                            </View>
                        </View>
                        {
                            this.state.productData.category_type === 'B' &&
                            <View style={styles.boxWrap}>
                                <View style={styles.boxLeftWrap}>
                                    <CustomTextR style={styles.menuTitleText}>제조사</CustomTextR>
                                </View>
                                <View style={styles.boxRightWrap}>
                                    <CustomTextR style={CommonStyle.dataText15}>{this.state.productData.category_name}</CustomTextR>
                                </View>
                            </View>
                        }
                        <View style={styles.boxWrap}>
                            <View style={styles.boxLeftWrap}>
                                <CustomTextR style={styles.menuTitleText}>재질</CustomTextR>
                            </View>
                            <View style={styles.boxRightWrap}>
                                <CustomTextR style={CommonStyle.dataText15}>{this.state.productData.material}</CustomTextR>
                            </View>
                        </View>
                        <View style={styles.boxWrap}>
                            <View style={styles.boxLeftWrap}>
                            </View>
                            <View style={styles.boxRightWrap}>
                                {this.state.productData.is_nonpoint &&
                                <CustomTextR style={CommonStyle.requiredText2}>*리워드 적립비대상 상품입니다.</CustomTextR>
                                }
                            </View>
                        </View>
                    </View>
                    <View style={styles.productDetailWrap}>
                        <View style={styles.blockWrap}>
                            <CustomTextR style={[styles.menuTitleText,{paddingLeft:20}]}>상세이미지</CustomTextR>
                        </View>
                        <View style={styles.detailImageWrap}>
                            { 
                                !CommonUtil.isEmpty(this.state.productData.detail_img1) &&
                                <TouchableOpacity
                                    onPress={() => this.setImageGallery(0)}
                                >
                                <FastImage
                                    source={{
                                        uri:DEFAULT_CONSTANTS.defaultImageDomain+this.state.productData.detail_img1,
                                        priority: FastImage.priority.normal,
                                    }}
                                    resizeMode={FastImage.resizeMode.contain}
                                    style={{width: SCREEN_WIDTH-20,height: this.state.detail_img1_height}}
                                    /* onLoad={evt => {                                    
                                        if ( evt.nativeEvent) {
                                            this.setState({
                                                detail_img1_width : evt.nativeEvent.width,
                                                detail_img1_height : evt.nativeEvent.height
                                            })
                                        }
                                    }} */
                                />
                                </TouchableOpacity>
                            }
                        </View>
                        <View style={styles.detailImageWrap}>
                            { 
                                !CommonUtil.isEmpty(this.state.productData.detail_img2) &&
                                <FastImage
                                    source={{
                                        uri:DEFAULT_CONSTANTS.defaultImageDomain+this.state.productData.detail_img2,
                                        priority: FastImage.priority.normal,
                                    }}
                                    resizeMode={FastImage.resizeMode.contain}
                                    style={{width: SCREEN_WIDTH-20,height: this.state.detail_img2_height}}
                                />  
                            }
                        </View>
                        <View style={styles.detailImageWrap}>
                            { 
                                !CommonUtil.isEmpty(this.state.productData.detail_img3) &&
                                <FastImage
                                    source={{
                                        uri:DEFAULT_CONSTANTS.defaultImageDomain+this.state.productData.detail_img3,
                                        priority: FastImage.priority.normal,
                                    }}
                                    resizeMode={FastImage.resizeMode.contain}
                                    style={{width: SCREEN_WIDTH-20,height: this.state.detail_img3_height}}
                                />  
                            }
                        </View>
                        <View style={styles.detailImageWrap}>
                            { 
                                !CommonUtil.isEmpty(this.state.productData.detail_img4) &&
                                <FastImage
                                    source={{
                                        uri:DEFAULT_CONSTANTS.defaultImageDomain+this.state.productData.detail_img4,
                                        priority: FastImage.priority.normal,
                                    }}
                                    resizeMode={FastImage.resizeMode.contain}
                                    style={{width: SCREEN_WIDTH-20,height: this.state.detail_img4_height}}
                                />  
                            }
                        </View>
                    </View>
                    <View style={CommonStyle.termLineWrap80} />
                    {this.enterCount()}
                    { 
                        this.state.moreLoading &&
                        <View style={CommonStyle.moreWrap}>
                            <Loader screenState={{isLoading:this.state.moreLoading,color:DEFAULT_COLOR.base_color}} />
                        </View>
                    }
                    </ScrollView>
                    <Modal 
                        visible={this.state.isImageViewVisible} transparent={true}
                        onRequestClose={() => this.setState({ isImageViewVisible: false })}
                        style={{margin:0,padding:0}}
                    >
                        <ImageViewer      
                            //glideAlways
                            imageUrls={this.state.thisImages}
                            index={this.state.imageIndex}
                            enableSwipeDown={true}
                            useNativeDriver={true}
                            enablePreload={true}
                            saveToLocalByLongPress={true}
                            renderIndicator={this.renderIndicator}
                            maxOverflow={300}
                            onSwipeDown={() => this.setState({ isImageViewVisible: false })}
                            renderFooter={(currentIndex) => (
                                <ImageFooter imageIndex={currentIndex} imagesCount={this.state.thisImages.length} />
                            )}
                        />
                    </Modal>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fixedUpButton3 : {
        position:'absolute',bottom:40,right:20,width:50,height:50,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',zIndex:3,borderColor:'#ccc',borderWidth:1,borderRadius:25,opacity:0.5
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
        flex:1,backgroundColor:'#fff',padding:0
    },
    blankArea : {
        flex:1,height:200,backgroundColor:'#fff'
    },
    blockWrap : {
        paddingVertical:Platform.OS === 'ios' ? 10 : 0,marginBottom:20,backgroundColor:'#f7f7f7'
    },
    productDetailWrap : {
        flex:1,borderTopWidth:1,borderTopColor:DEFAULT_COLOR.input_border_color,backgroundColor : "#fff"
    },
    cartWrap : {
        position:'absolute',right:0,bottom:0,width:SCREEN_WIDTH,height:200,backgroundColor:DEFAULT_COLOR.base_background_color,
        borderTopWidth:5,borderTopColor:'#ccc'
    },
    thumbnailWrap : {
        paddingHorizontal:0,marginBottom:20,justifyContent:'center',alignItems:'center',overflow:'hidden'
    },
    detailImageWrap : {
        paddingHorizontal:10
    },
    bottomBuyTextContentWrapper : {
        width:'100%',justifyContent: 'flex-start',alignItems: 'center',backgroundColor:'#fff',paddingHorizontal:15
    },  
    unitWrap : {
        flexDirection:'row',flexGrow:1,alignItems:'center'
    },
    checkboxLeftWrap : {
        width:30,
        justifyContent:'center',
        alignItems:'center'
    },
    bottomBoxLeftSubWrap : {
        flex:3,
        flexDirection:'row',    
        flexGrow:1,    
        paddingLeft:15,paddingVertical: 5
    },
    bottomBoxRightSubWrap : { 
        flex:1.5,paddingRight:5,paddingVertical:5,justifyContent:'center',alignItems:'center',flexDirection:'row',flexGrow:1
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
        flex:1,backgroundColor:DEFAULT_COLOR.base_color,justifyContent:'center',alignItems:'center',paddingVertical:15
    },
    scrollFooterLeftWrap2 : {
        flex:1,backgroundColor:'#ff0000',justifyContent:'center',alignItems:'center',paddingVertical:15
    },
    defaultWrap : {
        flex:1,backgroundColor : "#fff"
    },
    totalPriceWrap : {
        flex:1,backgroundColor : "#f7f7f7",paddingVertical:15,flexDirection:'row',marginBottom:20
    },
    menuRedText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),paddingLeft:10,color:'#ff0000'
    },
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),paddingRight:10
    },
    menuTitleText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#343434'
    },
    salesText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),color:'#0059a9'
    },
    percentWrap : {
        borderWidth:0.5,borderColor:DEFAULT_COLOR.base_color,borderRadius:4,marginLeft:5,
        paddingHorizontal:2
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
    boxRightWrap2 : {
        flex:3,justifyContent:'center',
    },
    orderCountWrap : {
        width:60,height:CommonUtil.dpToSize(25),borderTopWidth:1,borderTopColor:'#ccc',borderBottomWidth:1,borderBottomColor:'#ccc',justifyContent:'center',alignItems:'center'
    },
    boxLeftWrap2 : {
        flex:1,        
        justifyContent:'center',
        alignItems:'center',
        paddingLeft:10
    },
    boxRightWrap3 : {
        flex:2,        
        justifyContent:'center',
        alignItems:'flex-end',paddingRight:25
    },
    numberWrap : {
        width:CommonUtil.dpToSize(25)
    },
    numberDataWrap : {
        width:CommonUtil.dpToSize(25),height:CommonUtil.dpToSize(25)
    },
    renderIconDataWrap : {
        flex:1,flexDirection:'row',opacity:1,backgroundColor:DEFAULT_COLOR.base_color,paddingVertical:15
    },
    renderIconData : {
        flex:1,flexDirection:'row',paddingVertical:8,justifyContent:'center',alignItems:'center'
    },
    menuTextWhite : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#fff'
    },
    /**** bottom  ******/
    contentContainer: {
        flex : 1,
        alignItems: 'center',
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
    },
    footerRoot: {
        flex:1,
        flexDirection:'row',
        height: 64,
        width : SCREEN_WIDTH,
        paddingHorizontal:50,
        backgroundColor: "#00000077",
        alignItems: "center",
        justifyContent: "center"
    },
    footerLeftRoot : {
        flex:6,
        justifyContent:'center',
        alignItems:'center'
    },
    footerRightRoot : {
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    footerText: {
        fontSize: 17,
        color: "#FFF"
    }
});


function mapStateToProps(state) {
    return {
        userToken : state.GlabalStatus.userToken,
        nonUserToken : state.GlabalStatus.nonUserToken,
        userCartCount : state.GlabalStatus.userCartCount,
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