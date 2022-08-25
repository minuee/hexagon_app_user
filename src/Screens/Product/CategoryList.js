import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Text,Dimensions,RefreshControl, PixelRatio,Image,TouchableOpacity, Platform,Animated} from 'react-native';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import Modal from 'react-native-modal';
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

const mockData1 = [
    { id: 1, icon : require('../../../assets/images/arix_ic.png'),name : '아릭스'},
    { id: 2, icon : require('../../../assets/images/cleanlogic_ic.png'),name : '클릭로직'},
    { id: 3, icon : require('../../../assets/images/dri_pak_ic.png'),name : '드라이팍'},
    { id: 4, icon : require('../../../assets/images/la_corona_ic.png'),name : '라코로나'},
    { id: 5, icon : require('../../../assets/images/tonkita_ic.png'),name : '톤키타'},
   
]

class CategoryList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : false,
            togglecategory : this.props.togglecategory,
        }
    }

    UNSAFE_componentWillMount() {
      
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

    moveDetail = (item) => {
        this.props.navigation.navigate('ProductListStack',{
            screenData:item
        })
    }

    moveCategory = () => {
        this.props._fn_ToggleCategory(false);
        this.props.navigation.navigate('CategoryListModifyStack')
    }

    addSchedule = () => {
        //CommonFunction.fn_call_toast('준비중입니다.',2000);
        this.props.navigation.navigate('CategoryRegistStack');
    }

    animatedHeight = new Animated.Value(SCREEN_HEIGHT * 0.1);
    
    closeModalInforation = () => {
        this.props._fn_ToggleCategory(false)
    };

    render() {
        return(
            <SafeAreaView style={ styles.container }>
                
                <TouchableOpacity 
                    style={styles.fixedUpButton}
                    onPress={e => this.addSchedule()}
                >
                    <CustomTextL style={{color:'#fff',fontSize:PixelRatio.roundToNearestPixel(35)}}>+</CustomTextL>
                </TouchableOpacity>
                
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
                        <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)}}>카테고리</CustomTextM>
                        
                    </View> 
                    {
                        mockData1.map((item, index) => {  
                            return (
                                <View key={index} style={{backgroundColor:'#fff'}}>
                                    <TouchableOpacity style={styles.boxSubWrap} onPress={()=>this.moveDetail(item)}>
                                        <View style={styles.boxLeftWrap}>
                                            <Image
                                                source={item.icon}
                                                resizeMode={"contain"}
                                                style={{width:PixelRatio.roundToNearestPixel(25),height:PixelRatio.roundToNearestPixel(25)}}
                                            />
                                            <CustomTextR style={[styles.menuTitleText,{paddingLeft:20}]}>{item.name}</CustomTextR>
                                        </View>
                                        <View style={styles.boxRightWrap}>
                                            <Image
                                                source={require('../../../assets/icons/btn_next.png')}
                                                resizeMode={"contain"}
                                                style={{width:PixelRatio.roundToNearestPixel(20),height:PixelRatio.roundToNearestPixel(20)}}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )
                        })
                    } 

                </ScrollView>    
                {/** 인포메이션 모달 **/}
                <Modal
                    onBackdropPress={this.closeModalInforation}
                    animationType="slide"
                    //transparent={true}
                    onRequestClose={() => {
                        this.props._fn_ToggleCategory(false)
                    }}                        
                    style={{justifyContent: 'flex-end',margin: 0}}
                    useNativeDriver={true}
                    animationInTiming={300}
                    animationOutTiming={300}
                    hideModalContentWhileAnimating                    
                    isVisible={this.props.togglecategory}
                >
                    <Animated.View style={[styles.modalContainer,{ height: this.animatedHeight }]}>
                        <View style={styles.modalContainer}>                            
                            <TouchableOpacity 
                                onPress={()=>this.moveCategory()}
                                style={{paddingHorizontal:20,paddingVertical:15}}
                            >
                                <CustomTextR style={styles.termText4}>카테고리 목록 수정</CustomTextR>
                            </TouchableOpacity>
                        
                        </View>
                    </Animated.View>
                </Modal>              
            </SafeAreaView>
        );
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
    boxWrap : {
        flex:1,
        flexDirection:'row',    
        flexGrow:1,    
        padding:20,
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
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),paddingRight:10
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
        togglecategory : state.GlabalStatus.togglecategory
    };
}

function mapDispatchToProps(dispatch) {
    return {                
        _fn_ToggleCategory:(bool)=> {
            dispatch(ActionCreator.fn_ToggleCategory(bool))
        }
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(CategoryList);