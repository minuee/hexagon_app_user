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

const DefaultPaginate = 5;
class MyOrderListScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            moreLoading : true,
            showTopButton : false,
            totalCount : 0,
            orderList : [],
            ismore :  false,
            currentPage : 1,
        }
    }

    moreDataUpdate = async( baseData , addData) => {     
        let newArray = await baseData.concat(addData.data.orderList);  
        this.setState({            
            moreLoading : false,
            loading : false,
            orderList : newArray,
            ismore : parseInt(this.state.currentPage) < parseInt(addData.lastPage) ? true : false
        })
    }

    getBaseData = async(currentpage,morePage = false, isreload = false) => {
        this.setState({moreLoading : true});
        let wpaginate = isreload ? currentpage*DefaultPaginate : DefaultPaginate
        let returnCode = {code:9998};
        const member_pk = this.props.userToken.member_pk;
        try {            
            const url = DEFAULT_CONSTANTS.apiAdminDomain + '/v1/order/list/'+member_pk +'?page=' + currentpage + '&paginate='+wpaginate;
            //console.log('url',url) ;
            const token = this.props.userToken.apiToken;
            let sendData = null;
            returnCode = await apiObject.API_getPageList(this.props,url,token,sendData);          
            console.log('returnCode',returnCode.data.orderList[1]) ;
            if ( returnCode.code === '0000'  ) {
                this.setState({currentPage : returnCode.currentPage})
                if ( morePage ) {
                    this.moreDataUpdate(this.state.orderList,returnCode )
                }else{
                    this.setState({
                        totalCount : returnCode.total,
                        orderList : CommonUtil.isEmpty(returnCode.data.orderList) ? [] : returnCode.data.orderList,
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

        this.props.navigation.addListener('focus', (payload) => {
            this.getBaseData(this.state.currentPage,false,true);
        })
        
    }
    componentDidMount() {
        
    }


    handleOnScroll (event) {             
        if ( event.nativeEvent.contentOffset.y >= 150 ) {
            this.setState({showTopButton : true}) 
        }else{
            this.setState({showTopButton : false}) 
         }

        let paddingToBottom = 1;
        paddingToBottom += event.nativeEvent.layoutMeasurement.height;                            
        if (event.nativeEvent.contentOffset.y + paddingToBottom >= event.nativeEvent.contentSize.height) {            
            //this.scrollEndReach();
        }
    }

    scrollEndReach = () => {
        if ( this.state.moreLoading === false && this.state.ismore) {            
            this.setState({moreLoading : true})   
            setTimeout(
                () => {            
                    
                },500
            )
            
        }
    }

    upButtonHandler = () => {        
        this.ScrollView.scrollTo({ x: 0,  animated: true });
    };

    moveDetail = (item) => {
        this.props.navigation.navigate('OrderDetailStack',{
            screenTitle:item.order_no,
            screenData:item
        })
    }
    render() {
        if ( this.state.loading ) {
            return (
                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} /> 
            )
        }else {  
        return(
            <SafeAreaView style={ styles.container }>
                { this.state.showTopButton &&
                    <TouchableOpacity 
                        style={styles.fixedUpButton}
                        onPress={e => this.upButtonHandler()}
                    >
                        <Icon name="up" size={25} color="#000" />
                    </TouchableOpacity>
                }
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
                    onScrollEndDrag ={({nativeEvent}) => { 
                    }}
                    //style={{flex:1,width:SCREEN_WIDTH}}
                >
                   <View style={styles.termLineWrap} />  
                    {
                        this.state.orderList.length === 0 ?

                        <View style={styles.blankWrap}>
                            <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#838383'}}>구매이력이 없습니다.</CustomTextR>
                        </View>
                        :
                        this.state.orderList.map((item, index) => {  
                        return (
                            
                        <TouchableOpacity 
                            key={index}
                            onPress={()=>this.moveDetail(item)}
                        >
                            <View style={styles.boxSubWrap}>
                                <View style={styles.boxLeftWrap}>
                                    <View style={{flex:3}}>
                                        <CustomTextR style={styles.dataTitleText}>{item.order_no}</CustomTextR>                         
                                    </View>
                                    <View style={{flex:1,justifyContent:'center',alignItems:'flex-end'}}>
                                        <Image
                                            source={require('../../../assets/icons/btn_next.png')}
                                            resizeMode={"contain"}
                                            style={CommonStyle.defaultIconImage20}
                                        /> 
                                    </View>                                
                                </View>
                            </View>
                            <View style={{paddingVertical:15}}>
                                <View style={styles.dataSubWrap}>
                                    <View style={styles.detailLeftWrap}>
                                        <CustomTextR style={styles.menuTitleSubText}>상품명</CustomTextR>
                                    </View>
                                    <View style={styles.detailRightWrap}>
                                        { item.product.length > 1 ?
                                        <CustomTextR style={CommonStyle.dataText}>
                                           {item.product[0].product_name}외 {item.product.length-1}건
                                        </CustomTextR>  
                                        :
                                        <CustomTextR style={CommonStyle.dataText}>
                                           {item.product[0].product_name}
                                        </CustomTextR>  
                                        }
                                           
                                    </View>
                                </View>
                                <View style={styles.dataSubWrap}>
                                    <View style={styles.detailLeftWrap}>
                                        <CustomTextR style={styles.menuTitleSubText}>주문일시</CustomTextR>
                                    </View>
                                    <View style={styles.detailRightWrap}>
                                        <CustomTextR style={CommonStyle.dataText}>{CommonFunction.convertUnixToDate(item.reg_dt,"YYYY.MM.DD H:m")}</CustomTextR>     
                                    </View>
                                </View>
                                <View style={styles.dataSubWrap}>
                                    <View style={styles.detailLeftWrap}>
                                        <CustomTextR style={styles.menuTitleSubText}>결제금액</CustomTextR>
                                    </View>
                                    <View style={styles.detailRightWrap}>
                                        <TextRobotoB style={CommonStyle.dataText}>
                                            {CommonFunction.currencyFormat(item.total_amount)}원
                                        </TextRobotoB>     
                                    </View>
                                </View>
                                <View style={styles.dataSubWrap}>
                                    <View style={styles.detailLeftWrap}>
                                        <CustomTextR style={styles.menuTitleSubText}>주문상태</CustomTextR>
                                    </View>
                                    <View style={styles.detailRightWrap}>
                                        <CustomTextR style={CommonStyle.dataText}>
                                            {item.order_status_name}
                                            {
                                                (item.settle_type === 'vbank' && item.order_status === 'CANCEL_A' )
                                            && '(처리중)'
                                            }
                                        </CustomTextR>     
                                    </View>
                                </View>
                            </View>
                            <View style={styles.termLineWrap} />  
                        </TouchableOpacity>
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
                    <View style={CommonStyle.blankArea}></View>
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
    fixedUpButton : {
        position:'absolute',bottom:80,right:20,width:50,height:50,borderColor:'#ccc',borderWidth:1,borderRadius:25,alignItems:'center',justifyContent:'center',zIndex:10
    },
    blankWrap : {
        flex:1,    
        paddingTop:100,
        justifyContent:'center',
        alignItems:'center'
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
    dataSubWrap : {
        flex:1,
        flexDirection:'row',    
        flexGrow:1,    
        paddingHorizontal:20,paddingVertical:5,
        alignItems: 'center',        
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
    detailLeftWrap : {
        flex:1,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center'
    },
    detailRightWrap : {
        flex:3,        
        justifyContent:'center',
    },
    menuTitleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize25)
    },
    menuTitleText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),color:'#fff'
    },
    menuTitleSubText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#111'
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


export default connect(mapStateToProps,mapDispatchToProps)(MyOrderListScreen);