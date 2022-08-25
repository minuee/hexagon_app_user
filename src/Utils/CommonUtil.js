import {Dimensions, Platform, PixelRatio, Linking, Alert} from 'react-native';
import jwt_decode from "jwt-decode";
import Toast from 'react-native-tiny-toast';
import AppLink from '../Utils/AppLink';
import SendIntentAndroid from 'react-native-send-intent';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';

//공통상수
import COMMON_STATES from '../Constants/Common';
import * as getDEFAULT_CONSTANTS from '../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const scale = SCREEN_WIDTH / 320;
const guidelineBaseWidth = 360;

// 하단 how to use 참고
class Util {
  
    // '', null, undefinded, 빈객체{} 체크
    isEmpty = str => {
        return str === null || str === undefined || str === '' || (typeof str === 'object' && Array.isArray(str) === false && Object.keys(str).length === 0);
    };


    scale = size => {
        return PixelRatio.roundToNearestPixel((dimensions / guidelineBaseWidth) * size);
      };
    
    dpToSize = size => {
        //console.log ('PixelRatio.get : ', PixelRatio.get ());
        //console.log ('PixelRatio.getFontScale : ', PixelRatio.getFontScale ());
        //console.log ('PixelRatio.getPixelSizeForLayoutSize 37 x 27.3 : ' + PixelRatio.getPixelSizeForLayoutSize (37) + ' x ' + PixelRatio.getPixelSizeForLayoutSize (21.3));
        //console.log ('PixelRatio.roundToNearestPixel : ', PixelRatio.roundToNearestPixel (21.3));
        //console.log ('PixelRatio.getPixelSizeForLayoutSize fontSize 23 : ' + PixelRatio.getPixelSizeForLayoutSize (23));
        //console.log ('PixelRatio.roundToNearestPixel fontSize 23 : ', PixelRatio.roundToNearestPixel (23));
        const newSize = size * scale;
        if (Platform.OS === 'ios') {
            return Math.round (PixelRatio.roundToNearestPixel (newSize));
        } else {
            return Math.round (PixelRatio.roundToNearestPixel (newSize)) - 2;
        }
    };
  
    normalize = size => {
        //console.log ('PixelRatio.get : ', PixelRatio.get ());
        //console.log ('PixelRatio.getFontScale : ', PixelRatio.getFontScale ());
        //console.log ('PixelRatio.getPixelSizeForLayoutSize 37 x 27.3 : ' + PixelRatio.getPixelSizeForLayoutSize (37) + ' x ' + PixelRatio.getPixelSizeForLayoutSize (21.3));
        //console.log ('PixelRatio.roundToNearestPixel : ', PixelRatio.roundToNearestPixel (21.3));
        //console.log ('PixelRatio.getPixelSizeForLayoutSize fontSize 23 : ' + PixelRatio.getPixelSizeForLayoutSize (23));
        //console.log ('PixelRatio.roundToNearestPixel fontSize 23 : ', PixelRatio.roundToNearestPixel (23));
        const newSize = size * scale;
        if (Platform.OS === 'ios') {
            return Math.round (PixelRatio.roundToNearestPixel (newSize));
        } else {
            return Math.round (PixelRatio.roundToNearestPixel (newSize)) - 2;
        }
    };


