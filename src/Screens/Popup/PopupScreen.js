import React, { Component } from 'react';
import {Alert,View,TouchableOpacity,StyleSheet,Dimensions,Animated,Image,PixelRatio,Linking} from "react-native";
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-community/async-storage';
import {CheckBox} from 'react-native-elements';
import 'moment/locale/ko'
import  moment  from  "moment";
import {connect} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
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
import Loader from '../../Utils/Loader';
import Swiper from '../../Utils/Swiper';
const HEADER_CLOSE_IMAGE = require('../../../assets/icons/btn_close.png');
const CHECKNOX_OFF = require('../../../assets/icons/checkbox_off.png');
const CHECKNOX_OFF2 = require('../../../assets/icons/checkbox_off2.png');
const CHECKNOX_ON = require('../../../assets/icons/checkbox_on.png');
const Tomorrow = moment(Tomorrow).add(1, 'day').format('YYYY-MM-DD');
import Progress from 'react-native-progress/Bar';
import ScalableImage from '../../Utils/ScalableImage';

class PopupScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            isVisible : true,
            autoplay : false,
            isLoop : true,
            showPopupLayer : false,
            popLayerList : []
        }
    }

    UNSAFE_componentWillMount() {
        console.log('this.props.screenState.popLayerList2',this.props.screenState.popLayerList)
        
        this.setState({
            popLayerList : this.props.screenState.popLayerList,
        })

        this.props.screenProps.navigation.addListener('focus', () => {        
            this.setState({
                popLayerList : this.props.screenState.popLayerList,
            })
        })
    }

    componentDidMount() {
        setTimeout(
            () => {            
                this.setState({loading:false})
            },500
        )
    }
    UNSAFE_componentWillUnmount(){
        this.setState({
            autoplay:false,
            isLoop : false
        })
    }

    shouldComponentUpdate(nextProps, nextState) {
        //console.log('nextState',nextState.isVisible );
        //console.log('nextProps',nextProps.isVisible );
        if ( this.state.isVisible !== nextProps.isVisible ) {
            this.setState({
                isVisible:nextProps.isVisible
            })
        }
        return true;
    }

    closePopUp = () => {
        //console.log('closePopUp',this.state.isVisible)
        this.setState({isVisible : false, isLoading:false})
        this.props.screenState.closePopUp();
    }

    renderPagination = (index, total, context) => {
        return (
          <View style={styles.paginationStyle}>
            <TextRobotoR style={styles.paginationText2}>
              <TextRobotoR style={styles.paginationText}>{index + 1}</TextRobotoR>/{total}
            </TextRobotoR>
          </View>
        )
    }

    renderImage = (item) => {
        return (
            <ScalableImage
                source={{uri:DEFAULT_CONSTANTS.defaultImageDomain + item.img_url}}
                width={SCREEN_WIDTH*0.9}
                height={SCREEN_WIDTH*0.9/3*4}
                indicator={Progress.Pie}
                indicatorProps={{size: 80,borderWidth: 0,color: DEFAULT_COLOR.base_color,unfilledColor:'#fff'}}
            /> 
        )
    }

    renderImageNew = (item) => {
        return (
            <Image
                source={{uri:DEFAULT_CONSTANTS.defaultImageDomain + item.img_url}}
                style={{width:SCREEN_WIDTH*0.9, height:SCREEN_WIDTH*0.9/3*4}}
                resizeMode={'contain'}
            /> 
        )
    }

    moveBannerDetail = async(item) => {
        
        if ( item.popup_gubun === 'Notice') {
        }else{
            this.setState({loading:false});
            if ( item.inlink_type === 'PRODUCT') {
                if ( CommonUtil.isEmpty(this.props.userToken)) {
                    Alert.alert(DEFAULT_CONSTANTS.appName, '로그인이 필요합니다.\n로그인 하시겠습니까',
                    [
                        {text: '확인', onPress: () => CommonUtil.moveLogin(this.props)},
                        {text: '취소', onPress: () => console.log('취소')},
                    ]);
                }else{
                    await this.closePopUp()
                    this.props.screenProps.navigation.navigate('ProductDetailStack',{
                        screenData:{...item,product_pk:item.target_pk}
                    });
                }
            }else if ( item.inlink_type === 'EVENT') {
                await this.closePopUp()
                this.props.screenProps.navigation.navigate('EventProductStack',{
                    screenTitle: item.popup_title,
                    screenData:{...item,event_pk:item.target_pk,event_name:item.popup_title}
                });
            }else if ( item.inlink_type === 'CATEGORY') {
                this.closePopUp()                
                setTimeout(() => {
                    this.props.screenProps.navigation.navigate('ProductListStack',{
                        screenData:{...item,category_pk:item.target_pk,category_name : item.popup_title}
                    });
                }, 500);
            }else{
               
            }
        }
    }
    checkItem = async(bool) => {
        console.log("bool",bool)
        if ( bool ) {
            const ExpireDate = Date.parse(new Date(Tomorrow + 'T00:10:00'));
            const ExpireDate2 = ExpireDate/1000;
            console.log("ExpireDate",ExpireDate2)
            try {
                await AsyncStorage.setItem('popLayerExpireTime', ExpireDate2.toString());
            } catch (e) {
                console.log(e);
            }
        }else{
            await AsyncStorage.removeItem('popLayerExpireTime');
        }
        this.setState({showPopupLayer:bool})
    }
    animatedHeight = new Animated.Value(SCREEN_WIDTH/3*4);
    render() {
        if ( this.state.loading ) {
            return (
                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} /> 
            )
        }else {  
        return (
            <Modal 
                onBackdropPress={()=>this.closePopUp()}
                animationType="slide"
                transparent={true}
                onRequestClose={() => this.closePopUp()}
                style={{justifyContent: 'flex-end',margin: 0}}
                useNativeDriver={true}
                animationInTiming={300}
                animationOutTiming={300}
                hideModalContentWhileAnimating                    
                isVisible={this.state.isVisible}
            >
                <View style={styles.modalBackground}>
                    <Animated.View style={[styles.modalContainer,{ height: this.animatedHeight }]}>
                        {/* <TouchableOpacity 
                            hitSlop={{left:10,right:10,bottom:10,top:10}}
                            style={styles.modalTop}
                            onPress={()=>this.closePopUp()}
                        > 
                            <Image source={HEADER_CLOSE_IMAGE} style={CommonStyle.defaultIconImage30} />
                        </TouchableOpacity> */}
                        <View style={{flex:1,overflow:'hidden'}}>
                            <Swiper
                                style={[{margin:0,padding:0,backgroundColor:'transparent',height:'100%'}]}
                                renderPagination={this.renderPagination}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                //onTouchStart={()=>this._onTouchStart()}
                                //onMomentumScrollEnd={()=>this._onTouchEnd()}
                                loop={this.state.isLoop}
                                autoplay={this.state.autoplay}            
                                //autoplayTimeout={5}
                            >
                                {this.state.popLayerList.map((imageItem,index) => {
                                    return (
                                        <TouchableOpacity key={index} 
                                            onPress= {()=> this.moveBannerDetail(imageItem)}
                                            style={{flex:1,minHeight:'100%'}}
                                        >
                                            <View style={styles.imageWarp}>
                                                {this.renderImageNew(imageItem)}
                                            </View>
                                            {/*
                                            <View style={styles.contentStyle}>
                                                <LinearGradient
                                                    colors={['transparent', '#333','#000']}
                                                    style={[StyleSheet.absoluteFill]}
                                                />
                                                <CustomTextB style={styles.menuText} numberOfLines={2} ellipsizeMode={'tail'}>{imageItem.popup_title}</CustomTextB>
                                            </View>
                                            */}
                                        </TouchableOpacity>
                                        )
                                })}
                                
                            </Swiper>
                           
                        </View>
                        <View style={styles.checkBoxWrap}>
                            <LinearGradient
                                colors={['transparent', '#666','#222']}
                                style={[StyleSheet.absoluteFill]}
                            />
                            <CheckBox 
                                containerStyle={{padding:0,margin:0}}   
                                iconType={'FontAwesome'}
                                checkedIcon={<Image source={CHECKNOX_ON} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                uncheckedIcon={<Image source={CHECKNOX_OFF} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                                checkedColor={DEFAULT_COLOR.base_color}                          
                                checked={this.state.showPopupLayer}
                                onPress={() => this.checkItem(!this.state.showPopupLayer)}
                            />
                            <CustomTextR style={styles.menuText}>오늘하루 안보기</CustomTextR>
                            <TouchableOpacity 
                                hitSlop={{left:10,right:10,bottom:10,top:10}}
                                style={{paddingLeft:10}}
                                onPress={()=>this.closePopUp()}
                            > 
                                <Image source={HEADER_CLOSE_IMAGE} style={{width:CommonUtil.dpToSize(20),height:CommonUtil.dpToSize(20)}} />
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                    
                </View>
            </Modal>
        );
        }
    }
}

