import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Alert,Dimensions,Linking, PixelRatio,Image,TouchableOpacity,ImageBackground,  ProgressBarAndroid, ProgressViewIOS} from 'react-native';
import * as Progress from 'react-native-progress';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import AsyncStorage from '@react-native-community/async-storage';
import {Overlay,Tooltip} from 'react-native-elements';
//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonStyle from '../../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoB,TextRobotoM,TextRobotoR, TextRobotoL} from '../../Components/CustomText';
import CustomAlert from '../../Components/CustomAlert';
import CommonFunction from '../../Utils/CommonFunction';
import CheckConnection from '../../Components/CheckConnection';
import Loader from '../../Utils/Loader';
import CommonUtil from '../../Utils/CommonUtil';
import { apiObject } from "../Apis";

const gradeSilverPrice = 3000000;
const gradeGoldPrice = 5000000;
const gradePlantinumPrice = 9000000;

const ICON_GRADE = require('../../../assets/icons/icon_grade.png');
const ICON_BONUS = require('../../../assets/icons/icon_bonus.png');
const ICON_COUPON = require('../../../assets/icons/icon_coupon.png');
const alertContents = 
(<View style={{flex:1,marginTop:10}}>
    <View style={{paddingTop:20}}>
        <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),color:'#494949'}}>
           {DEFAULT_CONSTANTS.CompanyInfoTel}
        </CustomTextR>        
    </View>                        
</View>);
//여기서부터는 채팅을 위함
import firestore from '@react-native-firebase/firestore';


class IntroScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            userData : {},
            nextGrade : '브론즈',
            nextGradePrice : gradeSilverPrice,            
            nextGradeRate : 0,
            nextGradeRemainPrice :  0,
            csPhone : DEFAULT_CONSTANTS.CompanyInfoTel,
            csEmail : DEFAULT_CONSTANTS.CompanyInfoEmail,
            //poplayer
            popLayerView : false,
            isCancelView : true,
            cancleText : '취소',
            okayText : '통화하기',
            alertTitle : '슈퍼바인더 고객센터',
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
        let tmpNumber = this.state.csPhone;
        if ( !CommonUtil.isEmpty(tmpNumber)) {
           
            let phoneNumber = '';
            if (Platform.OS === 'android') { phoneNumber = `tel:${tmpNumber}`; }
            else {phoneNumber = `telprompt:${tmpNumber}`; }
            Linking.openURL(phoneNumber);
        }
    }

    getBaseData = async(member_pk) => {

        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/member/view/'+member_pk;
            const token = this.props.userToken.apiToken;
            returnCode = await apiObject.API_getDetailDefault(this.props,url,token);          
            //console.log('returnCode',returnCode.data.userDetail)   
            if ( returnCode.code === '0000'  ) {
                const myGrade_amount = returnCode.data.userDetail.grade_amount;
                let nextGradePrice = gradeSilverPrice;
                let nextGradeRemainPrice = gradeSilverPrice;
                let nextGrade = '브론즈';
                let nextGradeRate = 0;
                if ( gradeSilverPrice > myGrade_amount ) {
                    //nextGradeRemainPrice = gradeSilverPrice - myGrade_amount;
                    nextGrade = '실버';
                    nextGradeRate = (myGrade_amount/gradeSilverPrice).toFixed(1);
                }else if ( gradeSilverPrice < myGrade_amount  && myGrade_amount < gradeGoldPrice) {
                    //nextGradeRemainPrice = gradeGoldPrice - myGrade_amount;
                    nextGradePrice = gradeGoldPrice;
                    nextGradeRate = (myGrade_amount/gradeGoldPrice).toFixed(1);
                    nextGrade = '골드'
                }else if ( gradeGoldPrice < myGrade_amount  && myGrade_amount < gradePlantinumPrice) {
                    nextGradePrice = gradePlantinumPrice;
                    nextGradeRate = (myGrade_amount/gradePlantinumPrice).toFixed(1);
                    //nextGradeRemainPrice = gradePlantinumPrice - myGrade_amount;
                    nextGrade = '플래티넘'
                }
                //console.log('nextGradeRate',parseFloat(nextGradeRate))   
                this.setState({
                    userData : CommonUtil.isEmpty(returnCode.data.userDetail) ? [] : returnCode.data.userDetail,
                    nextGrade : nextGrade,
                    nextGradePrice,
                    nextGradeRate : parseFloat(nextGradeRate),
                    nextGradeRemainPrice : myGrade_amount
                })
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.',1500);
                setTimeout(
                    () => {            
                       this.props.navigation.goBack(null);
                    },1500
                )
            }
            this.setState({moreLoading:false,loading:false})
        }catch(e){
            this.setState({loading:false,moreLoading : false})
        }
    }
    


    async UNSAFE_componentWillMount() {
        const APPBaseInfo = await AsyncStorage.getItem('APPBaseInfo');
        ///.log('APPBaseInfo.cs_phone',JSON.parse(APPBaseInfo)?.cs_phone)
        if (!CommonUtil.isEmpty(APPBaseInfo)  ) {
            this.setState({
                csPhone : CommonUtil.onlyDigits(JSON.parse(APPBaseInfo).cs_phone),
                csEmail : CommonUtil.onlyDigits(JSON.parse(APPBaseInfo).cs_email),
                alertBody : (<View style={{flex:1,marginTop:10}}>
                    <View style={{paddingTop:20}}>
                        <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),color:'#494949'}}>
                           {CommonUtil.phoneFormat(JSON.parse(APPBaseInfo).cs_phone)}
                        </CustomTextR>        
                    </View>                        
                </View>)
            })
        }
        if ( !CommonUtil.isEmpty(this.props.userToken)) {
            await this.getBaseData(this.props.userToken.member_pk);
        }
        this.props.navigation.addListener('focus', () => {    
            if ( !CommonUtil.isEmpty(this.props.userToken)) {    
                this.getBaseData(this.props.userToken.member_pk);
            }
        })
    }

    componentDidMount() {
        
    }


    moveDetail = (nav,item) => {
        this.props.navigation.navigate(nav,{
            screenTitle:item,
            screenData : this.state.userData
        })
    }


    requestToManager = async() => {

        const firebaseName = this.props.userToken.name;
        const firebaseMail = this.props.userToken.user_id + '@superbinder.com';
        const firebaseID = this.props.userToken.user_id;

        if ( !CommonUtil.isEmpty(firebaseID) && !CommonUtil.isEmpty(firebaseName) ) {
            
            let checkId = null;
            await firestore().collection('THREADS').where('userId','==', firebaseID).get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    if ( !CommonUtil.isEmpty(doc.id)) {
                        checkId =  doc.id;
                    }
                });
            })
            .catch(function(error) {
                CommonFunction.fn_call_toast('접속중 오류가 발생하였습니다. 잠시뒤 다시 이용해주세요',2000);

            });

            if ( !CommonUtil.isEmpty(checkId)) {
                
                this.props.navigation.navigate('ChatStack', {
                    uname : firebaseName,
                    uid : firebaseID,
                    email : firebaseMail,
                    thread : {_id : checkId}
                })
                
            }else{
                if ( checkId !== undefined ) {
                    firestore().collection('THREADS')
                    .add({
                        name: firebaseName,
                        userId : firebaseID,
                        latestMessage: {
                            text: `${firebaseName}님과의 방이 개설되었습니다.`,
                            createdAt: new Date().getTime()
                        }
                    })
                    .then(docRef => {
                        docRef.collection('MESSAGES').add({
                            text: `${firebaseName}님과의 방이 개설되었습니다.`,
                            createdAt: new Date().getTime(),
                            system: true
                        });

                        this.props.navigation.navigate('ChatStack', {
                            uname : firebaseName,
                            uid : firebaseID,
                            email : firebaseMail,
                            thread : {_id : docRef.id}
                        })
                    });
                }
            }
        }else{
            CommonFunction.fn_call_toast('필수정보[사업자번호,이름]이 없습니다.',2000);
        }

        

        
    }

    renderGradeImage = ( grade ) => {
        switch(grade) {
            case 'Bronze' :
                return (
                    <ImageBackground
                        source={require('../../../assets/icons/grade_bronze.png')}
                        resizeMode={"contain"}
                        style={{width:70,height:70}}
                    />
                );break;
            case 'Silver' :
                return (
                    <ImageBackground
                        source={require('../../../assets/icons/grade_silver.png')}
                        resizeMode={"contain"}
                        style={{width:70,height:70}}
                    />
                );break;
                case 'Gold' :
            return (
                <ImageBackground
                    source={require('../../../assets/icons/grade_gold.png')}
                    resizeMode={"contain"}
                    style={{width:70,height:70}}
                />
            );break;
            case 'Platinum' :
            return (
                <ImageBackground
                    source={require('../../../assets/icons/grade_platinum.png')}
                    resizeMode={"contain"}
                    style={{width:70,height:70}}
                />
            );break;
            default :
            return (
                <ImageBackground
                    source={require('../../../assets/icons/grade_bronze.png')}
                    resizeMode={"contain"}
                    style={{width:70,height:70}}
                />
            );break;
        }
    } 


    sendPush = async() => {
        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/test/pushsend';
            const token = this.props.userToken.apiToken;
            let sendData = {
                TargetToken : "c2j3yU7lXSM:APA91bHXNbWdUREIDga4rWm3LhKDOUoABIschRvI4TsS0tBwRKVdjbGDgpO-iRUmg5AKsHKU_-aTzJYxGasV3yZ4hPtoFtpqNVUBVla3CnYGLg-fKROK6H1goarBpo6NivezG-_J5Phk",
                title : "푸쉬 제목1",
                comment : "푸쉬 내용",
                routeName : "NoticeDetailStack",
                routeIdx : 1,
            } 
            returnCode = await apiObject.API_registCommon(this.props,url,token,sendData);
            
        }catch(e){
            console.log('e',e) 
        }
    
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
        this.props._saveNonUserToken(null);
        this.props._saveUserToken({});
        setTimeout(() => {
            this.props.navigation.popToTop();
        }, 500);
       
    }



    
    moveCouponDetail = () => {
        this.props.navigation.navigate('CouponListStack')
    }
    renderTooltip = () => {
        return (
            <View style={{width:'100%',padding:5,backgroundColor:'#ccc'}}>
                <CustomTextB style={CommonStyle.dataText}>등급({this.state.nextGrade})까지의 남은금액 </CustomTextB>
                <CustomTextR style={CommonStyle.dataText}>{CommonFunction.currencyFormat(this.state.nextGradeRemainPrice)}만원</CustomTextR>
            </View>
        )
    }

    render() {
        if ( CommonUtil.isEmpty(this.props.userToken) ) {
            return(
                <SafeAreaView style={ styles.container }>
                    <View style={styles.nonUserWrap}>
                        <CustomTextR style={styles.menuTitleSubText}>로그인후 이용하실수 있습니다.</CustomTextR>   
                        <TouchableOpacity 
                            hitSlop={{left:10,right:10,bottom:10,top:10}}
                            style={styles.modalTail}
                            onPress={()=>this.logoutAction()}
                        > 
                            <View style={styles.moveButton}>
                                <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#fff'}}>로그인</CustomTextR>
                            </View>
                        </TouchableOpacity> 
                    </View>
                </SafeAreaView>
            )
        }else{
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
                    >
                        <View style={styles.boxSubWrap2}>
                            <View style={styles.boxLeftWrap}>
                                <View style={styles.topMyGradeLeft}>
                                    <TouchableOpacity 
                                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                        style={{width:80,height:80,justifyContent:'center',alignItems:'center'}}    
                                    >
                                        <Tooltip popover={this.renderTooltip()} width={SCREEN_WIDTH*0.6} height={80} backgroundColor="#ccc" skipAndroidStatusBar={true}>
                                            {this.renderGradeImage(this.state.userData.grade_code)}
                                        </Tooltip>
                                    </TouchableOpacity>                      
                                </View>
                                <View style={styles.topMyGradeCenter}>
                                    <CustomTextR style={styles.menuTitleText}>{this.state.userData.name}</CustomTextR>
                                    <CustomTextR style={styles.menuTitleText}>
                                        {CommonUtil.isEmpty(this.state.userData.rate) ? '0.5' : this.state.userData.rate*100}% 적립
                                    </CustomTextR>
                                </View>     
                                <TouchableOpacity style={styles.topMyGradeLeft}  onPress={()=>this.logout()}>
                                    <View style={{width:80,height:80,justifyContent:'center',alignItems:'flex-end'}}>
                                        <View style={{borderWidth:0.5,borderColor:'#ccc',paddingHorizontal:5,paddingVertical:2}}>
                                            <CustomTextR style={styles.exitText}>Logout</CustomTextR>
                                        </View>
                                        {/*
                                        <Image
                                            source={require('../../../assets/icons/logout.png')}
                                            resizeMode={"contain"}
                                            style={{width:CommonUtil.dpToSize(25),height:CommonUtil.dpToSize(25)}}
                                        />
                                        */}
                                    </View>                      
                                </TouchableOpacity>                      
                            </View>
                        </View>
                        <View style={styles.boxSubWrap2}>
                            <CustomTextR style={styles.menuTitleSubText}>다음 {this.state.nextGrade}까지의 목표(단위:만원)</CustomTextR>
                        </View>
                        <View style={styles.boxSubWrap2}>
                            <View style={{flex:1}}>
                                <TextRobotoL style={styles.menuTitleSubText3}>{CommonFunction.currencyFormat(this.state.nextGradeRemainPrice)}</TextRobotoL>
                            </View>
                            <View style={{flex:1,alignItems:'flex-end'}}>
                                <TextRobotoL style={styles.menuTitleSubText3}>{CommonFunction.currencyFormat(this.state.nextGradePrice)}</TextRobotoL>
                            </View>
                        </View>
                        <View style={styles.boxSubWrap}>
                            <Progress.Bar
                                width={SCREEN_WIDTH-40}
                                //height={10}
                                //borderRadius={5}
                                indeterminate={false}
                                color={DEFAULT_COLOR.base_color}
                                unfilledColor={'#ebebeb'}
                                borderColor={'#ccc'}
                                progress={this.state.nextGradeRate} 
                            />
                        </View>        
                        <View style={styles.boxSubWrap2}>
                            <TouchableOpacity style={styles.menuWrap} onPress={()=>this.moveDetail('MyGradeStack','등급관리')}>
                                <Image
                                    source={ICON_GRADE}
                                    resizeMode={"contain"}
                                    style={{width:CommonUtil.dpToSize(30),height:CommonUtil.dpToSize(30)}}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuWrap} onPress={()=>this.moveDetail('MyPointListStack','적립금')}>
                                <TextRobotoL style={styles.menuTitleSubText}>
                                    {CommonFunction.currencyFormat(this.state.userData.remain_reward)}원
                                </TextRobotoL>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuWrap} onPress={()=>this.moveCouponDetail()}>
                                <Image
                                    source={ICON_COUPON}
                                    resizeMode={"contain"}
                                    style={{width:CommonUtil.dpToSize(30),height:CommonUtil.dpToSize(30)}}
                                />
                            </TouchableOpacity>
                        </View> 
                        <View style={[styles.boxSubWrap,{paddingTop:2,paddingBottom:15}]}>
                            <TouchableOpacity style={styles.menuWrap} onPress={()=>this.moveDetail('MyGradeStack','등급관리')}>
                                <CustomTextR style={styles.menuTitleSubText2}>등급</CustomTextR>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuWrap} onPress={()=>this.moveDetail('MyPointListStack','적립금')}>
                                <CustomTextR style={styles.menuTitleSubText2}>적립금</CustomTextR>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuWrap} onPress={()=>this.moveCouponDetail()}>
                                <CustomTextR style={styles.menuTitleSubText2}>나의 쿠폰</CustomTextR>
                            </TouchableOpacity>
                        </View>                
                        <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail('MyOrderListStack','주문내역')}>
                            <View style={styles.boxLeftWrap}>                                
                                <View style={{flex:1}}>
                                    <CustomTextR style={styles.menuTitleText}>주문내역</CustomTextR>                         
                                </View>
                                {
                                <View style={styles.orderingWrap}>
                                    <View style={this.props.userOrderingCount > 9 ? styles.orderingDataWrap2 : styles.orderingDataWrap}>
                                        <CustomTextR style={styles.menuTitleSubText2}>{this.props.userOrderingCount}</CustomTextR>
                                    </View>
                                </View>
                                }
                            </View>
                        </TouchableOpacity>
                       
                        {/*
                        <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.sendPush()}>
                            <View style={styles.boxLeftWrap}>
                                <CustomTextR style={styles.menuTitleText}>sendPush</CustomTextR>
                            </View>
                        </TouchableOpacity>
                        */}
                        {/*
                        <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail('MyPointListStack','적립금')}>
                            <View style={styles.boxLeftWrap}>
                                <View style={{flex:1}}>
                                    <CustomTextR style={styles.menuTitleText}>적립금</CustomTextR>                         
                                </View>
                                <View style={{flex:2,justifyContent:'center',alignItems:'flex-end'}}>
                                    <TextRobotoB style={[styles.menuTitleText,{color:DEFAULT_COLOR.base_color}]}>{CommonFunction.currencyFormat(this.state.userData.remain_reward)}원</TextRobotoB>
                                </View>
                                <View style={{flex:0.2,justifyContent:'center',alignItems:'flex-end'}}>
                                    <Image
                                        source={require('../../../assets/icons/btn_next.png')}
                                        resizeMode={"contain"}
                                        style={{width:PixelRatio.roundToNearestPixel(20),height:PixelRatio.roundToNearestPixel(20)}}
                                    /> 
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail('MyGradeStack','등급관리')}>
                            <View style={styles.boxLeftWrap}>
                                <View style={{flex:1}}>
                                    <CustomTextR style={styles.menuTitleText}>등급</CustomTextR>                         
                                </View>
                                <View style={{flex:2,justifyContent:'center',alignItems:'flex-end'}}>
                                    <TextRobotoB style={[styles.menuTitleText,{color:DEFAULT_COLOR.base_color}]}>
                                    {CommonUtil.isEmpty(this.state.userData.grade_name) ? 'Bronze' : this.state.userData.grade_name}
                                    </TextRobotoB>
                                </View>
                                <View style={{flex:0.2,justifyContent:'center',alignItems:'flex-end'}}>
                                    <Image
                                        source={require('../../../assets/icons/btn_next.png')}
                                        resizeMode={"contain"}
                                        style={{width:PixelRatio.roundToNearestPixel(20),height:PixelRatio.roundToNearestPixel(20)}}
                                    /> 
                                </View>
                            </View>
                        </TouchableOpacity>
                        */}
                        <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail('MyInfoStack','계정설정')}>
                            <View style={styles.boxLeftWrap}>
                                <CustomTextR style={styles.menuTitleText}>계정설정</CustomTextR>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail('NoticeListStack','공지사항')}>
                            <View style={styles.boxLeftWrap}>
                                <CustomTextR style={styles.menuTitleText}>공지사항</CustomTextR>
                            </View>
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail('FaqListStack','FAQ')}>
                            <View style={styles.boxLeftWrap}>
                                <CustomTextR style={styles.menuTitleText}>FAQ</CustomTextR>
                            </View>
                        </TouchableOpacity> */}
                        <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.showPopLayer()}>
                            <View style={styles.boxLeftWrap}>
                                <CustomTextR style={styles.menuTitleText}>고객센터</CustomTextR>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.logout()}>
                            <View style={styles.boxLeftWrap}>
                                <CustomTextR style={styles.menuTitleText}>로그아웃</CustomTextR>
                            </View>
                        </TouchableOpacity>
                        { this.props.userToken.user_id === '1234567891' || this.props.userToken.user_id === '1234567890' ?
                        <TouchableOpacity 
                            style={styles.boxSubWrap} 
                            onPress={()=>this.requestToManager()}
                        >
                            <View style={styles.boxLeftWrap}>
                                <CustomTextR style={styles.menuTitleText}>1:1 문의방</CustomTextR>
                            </View>
                        </TouchableOpacity>
                        :
                        null
                        }
                    </ScrollView>                
                </SafeAreaView>
            );
            }
        }
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
    nonUserWrap : {
        flex:1,
        alignItems:'center',
        justifyContent:'flex-start',
        paddingTop:50,
    },
    modalTail : {
        flex:1,
        alignItems:'center',
        justifyContent:'flex-start',
        paddingTop:20,
        
    },
    topMyGradeLeft : {
        flex:1,justifyContent:'center',alignItems:'flex-start'
    },
    topMyGradeCenter : {
        flex:2,justifyContent:'center',alignItems:'flex-start',paddingLeft:10
    },
    moveButton  : {
        paddingVertical:5,
        width : SCREEN_WIDTH*0.5,
        backgroundColor:DEFAULT_COLOR.base_color,
        justifyContent:'center',
        alignItems:'center'
    },
    mainTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)
    },
    menuWrap : {
        flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'
    },
    termLineWrap : {
        flex:1,
        paddingVertical:5,
        backgroundColor:'#f5f6f8'
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
    boxSubWrap2 : {
        flex:1,
        flexDirection:'row',    
        flexGrow:1,    
        paddingHorizontal:20,marginTop:15,
        alignItems: 'center'
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
    exitText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),color:'#555'
    },
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),paddingRight:10
    },
    menuTitleText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#fff'
    },
    menuTitleSubText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingRight:10,color:'#666'
    },
    menuTitleSubText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),color:'#555'
    },
    menuTitleSubText3 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),paddingRight:10,color:'#666'
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
        width: 24,height: 24,borderRadius: 12,backgroundColor:'#fff',
        
    },
    orderingWrap : {
        flex:2,justifyContent:'center',alignItems:'flex-end'
    },
    orderingDataWrap : {
        width:20,height:20,borderRadius:10,backgroundColor:'#ccc',justifyContent:'center',alignItems:'center'
    },
    orderingDataWrap2 : {
        width:28,height:20,borderRadius:10,backgroundColor:'#ccc',justifyContent:'center',alignItems:'center'
    }
});

function mapStateToProps(state) {
    return {
        userToken : state.GlabalStatus.userToken,
        userOrderingCount : state.GlabalStatus.userOrderingCount,
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


export default connect(mapStateToProps,mapDispatchToProps)(IntroScreen);