    // 로그아웃
    logout = async () => {
        const userInfo = await this.getUserInfo();
        const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/auth/logout';
        if (this.isEmpty(userInfo)) {
        await this.removeLocalUserInfo();
        return true;
        } else {
        let returnResult = false;
        const formData = new FormData();
        formData.append('v1', userInfo.memberIdx);
        formData.append('v2', userInfo.logKey);
        formData.append('v3', 1);
        const options = {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            ApiKey: '2B5A42E1BFA12821F475E4FF962E541B',
            },
            body: formData,
        };
        await this.requestAPI(url, options)
            .then(response => {
            if (response.code === '0000') {
                if (response.data.isLogout === 1) {
                // if (this.state.isAutoLogin) {
                //   // this.state.saveToken(response.data.logKey);
                // }
                this.removeLocalUserInfo();
                returnResult = true;
                } else {
                returnResult = false;
                }
            } else {
                returnResult = false;
            }
            })
            .catch(err => {
            console.log('logout error : ', err);
            returnResult = false;
            });
        return returnResult;
        }
    };

    // 로그인 체크
    isLoginCheck = async props => {
        const userInfo = await this.getUserInfo();
        if (this.isEmpty(userInfo)) {
        await this.resetLoginData(props);
        return false;
        } else {
        const validationLogKey = await this.validationLogKey(userInfo);
        if (validationLogKey) {
            const unAuthMemberFlagServiceName = await this.getUnAuthMemberFlagServiceName();
            if (unAuthMemberFlagServiceName === null) {
            return true;
            } else {
            // Alert.alert(
            //   '',
            //   unAuthMemberFlagServiceName + ' 아이디가 통합 전환하지 않아,\n' +
            //     '추가 계정 통합이 필요합니다.\n\n' +
            //     '통합회원 전환은 PC 또는 모바일 웹에서\n' +
            //     '가능합니다 : )',
            //   [{text: '확인', onPress: () => console.log('일부 미통합 확인')}],
            // );
            // if (props && props._saveUserToken) {
            //   await props._saveUserToken(null);
            //   await this.removeLocalUserInfo();
            // }
            // console.log('isLoginCheck : 일부 미통합 확인');
            return {code: -1, flagName: unAuthMemberFlagServiceName};
            }
        } else {
            await this.resetLoginData(props);
            return false;
        }
        // return validationLogKey;
        }
    };

    moveLogin = async props => {
        await props._saveNonUserToken(null);
        setTimeout(() => {
            props.navigation.popToTop();
        }, 500);
    }
    resetLoginData = async props => {
        if (props && props._saveUserToken) {
            await props._saveUserToken(null);
            await this.removeLocalUserInfo();
        }
    };

    // 현재 로그인 로그키 유효성 검증
    validationLogKey = async userInfo => {
        const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/auth/validation?v1=' + userInfo.memberIdx + '&v2=' + userInfo.logKey + '&v3=1';
        let returnResult = false;
        await this.requestAPI(url)
        .then(response => {
            if (response.code === '0000') {
            if (response.data.isAuth === 1) {
                // if (this.state.isAutoLogin) {
                //   // this.state.saveToken(response.data.logKey);
                // }
                const newUserInfo = {
                ...userInfo,
                updateDatetime: moment().format('YYYY-MM-DD HH:mm:ss'),
                };
                this.saveLocalUserInfo(newUserInfo);
                // this.props.saveUserInfo(response.data);
                returnResult = true;
            } else {
                returnResult = false;
            }
            } else {
            returnResult = false;
            }
        })
        .catch(err => {
            //console.log('validationLogKey error : ', err);
            returnResult = false;
        });
        return returnResult;
    };
    
    fn_call_toast(message, timesecond) {
        const atoast = Toast.show(message);
            setTimeout(() => {
                Toast.hide(atoast); 
            }, timesecond)
    }

    resetLoginData = async (props) => {
        this.fn_call_toast('세션이 만료되어 로그아웃됩니다.',1500);
        await AsyncStorage.removeItem('autoLoginData');
        setTimeout(() => {
            props._saveUserToken({});
            props._saveNonUserToken({});
        }, 1500);
    };


    // 로그인 
    API_refreshLogin = async(token) => {   
        let jwtObject = await jwt_decode(token);
        console.log('jwtObject', jwtObject);     
        let returnCode = {code:'9999'};
        let url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/auth/refreshtoken';
        let sendData = {
            user_id : jwtObject.user_id,
            token : token
        }
        await this.callAPI( url,{
            method: 'POST', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'application/json; charset=UTF-8'
            }), 
            body: JSON.stringify(sendData)
        },10000).then(response => {
            returnCode = response;
        })
        .catch(err => {
            console.log('err', err);
        });        
        return returnCode;
    }

    refreshToken = async (props,token) => {
        console.log('refreshToken',token );
        let returnCode = await this.API_refreshLogin(token)
        if (  returnCode.code === '0000') {
            let jwtObject = await jwt_decode(returnCode.token);
            console.log('jwtObject', jwtObject);
            await this.setLoginToken(props,returnCode.token,jwtObject);
            return {code:'0000',apiToken:token};
        }else{
            return returnCode;
        }
    }

    setLoginToken = async(props,token,jwtObject) => {
        props._saveUserToken({
            user_id : jwtObject.id,
            member_pk : jwtObject.member_pk,
            name : jwtObject.name,
            email : jwtObject.email,
            phone : jwtObject.phone,
            is_salesman : jwtObject.is_salesman,
            apiToken : token,
        });
  
    }
  
    // 로컬에 회원앱설정 정보 저장
    saveLocalMemberAppSetting = async memberAppSetting => {
        try {
        await AsyncStorage.setItem('memberAppSetting', JSON.stringify(memberAppSetting));
        return await this.getLocalMemberAppSetting();
        } catch (error) {
        //console.log('saveLocalMemberAppSetting error : ', error);
        // this.setState({loginError: error});
        }
    };
    // 로컬에 회원앱설정 정보 저장
    removeLocalMemberAppSetting = async memberAppSetting => {
        try {
        await AsyncStorage.removeItem('memberAppSetting');
        } catch (error) {
        //console.log('removeLocalMemberAppSetting error : ', error);
        // this.setState({loginError: error});
        }
    };
  
    // 로그인 유저 정보 AsyncStorage 저장
    saveLocalUserInfo = async userInfo => {
        try {
        await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        } catch (error) {
        console.log('saveLocalUserInfo error : ', error);
        // this.setState({loginError: error});
        }
    };
    // 로그인 유저 정보 AsyncStorage 삭제
    removeLocalUserInfo = async () => {
        try {
        const resp = await AsyncStorage.removeItem('userInfo');
        return resp;
        } catch (error) {
        console.log('removeLocalUserInfo error : ', error);
        }
    };
    // 로컬 저장된 유저 정보 조회
    getUserInfo = async () => {
        // TEST
        // return {
        //   memberIdx: 2014896, //챔프: 5104881 7015069 7014826 3649866 / 임용: 1307399 2014896
        //   memberID: 'TEST',
        //   memberBirthDate: '2000-02-02',
        //   memberName: '테스트',
        //   isAutoLogin: true,
        // };
        try {
        const userInfo = await AsyncStorage.getItem('userInfo');
        return JSON.parse(userInfo);
        } catch (error) {
        console.log('getUserInfo error : ', error);
        }
    };
    // 자동로그인 여부 조회
    isAutoLogin = async () => {
        const userInfo = await this.getUserInfo();
        if (!this.isEmpty(userInfo)) {
        return userInfo.isAutoLogin;
        } else {
        return false;
        }
    };
    // 회원 식별자 조회
    getMemberIdx = async () => {
        const userInfo = await this.getUserInfo();
        if (!this.isEmpty(userInfo)) {
        return userInfo.memberIdx;
        } else {
        return null;
        }
    };
    // 회원 아이디 조회
    getMemberID = async () => {
        // TEST
        // return 'jb3238'; //7015069 (cdffee1), 5104881 (ID = jb3238 ), 6000434 (ID = jba3238 )
        const userInfo = await this.getUserInfo();
        if (!this.isEmpty(userInfo)) {
        return userInfo.memberID;
        } else {
        return null;
        }
    };


    // 로컬 저장된 유저의 logKey 조회
    getToken = async () => {
        try {
        const userInfo = await AsyncStorage.getItem('userInfo');
        if (userInfo) {
            return JSON.parse(userInfo).logKey;
        }
        return false;
        } catch (error) {
        console.log('getToken error : ', error);
        }
    };

    SingleImageUpload = async(token,imgData , folder = 'product') => {
        let formData = new FormData();
        formData.append('folder', folder);
        formData.append('img', imgData);
        //console.log('formData', formData._parts);
        /*
         formData.append('img', {
                name: imgData.filename, 
                size : imgData.size,
                uri:  imgData.path, 
                type: imgData.mime, 
            }); */
        const FETCH_TIMEOUT = 10000;
        const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/img/single';
        const options = {
            body: formData,
            method: 'POST',
            headers: {
                "Content-Type": "multipart/form-data",
                'authorization' : token
            },
        };
        const response = await CommonUtil.imgUploadWithTimeout(url, options, FETCH_TIMEOUT);
        //console.log('response', response);
        const responseJson = await response.json();
        //console.log('responseJson', responseJson);
        try {   
            if ( responseJson.code === '0000' || CommonUtil.isEmpty(responseJson.data) ) {
                return responseJson;
            }else{
                return {code : '9999' ,msg:'fail'};
            }
        }catch(err) {
            return {code : '9999' ,msg:err};
        }
    }

    MultipleImageUpload = async(imgArray) => {
        
        let formData = new FormData();
        formData.append('folder', 'product');
 
        await imgArray.forEach(function(element,index,array){     
            formData.append('img', {
                name: element.name, 
                size : element.size,
                uri:  element.uri,
                type: element.type
            } );
        });  
   
        console.log('formData', formData._parts);
        const FETCH_TIMEOUT = 10000;
        const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/img/multiple';
        const options = {
            body: formData,
            //mode: "cors",
            method: 'POST',
            headers: {
                "Content-Type": "multipart/form-data"
            },
        };
        const response = await this.imgUploadWithTimeout(url, options, FETCH_TIMEOUT);
        console.log('response', response);
        const responseJson = await response.json();
        console.log('MultipleImageUpload', responseJson);
        try {   
            if ( responseJson.code === '0000' || this.isEmpty(responseJson.data) ) {
                return responseJson;
            }else{
                return {code : '9999' ,msg:'fail'};
            }
        }catch(err) {
            return {code : '9999' ,msg:err};
        }
    }
  
    // fetch with timeout
    imgUploadWithTimeout = async (url, options = null, FETCH_TIMEOUT = 30000, ) => {
        return Promise.race([
            fetch(url, options),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('timeout')), FETCH_TIMEOUT),
            ),
        ]);
    };
  
    // call API with timeout Function, default limit = 30 seconds
    callAPI = async (url, options = null, FETCH_TIMEOUT = 30000, requiredLogin = false, signal = null) => {
        const myTimeout = this.isEmpty(FETCH_TIMEOUT) ? 30000 : FETCH_TIMEOUT;
        if (requiredLogin) {
            const isLogin = this.isLoginCheck();
            if (isLogin) {
                return this.requestAPI(url, options, myTimeout, signal);
            } else {
                // Alert.alert('', '로그인이 필요한 서비스 입니다.');
                throw new Error('requiredLogin');
            }
        } else {
            return this.requestAPI(url, options, myTimeout, signal);
        }
    };

    requestAPI = async (url, options = null, FETCH_TIMEOUT = 30000, signal = null) => {
        const domain = url.replace('http://','').replace('https://','').split(/[/?#]/)[0];
        try {
            // 1) myClass에서는 사용자가 선택한 마이클래스의 ServiceID를 사용하므로 
            //    callAPI 호출 시 options headers ApiKey 직접 기재해서 호출
            // 2) 마이클래스 이외는 관심분야 선택에 따른 ServiceID 불러와 자동 삽입
            if (options === null) {
                options = {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                };
            } else {
                // headers를 new Headers로 넘기면 map 으로 넘어옴.
                // 그냥 headers: {}, new Headers({}) 모두 허용위해 newHeaders로 받음
                // headers 대소문자 구분으로 인해 변화 후 사용
                const tmpHeaders = options.headers
                ? typeof options.headers.map !== 'undefined'
                    ? options.headers.map
                    : options.headers
                : {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                    };
                let arrHeaders = [];
                let arrHeaderKeys = [];
                Object.keys(tmpHeaders).forEach(item => {
                    arrHeaders[item.toLowerCase()] = tmpHeaders[item];
                    arrHeaderKeys.push(item.toLowerCase());
                });

                let newHeaders = {};
                arrHeaderKeys.forEach((value, index) => {
                let objKey = '';
                if (value === 'accept') {
                    objKey = 'Accept';
                } else if (value === 'content-type') {
                    objKey = 'Content-Type';
                } else if (value === 'apikey') {
                    objKey = 'ApiKey';
                } else {
                    objKey = value;
                }
                const obj = {[objKey]: arrHeaders[value]};
                newHeaders = {...newHeaders, ...obj};
                });
                const contentType =
                options.method && options.method.toUpperCase() === 'POST'
                    ? 'multipart/form-data'
                    : options.method && options.method.toUpperCase() === 'PUT' || options.method && options.method.toUpperCase() === 'DELETE'
                    ? 'application/x-www-form-urlencoded'
                    : 'application/json; charset=UTF-8';
                const receivedApiKey = newHeaders.ApiKey ? newHeaders.ApiKey : newHeaders.apiKey;
                options.headers = {
                ...newHeaders,
                //'Content-Type': contentType, // <= 강제 지정 / 호출지의 content-type 이 있으면 사용 => newHeaders['Content-Type'] ? newHeaders['Content-Type'] : contentType,
                'authorization': receivedApiKey ? receivedApiKey : null,
                };
            }
            //console.log('CallAPI requestAPI : ', url, options);
            //console.log('CallAPI body : ', options.body);
            const response = await this.fetchWithTimout(url, options, FETCH_TIMEOUT, signal);
            const responseJson = await response.json();
            // console.log('CallAPI responseJson : ', responseJson);
            return responseJson;
        } catch (error) {
            //console.log('callAPI error : ', error);
            throw new Error(error);
        }
    };

    // fetch with timeout
    fetchWithTimout = async (url, options = null, FETCH_TIMEOUT = 30000, signal = null) => {
        return Promise.race([
        fetch(url, options, signal),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), FETCH_TIMEOUT),
        ),
        ]);
    };


    // 문자열 날짜 -> 날짜 객체로 변환
    stringToDate = dateString => {
        dateString = dateString.replace(/-/g, "/");
        dateString = dateString.replace("T", " ");
        return new Date(
            dateString.replace(/(\+[0-9]{2})(\:)([0-9]{2}$)/, " UTC$1$3")
        );
    };

    // 두 날짜 사이 일 수 계산
    dateDiff = (dateString1, dateString2) => {
        // let date1 = new Date(dateString1);
        // let date2 = new Date(dateString2);
        // let timeDiff = Math.abs(date2.getTime() - date1.getTime());
        // let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        // return diffDays;
        return moment(dateString2).diff(moment(dateString1), 'days') + 1;
    };

    //전화번호 포맷
    phoneFormat = (input) => {
        const regex = /[^0-9]/g;				// 숫자가 아닌 문자열을 선택하는 정규식
        let result = input.replace(regex, "");
        if(result.length === 9){
          return result.replace(/(\d{2})(\d{3})(\d{4})/, "$1-$2-$3");
        }else if(result.length === 10){
            return result.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
        }else if(result.length === 11){
            return result.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
        }else if(result.length === 12){
            return result.replace(/(\d{4})(\d{4})(\d{4})/, "$1-$2-$3");
        }else{
            return result;
        }
    };

    //숫자만 포맷
    onlyDigits = (input) => {
        const regex = /[^0-9]/g;				// 숫자가 아닌 문자열을 선택하는 정규식
        let result = input.replace(regex, "");
       
        return result;
    };

    // 날짜 포맷
    dateFormat = (format, date) => {
        let d;
        const _this = this;
        if (date == undefined || date == "" || date == null) {
            d = new Date();
        } else {
            if (typeof date == "string") {
                d = _this.stringToDate(date);
            } else {
                d = date;
            }
        }

        return format.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
            switch ($1) {
                case "yyyy":
                    return d.getFullYear();
                    break;
                case "yy":
                    return _this.mask("00", d.getFullYear() % 1000);
                    break;
                case "MM":
                    return _this.mask("00", d.getMonth() + 1);
                    break;
                case "dd":
                    return _this.mask("00", d.getDate());
                    break;
                case "E":
                    return weekName[d.getDay()];
                    break;
                case "HH":
                    return _this.mask("00", d.getHours());
                    break;
                case "hh":
                    return _this.mask("00", (h = d.getHours() % 12) ? h : 12);
                    break;
                case "mm":
                    return _this.mask("00", d.getMinutes());
                    break;
                case "ss":
                    return _this.mask("00", d.getSeconds());
                    break;
                case "a/p":
                    return d.getHours() < 12 ? "오전" : "오후";
                    break;
                default:
                    return $1;
            }
        });
    };

    // 마스킹
    mask = (fs, s) => {
        var string = fs.toString() + s.toString();
        var size =
            fs.length > s.toString().length ? fs.length : s.toString().length;
        return string.substr(s.toString().length, size);
    };

    cardMiddleMask = (fs, s) => {
        const string = fs.toString();
        const size = string.length;
        const maskLength = size > 8 ? size - 8 : 1;
        let maskString = '';
        for (i = 0; i < maskLength; i++) {
        maskString += s;
        }
        return string.substr(0, 4) + (size > 4 ? (maskString + string.substr(-4)) : maskString);
    };


    middleMask = (fs, s) => {
        const string = fs.toString();
        const size = string.length;
        const maskLength = size > 2 ? size - 2 : 1;
        let maskString = '';
        for (i = 0; i < maskLength; i++) {
        maskString += s;
        }
        return string.substr(0, 1) + (size > 2 ? (maskString + string.substr(-1)) : maskString);
    };

    // 문자열에서 슬래시 제거 (역슬래시 제거)
    stripSlashes = str => {
        return str.replace(/\\(.)/gm, '$1');
    };

    stripTags = str => {
        return str.replace(/<\/?[^>]+(>|$)/g, "");
    };

    // obejct -> url get param 변환
    // {memberIdx: 1234, classIdx: 5678} => memberIdx=1234&classIdx=5678
    objectToParamString = obj => {
        return Object.entries(obj)
        .map(([key, val]) => encodeURIComponent(`${key}`) + '=' + encodeURIComponent(`${val}`))
        .join('&');
    };

    openApp = (url, appName, appStoreId, appStoreLocale, playStoreId) => {
        Platform.OS === 'ios'
            ? this.openiOSCustomUrlLinking(url, appName, appStoreId, appStoreLocale, playStoreId)
            : this.openAndroidCustomUrlLinking(url, appName, appStoreId, appStoreLocale, playStoreId)
    };

    //패키지 미설치 시, 앱 스토어 정상 이동
    //패키지 설치 시, 앱 정상 실행, 동영상 정상 실행 및 다운로드 정상 실행
    openiOSCustomUrlLinking = ( intentUrl, appName, appStoreId, appStoreLocale, playStoreId) => {
        AppLink.maybeOpenURL(intentUrl, { appName, appStoreId, appStoreLocale, playStoreId }).then(() => {
            Linking.openURL(intentUrl);
        }).catch((err) => {
            //  alert('err occurred on ios');
            AppLink.openInStore(appName, appStoreId, appStoreLocale, playStoreId);
        });
    }

    //패키지 미설치 시, 구글 스토어 정상 이동
    //패키지 설치 시, 앱 정상 실행, 동영상 정상 실행 및 다운로드 정상 실행
    openAndroidCustomUrlLinking = (intentUrl, appName, appStoreId, appStoreLocale, playStoreId) => {
        SendIntentAndroid.isAppInstalled(playStoreId)
            .then(function(isInstalled){
                if(!isInstalled){
                    //console.log('openAndroidCustomUrlLinking()', 'playStoreId = ' + playStoreId)
                    AppLink.openInStore({ appName, appStoreId, appStoreLocale, playStoreId }).then(() => {})
                    return;
                } else {
                    SendIntentAndroid.openChromeIntent(intentUrl);
                    return;
                }
            }).catch((err) => {
            alert('err occurred on android');
        });
    }
}

const CommonUtil = new Util();
export default CommonUtil;

