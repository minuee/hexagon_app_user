import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Text,Dimensions,RefreshControl, PixelRatio,Image,TouchableOpacity,TouchableHighlight, Platform,Alert} from 'react-native';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import {Overlay,CheckBox,Tooltip,Input} from 'react-native-elements';
import SlidingUpPanel from 'rn-sliding-up-panel';
//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonStyle from '../../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM,TextRobotoB,TextRobotoL, TextRobotoM,TextRobotoR} from '../../Components/CustomText';
import CommonFunction from '../../Utils/CommonFunction';
import CommonUtil from '../../Utils/CommonUtil';
import Loader from '../../Utils/Loader';
import ToggleBox from '../../Utils/ToggleBox';
import PopLayerOption from './PopLayerOption';
import { apiObject } from "../Apis";

const CHECKNOX_OFF = require('../../../assets/icons/checkbox_off.png');
const CHECKNOX_ON = require('../../../assets/icons/checkbox_on.png');

class CartScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            popLayerView : false,
            toggleStatus : false,
            closepopLayer :  this.closepopLayer.bind(this),
            optionProductIndex : 0,
            optionProduct : 0,
            allChecked : false,
            cartArray : [],

            selectedArray : [],
            selectedTotalAmount : 0,
            selectedRewardAmount : 0,
            seletedSettleTotalCount : 0,
            selectedTotalDiscount : 0,
            selectedDeliveryAmount : 0,
            seletedSettleAmount : 0,
            userRate : 0.005
        }

        this._panel = React.createRef();
    }

    resetForm = () => {
        this.setState({
            allChecked : false,
            selectedArray : [],
            selectedTotalAmount : 0,
            selectedRewardAmount : 0,
            seletedSettleTotalCount : 0,
            selectedTotalDiscount : 0,
            seletedSettleAmount : 0
        })
    }
    setCartList = async(data) => {
        let returnArray = [];
        await data.forEach(function(element){       
            let initialValue = 0;  
            let initialValue2 = 0;
            let initialValue3 = 0;
            let eachSoldCount = 0; 
            let boxSoldCount = 0;
            let cartonSoldCount = 0;
            let newChild = element.child.map(function(obj){
                let rObj = {};
                rObj['event_price'] = obj.unit_type === 'Carton' ? element.event_carton_price : obj.unit_type === 'Box' ? element.event_box_price : element.event_each_price;
                rObj['event_stock'] = obj.unit_type === 'Carton' ? element.event_carton_stock : obj.unit_type === 'Box' ? element.event_box_stock : element.event_each_stock;
                rObj['cart_pk'] = obj.cart_pk;
                rObj['quantity'] =  (rObj['event_stock'] > 0 && obj.quantity > rObj['event_stock'] ) ? rObj['event_stock'] : obj.quantity;
                rObj['unit_type'] = obj.unit_type;
                rObj['price'] = obj.unit_type === 'Carton' ? element.carton_price : obj.unit_type === 'Box' ? element.box_price : element.each_price;
                eachSoldCount = obj.unit_type === 'Each' ? obj.quantity : 0;
                boxSoldCount = obj.unit_type === 'Box' ? obj.quantity : 0;
                cartonSoldCount = obj.unit_type === 'Carton' ? obj.quantity : 0;
                return rObj;
            });            
            returnArray.push({
                ...element,
                eachSoldCount : eachSoldCount,
                boxSoldCount : boxSoldCount,
                cartonSoldCount : cartonSoldCount,
                id : element.product_pk,
                product_name : element.product_name,
                product_pk : element.product_pk,
                thumb_img : element.thumb_img,
                quantity : newChild.reduce(function(acc,cur) {
                    return acc+cur.quantity
                },initialValue),
                totalPrice : newChild.reduce(function(acc,cur) {
                    return acc+(cur.quantity*cur.price)
                },initialValue2),
                eventTotalPrice : newChild.reduce(function(acc,cur) {
                    return acc+(cur.quantity*cur.event_price)
                },initialValue3),
                child : newChild
            })
        });         
        this.setState({cartArray : returnArray,moreLoading:false,loading:false});
    }
    getBaseData = async(userToken) => {
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/cart/list/' + userToken.member_pk;
            const token = userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_getPageList(this.props,url,token,sendData);
            if ( returnCode.code === '0000'  ) {
                this.setCartList(returnCode.data.cartList)
            }else{
                CommonFunction.fn_call_toast('RecommScreen 처리중 오류가 발생하였습니다.',2000);
                this.setState({moreLoading:false,loading:false})
            }
        }catch(e){            
            this.setState({loading:false,moreLoading : false})
        }
    }

    async UNSAFE_componentWillMount() {
        if ( !CommonUtil.isEmpty(this.props.userToken)) {
            this.setState({
                userRate :  this.props.userToken.gradeRate                
            })            
            await this.getBaseData(this.props.userToken);
        }else{
            CommonFunction.fn_call_toast('잘못된 접근입니다..',2000);
            this.props.navigation.goBack(null)
        }
        this.props.navigation.addListener('focus', () => {
            this.getBaseData(this.props.userToken); 
            this.resetForm();
        })
        this.props.navigation.addListener('blur', () => {            
            //this._panel.hide();  
        })
    }

    componentDidMount() {
        //this._panel.hide();  
    }
       
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

    removeActionCarts = async(item = null, idx = null) => {
        this.setState({moreLoading:true})
        let targetArray = await this.state.selectedArray.map(function (info) {
            return {product_pk : info.product_pk};
        });
        if ( !CommonUtil.isEmpty(item) ) {
            targetArray = [{product_pk : item.product_pk}]
        }
        let returnCode = await this.deleteCartArray(targetArray);
        if ( returnCode ) {
            let returnArray = await this.state.cartArray.filter((info) => info.checked !== true); 
            setTimeout(
                () => {            
                    this.setState({
                        moreLoading:false,
                        cartArray : returnArray,
                        selectedArray : [],
                        selectedTotalAmount : 0,
                        selectedTotalDiscount : 0,
                        seletedSettleAmount : 0,
                        seletedSettleTotalCount : 0
                    })
                },500
            )
        }
    }

    removeCartArray = () => {
        if ( this.state.selectedArray.length > 0 ) {
            Alert.alert(DEFAULT_CONSTANTS.appName, '선택하신 상품을 장바구니에서 삭제하시겠습니까?',
            [
                {text: '확인', onPress: () => this.removeActionCarts()},
                {text: '취소', onPress: () => console.log('취소')},
            ]);
        }else{
            CommonFunction.fn_call_toast('삭제할 상품을 선택해주세요',2000)
        }
    }

    orderCart = async() => {        
        this.props.navigation.navigate('OrderingStack',{
            screenData: {
                selectedArray : this.state.selectedArray,
                selectedTotalAmount : this.state.selectedTotalAmount,
                selectedRewardAmount : this.state.selectedRewardAmount,
                userRate : this.state.userRate,
                seletedSettleTotalCount : this.state.seletedSettleTotalCount,
                selectedTotalDiscount : this.state.selectedTotalDiscount,
                selectedDeliveryAmount : this.state.selectedDeliveryAmount,
                seletedSettleAmount : this.state.seletedSettleAmount
            }
        })
    }

    actionOrder = () => {        
        if ( this.state.selectedArray.length > 0 ) {
            let nullCount = 0;
            this.state.selectedArray.forEach((item) => {
                if( item.quantity == 0 || item.totalPrice == 0 ) {
                    nullCount++;
                }
            })
            console.log('nullCount',  nullCount)
            if ( nullCount > 0 ) {
                CommonFunction.fn_call_toast('최소 1개이상 수량선택을 해주세요',2000);
                return;
            }else{
                Alert.alert(DEFAULT_CONSTANTS.appName, '주문하시겠습니까?',
                [
                    {text: '확인', onPress: () => this.orderCart()},
                    {text: '취소', onPress: () => console.log('취소')},
                ]);
            }
            
        }else{
            CommonFunction.fn_call_toast('구매할 상품을 선택해주세요',2000)
        }
    }

    removeCartAlert = (item,idx) => {
        Alert.alert(DEFAULT_CONSTANTS.appName, '장바구니에서 삭제하시겠습니까?',
        [
            {text: '확인', onPress: () => this.removeActionCarts(item,idx)},
            {text: '취소', onPress: () => console.log('취소')},
        ]);
    }
    removeCart = async(item,idx) => {
        this.setState({moreLoading:true})
        let resetArray = await this.state.cartArray.filter((info) => info.id !== item.id);
        let returnArray = await resetArray.filter((info) => info.checked === true); 
        await this.calTotalAmount(returnArray);
        this.setState({cartArray : resetArray })
    }
    removeEachAlert = (idx,tidx,item) => {
        if ( this.state.cartArray[idx].child.length === 1 ) {
            Alert.alert(DEFAULT_CONSTANTS.appName, '해당옵션삭제시 상품도 장바구니에서 삭제됩니다.\n옵션을 삭제하시겠습니까?',
            [
                {text: '확인', onPress: () => this.removeCart(item,idx)},
                {text: '취소', onPress: () => console.log('취소')},
            ]);
        }else{
            Alert.alert(DEFAULT_CONSTANTS.appName, '해당옵션을 삭제하시겠습니까?',
            [
                {text: '확인', onPress: () => this.removeEachUnit(idx,tidx,item)},
                {text: '취소', onPress: () => console.log('취소')},
            ]);
        }
    }

    resetSelectedArray = async() => {        
        let returnArray = await this.state.cartArray.filter((info) => info.checked === true); 
        this.setState({selectedArray : returnArray });
        return returnArray;
    }
    removeEachUnit = async(idx,tidx,item) => {

        this.setState({moreLoading:true})
        let cart_pk = this.state.cartArray[idx].child[tidx].cart_pk;       
        let returnCode = await this.deleteCartEach(cart_pk);        
        if ( returnCode ) {
            let newOptions = await this.state.cartArray[idx].child.filter((info,index) => index !== tidx); 
            let initialValue = 0;
            this.state.cartArray[idx].child = newOptions;
            this.state.cartArray[idx].totalPrice = newOptions.reduce(function(acc,cur) {
                return acc+(cur.quantity*cur.price)
            },initialValue);
            let selectedArray = await this.resetSelectedArray()
            let returnArray = [];
            await selectedArray.forEach(function(element,index,array){       
                let initialValue = 0;  
                let initialValue2 = 0;  
                let initialValue3 = 0;  
                returnArray.push({
                    ...element,
                    quantity : element.child.reduce(function(acc,cur) {
                        return acc+cur.quantity
                    },initialValue),
                    totalPrice : element.child.reduce(function(acc,cur) {
                        return acc+(cur.quantity*cur.price)
                    },initialValue2),
                    eventTotalPrice : element.child.reduce(function(acc,cur) {
                        return acc+(cur.quantity*cur.event_price)
                    },initialValue3),
                    checked : true,
                })
            });
            await this.calTotalAmount(returnArray);
        }
    }
    
    deleteCartEach = async(cart_pk) => {
        this.setState({moreLoading :true})
        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/cart/remove/' + cart_pk + '/'+this.props.userToken.member_pk;            
            const token = this.props.userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_removeCommon(this.props,url,token,sendData);            
            this.setState({moreLoading:false,loading:false})
            if ( returnCode.code === '0000'  ) {
                let userCartCount = CommonUtil.isEmpty(returnCode.data.totalCount) ? 0 : returnCode.data.totalCount ;
                this.props._fn_getUserCartCount(userCartCount);
                CommonFunction.fn_call_toast('정상적으로 삭제되었습니다.' ,1500);
                await this.getBaseData(this.props.userToken);
                return true;
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.\n[ERR]' + returnCode.msg ,1500);
                return false;
            }
        }catch(e){
            this.setState({loading:false,moreLoading : false})
            return false;
        }
    }

    deleteCartArray = async(product_array) => {
        this.setState({moreLoading :true})
        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1//cart/remove/product';
            const token = this.props.userToken.apiToken;
            let sendData = {
                member_pk : this.props.userToken.member_pk,
                data_array : product_array
            };            
            returnCode = await apiObject.API_updateCommon(this.props,url,token,sendData);            
            this.setState({moreLoading:false,loading:false})
            if ( returnCode.code === '0000'  ) {
                let userCartCount = CommonUtil.isEmpty(returnCode.data.totalCount) ? 0 : returnCode.data.totalCount ;
                this.props._fn_getUserCartCount(userCartCount);
                CommonFunction.fn_call_toast('정상적으로 삭제되었습니다.' ,1500);
                await this.getBaseData(this.props.userToken);
                return true;
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.\n[ERR]' + returnCode.msg ,1500);
                return false;
            }
        }catch(e){
            this.setState({loading:false,moreLoading : false})
            return false;
        }

    }
    btnOrderCount = async(mode,item,index,tindex, val = 0) => {
        console.log('btnOrderCount',mode,val)
        let orderCount = this.state.cartArray[index].child[tindex].quantity;
        let eventStock = this.state.cartArray[index].child[tindex].event_stock;
        let event_price = this.state.cartArray[index].child[tindex].event_price;
        let initialValue = 0;  
        let initialValue2 = 0;  
        if ( mode === 'direct' ) {            
                this.setState({moreLoading:true})             
                this.state.cartArray[index].child[tindex].quantity = parseInt(val*1);
                let returnCode = await  this.updateQuantity(item,parseInt(val*1));
                if (returnCode )  {
                    this.state.cartArray[index].totalPrice = this.state.cartArray[index].child.reduce(function(acc,cur) {
                        return acc+(cur.quantity*cur.price)
                    },initialValue);
                    this.state.cartArray[index].eventTotalPrice = this.state.cartArray[index].child.reduce(function(acc,cur) {
                        return acc+(cur.quantity*cur.event_price)
                    },initialValue2);
                }

            
        }else if ( mode === 'minus') {
            if ( orderCount > 1 ) {  
                this.setState({moreLoading:true})             
                this.state.cartArray[index].child[tindex].quantity = orderCount -1;
                let returnCode = await  this.updateQuantity(item,orderCount -1);
                if (returnCode )  {
                    this.state.cartArray[index].totalPrice = this.state.cartArray[index].child.reduce(function(acc,cur) {
                        return acc+(cur.quantity*cur.price)
                    },initialValue);
                    this.state.cartArray[index].eventTotalPrice = this.state.cartArray[index].child.reduce(function(acc,cur) {
                        return acc+(cur.quantity*cur.event_price)
                    },initialValue2);
                }
            }
        }else{
            if ( eventStock > 0  && event_price> 0 ) {
                if ( parseInt(orderCount+1) > eventStock ) {
                    CommonFunction.fn_call_toast('해당상품은 판매수량이 제한되어 있습니다.',1500)
                    return;
                }
            }
            this.setState({moreLoading:true})
            this.state.cartArray[index].child[tindex].quantity = orderCount+1;
            let returnCode2 = await this.updateQuantity(item,orderCount+1);
            if ( returnCode2 )  {
                this.state.cartArray[index].totalPrice = this.state.cartArray[index].child.reduce(function(acc,cur) {
                    return acc+(cur.quantity*cur.price)
                },initialValue);
                this.state.cartArray[index].eventTotalPrice = this.state.cartArray[index].child.reduce(function(acc,cur) {
                    return acc+(cur.quantity*cur.event_price)
                },initialValue2);
            }
        }
         
        if ( this.state.selectedArray.length > 0 ) {            
            let returnArray = await this.state.cartArray.filter((info) => info.checked === true);
            await this.calTotalAmount(returnArray);
        }else{
            this.setState({moreLoading :false})
        }
    }

    updateQuantity = async( item,qty ) => {        
        this.setState({moreLoading:true})
        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/cart/modify/quantity/'+ item.cart_pk;
            const token = this.props.userToken.apiToken;
            let sendData = {
                quantity : qty
            }
            returnCode = await apiObject.API_updateCommon(this.props,url,token,sendData);          
            if ( returnCode.code === '0000'  ) {
                return true;
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.\n[ERR]' + returnCode.msg ,2000);
                return false;
            }
        }catch(e){
            return false;
        }

    } 
    setAllCheck = async( bool = false ) => {
        this.setState({moreLoading:true})
        let isBool = CommonUtil.isEmpty(bool) ? this.state.allChecked  : bool;
        let returnArray = [];
        if ( isBool ) {
            await this.calTotalAmount(returnArray);
            this.setState({allChecked : false})
        }else{
            let targetArray = this.state.cartArray.filter((info) =>  info.is_soldout === false );
            await targetArray.forEach(function(element,index,array){       
                let initialValue = 0;  
                let initialValue2 = 0;  
                let initialValue3 = 0;  
                returnArray.push({
                    ...element,
                    quantity : element.child.reduce(function(acc,cur) {
                        return acc+cur.quantity
                    },initialValue),
                    totalPrice : element.child.reduce(function(acc,cur) {
                        return acc+(cur.quantity*cur.price)
                    },initialValue2),
                    eventTotalPrice : element.child.reduce(function(acc,cur) {
                        return acc+(cur.quantity*cur.event_price)
                    },initialValue3),
                    child:element.child,
                    checked : true,
                })
            });             
            await this.calTotalAmount(returnArray);
            this.setState({allChecked : true})
        }
    }
    setDeliveryCost = async(price) => {
        let deliveryCost = 5500;
        if ( this.props.userToken.gradeCode === 'Bronze') {
            if ( price >= parseInt(DEFAULT_CONSTANTS.bronzeDeliveryFreeCost) ) {
                deliveryCost = 0;
            }
        }else if ( this.props.userToken.gradeCode === 'Silver') {
            if ( price >= parseInt(DEFAULT_CONSTANTS.silverDeliveryFreeCost) ) {
                deliveryCost = 0;
            }
        }else{

        }
        return deliveryCost;
    }

    calTotalAmount = async(returnArrayOrigin) => {
        let returnArray = [];
        let rewardPoint = 0;
        let eachSoldCount = 0; 
        let boxSoldCount = 0;
        let cartonSoldCount = 0;
        let eachEventStock = 0; 
        let boxEventStock = 0;
        let cartonEventStock = 0;
        let eachEventPrice = 0;
        let boxEventPrice = 0;
        let cartonEventPrice = 0;
        let eventLimitAmount = 0;
        //console.log('userRate',this.state.userRate)
        returnArrayOrigin.forEach(function(element,index){ 
            
            let pointTarget = element.eventTotalPrice > 0 ?  element.eventTotalPrice : element.totalPrice;
            //let pointTargetTax = pointTarget*0.1;
            if ( element.is_nonpoint === false ) { 
                rewardPoint = parseInt(pointTarget *0.9);
                //console.log('returnArrayOrigin',index, element.eventTotalPrice,element.totalPrice, rewardPoint)
            }
            eachSoldIndex = element.child.findIndex((info)=> info.unit_type === 'Each');
            boxSoldIndex = element.child.findIndex((info)=> info.unit_type === 'Box');
            cartonSoldIndex = element.child.findIndex((info)=> info.unit_type === 'Carton');
            eachSoldCount = eachSoldIndex != -1 ? element.child[eachSoldIndex].quantity : 0;
            boxSoldCount = boxSoldIndex != -1 ? element.child[boxSoldIndex].quantity : 0;
            cartonSoldCount = cartonSoldIndex != -1 ? element.child[cartonSoldIndex].quantity : 0;
            eachStockIndex = element.child.findIndex((info)=> (info.unit_type === 'Each' && info.event_stock > 0 && info.event_price > 0 ));
            boxStockIndex = element.child.findIndex((info)=> (info.unit_type === 'Box' && info.event_stock > 0 && info.event_price > 0 ));
            cartonStockIndex = element.child.findIndex((info)=> (info.unit_type === 'Carton' && info.event_stock > 0 && info.event_price > 0 ));
            eachEventStock = eachStockIndex != -1 ? element.child[eachStockIndex].quantity : 0;
            boxEventStock = boxStockIndex != -1 ? element.child[boxStockIndex].quantity : 0;
            cartonEventStock = cartonStockIndex != -1 ? element.child[cartonStockIndex].quantity : 0;
            eachEventPrice = eachStockIndex != -1 ? element.child[eachStockIndex].event_price*eachEventStock : 0;
            boxEventPrice = boxStockIndex != -1 ? element.child[boxStockIndex].event_price*boxEventStock : 0;
            cartonEventPrice = cartonStockIndex != -1 ? element.child[cartonStockIndex].event_price*cartonEventStock : 0;
            eventLimitAmount = eachEventPrice+boxEventPrice+cartonEventPrice;
            returnArray.push({
                ...element,
                eachSoldCount : eachSoldCount,
                boxSoldCount : boxSoldCount,
                cartonSoldCount : cartonSoldCount,
                eachEventStock : eachEventStock,
                boxEventStock : boxEventStock,
                cartonEventStock : cartonEventStock,
                eventLimitAmount : eventLimitAmount,
                rewardPoint : rewardPoint
            })
        })        
        let seletedSettleTotalCount = 0;
        let initialValue = 0;  
        let initialValue2 = 0;  
        let initialValue3 = 0;  
        let selectedTotalAmount = await returnArray.reduce(function(acc,cur) {
            return acc+cur.totalPrice
        },initialValue);   
        let selectedRewardAmount = await returnArray.reduce(function(acc,cur) {
            return acc+cur.rewardPoint
        },initialValue3);        
        let selectedTotalDiscount = await returnArray.reduce(function(acc,cur) {
            return cur.eventTotalPrice > 0 ? acc+(cur.totalPrice-cur.eventTotalPrice) : acc+0
        },initialValue2);
        let selectedDeliveryAmount = returnArray.length === 0 ? 0 :  await this.setDeliveryCost(selectedTotalAmount-selectedTotalDiscount);
        let seletedSettleAmount = selectedTotalAmount + selectedDeliveryAmount - selectedTotalDiscount;
        //console.log('selectedRewardAmount',selectedRewardAmount);
        await this.setState({
            selectedArray : returnArray,
            selectedTotalAmount : selectedTotalAmount,
            selectedRewardAmount : selectedRewardAmount,
            seletedSettleTotalCount : returnArray.reduce(function(acc,cur) {
                return acc+cur.quantity
            },seletedSettleTotalCount),
            selectedTotalDiscount : selectedTotalDiscount,
            selectedDeliveryAmount : selectedDeliveryAmount,
            seletedSettleAmount : seletedSettleAmount
        })
        this.setState({ moreLoading:false})
    }

    checkItem = async(item,index) => {
        this.setState({moreLoading:true});
        let initialValue = 0;  
        let initialValue2 = 0;  
        let initialValue3 = 0;       
        if ( CommonUtil.isEmpty(item.checked) || item.checked === false) {
            let returnArray = this.state.selectedArray;
            await returnArray.push({
                ...item,
                quantity : item.child.reduce(function(acc,cur) {
                    return acc+cur.quantity
                },initialValue),
                totalPrice : item.child.reduce(function(acc,cur) {
                    return acc+(cur.quantity*cur.price)
                },initialValue2),
                eventTotalPrice : item.child.reduce(function(acc,cur) {
                    return acc+(cur.quantity*cur.event_price)
                },initialValue3),
                child:item.child,
                checked : true
            })
            this.state.cartArray[index].checked = true;            
            await this.calTotalAmount(returnArray);
        }else{
            this.setState({allChecked : false })
            let returnArray = await this.state.selectedArray.filter((info) => info.id !== item.id); 
            this.state.cartArray[index].checked = false;
            await this.calTotalAmount(returnArray);
        }
    }

    openOptionSet = async(item,idx) => {        
        let reitem = {...item,product_pk : item.product_pk}
        await this.setState({
            optionProductIndex : idx,
            optionProduct : reitem,
        })
        this.setState({popLayerView:true})
    }

    closepopLayer = async(arr=null) => {
        console.log('closepopLayer',arr)
        if ( !CommonUtil.isEmpty(arr)) {
            this.state.cartArray[this.state.optionProductIndex] = arr;
            await this.setAllCheck(true);
        }
        this.setState({ popLayerView: false})
    }; 

    renderTooltip = (mode) => {
        if ( mode === 'delivery' ) {
            return (<View style={{width:'100%',padding:5,backgroundColor:'#ccc'}}>
                <CustomTextB style={CommonStyle.dataText}>무료배송 기준 </CustomTextB>
                <CustomTextR style={CommonStyle.dataText}>브론즈:결제금액  {CommonFunction.currencyFormat(DEFAULT_CONSTANTS.bronzeDeliveryFreeCost)}만원 이상 주문시 </CustomTextR>
                <CustomTextR style={CommonStyle.dataText}>실버:결제금액  {CommonFunction.currencyFormat(DEFAULT_CONSTANTS.silverDeliveryFreeCost)}만원 이상 주문시 </CustomTextR>
                <CustomTextR style={CommonStyle.dataText}>골드이상 무료배송 </CustomTextR>
            </View>)
        }else{
            return (<View style={{width:'100%',padding:5,backgroundColor:'#ccc'}}>
                <CustomTextB style={CommonStyle.dataText}>적립포인트 산정 (*비대상제외) </CustomTextB>
                <CustomTextR style={CommonStyle.dataText}>순발주금액(결제금액 - 부가세(10%) - 포인트/쿠폰사용금액 )*적립률</CustomTextR>
                <CustomTextR style={CommonStyle.dataText}>적립률: 등급별 상이</CustomTextR>
            </View>)
        }
    }

    moveDetail = (item) => {
        this.props.navigation.navigate('ProductDetailStack',{
            screenData:item
        })
    }
    
    togglePanel = () => {      
        console.log('togglePanel')  
        if ( this.state.toggleStatus ) {
            this._panel.hide();
            this.setState({toggleStatus:false})
        }else{            
            this._panel.show();
            this.setState({toggleStatus:true})
        }        
    }

    setPanelStatus = (xy) => {
        const BaseBottom =  Platform.OS === 'ios' ? DEFAULT_CONSTANTS.BottomHeight : DEFAULT_CONSTANTS.BottomHeight+20;
        if ( xy <= BaseBottom ) {
            this.setState({toggleStatus:false})
        }else{
            this.setState({toggleStatus:true})
        }
    }
    render() {
        if ( this.state.loading ) {
            return (
                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} /> 
            )
        }else {  
            if ( this.state.cartArray.length === 0 ) {
                return(
                <SafeAreaView style={ styles.container }>
                    <View style={styles.blankWrap}>
                        <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#838383'}}>장바구니가 비었습니다.</CustomTextR>
                        <TouchableOpacity
                            onPress={()=>this.props.navigation.popToTop()}
                            style={{paddingTop:20}}
                        >
                        <CustomTextM style={CommonStyle.baseColorText}>쇼핑하러 가기</CustomTextM>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.blankWrap}></View>
                </SafeAreaView>
                )
            }else{
            return(
                <SafeAreaView style={ styles.container }>
                    {this.state.popLayerView && (
                        <View >
                            <Overlay
                                isVisible={this.state.popLayerView}
                                //onBackdropPress={this.closepopLayer}
                                windowBackgroundColor="rgba(0, 0, 0, 0.8)"
                                overlayBackgroundColor="tranparent"                                
                                containerStyle={{margin:0,padding:0}}
                            >
                                <View style={styles.popLayerWrap}>
                                    <PopLayerOption screenState={this.state} screenProps={this.props}/>
                                </View>
                            </Overlay>
                        </View>
                    )}
                    <View style={styles.topBoxWrap}>
                        <TouchableOpacity style={styles.topBoxLeftWrap}  onPress={() => this.setAllCheck(this.state.allChecked)}>
                            <CheckBox 
                                containerStyle={{padding:0,margin:0}}   
                                iconType={'FontAwesome'}
                                checkedIcon={<Image source={CHECKNOX_ON} resizeMode='contain' style={CommonStyle.checkboxIcon2} />}
                                uncheckedIcon={<Image source={CHECKNOX_OFF} resizeMode='contain' style={CommonStyle.checkboxIcon2} />}
                                checkedColor={DEFAULT_COLOR.base_color}                          
                                checked={this.state.allChecked}
                                size={CommonUtil.dpToSize(20)}                             
                                onPress={() => this.setAllCheck(this.state.allChecked)}
                            />
                            <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)}}>전체선택</CustomTextR>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.topBoxRightWrap} onPress={()=>this.removeCartArray()}>
                            <CustomTextR style={CommonStyle.baseColorText}>선택 삭제</CustomTextR>
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
                        style={{width:'100%',backgroundColor:'#fff'}}
                    >
                        <View style={styles.boxWrap}>
                        {
                            this.state.cartArray.map((item, index) => {  
                            let isIndexOf = this.state.selectedArray.findIndex(                
                                info => ( info.id === item.id )
                            );  
                            return (
                                <View key={index} style={styles.itemWrap} >
                                    <View style={styles.TitleBoxSubWrap} >
                                        <View style={styles.checkboxLeftWrap}>
                                            {
                                                item.is_soldout === false &&
                                                <CheckBox 
                                                    containerStyle={{padding:0,margin:0}}   
                                                    iconType={'FontAwesome'}
                                                    checkedIcon={<Image source={CHECKNOX_ON} resizeMode='contain' style={CommonStyle.checkboxIcon2} />}
                                                    uncheckedIcon={<Image source={CHECKNOX_OFF} resizeMode='contain' style={CommonStyle.checkboxIcon2} />}
                                                    checkedColor={DEFAULT_COLOR.base_color}                          
                                                    checked={isIndexOf != -1 ? true : false}
                                                    size={CommonUtil.dpToSize(20)}
                                                    onPress={() => this.checkItem(item,index)}
                                                />
                                            }
                                        </View>
                                        <View style={styles.checkboxRightWrap}>
                                            <View style={styles.commonTitleWarp}>
                                                <CustomTextR style={CommonStyle.titleText14} numberOfLines={1} ellipsizeMode={'tail'}>
                                                    {item.product_name} {item.is_soldout == true && <CustomTextR style={[CommonStyle.titleText,{color:'#ff0000'}]}>(품절)</CustomTextR>} 
                                                </CustomTextR>
                                                <TouchableOpacity 
                                                    style={styles.closeboxLeftWrap}
                                                    hitSlop={{left:10,top:20,right:10,bottom:10}}
                                                    onPress={()=>this.removeCartAlert(item,index)}
                                                >
                                                    <Image
                                                        source={require('../../../assets/icons/btn_close.png')}
                                                        resizeMode={"contain"}
                                                        style={{width:CommonUtil.dpToSize(20),height:CommonUtil.dpToSize(20)}}
                                                    />  
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={[styles.boxSubWrap,{paddingBottom:15}]}>
                                        <TouchableOpacity style={styles.optionBoxLeftWrap} onPress={()=>this.moveDetail(item)}>
                                            { 
                                                !CommonUtil.isEmpty(item.thumb_img) ?
                                                <Image
                                                    source={{uri:DEFAULT_CONSTANTS.defaultImageDomain+item.thumb_img}}
                                                    resizeMode={"contain"}
                                                    style={{width:CommonUtil.dpToSize(35),height:CommonUtil.dpToSize(35)}}
                                                />
                                                :
                                                <Image
                                                    source={require('../../../assets/icons/no_image.png')}
                                                    resizeMode={"contain"}
                                                    style={CommonStyle.defaultIconImage60}
                                                />
                                            }
                                        </TouchableOpacity>
                                        <View style={styles.optionBoxRightWrap}>
                                            { item.child.map((titem, tindex) => {  
                                                return (
                                                <View style={styles.boxSubWrap2} key={tindex}>
                                                    <View style={{width:40,justifyContent:'center',alignItems:'center'}}>
                                                        <CustomTextR style={CommonStyle.dataText}>{CommonFunction.replaceUnitType(titem.unit_type)} </CustomTextR>
                                                    </View>
                                                    { 
                                                        titem.event_price > 0  ?
                                                        <View style={styles.unitWrap}>
                                                            <TextRobotoB style={CommonStyle.titleText}>
                                                                {CommonFunction.currencyFormat(titem.event_price)}
                                                                <CustomTextR style={CommonStyle.dataText}>{"원"}</CustomTextR>
                                                            </TextRobotoB>
                                                            <TextRobotoR style={[styles.menuText888,CommonStyle.fontStrike]}>
                                                                {CommonFunction.currencyFormat(titem.price)}원
                                                            </TextRobotoR> 
                                                        </View>
                                                        :
                                                        <View style={styles.unitWrap}>
                                                            <TextRobotoB style={CommonStyle.dataText}>
                                                                {CommonFunction.currencyFormat(titem.price)}
                                                                <CustomTextR style={CommonStyle.dataText}>{"원"}</CustomTextR>
                                                            </TextRobotoB>
                                                        </View>
                                                    }
                                                    <View style={styles.numberWrap}>
                                                        <TouchableOpacity onPress={()=>this.btnOrderCount('minus',titem,index,tindex)}>
                                                            <Image
                                                                source={require('../../../assets/icons/btn_minus.png')}
                                                                resizeMode={"contain"}
                                                                style={styles.numberDataWrap}
                                                            />
                                                        </TouchableOpacity>
                                                        <View style={styles.orderCountWrap}>
                                                            {/* <TextRobotoR style={styles.menuTitleText3}>
                                                                {CommonFunction.currencyFormat(titem.quantity)}
                                                            </TextRobotoR> */}
                                                            <Input
                                                                keyboardType={'number-pad'}
                                                                value={titem.quantity.toString()}
                                                                inputContainerStyle={[styles.inputContainerStyle]}
                                                                inputStyle={styles.inputStyle}                
                                                                onChangeText={value => this.btnOrderCount('direct',titem,index,tindex,value)}
                                                            />
                                                        </View>
                                                        <TouchableOpacity onPress={()=>this.btnOrderCount('plus',titem,index,tindex)}>
                                                            <Image
                                                                source={require('../../../assets/icons/btn_plus.png')}
                                                                resizeMode={"contain"}
                                                                style={styles.numberDataWrap}
                                                            />
                                                        </TouchableOpacity>
                                                    </View>
                                                    <TouchableOpacity 
                                                        style={styles.removeWrap}
                                                        onPress={()=>this.removeEachAlert(index,tindex,item)}
                                                    >
                                                        <Image
                                                            source={require('../../../assets/icons/btn_remove.png')}
                                                            resizeMode={"contain"}
                                                            style={{
                                                                width:CommonUtil.dpToSize(12),
                                                                height:CommonUtil.dpToSize(12),
                                                                marginLeft:5
                                                            }}
                                                        />  
                                                    </TouchableOpacity>
                                                </View>
                                                )
                                                })
                                            }
                                        </View>
                                    </View>
                                    <View style={styles.boxSubWrap3}>
                                        <View style={styles.boxRightWrap}>
                                            <TouchableOpacity
                                                onPress={()=>this.openOptionSet(item,index)}
                                                style={styles.commonTitleWarp2}
                                            >
                                                <Image
                                                    source={require('../../../assets/icons/sales_tab2_off.png')}
                                                    resizeMode={"contain"}
                                                    style={CommonStyle.defaultIconImage20}
                                                /> 
                                                <CustomTextR style={CommonStyle.dataText}>옵션변경</CustomTextR>
                                            </TouchableOpacity>
                                        </View> 
                                        <View style={styles.boxLeftWrap2}>
                                            <CustomTextR style={styles.dataText}>합계</CustomTextR>
                                        </View>
                                        <View style={styles.boxRightWrap2}>
                                            { item.eventTotalPrice > 0 ?
                                            <TextRobotoB style={CommonStyle.titleText}>
                                                {CommonFunction.currencyFormat(item.eventTotalPrice)}
                                                <CustomTextR style={CommonStyle.dataText}>{"원  "}</CustomTextR>
                                                <TextRobotoL style={[styles.menuText888,CommonStyle.fontStrike]}>
                                                    {CommonFunction.currencyFormat(item.totalPrice)}
                                                </TextRobotoL>
                                                <CustomTextR style={[styles.menuText888,CommonStyle.fontStrike]}>{"원"}</CustomTextR>
                                            </TextRobotoB>
                                            :
                                                <TextRobotoB style={CommonStyle.titleText}>
                                                    {CommonFunction.currencyFormat(item.totalPrice)}
                                                    <CustomTextR style={CommonStyle.dataText}>{"원"}</CustomTextR>
                                                </TextRobotoB>  
                                            }
                                        </View>
                                    </View>
                                </View>
                            )
                            })
                        }
                        </View>
                        <ToggleBox 
                            label={'결제 예정금액'}
                            value={CommonFunction.currencyFormat(this.state.seletedSettleAmount)+'원'}
                            arrowColor={'#555'}
                            style={styles.toggleBoxWrap}
                            expanded={false}
                        >
                            <>
                            <View style={styles.bottomBoxSubWrap} >
                                <View style={styles.bottomBoxLeftWrap}>
                                    <CustomTextR style={CommonStyle.titleText2}>상품금액</CustomTextR>
                                </View>
                                <View style={styles.bottomBoxRightWrap}>
                                    <TextRobotoM style={CommonStyle.titleText2}>{CommonFunction.currencyFormat(this.state.selectedTotalAmount)}원</TextRobotoM>
                                </View>
                            </View>
                            <View style={styles.bottomBoxSubWrap} >
                                <View style={styles.bottomBoxLeftWrap}>
                                    <CustomTextR style={CommonStyle.titleText2}>상품할인금액</CustomTextR>
                                </View>
                                <View style={styles.bottomBoxRightWrap}>
                                    <TextRobotoM style={CommonStyle.titleText2}>{CommonFunction.currencyFormat(this.state.selectedTotalDiscount)}원</TextRobotoM>
                                </View>
                            </View>
                            <View style={styles.bottomBoxSubWrap} >
                                <View style={[styles.bottomBoxLeftWrap,{flexDirection:'row'}]}>
                                    <CustomTextR style={CommonStyle.titleText2}>배송비</CustomTextR>
                                    <TouchableOpacity 
                                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                        style={styles.tooltipWrap}        
                                    >
                                        <Tooltip popover={this.renderTooltip('delivery')} width={SCREEN_WIDTH*0.8} height={120} backgroundColor="#ccc" skipAndroidStatusBar={true}>
                                            <Icon name="questioncircleo" size={PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16)} color="#bbb" />
                                        </Tooltip>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.bottomBoxRightWrap}>
                                    <TextRobotoM style={CommonStyle.titleText2}>{CommonFunction.currencyFormat(this.state.selectedDeliveryAmount)}원</TextRobotoM>
                                </View>
                            </View>
                            <View style={styles.bottomBoxSubWrap} >
                                <View style={[styles.bottomBoxLeftWrap,{flexDirection:'row'}]}>
                                    <CustomTextR style={CommonStyle.titleText2}>적립포인트</CustomTextR>
                                    <TouchableOpacity 
                                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                        style={styles.tooltipWrap}        
                                    >
                                        <Tooltip popover={this.renderTooltip('reward')} width={SCREEN_WIDTH*0.8} height={120} backgroundColor="#ccc" skipAndroidStatusBar={true}>
                                            <Icon name="questioncircleo" size={PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16)} color="#bbb" />
                                        </Tooltip>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.bottomBoxRightWrap}>
                                    <TextRobotoM style={CommonStyle.titleText2}>{CommonFunction.currencyFormat(this.state.selectedRewardAmount*this.state.userRate)}원</TextRobotoM>
                                </View>
                            </View>
                            <View style={[styles.bottomBoxSubWrap2,{}]} >
                                <View style={styles.bottomBoxLeftWrap}>
                                    <CustomTextR style={CommonStyle.titleText2}>결제예정금액</CustomTextR>
                                </View>
                                <View style={styles.bottomBoxRightWrap}>
                                    <TextRobotoM style={CommonStyle.titleText2}>{CommonFunction.currencyFormat(this.state.seletedSettleAmount)}원</TextRobotoM>
                                </View>
                            </View>
                            </>
                        </ToggleBox>
                        <View style={styles.termLineWrap} />
                        <View style={[CommonStyle.blankArea]}></View>
                        { 
                            this.state.moreLoading &&
                            <View style={CommonStyle.moreWrap}>
                                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} />
                            </View>
                        }
                    </ScrollView>    
                    <SlidingUpPanel 
                        ref={c => this._panel = c}
                        animatedValue={this.animatedValue}
                        allowDragging={ this.state.selectedArray.length > 0 ? true : false}
                        draggableRange={{
                            top: SCREEN_HEIGHT*0.4,
                            bottom: Platform.OS === 'ios' ? DEFAULT_CONSTANTS.BottomHeight : DEFAULT_CONSTANTS.BottomHeight+20
                        }}
                        style={{marginBottom:DEFAULT_CONSTANTS.BottomHeight}}
                        onBottomReached={()=>this.setState({toggleStatus:false})}
                        onDragEnd={(e)=>this.setPanelStatus(e)}
                    >
                        <View style={styles.slideContainer}>
                            <View style={styles.scrollFooterWrap2}>
                                <TouchableOpacity 
                                    hitSlop={{left:10,right:10,bottom:0,top:0}}
                                    style={styles.topScrollFooterWrap} onPress={() => this.togglePanel()} 
                                >
                                    <View style={styles.arrowWrap}>
                                        {
                                        this.state.toggleStatus ?
                                        <Icon name="down" size={CommonUtil.dpToSize(15)} color="#fff" />
                                        :
                                        <Icon name="up" size={CommonUtil.dpToSize(15)} color="#fff" />
                                        }
                                    </View>
                                </TouchableOpacity>
                                
                                {
                                    this.state.selectedArray.length > 0 ?
                                    <TouchableOpacity 
                                        style={styles.inScrollFooterWrap} 
                                        hitSlop={{left:10,right:10,bottom:10,top:10}}
                                        onPress={()=>this.actionOrder()}
                                    >
                                        <View style={{zIndex:9999}}>
                                            <CustomTextR style={CommonStyle.scrollFooterText}>
                                            총 {CommonFunction.currencyFormat(this.state.seletedSettleTotalCount)}개 {CommonFunction.currencyFormat(this.state.seletedSettleAmount)}원    <CustomTextB style={CommonStyle.scrollFooterText}>구매하기</CustomTextB>
                                            </CustomTextR>
                                        </View>
                                    </TouchableOpacity>
                                    :
                                    <View style={styles.inScrollFooterWrap}>
                                        <CustomTextB style={CommonStyle.scrollFooterText}>구매하기</CustomTextB>
                                    </View>
                                }
                            </View>
                            <View style={[styles.scrollFooterWrap,{backgroundColor:'#fff'}]}>
                                <View style={styles.bottomBoxSubWrap} >
                                    <View style={styles.bottomBoxLeftWrap}>
                                        <CustomTextR style={CommonStyle.titleText2}>상품금액</CustomTextR>
                                    </View>
                                    <View style={styles.bottomBoxRightWrap}>
                                        <TextRobotoM style={CommonStyle.titleText2}>
                                            {CommonFunction.currencyFormat(this.state.selectedTotalAmount)}원
                                        </TextRobotoM>
                                    </View>
                                </View>
                                <View style={styles.bottomBoxSubWrap} >
                                    <View style={styles.bottomBoxLeftWrap}>
                                        <CustomTextR style={CommonStyle.titleText2}>상품할인금액</CustomTextR>
                                    </View>
                                    <View style={styles.bottomBoxRightWrap}>
                                        <TextRobotoM style={CommonStyle.titleText2}>{CommonFunction.currencyFormat(this.state.selectedTotalDiscount)}원</TextRobotoM>
                                    </View>
                                </View>
                                <View style={styles.bottomBoxSubWrap} >
                                    <View style={[styles.bottomBoxLeftWrap,{flexDirection:'row'}]}>
                                        <CustomTextR style={CommonStyle.titleText2}>배송비</CustomTextR>
                                    </View>
                                    <View style={styles.bottomBoxRightWrap}>
                                        <TextRobotoM style={CommonStyle.titleText2}>
                                            {CommonFunction.currencyFormat(this.state.selectedDeliveryAmount)}원
                                        </TextRobotoM>
                                    </View>
                                </View>
                                <View style={styles.bottomBoxSubWrap} >
                                    <View style={[styles.bottomBoxLeftWrap,{flexDirection:'row'}]}>
                                        <CustomTextR style={CommonStyle.titleText2}>적립포인트</CustomTextR>
                                    </View>
                                    <View style={styles.bottomBoxRightWrap}>
                                        <TextRobotoM style={CommonStyle.titleText2}>
                                            {CommonFunction.currencyFormat(this.state.selectedRewardAmount*this.state.userRate)}원
                                        </TextRobotoM>
                                    </View>
                                </View>
                                <View style={[styles.bottomBoxSubWrap2,{}]} >
                                    <View style={styles.bottomBoxLeftWrap}>
                                        <CustomTextR style={CommonStyle.titleText2}>결제예정금액</CustomTextR>
                                    </View>
                                    <View style={styles.bottomBoxRightWrap}>
                                        <TextRobotoM style={CommonStyle.titleText2}>
                                            {CommonFunction.currencyFormat(this.state.seletedSettleAmount)}원
                                        </TextRobotoM>
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.buttonCorverWrap}  onPress={()=>this.actionOrder()}>
                                    <View style={styles.buttonWrap}>
                                        <CustomTextB style={CommonStyle.scrollFooterText}>구매하기</CustomTextB>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </SlidingUpPanel>                    
                </SafeAreaView>
            );
            }
        }
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : "#f5f6f8"
    },
    slideContainer : {
        flex: 1,
        
    },
    popLayerWrap : {
        width:SCREEN_WIDTH*0.8,height:SCREEN_HEIGHT*0.5,backgroundColor:'transparent',margin:0,padding:0
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    toggleBoxWrap : {
        backgroundColor: '#fff', borderBottomWidth: 0,paddingHorizontal:10
    },
    blankWrap : {
        flex:1,    
        paddingTop:100,
        justifyContent:'center',
        alignItems:'center'
    },
    topBoxWrap : {
        height:51,
        flexDirection:'row', 
        backgroundColor:'#f5f6f8',
        borderBottomWidth:1,
        borderBottomColor : DEFAULT_COLOR.input_border_color
    },
    boxWrap : {
        flex:1,   
        padding:15,
        backgroundColor:'#f5f6f8',
        borderBottomWidth:1,
        borderBottomColor : DEFAULT_COLOR.input_border_color
    },
    tooltipWrap : {
        justifyContent:'center',alignItems:'center',position:'absolute',right:0,top :0, bottom:0,width:20
    },
    itemWrap : {
        flex:1,marginBottom:15
    },
    TitleBoxSubWrap : {
        flex:1,
        flexDirection:'row', 
        paddingHorizontal:10,        
        alignItems: 'flex-start',        
        backgroundColor:'#fff',
        ...Platform.select({
            ios: {paddingVertical:5},
            android: {paddingVertical:0}
        })
    },
    boxSubWrap : {
        flex:1,
        flexDirection:'row', 
        paddingHorizontal:10,paddingVertical: Platform.OS === 'android' ? 5 : 5,
        alignItems: 'flex-start',        
        backgroundColor:'#fff'
    },
    boxSubWrap2 : { 
        flex:1,justifyContent:'center',alignItems:'center',flexDirection:'row',backgroundColor:'#fff'
    },
    boxSubWrap3 : { 
        flex:1,justifyContent:'center',alignItems:'center',flexDirection:'row',backgroundColor:'#fff',paddingHorizontal:10,paddingVertical:10,borderTopWidth:1,borderTopColor:'#e6e6e6'
    },
    unitWrap : {
        flex:1,justifyContent:'center'
    },
    removeWrap : {
        flex:0.2,justifyContent:'center',alignItems:'flex-end',paddingBottom:10
    },
    numberWrap : {
        flex:0.6,paddingBottom:10,justifyContent:'center',alignItems:'center',flexDirection:'row',flexGrow:1, backgroundColor:'#fff'
    },
    orderCountWrap : {
        
        width:50,height:PixelRatio.roundToNearestPixel(30),borderTopWidth:1,borderTopColor:'#ccc',borderBottomWidth:1,borderBottomColor:'#ccc',justifyContent:'center',alignItems:'center',
    },
    numberDataWrap : {
        width:PixelRatio.roundToNearestPixel(30),height:PixelRatio.roundToNearestPixel(30)
    },
    commonTitleWarp : {
        flexDirection:'row',paddingLeft:10,paddingRight:30,justifyContent:'flex-start',paddingVertical:5
    },
    commonTitleWarp2 : {
        flexDirection:'row',paddingLeft:20,justifyContent:'flex-start',paddingVertical:5
    },
    checkboxLeftWrap : {
        flex:1,
        justifyContent:'center',
        ...Platform.select({
            ios: {paddingTop:5},
            android: {paddingTop:15}
        })
    },
    checkboxRightWrap : {
        flex:10,
        justifyContent:'center',
    },
    optionBoxLeftWrap : {
        flex:1,
        justifyContent:'center',
        paddingLeft:5
    },
    optionBoxRightWrap : {
        flex:5,
        justifyContent:'center',        
    },
    closeboxLeftWrap : {
        position:'absolute',right:5,top:10,width:20,height:20,zIndex:2
    },
    termLineWrap : {
        flex:1,
        paddingVertical:5,
        backgroundColor:'#f5f6f8'
    },
    boxLeftWrap : {
        width:PixelRatio.roundToNearestPixel(70),
        alignItems:'center'
    },
    boxRightWrap : {
        flex:1,
        justifyContent:'center',
    },
    boxLeftWrap2 : {
        flex:1,        
        justifyContent:'center',
        alignItems:'flex-end'
    },
    boxRightWrap2 : {
        flex:2,        
        justifyContent:'center',
        alignItems:'flex-end'
    },
    topBoxLeftWrap : {
        flex:1,flexDirection:'row',flexGrow:1,alignItems:'center',paddingLeft:10
    },
    topBoxRightWrap : {
        flex:1,justifyContent:'center',alignItems:'flex-end',paddingRight:20
    },
    checkboxIcon : {
        width : PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize22),height:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize22)
    },
    buttonWrap : {
        width:SCREEN_WIDTH/2,paddingVertical:10,paddingHorizontal:15,backgroundColor:DEFAULT_COLOR.base_color,justifyContent:'center',alignItems:'center', borderRadius:10
    },
    scrollFooterLeftWrap : {
        flex:1,backgroundColor:DEFAULT_COLOR.base_color,justifyContent:'center',alignItems:'center',paddingVertical:5
    },
    cartWrap : {
        position:'absolute',right:0,bottom:0,width:SCREEN_WIDTH,height:250,backgroundColor:'#fff',
        borderTopWidth:1,borderTopColor:'#ccc',paddingVertical: 10
    },
    bottomBoxSubWrap : {
        flexDirection:'row',
        paddingHorizontal:20,paddingVertical: 5
    },
    bottomBoxSubWrap2 : {
        flexDirection:'row',
        paddingHorizontal:20,paddingVertical: 5,marginTop:10,paddingTop:10,borderTopWidth:1,borderTopColor:DEFAULT_COLOR.base_background_color,marginBottom:15
    },
    bottomBoxLeftWrap : {
        flex:1,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center'
    },
    bottomBoxRightWrap : {
        flex:2,        
        justifyContent:'center',
        alignItems:'flex-end'
    },

    menuText888 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),color:'#ccc',lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)
    },
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),paddingRight:10
    },
    scrollFooterWrap : {
        flex:1,alignItems:'center',paddingTop:10
    },
    scrollFooterWrap2 : {
        alignItems:'center',justifyContent:'center',
        ...Platform.select({
            ios: {height:DEFAULT_CONSTANTS.BottomHeight},
            android: {height:DEFAULT_CONSTANTS.BottomHeight+20}
        })
    },
    topScrollFooterWrap : {
        width:SCREEN_WIDTH,alignItems:'center',justifyContent:'center',
        backgroundColor:'transparent',zIndex:1,
        ...Platform.select({
            ios: {height:15},
            android: {height:20}
        })
    },
    inScrollFooterWrap : {
       zIndex:20,backgroundColor:DEFAULT_COLOR.base_color,width:SCREEN_WIDTH,alignItems:'center',
        ...Platform.select({
        ios: {height:DEFAULT_CONSTANTS.BottomHeight,paddingTop:15},
        android: {height:DEFAULT_CONSTANTS.BottomHeight+20,paddingTop:25}
        })
        
    },
    buttonCorverWrap : {
        width:SCREEN_WIDTH,alignItems:'center',zIndex:10
    },
    arrowWrap : {
        alignItems:'center',justifyContent:'center',paddingTop:2,
        //borderTopWidth:0.5,borderTopColor:'#ccc',
        borderTopRightRadius:5,borderTopLeftRadius:5,
        backgroundColor:DEFAULT_COLOR.base_color,
        ...Platform.select({
            ios: {width:40,height:15},
            android: {width:40,height:20}
        })
    },
    inputContainerStyle : {        
        position:'absolute',left:5,top:0,width:40,height:28,borderWidth:0,borderColor:'#fff',
        
        //margin:0,padding:0,height:30,borderWidth:1,borderColor:'#ff0000',marginTop:20
    },
    inputStyle :{ 
        margin:0,padding: 0,color: '#666666',fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),
        textAlign:'right'
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
});

function mapStateToProps(state) {
    return {
        userToken : state.GlabalStatus.userToken,
        userCartCount : state.GlabalStatus.userCartCount,
    };
}
function mapDispatchToProps(dispatch) {
    return {        
        _saveUserToken:(str)=> {
            dispatch(ActionCreator.saveUserToken(str))
        },
        _fn_getUserCartCount : (num) => {
            dispatch(ActionCreator.fn_getUserCartCount(num))
        },
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(CartScreen);