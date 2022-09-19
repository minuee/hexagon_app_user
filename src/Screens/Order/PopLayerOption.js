import React, { Component } from 'react';
import {Animated,ScrollView,View,StyleSheet,Alert,Dimensions,PixelRatio,Image,TouchableOpacity,TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import {CheckBox} from 'react-native-elements';

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonStyle from '../../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM,TextRobotoB, TextRobotoM,TextRobotoR} from '../../Components/CustomText';
import CommonUtil from '../../Utils/CommonUtil';
import CommonFunction from '../../Utils/CommonFunction';
import Loader from '../../Utils/Loader';
import { apiObject } from "../Apis";

const CHECKNOX_OFF = require('../../../assets/icons/checkbox_off.png');
const CHECKNOX_ON = require('../../../assets/icons/checkbox_on.png');


class PopLayerOption extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            product_pk : 0,
            productData : {},
            optionList : [],
        }
    }

    getBaseData = async(productData) => {

        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/product/view/'+productData.product_pk;
            const token = this.props.screenProps.userToken.apiToken;
            returnCode = await apiObject.API_getDetailDefault(this.props.screenProps,url,token);
            let optionList = [];
            if ( returnCode.code === '0000'  ) {
                //console.log('returnCode.data.productDetail',returnCode.data.productDetail)
                if ( returnCode.data.productDetail.each_price > 0) {  
                    optionList.push({
                        product_pk : productData.product_pk,
                        unit_type : 'Each',
                        quantity : productData.child.findIndex((info) => info.unit_type === 'Each') != -1 ? productData.child[productData.child.findIndex((info) => info.unit_type === 'Each')].quantity : 1,
                        price : returnCode.data.productDetail.each_price,
                        event_price : returnCode.data.productDetail.event_each_price,
                        checked : productData.child.findIndex((info) => info.unit_type === 'Each') != -1 ? true : false,
                        each_count : 1,
                        each_price : returnCode.data.productDetail.each_price
                    })
                }
                if ( returnCode.data.productDetail.box_price > 0) {
                    optionList.push({
                        product_pk : productData.product_pk,
                        unit_type : 'Box', 
                        quantity : productData.child.findIndex((info) => info.unit_type_type === 'Box') != -1 ? productData.child[productData.child.findIndex((info) => info.unit_type === 'Box')].quantity : 1,
                        price : returnCode.data.productDetail.box_price,
                        event_price : returnCode.data.productDetail.event_box_price,
                        checked : productData.child.findIndex((info) => info.unit_type === 'Box') != -1 ? true : false,
                        each_count : returnCode.data.productDetail.box_unit,
                        each_price : parseInt(returnCode.data.productDetail.box_price/returnCode.data.productDetail.box_unit)
                    })
                }
                if ( returnCode.data.productDetail.carton_price > 0) {
                    optionList.push({
                        product_pk : productData.product_pk,
                        unit_type : 'Carton', 
                        quantity : productData.child.findIndex((info) => info.unit_type === 'Carton') != -1 ? productData.child[productData.child.findIndex((info) => info.unit_type === 'Carton')].quantity : 1,
                        price : returnCode.data.productDetail.carton_price,
                        event_price : returnCode.data.productDetail.event_carton_price,
                        checked : productData.child.findIndex((info) => info.unit_type === 'Carton') != -1 ? true : false,
                        each_count : returnCode.data.productDetail.carton_unit,
                        each_price : parseInt(returnCode.data.productDetail.carton_price/returnCode.data.productDetail.carton_unit)
                    })
                }
                this.setState({
                    product_pk : productData.product_pk,
                    optionList : optionList,
                    productData : productData
                })
            }else{
            }
            this.setState({moreLoading:false,loading:false})
        }catch(e){
            this.setState({loading:false,moreLoading : false})
        }
    }
    

    async UNSAFE_componentWillMount() {
        if ( !CommonUtil.isEmpty(this.props.screenState.optionProduct)) {
            await this.getBaseData(this.props.screenState.optionProduct);
        }else{
            CommonFunction.fn_call_toast('잘못된 접근입니다.',1000);
            setTimeout(
                () => {            
                this.props.screenState.closepopLayer();
                },1000
            )
        }
    }

    setCartList = async(data) => {       
        try {
            let element = data[0];
            //console.log('element', data[0]);
            let initialValue = 0;  
            let initialValue2 = 0;
            let initialValue3 = 0;
            let isHaveCarton = false;
            let isHaveCartonPrice = 0;
            let isHaveBox = false;
            let isHaveBoxPrice = 0;
            var newChild = await element.child.map(function(obj){
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
                if ( obj.unit_type === 'Carton' ) {
                    isHaveCarton =  true;
                    isHaveCartonPrice = parseInt(element.carton_price / element.carton_unit);
                    rObj['other_carton_price'] = isHaveCartonPrice;
                }
                if ( obj.unit_type === 'Box' ) {
                    isHaveBox =  true;
                    isHaveBoxPrice =  parseInt(element.box_price / element.box_unit);
                    rObj['other_box_price'] = isHaveBoxPrice;
                }
                return rObj;
            });
            let returnData = {
                ...element,
                isHaveBox,
                isHaveBoxPrice,
                isHaveCarton,
                isHaveCartonPrice,
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
            }
            if ( isHaveCarton && isHaveCartonPrice > 0 ) {
                returnData = {
                    ...element,
                    isHaveBox,
                    isHaveBoxPrice,
                    isHaveCarton,
                    isHaveCartonPrice,
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
                        return cur.unit_type === 'Each' ? acc + cur.quantity * isHaveCartonPrice :  cur.unit_type === 'Box' ? acc+(cur.quantity*isHaveCartonPrice*element.box_unit) : acc+(cur.quantity*cur.price)
                    },initialValue2),
                    eventTotalPrice : newChild.reduce(function(acc,cur) {
                        return acc+(cur.quantity*cur.event_price)
                    },initialValue3),
                    child : newChild
                }
            }else if ( isHaveBox && isHaveBoxPrice > 0 ) {
                returnData = {
                    ...element,
                    isHaveBox,
                    isHaveBoxPrice,
                    isHaveCarton,
                    isHaveCartonPrice,
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
                        return cur.unit_type === 'Each' ? acc + cur.quantity * isHaveBoxPrice : acc+(cur.quantity*cur.price)
                    },initialValue2),
                    eventTotalPrice : newChild.reduce(function(acc,cur) {
                        return acc+(cur.quantity*cur.event_price)
                    },initialValue3),
                    child : newChild
                }
            }
            return returnData;
        }catch(e) {
            console.log('ee', e);
            return {};
        }        
    }

    registAddress = async(newChild) => { 
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
                let feedData = await this.setCartList(returnCode.data.cartList); 
                //console.log('feedData',feedData)
                let userCartCount = CommonUtil.isEmpty(returnCode.data.totalCount) ? 0 : returnCode.data.totalCount ;
                this.props._fn_getUserCartCount(userCartCount);
                this.props.screenState.closepopLayer(feedData);
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.\n[ERR]' + returnCode.msg ,2000);
            }
            this.setState({moreLoading:false,loading:false})
        }catch(e){
            this.setState({loading:false,moreLoading : false})
        }
    }
   
    selectMember = async() =>  {
        let isCheck = this.state.optionList.some((info)=>info.checked === true);
        if ( isCheck ) {
            let newChild = this.state.optionList.filter((info)=> info.checked === true);
            this.registAddress(newChild)
        }else{
            Alert.alert(
                DEFAULT_CONSTANTS.appName,      
                "옵션은 최소 1개이상 선택하셔야 합니다",
                [{text: '확인', onPress: () => console.log('Cancle')}],
                { cancelable: true }
            )  
            return false;
        }
    }
 
    checkItem = async(index) => {
        let orderChecked = this.state.optionList[index].checked;
        this.state.optionList[index].checked = !orderChecked;
        this.setState({loading:false})
    }
    renderPriceInfo = (item) => {
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
    
    }

    renderDescption = (item) => {
        return (
            <View style={{flex:1}}>
                <TextRobotoR style={styles.eventpriceText}>
                    (수량:{CommonFunction.currencyFormat(item.each_count)}, 단가:{CommonFunction.currencyFormat(item.each_price)}원)
                </TextRobotoR>                       
            </View>
        )
    }

    render() {
        if ( this.state.loading ) {
            return (
                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} /> 
            )
        }else { 
        return(
            <View style={ styles.container }>
                <View style={styles.titleWrap}>
                    <TouchableOpacity 
                        onPress={()=> this.props.screenState.closepopLayer()}
                        hitSlop={{left:10,right:5,top:10,bottom:10}}
                        style={{position:'absolute',top:5,right:10,width:22,height:22}}
                    >
                        <Image
                            source={require('../../../assets/icons/btn_close.png')}
                            resizeMode={"contain"}
                            style={{width:CommonUtil.dpToSize(25),height:CommonUtil.dpToSize(25)}}
                        />
                    </TouchableOpacity>
                    <View style={{width:'60%',paddingLeft:20}}>
                        <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#333'}}> 옵션선택</CustomTextM>
                    </View>
                </View>
                <View style={styles.dataWarp}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        indicatorStyle={'white'}
                    >
                        <View style={styles.defaultWrap}>
                            <CustomTextR style={CommonStyle.titleText15}>
                                {this.state.productData.product_name}
                            </CustomTextR>
                        </View>
                        <View style={styles.formWarp}>
                        {
                            this.state.optionList.map((item, index) => { 
                            return (
                                <View key={index} style={styles.itemWrap} >
                                    <TouchableOpacity style={styles.boxSubWrap} onPress={() => this.checkItem(index)}>
                                        <View style={styles.checkboxLeftWrap}>
                                            <CheckBox 
                                                containerStyle={{padding:0,margin:0}}   
                                                iconType={'FontAwesome'}
                                                checkedIcon={<Image source={CHECKNOX_ON} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                                uncheckedIcon={<Image source={CHECKNOX_OFF} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                                checkedColor={DEFAULT_COLOR.base_color}                          
                                                //checked={isIndexOf != -1 ? true : false}
                                                checked={item.checked}
                                                size={CommonUtil.dpToSize(50)}                                    
                                                onPress={() => this.checkItem(index)}
                                            />
                                        </View>
                                        <View style={styles.boxLeftWrap}>                                            
                                            { item.event_price > 0 ?
                                                <View style={[styles.unitWrap,{flexDirection:'row',alignItems:'center',justifyContent:'center'}]}>
                                                    <View style={{flex:1}}>
                                                        <CustomTextR style={CommonStyle.dataText15}>{CommonFunction.replaceUnitType(item.unit_type)}{" "}</CustomTextR>
                                                    </View>
                                                    <View style={{flex:3}}>
                                                        <TextRobotoR style={CommonStyle.titleText}>
                                                            {CommonFunction.currencyFormat(item.event_price)}
                                                            <CustomTextR style={CommonStyle.dataText}>{"원  "}</CustomTextR>
                                                            <TextRobotoR style={[styles.menuText888,CommonStyle.fontStrike]}>
                                                                {CommonFunction.currencyFormat(item.price)}
                                                                <CustomTextR style={CommonStyle.menuText888}>{"원"}</CustomTextR>
                                                            </TextRobotoR> 
                                                        </TextRobotoR>
                                                    </View>
                                                </View>
                                            :
                                                <TextRobotoR style={CommonStyle.dataText}>
                                                    {CommonFunction.replaceUnitType(item.unit_type)}{" "}
                                                    {CommonFunction.currencyFormat(item.price)}원
                                                </TextRobotoR> 
                                            } 
                                            {
                                                item.unit_type != 'Each' && (
                                                    this.renderDescption(item)
                                                )
                                            }                                 
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )
                            })
                        }
                        </View>
                   </ScrollView>
                </View> 
                <View style={styles.footerWrap}>
                    <TouchableOpacity 
                        onPress={()=> this.props.screenState.closepopLayer()}
                        style={styles.footerLeftWrap}
                    >
                        <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#9f9f9f'}}>취소</CustomTextM>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={()=>this.selectMember()}
                        style={styles.footerRightWrap}
                    >
                        <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#fff'}}>적용</CustomTextM>
                    </TouchableOpacity>
                    
                </View>                   
            </View>
        );
        }
    }
}



