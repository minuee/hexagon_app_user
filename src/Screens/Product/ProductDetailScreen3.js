import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Animated,Dimensions,PixelRatio,TouchableOpacity,Image,Linking,Alert} from 'react-native';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import 'moment/locale/ko'
import  moment  from  "moment";
import {Overlay,CheckBox} from 'react-native-elements';
import Modal from 'react-native-modal';
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
const CHECKNOX_OFF = require('../../../assets/icons/check_off.png');
const CHECKNOX_ON = require('../../../assets/icons/check_on.png');

const alertContents = 
(<View style={{flex:1,marginTop:10}}>
    <View style={{paddingTop:0}}>
        <CustomTextB style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),color:'#494949'}}>
            장바구니에 성공적으로 담겼습니다.
        </CustomTextB>        
    </View> 
    <View style={{paddingTop:20}}>
        <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),color:'#494949'}}>
            장바구니 총액 : 291,300원
        </CustomTextR>        
    </View>                        
</View>);


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

            //poplayer
            popLayerView : false,
            isCancelView : true,
            cancleText : '취소',
            okayText : '통화하기',
            alertTitle : DEFAULT_CONSTANTS.appName,
            alertBody : alertContents,
            clickCancle : this.clickCancle.bind(this),
            closePopLayer : this.closePopLayer.bind(this)
        }
    }

    clickCancle = () => {
        this.setState({popLayerView : false})
    }
    showPopLayer = async() => {
        this.setState({popLayerView : true})
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

    checkItem = (item) => {
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

    render() {
        if ( this.state.loading ) {
            return (
                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} /> 
            )
        }else {  
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
                                    <CustomAlert screenState={this.state} />
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
                    <View style={[!this.state.showCartForm ? CommonStyle.blankArea :styles.blankArea,{backgroundColor:'#f5f6f8'}]}></View>
                    { this.state.moreLoading &&
                        <View style={CommonStyle.moreWrap}>
                            <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} />
                        </View>
                    }
                    </ScrollView>
                    { !this.state.showCartForm ?
                    <View style={CommonStyle.scrollFooterWrap}>
                        <TouchableOpacity 
                            style={CommonStyle.scrollFooterLeftWrap}
                            onPress={()=>this.openModal()}
                        >
                            <CustomTextB style={CommonStyle.scrollFooterText}>구매하기</CustomTextB>
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={styles.cartWrap}>
                        <View style={styles.bottomBoxSubWrap} >
                            <View style={{flex:1,justifyContent:'center',paddingVertical:5}}>
                                <CustomTextB style={styles.menuTitleText}>{this.state.orderSetData.title}</CustomTextB>
                                <TextRobotoR style={styles.menuTitleText}>{CommonFunction.currencyFormat(this.state.orderSetData.price)}원</TextRobotoR>
                            </View>
                            <TouchableOpacity 
                                onPress={()=> this.setState({showModal:true})}
                                style={styles.bottomBoxRightWrap}
                                hitSlop={{left:10,right:10,top:10,bottom:10}}
                            >
                                <Image
                                    source={require('../../../assets/icons/btn_next.png')}
                                    resizeMode={"contain"}
                                    style={{width:PixelRatio.roundToNearestPixel(20),height:PixelRatio.roundToNearestPixel(20)}}
                                />
                            </TouchableOpacity>
                        </View>
                      
                        <View style={styles.bottomBoxSubWrap2}>
                            <TouchableOpacity 
                                style={styles.numberWrap}
                                onPress={()=>this.orderCount('minus')}
                            >
                                <Image
                                    source={require('../../../assets/icons/btn_minus.png')}
                                    resizeMode={"contain"}
                                    style={styles.numberDataWrap}
                                />
                            </TouchableOpacity>
                            <View style={styles.orderCountWrap}>
                                <TextRobotoR style={styles.menuTitleText3}>{CommonFunction.currencyFormat(this.state.orderCount)}</TextRobotoR>
                            </View>
                            <TouchableOpacity 
                                style={styles.numberWrap}
                                onPress={()=>this.orderCount('plus')}
                            >
                                <Image
                                    source={require('../../../assets/icons/btn_plus.png')}
                                    resizeMode={"contain"}
                                    style={styles.numberDataWrap}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.bottomBoxSubWrap} >
                            <TouchableOpacity 
                                style={styles.scrollFooterLeftWrap}
                                onPress={()=>this.showPopLayer()}
                            >
                                <CustomTextB style={CommonStyle.scrollFooterText}>장바구니 담기</CustomTextB>
                            </TouchableOpacity>
                        </View>
                        
                    </View>
                    }


                    {/** 인포메이션 모달 **/}
                    <Modal
                        onBackdropPress={this.closeModal}
                        animationType="slide"
                        //transparent={true}
                        onRequestClose={() => {
                            this.closeModal()
                        }}                        
                        style={{justifyContent: 'flex-end',margin: 0}}
                        useNativeDriver={true}
                        animationInTiming={300}
                        animationOutTiming={300}
                        hideModalContentWhileAnimating 
                        isVisible={this.state.showModal}
                    >
                        <Animated.View style={[styles.modalContainer,{ height: this.animatedHeight }]}>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                indicatorStyle={'white'}
                            >
                            
                                <View style={styles.modalTitleWrap} >
                                    <View style={styles.modalLeftWrap}>
                                        <CustomTextB style={styles.menuTitleText}>판매단위</CustomTextB>
                                    </View>    
                                </View>     
                                <View >       
                                {
                                    orderSeq.map((item, index) => {  
                                        return (
                                        <TouchableOpacity 
                                            key={index}  style={this.state.orderSeq === item.menu ? styles.modalSelectedWrap : styles.modalDefaultWrap} 
                                            onPress={() => this.checkItem(item,index)}
                                        >
                                            <CustomTextR style={styles.menuTitleText}>{item.title}</CustomTextR>
                                            <TextRobotoR style={styles.menuTitleText}>{CommonFunction.currencyFormat(item.price)}</TextRobotoR>
                                        </TouchableOpacity>
                                        )
                                    })
                                }    
                                </View> 
                                <View style={styles.bottomWrap}>
                                    <TouchableOpacity 
                                        onPress={()=> this.closeModal()}
                                        style={styles.bottomDataWrap}
                                    >
                                        <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#9f9f9f'}}>취소</CustomTextM>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        onPress={()=>this.selectOrderSeq(this.state.orderSeq)}
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
    bottomBoxSubWrap : {
        flex:1,
        flexDirection:'row',    
        flexGrow:1,    
        paddingHorizontal:20,paddingVertical: Platform.OS === 'android' ? 5 : 15
    },
    bottomBoxSubWrap2 : { 
        flex:1,paddingHorizontal:30,paddingVertical:5,justifyContent:'center',alignItems:'center',flexDirection:'row',flexGrow:1
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
    scrollFooterLeftWrap : {
        flex:1,backgroundColor:DEFAULT_COLOR.base_color,justifyContent:'center',alignItems:'center',paddingVertical:5
    },
    defaultWrap : {
        flex:1,backgroundColor : "#fff"
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
        width:SCREEN_WIDTH/2,height:PixelRatio.roundToNearestPixel(38),borderTopWidth:1,borderTopColor:'#ccc',borderBottomWidth:1,borderBottomColor:'#ccc',justifyContent:'center',alignItems:'center'
    },
    numberWrap : {
        width:PixelRatio.roundToNearestPixel(38)
    },
    numberDataWrap : {
        width:PixelRatio.roundToNearestPixel(38),height:PixelRatio.roundToNearestPixel(38)
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