import React, { Component } from 'react';
import {SafeAreaView,TouchableOpacity,View,StyleSheet,BackHandler,Dimensions,Image,PixelRatio,Platform} from 'react-native';
import AppIntroSlider from './AppIntroSlider.js';
import {connect} from 'react-redux';
import ActionCreator from '../Ducks/Actions/MainActions';

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR, CustomTextL, CustomTextM, TextRobotoM,TextRobotoR} from '../Components/CustomText';
import CommonFunction from '../Utils/CommonFunction';
import CommonUtil from '../Utils/CommonUtil';

class IntroduceApp extends React.Component {

    constructor(props) {        
        super(props);      
        
        this.state = {
           firstSlide : 0,
           loginData : {}
        }
    }

    nonUserLogin = async(mode) => {
        if ( mode === 'A') {
            await this.props._saveNonUserToken({
                uuid : this.props.screenState.thisUUID
            });
        }
        setTimeout(() => {
            this.props.screenState._onDone();
        }, 500);
    }


    _renderItem = ({ item }) => {
        if ( item.key === 's1') {
            return (
                <View style={{backgroundColor: item.backgroundColor,width:SCREEN_WIDTH,height:SCREEN_HEIGHT}}>
                    <View style={{flex:1,paddingHorizontal:50,justifyContent:'center',alignItems:'center'}}>
                        <Image
                            style={{aspectRatio: 1,height:200}}
                            //style={{height:SCREEN_HEIGHT/2-20,aspectRatio: 1}}
                            source={item.image} 
                            resizeMode='contain'
                        />
                    </View>                
                    <View style={{flex:1,paddingTop:40,paddingHorizontal:30,justifyContent:'flex-start',alignItems:'center'}}>                        
                        <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize25),color:DEFAULT_COLOR.base_color}}>{item.mainTitle}</CustomTextM>                       
                        <CustomTextL style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20),color:'#363636'}}>{item.subTitle}</CustomTextL>                       
                    </View>
                    
                </View>
            );
        }else if ( item.key === 's6') {
            return (
                <View style={{backgroundColor: item.backgroundColor,width:SCREEN_WIDTH,height:SCREEN_HEIGHT}}>
                    <View style={{flex:1,paddingHorizontal:50,justifyContent:'center',alignItems:'center'}}>
                        <Image
                            style={{aspectRatio: 1,height:200}}
                            //style={{height:SCREEN_HEIGHT/2-20,aspectRatio: 1}}
                            source={item.image} 
                            resizeMode='contain'
                        />
                    </View>                
                    <View style={{flex:1,paddingTop:40,paddingHorizontal:30,justifyContent:'flex-start',alignItems:'center'}}>                        
                        <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20),color:'#363636'}}>{item.mainTitle}</CustomTextM>  
                        <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20),color:DEFAULT_COLOR.base_color}}></CustomTextM>                       
                        <CustomTextL style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize17),color:'#363636'}}>{item.subTitle}</CustomTextL>                
                    </View>
                    
                </View>
            );
        }else{
            return (
                <View style={{backgroundColor: item.backgroundColor,width:SCREEN_WIDTH,height:SCREEN_HEIGHT}}>
                    <View style={{flex:1}}>
                        <Image
                            //style={{width: SCREEN_WIDTH-50}}
                            style={{height:SCREEN_HEIGHT/2-20,aspectRatio: 1}}
                            source={item.image} 
                            resizeMode='contain'
                        />
                    </View>                
                    <View style={{flex:1,paddingTop:40,paddingHorizontal:30}}>
                        <View>
                            <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize25),color:DEFAULT_COLOR.base_color}}>{item.mainTitle}</CustomTextM>
                        </View>
                        <View style={{marginTop:20}}>
                            <CustomTextL style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20),color:'#363636'}}>{item.subTitle}</CustomTextL>
                        </View>
                    </View>
                    
                </View>
            );
        }
        
    };

    
    
    render() {
      
        return (
            <View style={ styles.container }>
               
                <AppIntroSlider
                    slides={slides}                    
                    renderItem={this._renderItem}
                    onDone={this._onDone}
                    showSkipButton={false}
                    onSkip={this._onSkip}                    
                    dotStyle={{backgroundColor: '#ccc'}}
                    activeDotStyle={{backgroundColor: DEFAULT_COLOR.base_color}}
                    paginationStyle={{backgroundColor:'#fff'}}
                    buttonTextStyle={{color:DEFAULT_COLOR.base_color,fontWeight:'bold'}}
                    //skipLabel=""
                    doneLabel=""
                    prevLabel="     이전"
                    nextLabel="다음"
                   
                />
            </View>
        )
        
    }

}


const slides = [    
    {
        key: 's1',
        text: '',
        title: '',
        type : 'require',
        image: require('../../assets/icons/logo.png'),
        backgroundColor: '#fff',
        mainTitle : 'Super Binder',
        subTitle : '방문을 환영합니다.'
    },
    {
        key: 's2',
        text: '',
        title: '',
        type : 'require',
        image: require('../../assets/images/introduce_2.png'),
        backgroundColor: '#fff',
        mainTitle : '우수 제품 입점',
        subTitle : '고급브랜드 및 선별된 우수한 제품을 사장님 매장에 입점해 보세요.'
        
    },
    {
        key: 's3',
        text: '',
        title: '',
        type : 'require',
        image: require('../../assets/images/introduce_3.png'),
        backgroundColor: '#fff',
        mainTitle : '재고부담 NO',
        subTitle : '소량도 간단한 주문으로 큰 재고부담 없이 제품을 사입해보세요'
    },
    {
        key: 's4',
        text: '',
        title: '',
        type : 'require',
        image: require('../../assets/images/introduce_4.png'),
        backgroundColor: '#fff',
        mainTitle : '높은 수익성',
        subTitle : '리워드와 구간별 할인율을 적용하여 수익성을 높여드립니다.'
    },
    {
        key: 's5',
        text: '',
        title: '',
        type : 'require',
        image: require('../../assets/images/introduce_5.png'),
        backgroundColor: '#fff',
        mainTitle : '철저한 후속관리',
        subTitle : '철저한 후속관리로 재고부담은 낮추고 판매율은 높여드립니다.'
    },
    {
        key: 's6',
        text: '',
        title: '',
        type : 'require',
        image: require('../../assets/icons/logo.png'),
        backgroundColor: '#fff',
        mainTitle : '입점 및 제휴 문의',
        subTitle : '대표번호 : 02-545-8509 \n이메일 : ask_any_q@hexagonti.com'
    },
    
];


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonWrapOn2 : {
        backgroundColor:DEFAULT_COLOR.base_color,justifyContent:'center',alignItems:'center',borderRadius:30,borderWidth:0,borderColor:DEFAULT_COLOR.base_color,paddingVertical:5
    },
    buttonWrapOn : {
        width:SCREEN_WIDTH-100,backgroundColor:DEFAULT_COLOR.base_color,paddingVertical:10,marginHorizontal:15,marginTop:50,justifyContent:'center',alignItems:'center',borderRadius:25,borderWidth:1,borderColor:DEFAULT_COLOR.base_color
    },
});



function mapStateToProps(state) {
    return {
        userNonToken : state.GlabalStatus.userNonToken,
    };
}

function mapDispatchToProps(dispatch) {
    return {        
        _saveNonUserToken:(str)=> {
            dispatch(ActionCreator.saveNonUserToken(str))
        }
    };
}


export default connect(mapStateToProps,mapDispatchToProps)(IntroduceApp);