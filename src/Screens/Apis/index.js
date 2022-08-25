import React, { Component } from 'react';
import {Dimensions} from 'react-native';
//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import * as COMMON_CODES from '../../Constants/Codes';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');

import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';

export const apiObject = {

    // 페이징정보 조회 
    API_getCommonCode : async(url,token) => {
        //console.log('API_getPageList', url,token);
        let returnCode = {code:'9999'};
        await CommonUtil.callAPI( url,{
            method: 'GET', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'application/json; charset=UTF-8',
               }), 
            body: null
        },10000).then(response => {
            //console.log('getAPIData2', response);
            if ( !CommonUtil.isEmpty(response.data) ) {
                returnCode = {code:'0000',data:response.data}
            }else if ( response.statusCode == '401' && response.error == 'Unauthorized' ) {
                returnCode = {code:'4001'}
            }else{
                returnCode = {code:'9999',msg:response.message}
            }
        })
        .catch(err => {
            
        });        
        return returnCode;
    },


    //중복체크
    API_getDuplicateCheck : async(url,token) => {     
        let returnCode = {code:'9999'};
        await CommonUtil.callAPI( url,{
            method: 'GET', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'application/json; charset=UTF-8',
            }), 
            body: null
        },10000).then(response => {
            if ( !CommonUtil.isEmpty(response.error) ) {
                returnCode = {code:'9999',error :response.error,msg :  response.message}
            }else if ( response.statusCode == '401' && response.error == 'Unauthorized' ) {
                returnCode = {code:'4001'}
            }else{
                returnCode = {code:'0000',data:response}
                
            }
        })
        .catch(err => {
            
        });        
        return returnCode;
    },

    //중복체크
    API_getSendAuthCode : async(tel,centerId,token) => {     
        let returnCode = {code:'9999'};
        let url = DEFAULT_CONSTANTS.apiAdminDomain + '/admin/api/center/' + centerId + '/customer/message?nameOrPhone=' + tel;
        await CommonUtil.callAPI( url,{
            method: 'GET', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'application/json; charset=UTF-8',
            }), 
            body: null
        },10000).then(response => {
            if ( !CommonUtil.isEmpty(response.error) ) {
                returnCode = {code:'9999',error :response.error,msg :  response.message}
            }else if ( response.statusCode == '401' && response.error == 'Unauthorized' ) {
                returnCode = {code:'4001'}
            }else{
                returnCode = {code:'0000',data:response}
                
            }
        })
        .catch(err => {
            
        });        
        return returnCode;
    },
    //회원등록
    API_registMember : async(url,token,sendData) => {     
        let returnCode = {code:'9999'};
        //console.log('sendData', sendData);
        await CommonUtil.callAPI( url,{
            method: 'POST', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'application/json; charset=UTF-8'
            }), 
            body: JSON.stringify(sendData)
        },10000).then(response => {
            //console.log('API_registMember', response);
            returnCode = response
        })
        .catch(err => {
            
        });        
        return returnCode;
    },
    // 로그인 
    API_authLogin : async(url,sendData) => {        
        //console.log('url', url);
        let returnCode = {code:'9999'}; 
        await CommonUtil.callAPI( url,{
            method: 'POST', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'application/json; charset=UTF-8'
            }), 
            body: JSON.stringify(sendData)
        },5000).then(response => {
            //console.log('API_authLogin', response);
            returnCode = response;
        })
        .catch(err => {
            console.log('err', err);
        });        
        return returnCode;
    },

    // 페이징정보 조회 
    API_getPageList : async(props,url,token,sendData = null) => {
        let returnCode = {code:'9999'};
        await CommonUtil.callAPI( url,{
            method: 'GET', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'application/json; charset=UTF-8',
                'ApiKey' : token
            }), 
            body: null
        },10000).then(response => {
            if ( response.code === '1024') {
                let refreshCode = CommonUtil.refreshToken(props,token);
                if ( refreshCode.code === '0000') {
                    this.API_getPageList(url,refreshCode.apiToken);
                }else{
                    CommonUtil.resetLoginData(props);
                    return;
                }
            }else{
                returnCode = response
            }
        })
        .catch(err => {
            console.log('err', err);
        });        
        return returnCode;
    },

    // 기본상세조회 
    API_getDetailDefault : async(props,url,token) => {        
        let returnCode = {code:'9999'};
        await CommonUtil.callAPI( url,{
            method: 'GET', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'application/json; charset=UTF-8',
                'ApiKey' : token
            }), 
            body: null
        },10000).then(response => {
            if ( response.code === '1024') {
                let refreshCode = CommonUtil.refreshToken(props,token);
                if ( refreshCode.code === '0000') {
                    this.API_getDetailDefault(url,refreshCode.apiToken);
                }else{
                    CommonUtil.resetLoginData(props);
                    return;
                }
            }else{
                returnCode = response
            }
        })
        .catch(err => {
            
        });        
        return returnCode;
    },
   
    //공통등록
    API_registCommon : async(props,url,token,sendData) => {     
        let returnCode = {code:'9999'};
        await CommonUtil.callAPI( url,{
            method: 'POST', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'application/json; charset=UTF-8',
                'ApiKey' : token
            }), 
            body: JSON.stringify(sendData)
        },10000).then(response => {
            if ( response.code === '1024') {
                let refreshCode = CommonUtil.refreshToken(props,token);
                if ( refreshCode.code === '0000') {
                    this.API_registCommon(url,refreshCode.apiToken,sendData);
                }else{
                    CommonUtil.resetLoginData(props);
                    return;
                }
            }else{
                returnCode = response
            }
        })
        .catch(err => {
            
        });        
        return returnCode;
    },
    //공통수정
    API_updateCommon : async(props,url,token,sendData) => {     
        let returnCode = {code:'9999'};
        await CommonUtil.callAPI( url,{
            method: 'PUT', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'application/json; charset=UTF-8',
                'ApiKey' : token
            }), 
            body: JSON.stringify(sendData)
        },10000).then(response => {
            if ( response.code === '1024') {
                let refreshCode = CommonUtil.refreshToken(props,token);
                if ( refreshCode.code === '0000') {
                    this.API_updateCommon(url,refreshCode.apiToken,sendData);
                }else{
                    CommonUtil.resetLoginData(props);
                    return;
                }
            }else{
                returnCode = response
            }
        })
        .catch(err => {
            console.log('err', err);
        });        
        return returnCode;
    },
    //공통팻치
    API_patchCommon : async(props,url,token,sendData) => {     
        let returnCode = {code:'9999'};
        await CommonUtil.callAPI( url,{
            method: 'PATCH', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'application/json; charset=UTF-8',
                'ApiKey' : token
            }), 
            body: JSON.stringify(sendData)
        },10000).then(response => {
            if ( response.code === '1024') {
                let refreshCode = CommonUtil.refreshToken(props,token);
                if ( refreshCode.code === '0000') {
                    this.API_patchCommon(url,refreshCode.apiToken,sendData);
                }else{
                    CommonUtil.resetLoginData(props);
                    return;
                }
            }else{
                returnCode = response
            }
        })
        .catch(err => {
            
        });        
        return returnCode;
    },
    //공통삭제
    API_removeCommon : async(props,url,token,sendData) => {     
        let returnCode = {code:'9999'};
        await CommonUtil.callAPI( url,{
            method: 'DELETE', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'application/json; charset=UTF-8',
                'ApiKey' : token
            }), 
            body: CommonUtil.isEmpty(sendData) ? null : JSON.stringify(sendData)
        },10000).then(response => {
            //console.log('API_removeCommon',response);
            if ( response.code === '1024') {
                let refreshCode = CommonUtil.refreshToken(props,token);
                if ( refreshCode.code === '0000') {
                    this.API_removeCommon(url,refreshCode.apiToken,sendData);
                }else{
                    CommonUtil.resetLoginData(props);
                    return;
                }
            }else{
                returnCode = response
            }
        })
        .catch(err => {
            console.log('err', err);
        });        
        return returnCode;
    },

   
};

