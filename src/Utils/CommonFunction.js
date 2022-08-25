import {Dimensions, NativeModules,Platform,Alert} from 'react-native';
import {remove as removeDiacritics} from 'diacritics'
import Toast from 'react-native-tiny-toast';
import jwt_decode from "jwt-decode";
//import PushNotification from 'react-native-push-notification';
//let PushNotificationIOS = NativeModules.RNCPushNotificationIOS;
import 'moment/locale/ko'
import  moment  from  "moment";
import CryptoJS from "react-native-crypto-js";
import AsyncStorage from '@react-native-community/async-storage';

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../Utils/CommonUtil';
const key_hash = CryptoJS.MD5('hexagonadmin'); //암호화복호회
const hashkey = CryptoJS.enc.Utf8.parse(key_hash);//암호화복호회
const hashiv  = CryptoJS.enc.Utf8.parse(DEFAULT_CONSTANTS.CommonSaltKey);//암호화복호회


//LocalPusth
//import LocalNotifService from '../Utils/LocalNotifService';

class Funtion {   
  
  /*
  sendLocalPush = ( routeName, targetNotification ) => {        

    let soundName = null;
    let pushTitle = "해커스통합앱";
    let pushMessage = "푸쉬메시지푸쉬메시지푸쉬메시지";
    let sendTime = 10; //add per second 최소 5초 즉시발송개념, 그외에는 지연발송
    let isVibrate = false ;//
    let screenName = routeName;
    let screenIdx = 0;
    const nofiId = 4747;
    targetNotification.appLocalNotification(soundName,pushTitle,pushMessage,isVibrate,screenName,screenIdx,nofiId);

  } 

  checkMyNewsArrvalsRead = async(props = null ) => {

    const appUUID = await AsyncStorage.getItem('UUID');
    let memberIdx = 0;
    if ( props.userToken !== null) {
      if ( typeof props.userToken.memberIdx !== 'undefined' ) {
        memberIdx = props.userToken.memberIdx;
      }else{
        if ( props.userToken.length > 0 ) {
          JSON.parse(props.userToken).memberIdx;
        }
      }    
    }
    
    let appID = DEFAULT_CONSTANTS.appID;
    let interestCode = typeof props.myInterestCodeOne.code !== 'undefined' ? props.myInterestCodeOne.code : 0;
    await CommonUtil.callAPI( DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/push/allread?appID=' + appID +'&UUID=' + appUUID + '&memberIdx=' + memberIdx + '&interestCode=' + interestCode ,{
        method: 'PUT', 
        headers: new Headers({
          Accept: 'application/json',                
          'Content-Type': 'application/x-www-form-urlencoded',
          'apiKey': DEFAULT_CONSTANTS.apiAdminKey
        }), 
          body:null
        },10000
      ).then(response => {         
        console.log('checkMyNewsArrvalsRead',response)   
        if ( response  ) {                    
            if ( response.code === '0000' ) {                    
                props._updateGlobalNewsUnReadCount(0);
            }else{
              //DHFB
            }
        } 
      }).catch(err => {
      });
  }

  checkMyNewsArrvals = async(props = null ) => {
    
    const appUUID = await AsyncStorage.getItem('UUID');
    await props._updateGlobalNewsUnReadCount(0);
    //console.log('appUUID2',appUUID);
    //console.log('checkMyNewsArrvals code',props.myInterestCodeOne.code);
    //console.log('checkMyNewsArrvals memberIdx',props.userToken);

    let returnCode = null;
    let memberIdx = 0;
    if ( props.userToken !== null) {
      if ( typeof props.userToken.memberIdx !== 'undefined' ) {
        memberIdx = props.userToken.memberIdx;
      }else{
        if ( props.userToken.length > 0 ) {
          JSON.parse(props.userToken).memberIdx;
        }
      }    
    }
    
    let appID = DEFAULT_CONSTANTS.appID;
    let interestCode = typeof props.myInterestCodeOne.code !== 'undefined' ? props.myInterestCodeOne.code : 0;
    await CommonUtil.callAPI( DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/newarrival?appID=' + appID +'&UUID=' + appUUID + '&memberIdx=' + memberIdx + '&interestCode=' + interestCode ,{
        method: 'GET', 
        headers: new Headers({
          Accept: 'application/json',                
          'Content-Type': 'application/json; charset=UTF-8',
          'apiKey': DEFAULT_CONSTANTS.apiAdminKey
        }), 
            body:null
        },10000
        ).then(response => {    
          //console.log('response.data',response.data);        
            if ( response && typeof response.data !== 'undefined' ) {                    
              if ( response.code === '0000' ) {
                if ( typeof response.data.newArrivalCount !== 'undefined'){
                  if ( response.data.newArrivalCount > 0 ) {
                    props._updateGlobalNewsUnReadCount(parseInt(response.data.newArrivalCount));
                    props._updateGlobalNewsData(response.data.newArrival);
                    returnCode =  response.data.newArrival;
                  }
                }
              }
            }
        })
        .catch(err => {
    });
    return returnCode;
}

  isSetupPush ( bool ) {    
    AsyncStorage.setItem('isUsePush',bool ? 'true' : 'false');
    if (bool === false) {
      BackgroundTimer.stopBackgroundTimer(); 
    }
  }

  isSetupNewsPush ( bool ) {
    //
    AsyncStorage.setItem('isUseNewsPush',bool ? 'true' : 'false');
  }
  
  ifFirstNotification = async(props = null, targetNotification = null) => {
    let returnData = await this.checkMyNewsArrvals(props);
    if ( returnData !== null )  {
      //this.sendLocalPush('FreeBoard',targetNotification)
    }
  }

  setIntervalProess = async( isUse , time = 0 , props = null, targetNotification = null) => {

    if ( isUse ){      
      let returnData = null;//await this.checkMyNewsArrvals(props);
      BackgroundTimer.runBackgroundTimer(() => { 
          let CurrentDateTimeStamp = moment().unix();
          // console.log(' BackgroundTimer 3 : ',Platform.OS , CurrentDateTimeStamp, returnData);          
          if ( returnData !== null )  {
            this.sendLocalPush('FreeBoard',targetNotification)
          }else{
            // console.log(' BackgroundTimer 5 nothing');
          }
        }, 
        time
      );

    }else{
      let CurrentDateTimeStamp = moment().unix();
      console.log(' BackgroundTimer 4 : ', CurrentDateTimeStamp)
      BackgroundTimer.stopBackgroundTimer(); 

    }
  }

  */
    ValidateEmail = (mail) => {
        if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)){
            return true
        }else{
            return false
        }
    }

    tokenRelease(tdatap,props = null) {
        this.fn_call_toast('인증이 만료되었습니다. 재발행합니다.',2000);
        this.refreshToken(tdatap,props);
        console.log('tokenRelease', tdatap);       
    }

    refreshToken(data,props) {
        let formData = {
            "accessToken" : data.apiToken,
            "refreshToken" : data.refreshToken
        }
        let aPIsAuthKey = null;
        CommonUtil.callAPI( DEFAULT_CONSTANTS.apiAdminDomain + '/admin/api/auth',{
                method: 'PUT', 
                headers: new Headers({
                    Accept: 'application/json',                
                    'Content-Type': 'application/json; charset=UTF-8',
                    'apiKey': aPIsAuthKey
                }), 
                body: JSON.stringify(formData)
            },10000).then(response => {
                console.log('response', response);
                if (!CommonUtil.isEmpty(response.statusCode)) {
                    this.fn_call_toast('인증토큰이 유효하지 않습니다. 로그인페이지로 이동합니다.',1500);
                    props._saveUserToken({})
                    setTimeout(() => {
                        props.navigation.popToTop();
                    }, 1500);
                }else{
                    this.setLoginToken(response,props)
                }
                
            })
            .catch(err => {
                console.log('login error => ', err);                    
        });
    }

    setLoginToken = async(token,props) => {
        let jwtObject = await jwt_decode(token.accessToken);
        //console.log('jwtObject', jwtObject);
        
        props._saveUserToken({
            id : props.userToken.id,
            centerId : props.userToken.centerId,
            apiToken : token.accessToken,
            refreshToken : token.refreshToken,
            userName : jwtObject.rnm,
            userInfo : jwtObject
        });   
        setTimeout(() => {
            props.navigation.goBack(null);
        }, 1000);    
    }

    mixedString ( str1, str2 ) {
        let a = str1.split("");
        let b = str2.split("");
        let count = 0;
        let merged_string = "";
        a.length < b.length ? count = a.length: count = b.length;
        
        for( var i=0; i< count; i++){
        merged_string += a[i]+b[i];    
        }

        count < str1.length 
        ? merged_string += str1.substr(count, str1.length)
        : merged_string += str2.substr(count, str2.length)

        return merged_string;
    }

    //암호화
    fn_dataEncode(message){  
        var encrypted = CryptoJS.AES.encrypt(message, hashkey, { iv: hashiv,mode:CryptoJS.mode.CBC});
        return encrypted.toString();
    }
    //복호화
    fn_dataDecode(encrypted){    
        var decrypted = CryptoJS.AES.decrypt(encrypted,hashkey,{iv:hashiv});
        return decrypted.toString(CryptoJS.enc.Utf8);
    }
  
  
    currencyFormat(num) {
        let num2 = parseInt(num);
        return num2.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }  
    
    phoneFomatter(num,type = false){
        let formatNum = '';
        if(num.length==11){
            if(type){
                formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-****-$3');
            }else{
                formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
            }
        }else if(num.length==8){
            formatNum = num.replace(/(\d{4})(\d{4})/, '$1-$2');
        }else{
            if(num.indexOf('02')==0){
                if(type){
                    formatNum = num.replace(/(\d{2})(\d{4})(\d{4})/, '$1-****-$3');
                }else{
                    formatNum = num.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
                }
            }else{
                if(type){
                    formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1-***-$3');
                }else{
                    formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
                }
            }
        }
        return formatNum;
    }

    replaceUnitType(item) {
        switch(item) {
            case 'Each' : return  '낱개';break;
            case 'Box' : return  '박스';break;
            case 'Carton' : return  '카톤';break;
            default : return  '낱개';break;
        }
    }

    isIphoneX() {
        const dimen = Dimensions.get('window');
        return (
            Platform.OS === 'ios' &&
            !Platform.isPad &&
            !Platform.isTVOS &&
            ((dimen.height === 812 || dimen.height === 844 || dimen.width === 812) || (dimen.height === 896 || dimen.width === 896))
        );
    }

    groupBy(objectArray, property) {
        return objectArray.reduce(function (acc, obj) {
        var key = obj[property];
            if (!acc[key]) {
            acc[key] = [];
            }
            acc[key].push(obj);
            return acc;
        }, {});
    }

    groupBywithkey(objectArray, property) {
        let keyArray = [];
        return objectArray.reduce(function (acc, obj) {
            var key = obj[property];
            if (!acc[key]) {
            acc[key] = [];
            keyArray.push(key)
            }
            acc[key].push(obj);
            return acc;
        }, {keyArray});
        
    }


    flatten (array) {
        return array.reduce((flat, toFlatten) => (
            flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten)
        ), [])
    }

    convertArrayToObject = (array, key ,val = null ) => {
        const initialValue = {};
        if ( CommonUtil.isEmpty(array)) {
            return false;
        }else{
            return array.reduce((obj, item) => {
                if ( val === null ) {
                    return {
                        ...obj,
                        [item[key]]: item,
                    };
                }else {
                    return {
                        ...obj,
                        [item[key]]: item[val],
                    };
                }
            
            }, initialValue);
        }
        
    };

    getValuesForKey (key, item) {
        const keys = key.split('.')
        let results = [item]
        keys.forEach(_key => {
            let tmp = []
            results.forEach(result => {
            if (result) {
                if (result instanceof Array) {
                const index = parseInt(_key, 10)
                if (!isNaN(index)) {
                    return tmp.push(result[index])
                }
                result.forEach(res => {
                    tmp.push(res[_key])
                })
                } else if (result && typeof result.get === 'function') {
                tmp.push(result.get(_key))
                } else {
                tmp.push(result[_key])
                }
            }
            })
            results = tmp
        })
        
        // Support arrays and Immutable lists.
        results = results.map(r => (r && r.push && r.toArray) ? r.toArray() : r)
        results = this.flatten(results)
        
        return results.filter(r => typeof r === 'string' || typeof r === 'number')
    }

    searchStrings (strings, term, {caseSensitive, fuzzy, sortResults, normalize} = {}) {
        strings = strings.map(e => {
            const str = e.toString()
            return normalize && removeDiacritics(str) || str
        })
        
        try {
            if (fuzzy) {
            if (typeof strings.toJS === 'function') {
                strings = strings.toJS()
            }
            const fuse = new Fuse(
                strings.map(s => { return {id: s} }),
                { keys: ['id'], id: 'id', caseSensitive, shouldSort: sortResults }
            )
            return fuse.search(term).length
            }
            return strings.some(value => {
            try {
                if (!caseSensitive) {
                value = value.toLowerCase()
                }
                if (value && value.search(term) !== -1) {
                return true
                }
                return false
            } catch (e) {
                return false
            }
            })
        } catch (e) {
            return false
        }
    }

    createFilter (term, keys, options = {}) {
        return (item) => {
            if (term === '') { return true }
        
            if (!options.caseSensitive) {
                term = term.toLowerCase()
            }
        
            if (options.normalize) {
                term = removeDiacritics(term)
            }
      
            const terms = term.split(' ')
        
            if (!keys) {
                return terms.every(term => searchStrings([item], term, options))
            }
        
            if (typeof keys === 'string') {
                keys = [keys]
            }
      
            return terms.every(term => {
                // allow search in specific fields with the syntax `field:search`
                let currentKeys
                if (term.indexOf(':') !== -1) {
                const searchedField = term.split(':')[0]
                term = term.split(':')[1]
                currentKeys = keys.filter(key => key.toLowerCase().indexOf(searchedField) > -1)
                } else {
                currentKeys = keys
                }
        
                return currentKeys.some(key => {
                const values = this.getValuesForKey(key, item)
                return this.searchStrings(values, term, options)
                })
            })
        }
    }

    strip_tags(input, allowed) {
        allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('')
        const tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi
        return input.replace(tags, ($0, $1) => (allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : ''))
    }

    fn_strip_tags ( data ) {
        const regex = /(<([^>]+)>)/ig;
        const result = data.replace(regex, '');

        return 'result';
    }

    fn_division( arr, n ) {        
        
        var len = arr.length;
        var cnt = Math.floor(len / n);
        var tmp = [];

        for (var i = 0; i <= cnt; i++) {
            tmp.push(arr.splice(0, n));
        }
        return tmp;
    }

    addOrReplace(object) {
        var index = arrIndex[object.uid];
        if(index === undefined) {
            index = arr.length;
            arrIndex[object.uid] = index;
        }
        arr[index] = object;
    }
    convertUnixToDateToday2 = (wdate) =>{
        let date = new Date(wdate);
        let year = date.getFullYear();
        let month = ("0" + (1 + date.getMonth())).slice(-2);
        let day = ("0" + date.getDate()).slice(-2);
    
        return year + "." + month + "." + day;
    }
    convertUnixToDate = (unix,reform) => {
        return moment.unix(unix).format(reform);
    }
    convertUnixToNewDate = (unix) => {
        return new Date(unix*1000);
    }
    convertDateToUnix =  (datew) => {
        let val = moment(datew).valueOf();
        return parseInt(val/1000)
    }   
    convertUnixToRestDate = (s) => {

        const d = Math.floor(s / (3600 * 24));
        s  -= d * 3600 * 24;
        const h = Math.floor(s / 3600);
        s  -= h * 3600;
        const m = Math.floor(s / 60);
        s  -= m * 60;
        const tmp = [];
        (d) && tmp.push(d + '일');
        //(d || h) && tmp.push(h + '시');
        //(d || h || m) && tmp.push(m + '분');
        //tmp.push(s + '초');
        return tmp.join(' ');
          
    }

    fn_call_toast(message, timesecond) {
        const atoast = Toast.show(message,{overScreen : true});
            setTimeout(() => {
                Toast.hide(atoast); 
            }, timesecond)
    }
    fn_call_toast_top(message, timesecond , pos=null) {
        const atoast = Toast.show(message ,{
            position : pos === 'center' ? Toast.position.center: Toast.position.bottom,
            mask : true,
            overScreen : true
        });
        setTimeout(() => {
            Toast.hide(atoast); 
        }, timesecond)
    }

    replaceAll(strTemp, strValue1, strValue2){ 
        while(1){
            if( strTemp.indexOf(strValue1) != -1 )
                strTemp = strTemp.replace(strValue1, strValue2);
            else
                break;
        }
        return strTemp;
    }

    unicodeToKor(str){
        //유니코드 -> 한글     
        let returndata = unescape(this.replaceAll(str, "\\", "%"));
        return returndata
    }

    korToUnicode(str){
        let returndata =  escape(this.replaceAll(str, "\\", "%"));
        return returndata
    }

    escapeHtml(text) {
        var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
        };
    
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }

    isForbiddenWord (message, words) {
        let result = message;  
        for (let i = 0; i < words.length; i++) {      
            if ( words[i] !== '*')  {
            if (message.match(words[i])) {
                result = this.replaceAll(result, words[i], "OO");
            }
            }
        }
        return result;
    };

    //start : regist timestamp
    // end : now timestamp
    compareTime(start, end = null , date) {
        //let CurrentDateTimeStamp = moment().unix();
        let end2 = end === null ? moment().unix() : end;
        let msDiff = end2 - start;
        if ( msDiff <  60) {
        return '방금';
        }else if ( msDiff >= 60 && msDiff < 60*60 ) {
        return '1시간전'
        }else if ( date.substr(0,10) === moment().format('YYYY-MM-DD') ) {
        return date.substr(-7,5);
        }else{      
        return date.substr(5,5);
        }
    }

    copyObject(obj) {
        var copy = {};
        if (Array.isArray(obj)) {
        copy = obj.slice().map((v) => {
            return this.copyObject(v);
        });
        } else if (typeof obj === 'object' && obj !== null) {
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) {
            copy[attr] = this.copyObject(obj[attr]);
            }
        }
        } else {
        copy = obj;
        }
        return copy;
    }

    getStorageCode = async (gubun = 'CommonCodeList') => {
        const wasCommonCode = await AsyncStorage.getItem(gubun); 
        return JSON.parse(wasCommonCode);
    }

    getImageType = (imgtyp) => {
        if ( imgtyp.indexOf('jpeg') != -1 || imgtyp.indexOf('jpg') != -1 ) {
            return 'jpg'; 
        }else if ( imgtyp.indexOf('gif') != -1  ) {
            return 'gif'; 
        }else if ( imgtyp.indexOf('bmp') != -1  ) {
            return 'bmp'; 
        }else if ( imgtyp.indexOf('svg') != -1  || imgtyp.indexOf('svgz') != -1 ) {
            return 'svg'; 
        }else{
            return 'png';
        }   
    }

    renderWeekname = ( week ) => {
        switch(week) {
            case "Sunday" : return '일요일';break;
            case "Monday" : return '월요일';break;
            case "Tuesday" : return '화요일';break;
            case "Wednesday" : return '수요일';break;
            case "Thursday" : return '목요일';break;
            case "Friday" : return '금요일';break;
            case "Saturday" : return '토요일';break;
            default : return '일요일';break;            
        }
    }

    changeWeekname = ( week ) => {        
        switch(week) {
            case 0 : return '일요일';break;
            case 1 : return '월요일';break;
            case 2 : return '화요일';break;
            case 3 : return '수요일';break;
            case 4 : return '목요일';break;
            case 5 : return '금요일';break;
            case 6 : return '토요일';break;
            default : return '일요일';break;            
        }
    }

    convertWeekname = async( darta ) => {
        let dt = new Date(darta);
        let weekdt = await this.changeWeekname(dt.getDay());
        return weekdt;
    }  
    
    convertWeekNo = ( darta ) => {
        let dt = new Date(darta);        
        return dt.getDay();
    }  

    calEndtime = async ( starttime, addtime ) => {
        let result = parseInt(addtime / 60); // 값은 2
        let remainder = addtime % 60; // 값은 3
        let newHour =  starttime + result > 9 ? starttime + result : '0'+starttime + result ;

        let returnData = newHour + ":" + remainder;
        console.log(returnData)
        return returnData;
    } 

    generateSixDigit= async() => {
        var sixdigitsrandom = await Math.floor(100000 + Math.random() * 900000);;
        return sixdigitsrandom;
    }

    getRandomStringTmp = (length) => {
        var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var result = '';
        for ( var i = 0; i < length; i++ ) {
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        return result;
    }

    getRandomString = (length,array) => {
        var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var result = '';
        for ( var i = 0; i < length; i++ ) {
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        if ( this.checkForDuplicates(array,result)) {
            this.getRandomString(length,array)
        }else{
            return result;
        }
    }

    checkForDuplicates = (array,myUniqueID) => {
        let valuesAlreadySeen = []
        valuesAlreadySeen.push(myUniqueID);
      
        for (let i = 0; i < array.length; i++) {
          let value = array[i]
          if (valuesAlreadySeen.indexOf(value) !== -1) {
            return true
          }
          valuesAlreadySeen.push(value)
        }
        return false
    }

    goToTop = async(bool) => {
       return bool
    }

    loginAlert = () => {
        
        Alert.alert(DEFAULT_CONSTANTS.appName, '로그인이 필요합니다.\n로그인 하시겠습니까?',
        [
            {text: '확인', onPress: () => this.goToTop(true)},
            {text: '취소', onPress: () => this.goToTop(false)},
        ]);
    }

    showAsyncAlert = (title, message, buttons) => {
        return new Promise((resolve, reject) => {
          // We can't detect a cancellation, so make sure the Alert is not cancellable.
          buttons.forEach((button, index) => {
            let onPress = button.onPress
            button.onPress = option => {
              if (onPress) {
                onPress(option)
              }
              resolve(index)
            }
          })
          Alert.alert(DEFAULT_CONSTANTS.appName, message, buttons)
        })
    }

}

const CommonFunction = new Funtion();
export default CommonFunction;