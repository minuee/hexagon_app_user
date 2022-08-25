import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Alert,Dimensions,RefreshControl, PixelRatio,Image,TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import AsyncStorage from '@react-native-community/async-storage';
//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonStyle from '../../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoB,TextRobotoM,TextRobotoR} from '../../Components/CustomText';
import CustomAlert from '../../Components/CustomAlert';
import CommonFunction from '../../Utils/CommonFunction';

import CommonUtil from '../../Utils/CommonUtil';
import { apiObject } from "../Apis";
import Loader from '../../Utils/Loader';
import ToggleSwitch from '../../Components/ToggleSwitch';

class MyInfoScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : false,
            userData : {},
            switchOn1 : true
        }
    }

    UNSAFE_componentWillMount() {       
       if ( !CommonUtil.isEmpty(this.props.extraData.params.screenData)) {
            this.setState({
                userData : this.props.extraData.params.screenData,
                switchOn1 : this.props.extraData.params.screenData.is_push,
            })
        }        
        this.props.navigation.addListener('focus', (payload) => {
        })
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

    moveDetail = (nav,item) => {
        this.props.navigation.navigate(nav,{
            screenTitle:item
        })
    }

    logout = () => {
        Alert.alert(
            DEFAULT_CONSTANTS.appName,      
            "로그아웃하시겠습니까?",
            [
                {text: '네', onPress: () => this.logoutAction()},
                {text: '아니오', onPress: () => console.log('Cancle')},
                
            ],
            { cancelable: true }
        ) 
    }

    logoutAction = async() => {
        await AsyncStorage.removeItem('autoLoginData');
        this.props._saveNonUserToken({});
        this.props._saveUserToken({});
        setTimeout(() => {
            this.props.navigation.popToTop();
        }, 500);
       
    }
    _joinout = () => {
        Alert.alert(
            DEFAULT_CONSTANTS.appName,      
            "계정삭제후 쿠폰,포인트등의 정보를 이용하실수 없습니다\n계정을 삭제하시겠습니까?",
            [
                {text: '네', onPress: () => this.joinoutAction()},
                {text: '아니오', onPress: () => console.log('Cancle')},
                
            ],
            { cancelable: true }
        ) 
    }
    joinoutAction = async() => {
        this.setState({moreLoading:true})
        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/member/retire/'+this.state.member_pk;
            const token = this.props.userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_patchCommon(this.props,url,token,sendData);
            if ( returnCode.code === '0000'  ) {
                CommonFunction.fn_call_toast('정상적으로 삭제되었습니다. 로그인페이지로 이동합니다.',1000)
                setTimeout(() => {
                    this.logoutAction();
                }, 1000);
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.\n[ERR]' + returnCode.msg ,2000);
            }
            this.setState({moreLoading:false,loading:false})
        }catch(e){
            this.setState({loading:false,moreLoading : false})
        }
    }
    
    fn_onChangeToggle = async(bool) => {
        await this.setState({switchOn1 : bool})
        await this.updateData();
    }

    updateData = async() => {
        this.setState({moreLoading:true})
        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/member/modify/push/' + this.props.userToken.member_pk;
            const token = this.props.userToken.apiToken;
            let sendData = {
                is_push : this.state.switchOn1
            }            
            returnCode = await apiObject.API_patchCommon(this.props,url,token,sendData);             
            if ( returnCode.code === '0000'  ) {
                CommonFunction.fn_call_toast('정상적으로 수정되었습니다.' ,2000);
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.\n[ERR]' + returnCode.msg ,2000);
            }            
            this.setState({moreLoading:false,loading:false})
        }catch(e){            
            this.setState({loading:false,moreLoading : false})
        }        
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
                    <View style={styles.boxWrap}>
                        <CustomTextM style={styles.mainTitleText}>계정</CustomTextM>
                    </View>  
                    <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail('MyIDModifyStack','계정정보편집')}>
                        <View style={styles.boxLeftWrap}>
                            <CustomTextR style={styles.menuTitleText}>계정 정보 편집</CustomTextR>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail('MyPWModifyStack','비밀번호 변경')}>
                        <View style={styles.boxLeftWrap}>
                            <CustomTextR style={styles.menuTitleText}>비밀번호 변경</CustomTextR>                           
                        </View>
                    </TouchableOpacity>
                    <View style={styles.boxWrap}>
                        <CustomTextM style={styles.mainTitleText}>기타</CustomTextM>
                    </View> 
                    <View style={styles.boxSubWrap}>
                        <View style={styles.boxLeftWrap}>
                            <View style={{flex:5}}>
                                <CustomTextR style={styles.menuTitleText}>푸시 알림</CustomTextR>    
                                <CustomTextR style={styles.menuTitleSubText}>할인, 이벤트에 대한 정보 알림받기</CustomTextR>                       
                            </View>
                            <View style={{flex:1,justifyContent:'flex-start',alignItems:'flex-end'}}>
                                <ToggleSwitch
                                    type={0}
                                    containerStyle={styles.ballWarp}
                                    backgroundColorOn='#ccc'
                                    backgroundColorOff='#ccc'
                                    circleStyle={styles.ballStyle}
                                    switchOn={!this.state.switchOn1}
                                    onPress={()=> this.fn_onChangeToggle(!this.state.switchOn1)}
                                    circleColorOff={DEFAULT_COLOR.base_color}
                                    circleColorOn={'#f7f7f7'}
                                    duration={500}
                                />
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail('MyAlarmStack','입고알림')}>
                        <View style={styles.boxLeftWrap}>
                            <CustomTextR style={styles.menuTitleText}>입고알림 리스트</CustomTextR>                           
                        </View>
                    </TouchableOpacity>
                    <View style={styles.boxWrap}>
                        <CustomTextM style={styles.mainTitleText}>정책</CustomTextM>
                    </View> 
                    <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail('PrivateYakwanStack','개인정보처리방침')}>
                        <View style={styles.boxLeftWrap}>
                            <CustomTextR style={styles.menuTitleText}>개인정보처리방침</CustomTextR>                           
                        </View>
                        <View style={styles.boxRightWrap}>
                           
                        </View>
                    </TouchableOpacity>  
                    <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail('UseYakwanStack','이용약관')}>
                        <View style={styles.boxLeftWrap}>
                            <CustomTextR style={styles.menuTitleText}>이용약관</CustomTextR>                           
                        </View>
                        <View style={styles.boxRightWrap}>
                        </View>
                    </TouchableOpacity>                      
                    <TouchableOpacity onPress={()=>this._joinout()} style={styles.boxWrap}>
                        <CustomTextM style={styles.mainTitleText}>계정삭제</CustomTextM>
                    </TouchableOpacity>  
                    <View style={CommonStyle.blankArea}></View>
                    { this.state.moreLoading &&
                        <View style={CommonStyle.moreWrap}>
                            <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} />
                        </View>
                    }
                </ScrollView>                
            </SafeAreaView>
        );
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : "#fff"
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)
    },
    boxWrap : {
        flex:1,
        flexDirection:'row',    
        flexGrow:1,    
        paddingHorizontal:20,paddingVertical:15,
        backgroundColor:'#f5f6f8',
        borderBottomWidth:1,
        borderBottomColor : DEFAULT_COLOR.input_border_color
    },
    boxSubWrap : {
        flex:1,
        flexDirection:'row',    
        flexGrow:1,    
        paddingHorizontal:20,paddingVertical:15,
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
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),paddingRight:10
    },
    menuTitleSubText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingRight:10,color:'#666'
    },
    ballWarp : {
        marginTop: 0,width: 50,height: 15,borderRadius: 10,padding:5,borderWidth:0.5,borderColor:'#ebebeb',
        ...Platform.select({
            ios: {
                shadowColor: "#ccc",
                shadowOpacity: 0.5,
                shadowRadius: 2,
                shadowOffset: {
                    height: 0,
                    width: 0.1
                }
            },
            android: {
                elevation: 5
            }
        })
    },
    ballStyle : {
        width: 24,height: 24,borderRadius: 12,backgroundColor:'#fff'
    }
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
        _saveNonUserToken:(str)=> {
            dispatch(ActionCreator.saveNonUserToken(str))
        }
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(MyInfoScreen);