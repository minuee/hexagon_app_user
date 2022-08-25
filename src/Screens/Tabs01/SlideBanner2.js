import React from 'react';
import {View,Dimensions,TouchableOpacity,Linking,Platform,StyleSheet,Alert,PixelRatio,ImageBackground} from 'react-native';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");
import LinearGradient from 'react-native-linear-gradient';
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import {CustomTextM,CustomTextR, CustomTextB, TextRobotoB,TextRobotoR} from '../../Components/CustomText';
import Loader from '../../Utils/Loader';
import { apiObject } from "../Apis";
import CommonUtil from '../../Utils/CommonUtil';
import CommonFunction from '../../Utils/CommonFunction';
import Swiper from '../../Utils/Swiper';
import Image from 'react-native-image-progress';
import Progress from 'react-native-progress/Bar';

const defaultBanner = [
    {id:1 ,img_url : require('../../../assets/images/introduce_2.png'),title : '우수제품 입점을 제안합니다.',mode : 'local'},
    {id:2 ,img_url : require('../../../assets/images/introduce_3.png'),title : '재고부담 No 소량주문도 가능합니다.',mode : 'local'},
    {id:3 ,img_url : require('../../../assets/images/introduce_4.png'),title : '높은 수익성을 드립니다.',mode : 'local'},
    {id:4 ,img_url : require('../../../assets/images/introduce_5.png'),title : '철저한 후속관리로 재고부담을 낮추고 판매율을 높여드립니다.',mode : 'local'}
]

class SlideBanner extends React.Component {

    constructor(props) {
        super(props);
        this.state = {     
            loading : false,
            bannerList : [],
            autoplay : false,
            isLoop : false,
        };
    } 

