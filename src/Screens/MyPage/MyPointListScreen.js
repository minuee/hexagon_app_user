import React, { Component } from 'react';
import {SafeAreaView,ScrollView,View,StyleSheet,Alert,Dimensions,RefreshControl, PixelRatio,Image,TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonStyle from '../../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoB,TextRobotoM,TextRobotoR} from '../../Components/CustomText';
import CommonUtil from '../../Utils/CommonUtil';
import CommonFunction from '../../Utils/CommonFunction';
import Loader from '../../Utils/Loader';
import { apiObject } from "../Apis";
const mockData1  = [
    {id : 1, date : '2020.11.11' ,title : '주문 20201101-D12345 0.5% 적립', type : '+' , point : 198},
    {id : 2, date : '2020.11.11', title : '주문 20201101-D12345 사용', type : '-' , point : 98},
    {id : 3, date : '2020.11.19', title : '적립금 소멸', type : '-' , point : 298},
    {id : 4, date : '2020.11.19', title : '주문 20201101-D12347 0.5% 적립', type : '+' , point : 398}
]
const DefaultPaginate = 10;
class MyPointListScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            showTopButton :false,
            totalCount : 0,
            totalReward : 0,
            demiseExpected : [],
            myRewardList : [],
            ismore :  false,
            currentPage : 1,
        }
    }

    moreDataUpdate = async( baseData , addData) => {     
        let newArray = await baseData.concat(addData.data.userRewardHistory);  
        this.setState({            
            moreLoading : false,
            loading : false,
            myRewardList : newArray,
            ismore : parseInt(this.state.currentPage) < parseInt(addData.lastPage) ? true : false
        })
    }

    getBaseData = async(currentpage,morePage = false) => {

        this.setState({moreLoading : true})
        let returnCode = {code:9998};
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/cms/member/reward/list/'+this.props.userToken.member_pk + '?page=' + currentpage + '&paginate='+DefaultPaginate;
            const token = this.props.userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_getPageList(this.props,url,token,sendData);          
            //console.log('ereturnCode',returnCode) 
            if ( returnCode.code === '0000'  ) {
                this.setState({currentPage : returnCode.currentPage})
                if ( morePage ) {
                    this.moreDataUpdate(this.state.myRewardList,returnCode )
                }else{
                    this.setState({
                        totalCount : returnCode.total,
                        totalReward :  returnCode.data.totalReward,
                        myRewardList : CommonUtil.isEmpty(returnCode.data.userRewardHistory) ? [] : returnCode.data.userRewardHistory,
                        ismore : parseInt(this.state.currentPage)  < parseInt(returnCode.lastPage) ? true : false
                    })
                }
            }else{
                CommonFunction.fn_call_toast('처리중 오류가 발생하였습니다.',2000);
            }

            this.setState({moreLoading:false,loading:false})
        }catch(e){
            console.log('e',e) 
            this.setState({loading:false,moreLoading : false})
        }
       
    }

    async UNSAFE_componentWillMount() {

        if ( !CommonUtil.isEmpty(this.props.userToken)) {
            this.setState({
                member_pk :  this.props.userToken.member_pk
            })
            await this.getBaseData(1,false);
        }else{
            CommonFunction.fn_call_toast('잘못된 접근입니다..',2000);
            this.props.navigation.goBack(null)
        }

        this.props.navigation.addListener('focus', () => {        
        })
    }

    componentDidMount() {
        
    }


    moveDetail = (item) => {
        if ( item.order_pk > 0 ) {
            this.props.navigation.navigate('OrderDetailStack',{
                screenTitle:item.order_no,
                screenData:item
            })
        }
    }

    render() {
        if ( this.state.loading ) {
            return (
                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} /> 
            )
        }else {  
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
                >
                    <View style={styles.termLineWrap} />  
                    <View style={styles.boxSubWrap}>
                        <View style={styles.boxCenterWrap}>
                            <CustomTextR style={styles.dataTitleText2}>적립금 현황</CustomTextR>
                            <CustomTextR />
                            <TextRobotoB style={styles.menuTitleText20}>{CommonFunction.currencyFormat(this.state.totalReward)}원</TextRobotoB>
                        </View>
                    </View>
                    <View style={styles.termLineWrap} />  
                    {this.state.demiseExpected.length > 0 &&
                    <View>
                        <View style={styles.boxSubWrap}>
                            <View style={styles.boxLeftWrap}>
                                <View style={{flex:1}}>
                                    <CustomTextR style={styles.dataTitleText2}>소멸 예정 적립금</CustomTextR>   
                                </View>
                                { this.state.demiseExpected.map((item, index) => {  
                                    return (
                                    <View style={{flex:1}}>
                                        <TextRobotoR style={styles.menuTitleText}>
                                            {CommonFunction.currencyFormat(item.reward)}원 ( {CommonFunction.convertUnixToDate(item.end_dt,"YYYY.MM.DD 23:59")} 예정 )
                                        </TextRobotoR>                      
                                    </View>
                                    )
                                })
                                }
                            </View>
                        </View>
                        <View style={styles.termLineWrap} />  
                    </View>
                    }
                    {
                        this.state.myRewardList.length === 0 ?

                        <View style={CommonStyle.blankWrap}>
                            <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#838383'}}>이력이 없습니다.</CustomTextR>
                        </View>
                        :
                        this.state.myRewardList.map((item, index) => {  
                        return (
                        <View style={styles.boxSubWrap} key={index}>
                            <View style={styles.boxLeftWrap}>
                                <View style={{flex:2.5}}>
                                    <CustomTextR style={styles.dataTitleText2}>{CommonFunction.convertUnixToDate(item.reg_dt,"YYYY.MM.DD H:m")}</CustomTextR>   
                                    { item.reward_gubun === 'm'  && item.order_pk > 0 ?
                                    <CustomTextR style={styles.dataTitleText}>주문포인트 사용</CustomTextR>
                                    :
                                    <CustomTextR style={styles.dataTitleText}>{item.content}</CustomTextR>       
                                    }                  
                                </View>
                                <TouchableOpacity 
                                    style={{flex:1,flexDirection:'row',flexGrow:1,justifyContent:'flex-end'}}
                                    onPress={()=>this.moveDetail(item)}
                                >
                                    <TextRobotoR style={styles.dataTitleText}>{item.reward_gubun === 'p' ? '+' : '-'}{CommonFunction.currencyFormat(item.reward_point)}원</TextRobotoR>
                                    
                                    
                                        <Image
                                            source={require('../../../assets/icons/btn_next.png')}
                                            resizeMode={"contain"}
                                            style={CommonStyle.defaultIconImage20}
                                        /> 
                                    
                                    
                                </TouchableOpacity>
                            
                            </View>
                        </View>
                        )
                    })
                    }    
                    {
                    this.state.ismore &&
                        <View style={CommonStyle.moreButtonWrap}>
                            <TouchableOpacity 
                                onPress={() => this.getBaseData(this.state.currentPage+1,true)}
                                style={CommonStyle.moreButton}
                            >
                            <CustomTextL style={CommonStyle.moreText}>더보기</CustomTextL>
                            </TouchableOpacity>
                        </View>
                    }
                    <View style={[CommonStyle.blankArea,{backgroundColor:'#f7f7f7'}]}></View>
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
    boxCenterWrap : {
        flex:1,
        justifyContent:'center',
        alignItems:'center'
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
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize25)
    },
    menuTitleText20 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize25)
    },
    menuTitleText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#fff'
    },
    menuTitleSubText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#666'
    },
    dataTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)
    },
    dataTitleText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#666'
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


export default connect(mapStateToProps,mapDispatchToProps)(MyPointListScreen);