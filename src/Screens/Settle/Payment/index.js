import React from 'react';
import { Platform,BackHandler,Alert} from 'react-native';
import IMP from 'iamport-react-native';
import {connect} from 'react-redux';
import Loading from '../Loading';
import { getUserCode } from '../utils';
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
import CommonFuncion from '../../../Utils/CommonFunction'
import CommonUtil from '../../../Utils/CommonUtil';
import Loader from '../../../Utils/Loader';

class PaymentScreen extends React.Component {
    constructor(props) {
        super(props);     
        this.state = {
            loading : true,
            pg : null,
            resultScreen : 'PaymentResultStack',
            data : null
        }
    }

    async UNSAFE_componentWillMount() {   
        //console.log('PaymentScreen')
        if ( CommonUtil.isEmpty(this.props.extraData)){
        
            CommonFunction.fn_call_toast('잘못된 경로로 접근하였습니다',1500)
            setTimeout(() => {                
                this.props.navigation.goBack(null)
            }, 1000)
        }else{
            const data = {
                ...this.props.extraData.params,
                app_scheme: Platform.OS === 'android' ? DEFAULT_CONSTANTS.androidPackageName : DEFAULT_CONSTANTS.iosBundleId,
              };
            await this.setState({
                pg : this.props.extraData.params.pg,
                resultScreen : this.props.extraData.params.resultScreen,
                data : data,
                loading:false
            })
        }
    }

    componentDidMount () {    
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);          
    }
    handleBackButton = () => true
    //handleBackButton = () => {
        //return false;
        /*
        Alert.alert(
            DEFAULT_CONSTANTS.appName,
            '결제진행을 취소하시겠습니까?',
            [
                {text: '네', onPress: () => this.cancleSettle()},
                {text: '아니오', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: true},
        );
        */
    //};

    cancleSettle =  async() => {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);           
        this.props.navigation.goBack();                
        return true;
    }
    render() {
        if ( this.state.loading ) {
            return (
                <Loader screenState={{isLoading:this.state.loading,color:DEFAULT_COLOR.base_color}} /> 
            )
        }else{
            return (
                <IMP.Payment
                    userCode={getUserCode(this.state.pg)}
                    loading={<Loading />}
                    data={this.state.data}
                    callback={response => this.props.navigation.replace(this.state.resultScreen, { response, 'settleData' : this.state.data })}
                />
            )
        }
    }

}


function mapStateToProps(state) {
    return {
        userToken: state.GlabalStatus.userToken,
    };
}

export default connect(mapStateToProps, null)(PaymentScreen);

/*

export default function Payment({ navigation,extraData }) {

  //console.log('Payment route333',extraData.params )
  
  const params = extraData.params;//navigation.getParam('params');
  const { pg } = params;
  const resultScreen = params.resultScreen ? params.resultScreen : 'PaymentResultStack'
  const data = {
    ...params,
    app_scheme: Platform.OS === 'android' ? COMMON_STATES.androidPackageName : COMMON_STATES.iosBundleId,
  };
  
  //console.log('Payment/index.js', 'data = ' + JSON.stringify(data))
  return (
    <IMP.Payment
      userCode={getUserCode(pg)}
      loading={<Loading />}
      data={data}
      callback={response => navigation.replace(resultScreen, { response, 'settleData' : data })}
    />
  );   
}

*/