    getBaseData = async() => {
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/banner/list?page=1&paginate=10';
            const token = this.props.screenProps.userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_getPageList(this.props,url,token,sendData);
            //console.log('getBaseData',returnCode); 
            if ( returnCode.code === '0000'  ) {
                this.setState({
                    bannerList : CommonUtil.isEmpty(returnCode.data.bannerList) ? [] : returnCode.data.bannerList
                })
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.',2000);
            }

            this.setState({loading:false})
        }catch(e){
            console.log('e',e) 
            this.setState({loading:false})
        }
    }

    async UNSAFE_componentWillMount() {
        await this.getBaseData();
        this.props.screenProps.navigation.addListener('focus', () => {  
            this.getBaseData();
        })
    }
    componentDidMount() {        
       
    }
    UNSAFE_componentWillUnmount(){
        this.setState({
            autoplay:false,
            isLoop : false
        })
    }

    _onTouchStart = () => {        
        if ( Platform.OS === 'android') {
            //this.props.screenState.setTopScrollDisable(true);// disabed parent scroll            
        }
    }

    _onTouchEnd = () => {        
        if ( Platform.OS === 'android') {
            //this.props.screenState.setTopScrollDisable(false); // enables parent scroll
        }
    }
    moveDetail = () => {
        this.props.screenProps.navigation.navigate('IntroduceStack');
    }

    moveBannerDetail = (item) => {
        //console.log('moveBannerDetail',item)
        if ( item.link_type === 'OUTLINK' ) {
            //브라우저호출
            if ( !CommonUtil.isEmpty(item.target_url)) {
                Linking.openURL(item.target_url)
            }
            
        }else{
            if ( CommonUtil.isEmpty(this.props.userToken)) {
                Alert.alert(DEFAULT_CONSTANTS.appName, '로그인이 필요합니다.\n로그인 하시겠습니까',
                [
                    {text: '확인', onPress: () => CommonUtil.moveLogin(this.props)},
                    {text: '취소', onPress: () => console.log('취소')},
                ]);
            }else{
                switch(item.inlink_type) {
                    case 'PRODUCT' : 
                        this.props.screenProps.navigation.navigate('ProductDetailStack',{
                            screenData:{...item,product_pk:item.target_pk}
                        });break;
                    case 'CATEGORY' : 
                        this.props.screenProps.navigation.navigate('ProductListStack',{
                            screenData:{...item,category_pk:item.target_pk,category_name:'ddddd'}
                        });break;
                    case 'EVENT' : 
                        this.props.screenProps.navigation.navigate('EventProductStack',{
                            screenTitle: item.title,
                            screenData:{...item,event_pk:item.target_pk,event_name:'ddddd'}
                        });break;
                }
            }
        }
        
    }

    renderPaginationxx = (index = 0, total, context) => {
        //console.log('context',this.state.banners[index])
        //let item = this.state.banners[index];
        //console.log('item',item)
        //let title = CommonUtil.isEmpty(item) ? null : '';
        return (
            <View style={styles.renderWrapStyle}>
                
                <View style={styles.paginationWrapStyle}>
                    <View style={styles.paginationStyle}>
                        <TextRobotoB style={styles.paginationText2}>
                            <TextRobotoB style={styles.paginationText}>{index + 1}</TextRobotoB>/{total}
                        </TextRobotoB>
                    </View>
                </View>
                
            </View>
        )
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
        if ( CommonUtil.isEmpty(item.mode) ) {
            return (
                <Image
                    style={ styles.imageUriWrap }
                    source={ {uri:DEFAULT_CONSTANTS.defaultImageDomain + item.img_url}}
                    resizeMode={"contain"}
                    //source={require('../../../assets/images/sample004.png')} 
                    //resizeMode='cover'
                />
            )
        }else{
            return (
                <ImageBackground
                    style={styles.imagewrap}
                    source={item.img_url}
                    resizeMode={'stretch'}
                />
            )
        }
        
    }
    
    
    render () {
        if ( this.state.loading ) {
            return (
                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} /> 
            )
         }else {
            return (
                <View style={{flex:1,backgroundColor:'#fff'}}>
                    <Swiper
                        style={[{margin:0,padding:0,backgroundColor:'transparent',height:SCREEN_WIDTH/4*3}]}
                        renderPagination={this.renderPagination}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        onTouchStart={()=>this._onTouchStart()}
                        onMomentumScrollEnd={()=>this._onTouchEnd()}
                        loop={this.state.isLoop}
                        autoplay={this.state.autoplay}            
                        //autoplayTimeout={5}
                    >
                        {
                        this.state.bannerList.length === 0 ?
                            defaultBanner.map((imageItem,index) => {
                            return (
                                <TouchableOpacity 
                                    key={index} 
                                    onPress= {()=> this.moveDetail()}
                                    style={{flex:1}}
                                >
                                    {this.renderImage(imageItem)}
                                    <View style={styles.renderWrapStyle}>
                                        <View style={styles.contentStyle}>
                                            <CustomTextB style={styles.menuText2} numberOfLines={1} ellipsizeMode={'tail'}>{imageItem.title}</CustomTextB>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                            })
                        :
                        this.state.bannerList.map((imageItem,index) => {
                            return (
                                <TouchableOpacity 
                                    key={index} 
                                    onPress= {()=> this.moveBannerDetail(imageItem)}
                                    style={{width : SCREEN_WIDTH,height : SCREEN_WIDTH/4*3,justifyContent:'center',alignItems:'center'}}
                                >
                                    {this.renderImage(imageItem)}
                                    <View style={styles.renderWrapStyle}>
                                        <LinearGradient
                                            colors={['transparent', '#333','#000']}
                                            style={[StyleSheet.absoluteFill]}
                                        />
                                        
                                        <View style={styles.contentStyle}>
                                            <CustomTextB style={styles.menuText} numberOfLines={1} ellipsizeMode={'tail'}>{imageItem.title}</CustomTextB>
                                            <CustomTextB style={styles.menuText} numberOfLines={1} ellipsizeMode={'tail'}>{CommonFunction.replaceAll(imageItem.content,"\n","")}</CustomTextB>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                )
                        })
                        }
                        
                    </Swiper>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    IndicatorContainer : {
        flex: 1,
        width:'100%',        
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    slide: {
        flex: 1,
        alignItems :'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        //padding:5
    },
    imageUriWrap : {
        width:'100%',aspectRatio:1
    },

    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold'
    },
    imagewrap: {
        width : SCREEN_WIDTH,
        height : SCREEN_WIDTH/4*3,
        flex:1,
        overflow:'hidden'
    },
    renderWrapStyle: {
        position: 'absolute',
        width:SCREEN_WIDTH,
        bottom:0,
        left: 0,
        paddingVertical:10,
        flexDirection:'row',
        opacity:0.5
    },
    paginationWrapStyle : {
       
        marginRight:10,
        alignItems:'center',
        justifyContent:'center',
    },
    paginationStyle: {
        position: 'absolute',
        bottom: 20,
        right: 15,
        backgroundColor:'#555',
        paddingHorizontal:10,
        paddingVertical:3,
        borderRadius:12
    },
    contentStyle: {
        flex:5,
        paddingHorizontal:20,
        paddingVertical:5,
        
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
})


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
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(SlideBanner);