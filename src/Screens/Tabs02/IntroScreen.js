import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Alert,Dimensions,RefreshControl, PixelRatio,TouchableOpacity, Platform,Animated,BackHandler} from 'react-native';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import Modal from 'react-native-modal';
import Image from 'react-native-image-progress';
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
import CheckConnection from '../../Components/CheckConnection';
import Loader from '../../Utils/Loader';
import { apiObject } from "../Apis";

class IntroScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            remove_unUse : false,
            remove_unUse2 : false,
            togglecategory : this.props.togglecategory,
            categoryBrandList : [],
            categoryNormalList : [],
        }
    }

    getBaseData = async() => {
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/category/list?is_use=true';
            const token = this.props.userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_getPageList(this.props,url,token,sendData);
            if ( returnCode.code === '0000'  ) {
                this.setState({
                    categoryBrandList : CommonUtil.isEmpty(returnCode.data.categoryBrandList) ? [] : returnCode.data.categoryBrandList,
                })
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.',2000);
            }
            this.setState({moreLoading:false,loading:false})
        }catch(e){        
            this.setState({loading:false,moreLoading : false})
        }
    }
    
    async UNSAFE_componentWillMount() {
        await this.getBaseData();
        this.props.navigation.addListener('focus', () => {  
            this.getBaseData();
            BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        })
        this.props.navigation.addListener('blur', () => {            
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        })
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);          
    }

    handleBackButton = () => {        
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);  
        this.props.navigation.goBack(null);                
        return true;
    };


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
    moveDetail = async(item) => {       
        this.props.navigation.navigate('ProductListStack',{
            screenData:item
        })
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
                    {
                        this.state.categoryBrandList.length === 0 ? 
                        <View style={styles.emptyWrap} >
                            <CustomTextR style={CommonStyle.dataText}>등록된 카테고리가 없습니다.</CustomTextR>
                        </View>
                        :
                        this.state.categoryBrandList.map((item, index) => {  
                            return (
                                <View key={index} style={{backgroundColor:'#fff'}}>
                                    <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail(item)}>
                                        <View style={styles.boxLeftWrap}>
                                            { 
                                                !CommonUtil.isEmpty(item.category_logo) ?
                                                <Image
                                                    source={{uri:DEFAULT_CONSTANTS.defaultImageDomain + item.category_logo}}
                                                    resizeMode={"contain"}
                                                    style={CommonStyle.defaultIconImage}
                                                />
                                                :
                                                <Image
                                                    source={require('../../../assets/icons/no_image.png')}
                                                    resizeMode={"contain"}
                                                    style={CommonStyle.defaultIconImage}
                                                />
                                            }
                                            <CustomTextR style={[styles.menuTitleText,{paddingLeft:20}]}>
                                                {item.category_name}{"  "}({CommonFunction.currencyFormat(item.product_count)})
                                            </CustomTextR>
                                            {
                                                item.category_yn === false &&
                                                <CustomTextR style={[styles.menuRemoveText,{paddingLeft:10}]}>(사용중지)</CustomTextR>
                                            }
                                        </View>
                                        <View style={styles.boxRightWrap}>
                                            <Image
                                                source={require('../../../assets/icons/btn_next.png')}
                                                resizeMode={"contain"}
                                                style={CommonStyle.defaultIconImage}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )
                        })
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
    fixedUpButton : {
        position:'absolute',bottom:80,right:20,width:50,height:50,backgroundColor:DEFAULT_COLOR.base_color,borderColor:'#ccc',borderWidth:1,borderRadius:25,alignItems:'center',justifyContent:'center',zIndex:10
    },
    emptyWrap : {
        flex:1,justifyContent:'center',alignItems:'center',paddingVertical:20,backgroundColor:'#fff',
    },
    boxWrap : {
        flex:1,
        flexDirection:'row',    
        flexGrow:1,    
        paddingHorizontal:20,
        paddingVertical:10,
        backgroundColor:'#f5f6f8',
        borderBottomWidth:1,
        borderBottomColor : DEFAULT_COLOR.input_border_color
    },
    boxSubWrap : {
        flex:1,
        flexDirection:'row',    
        flexGrow:1,    
        paddingHorizontal:20,paddingVertical: Platform.OS === 'android' ? 5 : 15,
        alignItems: 'center',        
        borderBottomWidth:1,
        borderBottomColor : DEFAULT_COLOR.input_border_color
    },
    boxLeftWrap : {
        flex:5,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center'
    },
    boxRightWrap : {
        flex:1,        
        justifyContent:'center',
        alignItems:'flex-end'
    },
    boxLeftWrap2 : {
        flex:1,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center'
    },
    boxRightWrap2 : {
        flex:2,        
        flexDirection:'row',
        justifyContent:'flex-end',
        alignItems:'center'
    },
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),paddingRight:10
    },
    menuRemoveText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#777'
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
        togglecategory : state.GlabalStatus.togglecategory,
        selectCategoryName :  state.GlabalStatus.selectCategoryName
    };
}

function mapDispatchToProps(dispatch) {
    return {     
        _saveUserToken:(str)=> {
            dispatch(ActionCreator.saveUserToken(str))
        },
        _saveNonUserToken:(str)=> {
            dispatch(ActionCreator.saveNonUserToken(str))
        },           
        _fn_ToggleCategory:(bool)=> {
            dispatch(ActionCreator.fn_ToggleCategory(bool))
        },
        _fn_selectCategoryName:(str)=> {
            dispatch(ActionCreator.fn_selectCategoryName(str))
        }
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(IntroScreen);