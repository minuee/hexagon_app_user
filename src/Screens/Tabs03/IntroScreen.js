import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Dimensions,PixelRatio,TouchableOpacity,Alert,Image as NativeImage} from 'react-native';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import AsyncStorage from '@react-native-community/async-storage';
import 'moment/locale/ko'
import  moment  from  "moment";
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import Image from 'react-native-image-progress';
import {Input} from 'react-native-elements';
//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonStyle from '../../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM,TextRobotoB, TextRobotoM,TextRobotoR,DropBoxIcon,DropBoxIconSmall} from '../../Components/CustomText';
import CommonFunction from '../../Utils/CommonFunction';
import CommonUtil from '../../Utils/CommonUtil';
import CheckConnection from '../../Components/CheckConnection';
import Loader from '../../Utils/Loader';
import { apiObject } from "../Apis";
const ICON_CART = require('../../../assets/icons/icon_cart.png');
const ICON_ZZIM = require('../../../assets/icons/icon_zzim.png');
const DefaultPaginate = 10;


class IntroScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading : true,
            moreLoading : false,
            ismore :  false,
            currentpage : 1,
            isResult: false,
            resultData : [],
            searchKeyword : '',
            myKeywordHistory : [],
            totalCount : 0
        }
    }

    async UNSAFE_componentWillMount() {
        let myKeywordHistory = await AsyncStorage.getItem('MyKeywordHistory');        
        if ( !CommonUtil.isEmpty(myKeywordHistory)) {
            let newReturnArray = await JSON.parse(myKeywordHistory).sort(function(a, b) { // 숫자 오름차순
                return a.time > b.time ? -1 : a.time < b.time ? 1 : 0;
            }); 
            this.setState({myKeywordHistory : newReturnArray})
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

    setOrderBy = (seq) => {
        if ( this.state.sortItem !== seq ) {
            this.setState({sortItem:seq})
        }
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

    moreDataUpdate = async( baseData , addData) => {
        await addData.data.productList.forEach(function(element,index,array){                                
            baseData.push(element);
        });            
        this.setState({            
            moreLoading : false,
            loading : false,
            currentpage : parseInt(addData.currentPage),
            resultData : baseData,
            ismore : parseInt(this.state.currentpage+1)  < parseInt(addData.lastPage) ? true : false
        })
    }

    getData = async(searchKeyword,currentpage,morePage = false) => {
        console.log('currentpage',currentpage)
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/product/list?search_word=' + searchKeyword + '&page=' + currentpage + '&paginate='+DefaultPaginate;
            
            const token = this.props.userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_getPageList(this.props,url,token,sendData);          
            console.log('returnCode',returnCode)
            if ( returnCode.code === '0000'  ) {
                if ( morePage ) {
                    this.moreDataUpdate(this.state.resultData,returnCode )
                }else{
                    this.setState({
                        totalCount : CommonUtil.isEmpty(returnCode.total) ? 0 : returnCode.total,
                        resultData : CommonUtil.isEmpty(returnCode.data.productList) ? [] : returnCode.data.productList,
                        ismore : parseInt(this.state.currentpage+1)  < parseInt(returnCode.lastPage) ? true : false
                    })
                }
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.',2000);
            }

            this.setState({moreLoading:false,loading:false})
        }catch(e){
            console.log('eee',e)
            this.setState({loading:false,moreLoading : false})
        }
    }

    getSearchResult = async() => {
        if ( CommonUtil.isEmpty(this.state.searchKeyword))  {
            CommonFunction.fn_call_toast('검색어를 입력해주세요',2000);
            return false;
        }else{
            let searchKeyword = this.state.searchKeyword;
            const timeStampNow =  moment().unix();
            this.setState({
                moreLoading:true,
                currentpage : 1,
                totalCount : 0,
                resultData : []
            })
            let returnArray = this.state.myKeywordHistory;
            let isIndexOf = returnArray.findIndex(                
                info => ( info.keyword === searchKeyword )
            );
            let newReturnArray = [];
            if ( isIndexOf != -1 ) {
                returnArray.forEach(function(element,index,array){         
                    newReturnArray.push({
                        keyword : element.keyword,
                        time : element.keyword === searchKeyword ? timeStampNow  : element.time,
                        id : element.id
                    })
                }); 
            }else{
                newReturnArray = returnArray;
                returnArray.push({
                    keyword : searchKeyword,
                    time : timeStampNow,
                    id : newReturnArray.length
                })
            }
            //일단 스토리지에 넣는다
            let newReturnArray2 = await newReturnArray.sort(function(a, b) { // 숫자 오름차순
                return a.time > b.time ? -1 : a.time < b.time ? 1 : 0;
            });   
            await AsyncStorage.setItem('MyKeywordHistory', JSON.stringify(newReturnArray2));
            this.setState({
                isResult : true,
                myKeywordHistory : newReturnArray2
            })
            await this.getData(this.state.searchKeyword,1,false);
            
        }
    }
    reSearchData = async(keyword) => {
        this.setState({searchKeyword:keyword.toString()});
    }

    actionRemove = async(item) => {
        this.setState({moreLoading:true})
        let returnArray = await this.state.myKeywordHistory.filter((info) => info.id !== item.id);
        await AsyncStorage.setItem('MyKeywordHistory', JSON.stringify(returnArray));
        setTimeout(
            () => {            
                this.setState({moreLoading:false,myKeywordHistory : returnArray})
            },500
        )
    }

    removeKeyword = async(item) => {
        Alert.alert(
            DEFAULT_CONSTANTS.appName,
            item.keyword + '을(를) 검색이력에서 삭제하시겠습니까?',
            [
              {text: '네', onPress: () => this.actionRemove(item)},
              {text: '아니오', onPress: () => console.log('no')},
            ],
            {cancelable: false},
        )
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

    clearInputText = field => {
        this.setState({[field]: '',isResult:false});
    };

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

    renderIcons = (idx, item ) => {
        return (
            item.is_soldout ? 
            <View style={styles.renderIconWrap}>
                <View style={styles.renderIconTitleWrap}>
                    <CustomTextB style={styles.menuTextWhiteSmall}>일시품절</CustomTextB>  
                </View>
                <View style={styles.renderIconDataWrap}>
                    <TouchableOpacity style={styles.renderIconData} onPress={()=>this.registAlarm(item)}>
                        <Icon name="bells" size={10} color="#fff" />
                        <CustomTextR style={styles.menuTextWhiteSmall}> 입고알림</CustomTextR>  
                    </TouchableOpacity>
                </View>
                {item.measure > 0 &&
                <View style={styles.renderIconDataWrap2}>
                    <TouchableOpacity style={styles.renderIconData} onPress={()=>this.moveDetail3(item)}>
                        <Icon name="sync" size={10} color="#fff" />
                        <CustomTextR style={styles.menuTextWhiteSmall}> 대체상품</CustomTextR>  
                    </TouchableOpacity>
                </View>
                }
            </View>
            :
            null
        )
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
                    <View style={styles.searchWakuWrap}>
                        <Input
                            value={this.state.searchKeyword}    
                            placeholder="검색어를 입력해주세요"
                            placeholderTextColor={DEFAULT_COLOR.base_color_666}
                            inputContainerStyle={CommonStyle.searchinputContainer}
                            leftIcon={{ type: 'fontawesome', name: 'search',color:'#808080',size:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize25) }}
                            leftIconContainerStyle={CommonStyle.searchLeftIcon}
                            rightIcon={ () => { return (<TouchableOpacity onPress={()=>this.getSearchResult()} style={CommonUtil.isEmpty(this.state.searchKeyword) ? styles.searchBtnDefault : styles.searchBtnCan}><CustomTextM style={CommonStyle.bottomMenuOffText}>검색</CustomTextM></TouchableOpacity>)}}
                            clearButtonMode={'always'}
                            rightIconContainerStyle={CommonUtil.isEmpty(this.state.searchKeyword) ? CommonStyle.searchrightIconContainer : CommonStyle.searchrightIconContainerOn}
                            inputStyle={CommonStyle.searchFormWrap}
                            onChangeText={value => this.setState({searchKeyword:value,isResult:false})}
                        />
                        {
                            ( Platform.OS === 'android' && this.state.searchKeyword !== '' ) && (
                            <TouchableOpacity 
                                hitSlop={{left:10,right:10,bottom:10,top:10}}
                                style={{position: 'absolute', right: 100,top:10}} 
                                onPress={() => this.clearInputText('searchKeyword')}
                            >
                                <Image source={require('../../../assets/icons/btn_remove.png')} resizeMode={'contain'} style={CommonStyle.defaultIconImage20} />
                            </TouchableOpacity>
                            )
                        }
                    </View>
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
                    
                    <View style={CommonStyle.termLineWrap} />  
                    { 
                    (this.state.isResult && !CommonUtil.isEmpty(this.state.searchKeyword)) ?
                    <View style={{flex:1}}>
                        <View style={styles.titleWrap}>
                            <CustomTextR style={styles.defaultText}>검색결과 {this.state.totalCount}건</CustomTextR>
                        </View>
                        <View style={styles.mainWrap}>
                            {
                                this.state.resultData.length === 0 ?
                                <View style={styles.defaultWrap}>
                                    <CustomTextR style={styles.defaultText}>검색결과 없음</CustomTextR>
                                </View>
                                :
                                this.state.resultData.map((item, index) => {  
                                return (
                                    <View key={index} style={{backgroundColor:'#fff'}}>
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
                                                    style={CommonStyle.fullWidthImage}
                                                />
                                            }  
                                            {/*this.renderIcons(index,item)*/}
                                            </View> 
                                            <View style={styles.contentWrap}>
                                                <View style={styles.textPadding}>
                                                    <CustomTextR style={CommonStyle.titleText2}>[{item.category_name}]</CustomTextR>
                                                    <CustomTextR style={CommonStyle.titleText}>{item.product_name}</CustomTextR>
                                                    { 
                                                    !CommonUtil.isEmpty(this.props.userToken) &&
                                                    (
                                                    item.event_each_price > 0 ?
                                                        <TextRobotoB style={styles.menuText2}>{CommonFunction.currencyFormat(item.each_price)}원{"  "}<TextRobotoR style={[styles.menuText888,CommonStyle.fontStrike]}>{CommonFunction.currencyFormat(item.event_each_price)} 원</TextRobotoR></TextRobotoB>
                                                    :
                                                        <TextRobotoB style={styles.menuText2}>{CommonFunction.currencyFormat(item.each_price)}원</TextRobotoB>  
                                                    )}
                                                </View>  
                                            </View>                                        
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={()=>this.addEachAlert(item,index)}style={styles.cartIcoWrap}>
                                            <NativeImage source={ICON_CART} resizeMode={"contain"} style={styles.icon_cart_image} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={()=>this.registZzim(item)}style={styles.zzimIconWrap}>
                                            <NativeImage source={ICON_ZZIM} resizeMode={"contain"} style={styles.icon_cart_image} />
                                        </TouchableOpacity>
                                    </View>
                                )
                                })
                            }  
                        </View>
                    </View>
                    :
                    <View style={{flex:1}}>
                        <View style={styles.titleWrap}>
                            <CustomTextR style={styles.defaultText}>최근검색어</CustomTextR>
                        </View>
                        <View style={styles.mainWrap}>
                            {
                                this.state.myKeywordHistory.length === 0 ?
                                <View style={styles.defaultWrap}>
                                    <CustomTextR style={styles.defaultText}>최근 검색한 정보가 없습니다.</CustomTextR>
                                </View>
                                :
                                this.state.myKeywordHistory.map((item, index) => {  
                                return (
                                    <TouchableOpacity style={styles.boxWrap2} key={index} onPress={()=>this.reSearchData(item.keyword)}>
                                        <View style={styles.keywordLeftWrap}>
                                            <CustomTextR style={CommonStyle.dataText}>{item.keyword}</CustomTextR> 
                                        </View>
                                        <TouchableOpacity style={styles.keywordRightWrap} onPress={()=>this.removeKeyword(item)}>
                                            <NativeImage
                                                source={require('../../../assets/icons/btn_close.png')}
                                                resizeMode={"contain"}
                                                style={{width:20,height:20}}
                                            />
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                )
                                })
                            }
                        </View>
                    </View>
                    }
                    {
                        this.state.ismore &&
                        <View style={CommonStyle.moreButtonWrap}>
                            <TouchableOpacity 
                                onPress={() => this.getData(this.state.searchKeyword,this.state.currentpage+1,true)}
                                style={CommonStyle.moreButton}
                            >
                            <CustomTextL style={CommonStyle.moreText}>더보기</CustomTextL>
                            </TouchableOpacity>
                        </View>
                    }
                    <View style={CommonStyle.blankArea}></View>
                    { 
                        this.state.moreLoading &&
                        <View style={CommonStyle.moreWrap}>
                            <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} />
                        </View>
                    }
                    </ScrollView>
                </SafeAreaView>
            );
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : "#fff",
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchWakuWrap :{marginVertical:10,marginHorizontal:10,height:45},
    defaultWrap : {
        paddingHorizontal:15,paddingVertical:15
    },
    defaultText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),color:'#7d7d7d'
    },
    boxSubWrap : {
        flex:1,
        flexDirection:'row',    
        flexGrow:1,    
        paddingHorizontal:20,paddingVertical: Platform.OS === 'android' ? 10 : 15,
        alignItems: 'flex-start',        
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
        alignItems:'flex-start',
        paddingLeft:20
    },
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),paddingRight:10
    },
    menuCategoryText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),paddingRight:10,color:'#585858'
    },
    thumbWrap : {
        flex:1.2,alignItems:'center',justifyContent:'center',borderRadius:10,overflow:'hidden'
    },
    contentWrap :{
        flex:3,paddingLeft:15
    },
    cartIcoWrap : {
        position:'absolute',bottom:15,right:25,width:30,height:30,borderRadius:20,justifyContent:'center',alignItems:'center'
    },
    zzimIconWrap : {
        position:'absolute',bottom:15,right:60,width:30,height:30,borderRadius:20,justifyContent:'center',alignItems:'center'
    },
    icon_cart_image : {
        width:CommonUtil.dpToSize(25*1.1),height:CommonUtil.dpToSize(25*1.1)
    },
    renderIconWrap : {
        position:'absolute',left:0,bottom:0,width:'100%',backgroundColor:'#333',opacity:0.6,zIndex:5
    },
    renderIconTitleWrap : {
        flex:1,opacity:1,paddingVertical:5,justifyContent:'center',alignItems:'center'
    },
    renderIconDataWrap : {
        flex:1,flexDirection:'row',opacity:1,backgroundColor:'#000'
    },
    renderIconDataWrap2 : {
        flex:1,flexDirection:'row',opacity:1,backgroundColor:'#333'
    },
    renderIconData : {
        flex:1,flexDirection:'row',paddingVertical:5,justifyContent:'center',alignItems:'center'
    },
    menuTextWhite : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),color:'#fff'
    },
    menuTextWhiteSmall : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize10),color:'#fff'
    },
    menuText888 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),color:'#888'
    },
    /**** Modal  *******/
    modalContainer: {   
        zIndex : 10,     
        position :'absolute',
        left:0,
        //top : BASE_HEIGHY,
        width:SCREEN_WIDTH,
        height: SCREEN_HEIGHT*0.5,
        paddingTop: 16,
        backgroundColor: '#fff'
    },
    searchBtnDefault : {
        backgroundColor:'#ccc',paddingHorizontal:20
    },
    searchBtnCan : {
        backgroundColor:DEFAULT_COLOR.base_color,paddingHorizontal:20
    },
    titleWrap : {        
        marginHorizontal:15,paddingTop:10,paddingBottom:5,borderBottomColor:'#979797',borderBottomWidth:0.3
    },
    boxWrap : {
        flex:1,flexDirection:'row',
        borderTopWidth:1.5,borderTopColor:DEFAULT_COLOR.input_border_color,
        borderBottomWidth:1.5,borderBottomColor:DEFAULT_COLOR.input_border_color,
    },
    boxWrap2 : {
        flex:1,flexDirection:'row',        
        borderBottomWidth:1,borderBottomColor:DEFAULT_COLOR.input_border_color,
        paddingHorizontal:20,paddingVertical:15
    },
    keywordLeftWrap : {
        flex:5,justifyContent:'center'
    },
    keywordRightWrap : {
        flex:1,alignItems:'flex-end',justifyContent:'center',paddingRight:5
    },
    boxText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),color:'#000'
    },
    calendarWrap : {
        flex:1,flexDirection:'row',flexGrow:1,borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color
    },
    calendarImageWrap : {
        flex:1,justifyContent:'center',alignItems:'center'
    },   
    calendarDateWrap : {
        flex:3,padding:5,justifyContent:'center',alignItems:'center',backgroundColor:'#fff'
    },
    calendarImage : {
        width:PixelRatio.roundToNearestPixel(20),height:PixelRatio.roundToNearestPixel(20)
    },
    boxDataWrap1 : {
        flex:1,flexDirection:'row',flexGrow:1,justifyContent:'center',alignItems:'center',paddingVertical:10
    },
    boxDataWrap2 : {
        flex:1,flexDirection:'row',flexGrow:1,justifyContent:'flex-end',paddingRight:10,alignItems:'center',paddingVertical:10
    },
    boxDataWrap3 : {
        flex:1,justifyContent:'flex-end',paddingRight:30,alignItems:'flex-end',paddingVertical:10
    },
    dataText3 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),color:'#7f7f7f'
    },
});


function mapStateToProps(state) {
    return {
        userToken : state.GlabalStatus.userToken
    }
}

function mapDispatchToProps(dispatch) {
    return {        
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

export default connect(mapStateToProps,mapDispatchToProps)(IntroScreen);