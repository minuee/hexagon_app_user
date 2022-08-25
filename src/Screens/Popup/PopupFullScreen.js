import React, { Component } from 'react';
import {Platform,View,TouchableOpacity,StyleSheet,Dimensions,Animated,Image,PixelRatio} from "react-native";
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import {CheckBox} from 'react-native-elements';
import 'moment/locale/ko'
import  moment  from  "moment";
import {connect} from 'react-redux';
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
const CHECKNOX_ON = require('../../../assets/icons/checkbox_on.png');
const Tomorrow = moment(Tomorrow).add(1, 'day').format('YYYY-MM-DD');
class PopupFullScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            isVisible : true,
            autoplay : false,
            isLoop : true,
            showFullPopup : false,
            popLayerList : []
        }
    }

    UNSAFE_componentWillMount() {
        this.setState({popLayerList : this.props.screenState.popLayerList})
        this.props.screenProps.navigation.addListener('focus', () => {        
            this.setState({popLayerList : this.props.screenState.popLayerList})
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
        this.setState({autoplay:false,isLoop : false})
    }

    shouldComponentUpdate(nextProps, nextState) {
        if ( this.state.isVisible !== nextProps.isVisible ) {
            this.setState({
                isVisible:nextProps.isVisible
            })
        }
        return true;
    }

    closePopUp = () => {
        this.setState({isVisible : false})
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
            <Image
                style={{ width:'100%',height:'100%'}}
                source={{uri:DEFAULT_CONSTANTS.defaultImageDomain + item.img_url}}
                resizeMode={Platform.OS === 'ios' ? 'contain' : 'contain'}
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
            }else{
               
            }
        }
    }
    checkItem = async(bool) => {
        if ( bool ) {
            const ExpireDate = Date.parse(new Date(Tomorrow + 'T00:10:00'));
            const ExpireDate2 = ExpireDate/1000;            
            try {
                await AsyncStorage.setItem('popFullExpireTime', ExpireDate2.toString());
            } catch (e) {
                console.log(e);
            }
        }else{
            await AsyncStorage.removeItem('popFullExpireTime');
        }
        this.setState({showFullPopup:bool})
    }

  
    animatedHeight = new Animated.Value(SCREEN_HEIGHT);
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
                        
                        <View style={{flex:1,overflow:'hidden'}}>
                            <Swiper
                                style={[{margin:0,padding:0,backgroundColor:'transparent'}]}
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
                                        <TouchableOpacity 
                                            key={index} 
                                            onPress= {()=> this.moveBannerDetail(imageItem)}
                                            style={{minHeight:'100%',backgroundColor:'transparent',alignItems:'flex-start'}}
                                        >
                                            {this.renderImage(imageItem)}
                                            <View style={styles.renderWrapStyle}>
                                                
                                                <View style={styles.contentStyle}>
                                                    <CustomTextB style={styles.menuText} numberOfLines={2} ellipsizeMode={'tail'}>{imageItem.popup_title}</CustomTextB>
                                                </View>
                                            </View>
                                           
                                        </TouchableOpacity>
                                        )
                                })}
                            </Swiper>
                        </View>
                    </Animated.View>
                    <View style={styles.checkBoxWrap}>
                        <CheckBox 
                            containerStyle={{padding:0,margin:0}}   
                            iconType={'FontAwesome'}
                            checkedIcon={<Image source={CHECKNOX_ON} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                            uncheckedIcon={<Image source={CHECKNOX_OFF} resizeMode='contain' style={CommonStyle.checkboxIcon} />}
                            checkedColor={DEFAULT_COLOR.base_color}                          
                            checked={this.state.showFullPopup}
                            size={PixelRatio.roundToNearestPixel(55)}                                    
                            onPress={() => this.checkItem(!this.state.showFullPopup)}
                        />
                        <CustomTextR style={styles.menuText2}>오늘하루 안보기</CustomTextR>
                        <TouchableOpacity 
                            hitSlop={{left:10,right:10,bottom:10,top:10}}
                            style={{paddingLeft:10}}
                            onPress={()=>this.closePopUp()}
                        > 
                            <Image source={HEADER_CLOSE_IMAGE} style={{width:CommonUtil.dpToSize(20),height:CommonUtil.dpToSize(20)}} />
                        </TouchableOpacity>
                    </View>
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
        position:'absolute',top:10,left:0,width:SCREEN_WIDTH,
        height:Platform.OS === 'ios' ? 80 : 50,
        justifyContent:'center',
        paddingLeft:10,
        //backgroundColor:'#ff0000'
    },

    imageWrapios : {
        width:'100%',height:'100%'
    },
    imageWrapaandroid : {
        width:'100%',height:'100%'
    },
    moveButton  : {
        paddingVertical:10,
        width : SCREEN_WIDTH,
        backgroundColor:DEFAULT_COLOR.base_color,
        justifyContent:'center',
        alignItems:'center'
    },
    modalContainer: {
        width:SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        paddingTop: 16,
        backgroundColor: '#fff'
    },
    checkBoxWrap : {
        position: 'absolute',
        flexDirection:'row',
        alignItems:'center',
        bottom: 40,
        left : 5,
    },
    paginationStyle: {
        position: 'absolute',
        flexDirection:'row',
        bottom: 40,
        right: 15,
        backgroundColor:'#555',
        paddingHorizontal:10,
        paddingVertical:3,
        borderRadius:12
    },
    renderWrapStyle: {
        position:'absolute',
        height:100,
        width:SCREEN_WIDTH*0.9,
        top:0,
        left: 0,
        flexDirection:'row',
        opacity:0.3
    },
    contentStyle: {
        flex:5,
        paddingHorizontal:20,
        paddingVertical:10,
        
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

export default connect(mapStateToProps,null)(PopupFullScreen);