const styles = StyleSheet.create({
    container: {
        flex:1
    },
    unitWrap : {
        flex:1,justifyContent:'center',paddingBottom:10
    },
    /**** Modal  *******/
    modalContainer: {   
        zIndex : 10,     
        position :'absolute',
        left:0,        
        width:SCREEN_WIDTH,
        height: SCREEN_HEIGHT-200,
        paddingTop: 16,
        backgroundColor: '#fff'
    },
    titleWrap : {
        height:40,justifyContent:'center',alignItems:'center',borderBottomColor:'#ccc',borderBottomWidth:1
    },
    dataWarp : {
        flex:4,paddingTop:10
    },
    footerWrap : {
        flex:1,justifyContent:'center',alignItems:'center',flexDirection:'row'
    },
    footerLeftWrap : {
        width:80,backgroundColor:'#e1e1e1',justifyContent:'center',alignItems:'center',padding:5,marginRight:5
    },
    footerRightWrap:{
        width:80,backgroundColor:DEFAULT_COLOR.base_color,justifyContent:'center',alignItems:'center',padding:5
    },
    itemWrap : {
        flex:1,marginBottom:15
    },
    checkboxLeftWrap : {
        flex:0.5,        
        justifyContent:'center',
        alignItems:'center',
        marginRight:5
    },
    boxLeftWrap : {
        flex:5,        
        justifyContent:'center',
    },
    boxSubWrap : {
        flex:1,
        flexDirection:'row', 
        paddingHorizontal:10,
        alignItems: 'center',
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',        
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuText888 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),color:'#888',lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)
    },
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),paddingRight:10
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
    formWarp : {
        flex:1,paddingHorizontal:20,paddingVertical:5,marginTop:10,borderTopWidth:1,borderTopColor:DEFAULT_COLOR.base_background_color
    },
    formTitleWrap : {
        height:30,paddingVertical:5,flexDirection:'row',marginTop:5
    },
    formDataWrap : {
        height:40,paddingVertical:5
    },
    defaultWrap:{
        flex:1,justifyContent:'center',paddingHorizontal:20,paddingVertical:5
    },
});

function mapStateToProps(state) {
    return {
        userToken : state.GlabalStatus.userToken
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


export default connect(mapStateToProps,mapDispatchToProps)(PopLayerOption);