const styles = StyleSheet.create({
    modalBackground: {
        zIndex:1,
        flex: 1,
        justifyContent: "center",
        alignItems:'center',
        backgroundColor: "rgba(0,0,0,0.3)",
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height
    },
    modalTop : {
        zIndex:10,
        height:40,
        justifyContent:'flex-start',
        paddingLeft:10,
        //backgroundColor:'#ff0000'
    },
    modalTail : {
        zIndex:10,
        height:70,
        justifyContent:'center',
        alignItems:'center',
        paddingLeft:10,
        //backgroundColor:'#ff0000'
    },
    checkBoxWrap : {
        position: 'absolute',
        flexDirection:'row',
        alignItems:'center',
        bottom: 0,
        left : 0,
        //paddingBottom:5,
        width:SCREEN_WIDTH*0.9,
        height:60,
        zIndex:15
    },
    moveButton  : {
        paddingVertical:10,
        width : SCREEN_WIDTH*0.7,
        backgroundColor:DEFAULT_COLOR.base_color,
        justifyContent:'center',
        alignItems:'center'
    },
    modalContainer: {   
        //top : BASE_HEIGHY,
        width:SCREEN_WIDTH*0.9,
        height: SCREEN_HEIGHT*0.7,
        borderRadius:10,
        paddingTop: 0,
        backgroundColor: '#fff'
    },
    paginationStyle: {
        position: 'absolute',
        top: 10,
        right: 15,
        backgroundColor:'#555',
        paddingHorizontal:10,
        paddingVertical:3,
        borderRadius:12,
        zIndex:20
    },
    renderWrapStyle: {
        position:'absolute',
        height:SCREEN_HEIGHT*0.8,
        width:SCREEN_WIDTH*0.9,
        top:0,
        left: 0,
        flexDirection:'row',
    },
    imageWarp : {
        flex:1,
        backgroundColor:'transparent'
    },
    contentStyle: {
        position:'absolute',
        left:0,
        bottom:0,
        width:SCREEN_WIDTH*0.9,
        paddingHorizontal:20,
        height:100,
        zIndex:15,
        backgroundColor:'transparent'
        
    },
    menuText : {
        color: '#fff',fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14)
    },
    menuText2 : {
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14)
    },
    paginationText: {
        color: '#fff',fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)
    },
    paginationText2: {
        color: '#ccc',
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)
    }

});


function mapStateToProps(state) {
    return {
        userToken : state.GlabalStatus.userToken
    };
}

export default connect(mapStateToProps,null)(PopupScreen);