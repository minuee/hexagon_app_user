import React, { Component } from 'react';
import {ScrollView,View,StyleSheet,Dimensions,PixelRatio,BackHandler} from 'react-native';

//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import {CustomTextR,CustomTextL, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR} from '../../Components/CustomText';
import Loader from '../../Utils/Loader';

export default class PrivateYakwanScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading : true
        }
    }

    UNSAFE_componentWillMount() {
      
    }

    componentDidMount() {
        //BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        setTimeout(
            () => {            
                this.setState({loading:false})
            },500
        )
    }
    componentWillUnmount(){
        //BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);          
    }

    handleBackButton = () => {        
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);  
        this.props.navigation.goBack(null);                
        return true;
    };
   
    render() {
        if ( this.state.loading ) {
            return (
                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} /> 
            )
        }else {        
            return(
                <View style={ styles.container }>
                    
                    <View style={{backgroundColor:'#fff',height:20}} />
                        <View style={{marginVertical:15,marginHorizontal:15,borderWidth:1,borderColor:'#ccc',height:SCREEN_HEIGHT*0.8,padding:10}}>
                            <ScrollView
                                ref={(ref) => {
                                    this.ScrollView = ref;
                                }}
                                showsVerticalScrollIndicator={false}
                                indicatorStyle={'white'}
                                scrollEventThrottle={16}
                                keyboardDismissMode={'on-drag'}
                                style={{width:'100%'}}
                            >
                            
                            <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),color:'#808080'}}>
                            ㈜헥사곤무역산업(이하”회사”는) 아래와 같이 환불 및 유의사항을 수립ㆍ공개합니다.{"\n"}{"\n"}

                            주문(발주)취소 및 환불규정{"\n"}{"\n"}

1. 주문(발주) 후 납품(배송) 전 주문취소 시 전액 환불{"\n"}{"\n"}

2. 납품(배송) 지연(도서산간지역을 제외 영업일 기준 7일 이내) 또는 본사 귀책으로 인한 처리 불능 시 전액 환불
*당사의 고의 또는 과실 없이 천재지변, 운송업체의 파업, 휴업등으로 납품(배송)이 지연 될 시 협의를 통한 기간 조정 요청{"\n"}{"\n"}

3. 납품(배송) 전 부분취소는 불가하며 전체취소 후 재주문(재발주) 요청{"\n"}{"\n"}

4. 납품(진열) 후 반품 및 교환에 대한 사항{"\n"}
- 납품 된 제품의 하자가 없을 시 반품 또는 교환 절차를 통하여 환불 또는 상계처리 (상황에 따라 본사와 협의){"\n"}
- 납품 후 제품의 파손 및 분실에 대하여 해당 제품에 대한 환불(반품) 및 교환 불가{"\n"}
- 악의적 단순변심은 반품 및 교환 불가{"\n"}{"\n"}

5. 할인율 적용, 리워드 적립, 등급조정에 관한 사항{"\n"}
- 전체 취소 시 리워드 적립, 등급조정은 주문(발주) 전 상태로 회기 처리 됨{"\n"}
- 납품 후 부분 반품 및 교환 시 할인율 적용, 리워드 적립, 등급조정은 재계산되어 적용{"\n"}{"\n"}

6. 오배송(납품), 제품수량 미달 또는 초과 시 당사의 정정책임 원칙에 따라 처리{"\n"}
                            </CustomTextR>
                            </ScrollView>
                        </View>
                   
                </View>
            );
        }
    }
}



const styles = StyleSheet.create({
    container: {  
        flex:1,            
        backgroundColor : "#fff",
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
