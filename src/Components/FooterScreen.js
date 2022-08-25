import React, {Component} from 'react';
import {StyleSheet, Text, View,PixelRatio,Dimensions, TouchableOpacity} from 'react-native';
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;

import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoM,TextRobotoB} from '../Components/CustomText';
import CommonUtil from '../Utils/CommonUtil';
import CommonFunction from '../Utils/CommonFunction';
import ToggleBox from '../Utils/ToggleBox';

export default class FooterScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contentHeight : 100,
        }
        
    } 
      
    UNSAFE_componentWillMount() {
        if ( !CommonUtil.isEmpty(this.props.contentHeight) ) {
            if ( this.props.contentHeight < 0 ) {
                this.setState({
                    contentHeight : 100
                })
            }else{
                this.setState({
                    contentHeight : this.props.contentHeight
                })    
            }
        }else{
            //this.setState({contentHeight : 50})
        }
    }

    moveDetail = (nav,item) => {
        this.props.screenProps.navigation.navigate(nav,{
            screenTitle:item
        })
    }

    render() {
        return (
            <View style={[styles.container,CommonUtil.isEmpty(this.state.contentHeight) ? null : {marginTop:this.state.contentHeight}]}>
                <View style={styles.tabTopWrap}>
                    <TouchableOpacity style={styles.tabWrap2} onPress={() => this.moveDetail('IntroduceStack','슈퍼바인더소개')}>
                        <TextRobotoB style={styles.titleText}>소개</TextRobotoB>
                    </TouchableOpacity>
                    <View style={styles.tabWrap} ><CustomTextL style={styles.titleText}>|</CustomTextL></View>
                    <TouchableOpacity style={styles.tabWrap} onPress={()=>this.moveDetail('UseYakwanStack','이용약관')}>
                        <TextRobotoB style={styles.titleText}>이용약관</TextRobotoB>
                    </TouchableOpacity>
                    <View style={styles.tabWrap} ><CustomTextL style={styles.titleText}>|</CustomTextL></View>
                    <TouchableOpacity style={styles.tabWrap} onPress={()=>this.moveDetail('PrivateYakwanStack','개인정보처리방침')}>
                        <TextRobotoB style={styles.titleText}>개인정보처리방침</TextRobotoB>
                    </TouchableOpacity>
                    <View style={styles.tabWrap} ><CustomTextL style={styles.titleText}>|</CustomTextL></View>
                    <TouchableOpacity style={styles.tabWrap} onPress={()=>this.moveDetail('RefundYakwanStack','환불약관')}>
                        <TextRobotoB style={styles.titleText}>환불약관</TextRobotoB>
                    </TouchableOpacity>
                </View>
                <View style={styles.tabBottomWrap}>
                    <ToggleBox 
                        label='사업자 정보' 
                        value=''             
                        arrowColor={'#555'}
                        style={styles.toggleBoxWrap}
                        titleContainer={styles.toggleContainer}
                        labelStyle={styles.labelStyle}
                        buttonImageStyle={styles.buttonImageStyle}
                        expanded={false}
                    >
                        <View>
                            <View style={styles.dataWrap}>
                                <View style={styles.dataLeftWrap}>
                                    <CustomTextM style={styles.infoText}>{DEFAULT_CONSTANTS.CompanyInfoTitle}</CustomTextM>
                                </View>
                            </View>
                            <View style={styles.dataWrap}>
                                <View style={styles.dataLeftWrap}>
                                    <CustomTextL style={styles.infoText}>사업자등록번호</CustomTextL>
                                </View>
                                <View style={styles.dataRightWrap}>
                                    <CustomTextM style={styles.infoText}>{DEFAULT_CONSTANTS.CompanyInfoRegistCode}</CustomTextM>
                                </View>
                            </View>
                            <View style={styles.dataWrap}>
                                <View style={styles.dataLeftWrap}>
                                    <CustomTextL style={styles.infoText}>통신판매업신고증</CustomTextL>
                                </View>
                                <View style={styles.dataRightWrap}>
                                    <CustomTextM style={styles.infoText}>{DEFAULT_CONSTANTS.CompanyInfoRegistCode2}</CustomTextM>
                                </View>
                            </View>
                            <View style={styles.dataWrap}>
                                <View style={styles.dataLeftWrap}>
                                    <CustomTextL style={styles.infoText}>대표이사</CustomTextL>
                                </View>
                                <View style={styles.dataRightWrap}>
                                    <CustomTextM style={styles.infoText}>{DEFAULT_CONSTANTS.CompanyInfoCEO}</CustomTextM>
                                </View>
                            </View>
                            <View style={styles.dataWrap}>
                                <View style={styles.dataLeftWrap}>
                                    <CustomTextL style={styles.infoText}>주소</CustomTextL>
                                </View>
                                <View style={styles.dataRightWrap}>
                                    <CustomTextM style={styles.infoText}>{DEFAULT_CONSTANTS.CompanyInfoAddress}</CustomTextM>
                                </View>
                            </View>
                            <View style={styles.dataWrap}>
                                <View style={styles.dataLeftWrap}>
                                    <CustomTextL style={styles.infoText}>대표번호</CustomTextL>
                                </View>
                                <View style={styles.dataRightWrap}>
                                    <CustomTextM style={styles.infoText}>{DEFAULT_CONSTANTS.CompanyInfoTel}</CustomTextM>
                                </View>
                            </View>
                            <View style={styles.dataWrap2}>
                                <View style={styles.dataLeftWrap}>
                                    <CustomTextL style={styles.infoText}>서비스제공에 대한 민원, 환불등은 "(주)헥사곤무역산업"에서 처리하며 모든 책임은 "(주)헥사곤무역산업"에 있습니다.</CustomTextL>
                                </View>     
                                <View style={styles.dataLeftWrap}>
                                    <CustomTextL style={styles.infoText}>민원담당자 : {DEFAULT_CONSTANTS.CompanyInfoCEO} {DEFAULT_CONSTANTS.CompanyInfoTel}</CustomTextL>
                                </View>                            
                            </View>
                        </View>
                    </ToggleBox>
                </View>
                
               
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'#f5faff',
        justifyContent: 'center',
        paddingTop:20
    },
    tabTopWrap : {
        flex:1,
        flexGrow:1,
        backgroundColor:'#f5faff',
        flexDirection:'row',
        paddingVertical:10,
        paddingHorizontal:20
    },
    tabBottomWrap : {
        flex:1,paddingHorizontal:5
    },
    tabWrap : {
        justifyContent:'center',alignItems:'center',paddingHorizontal:5
    },
    tabWrap2 : {
        justifyContent:'center',alignItems:'center',paddingRight:5
    },

    titleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),color:'#707070'
    },
    dataWrap : {
        flex:1,flexDirection:'row',paddingHorizontal:5,paddingVertical:2,justifyContent:'center'
    },
    dataWrap2 : {
        flex:1,paddingHorizontal:5,paddingVertical:2,justifyContent:'center',marginTop:20
    },
    dataLeftWrap : {
        flex :1,justifyContent:'center'
    },
    dataRightWrap : {
        flex :2,justifyContent:'center'
    },
    linkWrap : {
        flex:1,
        backgroundColor :'transparent',
        flexDirection :'row',
        paddingVertical:10,
        marginBottom:20,
        zIndex:100
    },
    linkText : {
        color:'#fff',
        fontSize:15
    },
    infoText :  {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),color:'#555'
    },
    paddingh5 : {
        paddingHorizontal : 5
    },
    toggleBoxWrap : {
       borderBottomWidth: 0,paddingHorizontal:10
    },
    toggleContainer : {
        flexDirection: 'row',
        flexGrow:1,
        paddingHorizontal: 5,
        alignItems: 'center',
    },
    labelStyle  :{
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),
        color:'#707070'
    },
    buttonImageStyle : {
        width:30
    }
});