import React from 'react';
import {Text,View,StyleSheet,BackHandler,ToastAndroid,Platform,Alert,StatusBar,Image,SafeAreaView,Dimensions,ScrollView,PixelRatio,PermissionsAndroid,NativeModules} from 'react-native';
import 'react-native-gesture-handler';
import RNExitApp from 'react-native-exit-app';
import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation';
import AsyncStorage from '@react-native-community/async-storage';
import 'moment/locale/ko'
import  moment  from  "moment";
import CryptoJS from "react-native-crypto-js";
import messaging from '@react-native-firebase/messaging';
import { Provider } from 'react-redux';
import initStore from './src/Ducks/mainStore';
const store = initStore();
import { apiObject } from "./src/Screens/Apis";

import AppHomeStack from './src/Route/Navigation';
import jwt_decode from "jwt-decode";

//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from './src/Constants';
const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from './src/Utils/CommonUtil';
import CommonFunction from './src/Utils/CommonFunction';
import Loader from './src/Utils/Loader';
import IntroduceApp from './src/Components/IntroduceApp';
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR} from './src/Components/CustomText';

const TodayTimeStamp = moment()+840 * 60 * 1000;  // 서울
const Tomorrow = moment(Tomorrow).add(1, 'day').format('YYYY-MM-DD');
const ExpireDate = Date.parse(new Date(Tomorrow + 'T04:00:00'));

import codePush from 'react-native-code-push';
import CodePushComponent from './CodePushComponent';
const codePushOptions = {
    checkFrequency: codePush.CheckFrequency.ON_APP_START,
    installMode: codePush.InstallMode.IMMEDIATE,
}
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

class App extends React.PureComponent {

    constructor(props) {
        super(props);
            this.state = {   
                loading : true,
                isInstalledMTAP : false,
                popLayerView : false,
                isConnected : true, 
                exitApp : false,
                orientation : '',
                fcmToken : null,
                thisUUID : null,
                deviceModel : null,
                showRealApp: true,
                pushRouteName : null,
                loginInfo : null,
                pushRouteIdx :0
        };
    }  

    // 앱설치후 최초에만 나오도록
    checkStorageFirstOpen = async () => {
        try {
            const tisFirstOpen = await AsyncStorage.getItem('isFirstOpen')
            if(tisFirstOpen !== null) {  
                this.setState({showRealApp: true});
            }else{
                this.setState({showRealApp: false});  
            }
        } catch(e) {                        
            this.setState({showRealApp: false});
        }
    }

