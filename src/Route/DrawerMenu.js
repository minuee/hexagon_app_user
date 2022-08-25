import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Text,PixelRatio,Dimensions,TouchableOpacity} from 'react-native';

//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from '../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR} from '../Components/CustomText';


export default  class DrawerMenu extends Component {
    constructor(props) {
        super(props);
    }

    moveRoute = (nav,title) => {
        
        if ( nav === 'Schedule') {
            this.props.screenProps.navigation.navigate('Tabs02Stack');             
        }else{
            this.props.navigation.navigate(nav,{
                screenTitle:title
            })
            this.props.navigation.closeDrawer();
        }
    }

    render() {
        return(
            <View style={ styles.container }>
                <ScrollView>
                    <View style={[styles.headWrap,{backgroundColor:'#3b4c7a'}]}>
                        <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),color:'#fff'}}>MENU</CustomTextM>
                    </View>
                    <TouchableOpacity 
                        onPress={()=>this.moveRoute('Schedule','스케쥴')}
                        style={[styles.menuWrap]}
                    >
                        <CustomTextR style={styles.menuText}>스케쥴</CustomTextR>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={()=>this.moveRoute('MemberListStack','회원관리')}
                        style={[styles.menuWrap]}>
                        <CustomTextR style={styles.menuText}>회원관리</CustomTextR>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={()=>this.moveRoute('LessonListStack','수업관리')}
                        style={[styles.menuWrap]}>
                        <CustomTextR style={styles.menuText}>수업관리</CustomTextR>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={()=>this.moveRoute('LessonAdjustStack','수업 및 정산')}
                        style={[styles.menuWrap]}>
                        <CustomTextR style={styles.menuText}>수업 및 정산</CustomTextR>
                    </TouchableOpacity>        
                    <TouchableOpacity 
                        onPress={()=>this.moveRoute('MonthAdjustStack','월별정산')}
                        style={[styles.menuWrap]}>
                        <CustomTextR style={styles.menuText}>월별정산</CustomTextR>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={()=>this.moveRoute('WorkTranStack','업무전달')}
                        style={[styles.menuWrap]}>
                        <CustomTextR style={styles.menuText}>업무전달</CustomTextR>
                    </TouchableOpacity>                    
                    <View style={[styles.menuWrap]}>
                        <CustomTextR style={styles.menuText}>마이페이지</CustomTextR>
                    </View>
                    <TouchableOpacity 
                        onPress={()=>this.moveRoute('MyStudentStack','담당회원확인')}
                        style={[styles.menuWrap2]}>
                        <CustomTextR style={styles.menuText}>담당회원확인</CustomTextR>
                    </TouchableOpacity>  
                    <TouchableOpacity 
                        onPress={()=>this.moveRoute('MyReservationStack','예약/취소 내역')}
                        style={[styles.menuWrap2]}>
                        <CustomTextR style={styles.menuText}>예약/취소 내역</CustomTextR>
                    </TouchableOpacity>  
                    <TouchableOpacity 
                        onPress={()=>this.moveRoute('MyInformationStack','개인정보 설정')}
                        style={[styles.menuWrap2]}>
                        <CustomTextR style={styles.menuText}>개인정보 설정</CustomTextR>
                    </TouchableOpacity>   
                    <TouchableOpacity 
                        onPress={()=>this.moveRoute('MySalaryStack','인사정보')}
                        style={[styles.menuWrap2]}>
                        <CustomTextR style={styles.menuText}>인사정보</CustomTextR>
                    </TouchableOpacity>                    
                </ScrollView>
            </View>
        );
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headWrap : {
        flex:1,
        paddingVertical:15,
        justifyContent:'center',
        alignItems:'center'
    },
    menuWrap : {
        flex:1,
        paddingVertical:15,
        paddingLeft:15,
        justifyContent:'center',
        alignItems:'flex-start',
        borderBottomColor:'#c5c5c5',
        borderBottomWidth:1,
        backgroundColor:'#f6f7fc'
    },
    menuWrap2 : {
        flex:1,
        paddingVertical:15,
        paddingLeft:25,
        justifyContent:'center',
        alignItems:'flex-start',
        borderBottomColor:'#c5c5c5',
        borderBottomWidth:1,
        backgroundColor:'#e4fafe'
    },
    menuText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),color:'#000'
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