import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Text,Dimensions,RefreshControl, PixelRatio,Image,TouchableOpacity, Platform,Animated,Alert} from 'react-native';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import Modal from 'react-native-modal';
import {CheckBox} from 'react-native-elements';
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
import FooterScreen from '../../Components/FooterScreen';
const CHECKNOX_OFF = require('../../../assets/icons/check_off.png');
const CHECKNOX_ON = require('../../../assets/icons/check_on.png');

const mockData1 = [
    { id: 1, icon : require('../../../assets/images/sample001.png'),name : '아릭스 수세미 1',price : 1000},
    { id: 2, icon : require('../../../assets/images/sample011.png'),name : '아릭스 수세미 2',price : 1200},
    { id: 3, icon : require('../../../assets/images/sample010.png'),name : '아릭스 수세미 3',price : 1300},
    { id: 4, icon : require('../../../assets/images/sample001.png'),name : '아릭스 수세미 4',price : 1400},
    { id: 5, icon : require('../../../assets/images/sample011.png'),name : '아릭스 수세미 5',price : 1500},
]

const orderSeq = [
    { id: 1, title : '추천순' , menu :'A' },
    { id: 2, title : '신상품순' , menu :'B' },
    { id: 3, title : '가격 낮은순' , menu :'C' },
    { id: 4, title : '가격 높은순' , menu :'D' },
]

class EventProductScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : false,
            orderSeq : 'A',
            showModal : false,
            toggleproduct : this.props.toggleproduct,
        }
    }

    UNSAFE_componentWillMount() {
        this.setState({orderSeq:'A'})
    }

    componentDidMount() {
        
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

    moveDetail = (item) => {
        this.props.navigation.navigate('ProductDetailStack',{
            screenData:item
        })
    }

    moveCategory = (mode) => {
        this.props._fn_ToggleProduct(false);
        if ( mode === 1 ) {
            this.props.navigation.navigate('CategoryModifyStack',{
                screenData:this.state
            })
        }else{
            this.props.navigation.navigate('ProductListModifyStack',{
                screenData:this.state
            })
        }
    }

  

    animatedHeight = new Animated.Value(SCREEN_HEIGHT * 0.5);
    
    closeModal = () => {
        this.setState({showModal:false})
    };

    checkItem = (item) => {
        this.setState({orderSeq:item.menu})
    }

    selectOrderSeq = async(mode) => {
        //console.log('selectOrderSeq',mode);
        this.closeModal()
    }

    addEachAlert = (item,idx) => {
        Alert.alert(DEFAULT_CONSTANTS.appName, '장바구니에서 추가하시겠습니까?',
        [
            {text: '확인', onPress: () => this.addCart(item,idx)},
            {text: '취소', onPress: () => console.log('취소')},
        ]);
    }
    addCart = async(item,idx) => {
       CommonFunction.fn_call_toast('장바구니에 추가되었습니다',2000)
    }
    render() {
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
                    <View style={styles.filterWarp}>
                        <TouchableOpacity hitSlop={{left:10,right:10,top:10,bottom:10}} 
                        onPress={()=>this.setState({showModal:true})}>
                            <Image
                                source={require('../../../assets/icons/icon_filter.png')}
                                resizeMode={"contain"}
                                style={{width: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23), height: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize23)}}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.dataWarp}>
                    {
                        mockData1.map((item, index) => {  
                        return (
                            <View key={index} style={styles.dataEachWarp}>
                                <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail(item)}>
                                    <View style={{paddingBottom:10}}>
                                        <Image
                                            source={item.icon}
                                            resizeMode={"contain"}
                                            style={{width:SCREEN_WIDTH/3,height:SCREEN_WIDTH/3}}
                                            //style={{width:PixelRatio.roundToNearestPixel(SCREEN_WIDTH/2-20),aspectRatio:1}}
                                        />
                                    </View>
                                    <TextRobotoR style={styles.menuText}>{item.name}</TextRobotoR>
                                    <TextRobotoR style={styles.menuText}>{CommonFunction.currencyFormat(item.price)}원</TextRobotoR>   
                                    <TouchableOpacity 
                                        onPress={()=>this.addEachAlert(index,item)}
                                        style={styles.cartIcoWrap}
                                    >
                                        <Image
                                            source={require('../../../assets/icons/icon_cart.png')}
                                            resizeMode={"contain"}
                                            style={{width:PixelRatio.roundToNearestPixel(25),height:PixelRatio.roundToNearestPixel(25)}}
                                        />
                                    </TouchableOpacity>                                 
                                </TouchableOpacity>
                            </View>
                        )
                        })
                    } 
                    </View>
                    <FooterScreen contentHeight={0}/> 
                    <View style={[CommonStyle.blankArea,{backgroundColor:DEFAULT_COLOR.base_background_color}]}></View>
                    { this.state.moreLoading &&
                        <View style={CommonStyle.moreWrap}>
                            <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} />
                        </View>
                    }
                    
                </ScrollView>   
                {/** 인포메이션 모달 **/}
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
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            indicatorStyle={'white'}
                        >   
                        <View style={styles.modalTitleWrap} >
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
                                            checkedIcon={<Image source={CHECKNOX_ON} resizeMode='contain' style={styles.checkboxIcon} />}
                                            uncheckedIcon={<Image source={CHECKNOX_OFF} resizeMode='contain' style={styles.checkboxIcon} />}
                                            checkedColor={DEFAULT_COLOR.base_color}                          
                                            checked={this.state.orderSeq === item.menu}
                                            size={PixelRatio.roundToNearestPixel(15)}                                    
                                            //onPress={() => this.checkItem(item,index)}
                                            />
                                    </View>
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
    filterWarp : {
       justifyContent:'center',alignItems:'flex-end',paddingHorizontal:15,paddingTop:15
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
        flex:1,paddingHorizontal:10,paddingVertical: 15
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
    menuText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingRight:10
    },
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),paddingRight:10
    },
    cartIcoWrap : {
        position:'absolute',top:SCREEN_WIDTH/3-30,right:10,width:40,height:40,borderRadius:20,justifyContent:'center',alignItems:'center',borderColor:DEFAULT_COLOR.base_color,borderWidth:1,backgroundColor:'#fff',opacity:1
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
        }
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(EventProductScreen);