    getCodeData = async() => {
        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/commoncode';
           // console.log('url',url) 
            const token = null;
            returnCode = await apiObject.API_getCommonCode(url,token);          
            //console.log('returnCode',returnCode.data.codebank)   
            if ( returnCode.code === '0000'  ) {
                await  AsyncStorage.setItem('BankCode',JSON.stringify(returnCode.data.codebank) );   
                await  AsyncStorage.setItem('CommonCode',JSON.stringify(returnCode.data.common) );  
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.',2000);
            }
            this.setState({moreLoading:false,loading:false})
        }catch(e){
            this.setState({loading:false,moreLoading : false})
        }
    }

    setLoginToken = async(token,pw) => {
        let jwtObject = await jwt_decode(token);
        const loginInfo = {
            user_id : jwtObject.user_id,
            user_pw : pw,
            member_pk : jwtObject.member_pk,
            name : jwtObject.name,
            email : jwtObject.email,
            phone : jwtObject.phone,
            is_salesman : jwtObject.is_salesman,
            gradeRate : jwtObject.grade_rate,
            gradeCode : jwtObject.grade_code,
            gradeName : jwtObject.grade_name,
            apiToken : token,
            uuid : this.state.thisUUID
        }
        this.setState({loginInfo : loginInfo})
        await AsyncStorage.setItem('autoLoginData',JSON.stringify(loginInfo));   
               
    }

    loginAction = async(token) => {
        let returnCode = {code:9998};     
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/auth/signin';
            let sendData = {
                user_id : token.user_id,
                password : token.user_pw
            }
            returnCode = await apiObject.API_authLogin(url,sendData);   
            //console.log('loginActio222n',returnCode)       
            if ( returnCode.code === '0000'  ) {
                this.setLoginToken(returnCode.token,token.user_pw);
            }
        }catch(e){
           
        }
    }
    
    async UNSAFE_componentWillMount() {
        
        let makeUUID =  DeviceInfo.getMacAddressSync() + DeviceInfo.getUniqueId();        
        let deviceModel = DeviceInfo.getModel();
        let uuid =  DEFAULT_CONSTANTS.appID + CryptoJS.MD5(makeUUID).toString();
        const autoLoginData = await AsyncStorage.getItem('autoLoginData');
        //console.log('autoLoginData',autoLoginData)
        if(!CommonUtil.isEmpty(autoLoginData) ) {
            await this.loginAction(JSON.parse(autoLoginData))
        }  
        await this.setState({
            popLayerView : false,
            thisUUID:uuid,        
            deviceModel:deviceModel
        })
        await this.checkStorageFirstOpen();
        await this.requestUserPermissionForFCM();
        this.messageListener();
        
        this.getCodeData();
        BackHandler.addEventListener('hardwareBackPress', this.rootHandleBackButton);   
        const initial = Orientation.getInitialOrientation();
        Orientation.lockToPortrait();
        //if ( Platform.OS === 'android' ) {
            //await this.fcmCheckPermission();
            //await this.messageListener();  
        //}
        
    }

    componentDidMount() {
        Dimensions.addEventListener( 'change', () =>    {        
            this.getOrientation();
        });
        //codePush.sync(codePushOptions);
        //codePush.notifyAppReady();        
    }
    
    UNSAFE_componentWillUnmount() {
        Orientation.getOrientation((err, orientation) => {});
        Orientation.removeOrientationListener(this._orientationDidChange);
    }

    
    messageListener = async () => {    
        
        //백그라운드에서 푸시를 받으면 호출됨 
        messaging().setBackgroundMessageHandler(async remoteMessage => {
            //console.log('Message handled in the background!2', remoteMessage);
          
            const { title, body } = remoteMessage.notification;
            const { routeIdx, routeName } = remoteMessage.data;
            this.setState({
                fcmTitle :  title,
                fcmbody : body,
                pushRouteName : routeName,
                pushRouteIdx :routeIdx
            })
        });
    }

    requestUserPermissionForFCM = async () => {
        const authStatus = await messaging().requestPermission();
        const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) {
            const fcmToken = await messaging().getToken();
            //console.log('fcm token:', fcmToken,Platform.OS);
            //console.log('Authorization status:', authStatus, Platform.OS);   
            if ( !CommonUtil.isEmpty(fcmToken) ) {
                this.setFcmTokenToDataBase(fcmToken,Platform.OS,this.state.thisUUID)
            }
            this.setState({
                fcmToken : fcmToken
            })
            this.handleFcmMessage();
        } else {
            console.log('fcm auth fail');
        }
    }

    handleFcmMessage = () => {
        //알림창을 클릭한 경우 호출됨 
        messaging().getInitialNotification()
        .then(remoteMessage => {
            if (remoteMessage) {
                const { title, body } = remoteMessage.notification;
                const { routeIdx, routeName } = remoteMessage.data;
                this.setState({
                    fcmTitle :  title,
                    fcmbody : body,
                    pushRouteName : routeName,
                    pushRouteIdx :routeIdx
                })
            }
        });
        
        //푸시를 받으면 호출됨 
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            //Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
            //console.log('remoteMessage:',remoteMessage);
            const { title, body } = remoteMessage.notification;
            const { routeIdx, routeName } = remoteMessage.data;
            this.setState({
                fcmTitle :  title,
                fcmbody : body,
                pushRouteName : routeName,
                pushRouteIdx :routeIdx
            })
        });
      
        return unsubscribe;
    }
    
 
    getOrientation = () => {        
        if( this.rootView ){            
            if( Dimensions.get('window').width < Dimensions.get('window').height ){                
                this.setState({ orientation: 'portrait' });
            }else{                
                this.setState({ orientation: 'landscape' });
            }
        }
    }

    rootHandleBackButton = () => {      
        if ( this.state.exitApp ) {
            clearTimeout(this.timeout);
            this.setState({ exitApp: false });
            RNExitApp.exitApp();  // 앱 종료
        } else {
            ToastAndroid.show('한번 더 누르시면 종료됩니다.', ToastAndroid.SHORT);
            this.setState({ exitApp: true});
            this.timeout = setTimeout(
                () => {
                    this.setState({ exitApp: false});
                },
                2000    // 2초
            );                        
        }
        return true;
    }; 

    /* 여기부터 fcm 설정 */
    fcmCheckPermission = async () => {
        const enabled = await firebase.messaging().hasPermission();
        console.log('fcmCheckPermission enabled : ', enabled);
        if (enabled) {
            this.getFcmToken();
        } else {
            this.requestPermission();
        }
    }

    getFcmToken = async () => {
        const fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {          
            console.log('fcm Token', Platform.OS, fcmToken);
            console.log('this.state.thisUUID', this.state.thisUUID);
            const wasUUID = await AsyncStorage.getItem('UUID');
            //console.log('wasUUID: ',wasUUID);
            if(CommonUtil.isEmpty(wasUUID) ) {                
                await  AsyncStorage.setItem('UUID',this.state.thisUUID);    
            }
            if ( !CommonUtil.isEmpty(fcmToken) ) {
                this.setFcmTokenToDataBase(fcmToken,Platform.OS,this.state.thisUUID)
            }
            this.setState({
                fcmToken : fcmToken
            })
        } else {
            //this.showAlert('Failed', 'No token received');
        }
    }

    setFcmTokenToDataBase = async(fcmToken,ostype,uuid) => {
        
    }

    requestPermission = async () => {
        try {
            await firebase.messaging().requestPermission();
            // User has authorised
        } catch (error) {
            // User has rejected permissions
            //console.log('requestPermission error : ', error);
        }
    }

    

    showAlert = async(title, message,idx) => {
        Alert.alert(
            title,
            message,
            [
                {text: '닫기', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: false},
        );
    }

    _onDone = async() => {
        await AsyncStorage.setItem('isFirstOpen', ExpireDate.toString());
        this.setState({ showRealApp: true });
    };
    _onSkip = async() => {
        await AsyncStorage.setItem('isFirstOpen', ExpireDate.toString());
        this.setState({ showRealApp: true });
    };

    render() {
        if ( this.state.loading ) {
            return (
                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} />
            )
        }else {
            if (this.state.showRealApp) {      
                return (
                <Provider store={store} >                
                    { Platform.OS == 'android' && <StatusBar backgroundColor={'#fff'} translucent={false}  barStyle="dark-content" />}
                    <CodePushComponent />
                    <AppHomeStack screenState={this.state} screenProps={this.props} />
                </Provider>
                );
            }else {
                return (
                    <Provider store={store} > 
                        <View style={{ flex: 1 }}>
                            { Platform.OS == 'android' && <StatusBar backgroundColor={'#fff'} translucent={false}  barStyle="dark-content" />}                        
                            <IntroduceApp screenState={
                                {_onDone:this._onDone.bind(this),thisUUID:this.state.thisUUID}
                            }
                            />
                        </View>
                    </Provider>
                );       

            }
        }
    }
}


const styles = StyleSheet.create({
    Rootcontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor : "#fff",
    },
    introImageWrapper : {
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default codePush(codePushOptions)(App)