import React from 'react';
import {TouchableHighlight,Image,View,TouchableOpacity,PixelRatio,Dimensions,Platform,Alert} from 'react-native';
import {createStackNavigator, HeaderTitle} from '@react-navigation/stack';
import {useSelector,useDispatch} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';

const Stack = createStackNavigator();
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
const BACK_BUTTON_IMAGE = require('../../../assets/icons/back_icon.png');
const LOGO_IMAGE = require('../../../assets/icons/logo.png');
const USER_IMAGE_OFF = require('../../../assets/icons/icon_joinus.png');
const USER_IMAGE_ON = require('../../../assets/icons/icon_user_on.png');
const CART_IMAGE = require('../../../assets/icons/icon_cart2.png');
import IntroScreen from './IntroScreen'; 
import CommonMyShop from '../CommonMyShop';
const Tabs04Stack = ({navigation,route}) => {
    const dispatch = useDispatch();
    const reduxData = useSelector(state => state);
    const {userToken,userCartCount} = reduxData.GlabalStatus;

    const loginAlert = async() => {
       
        let alertTitle = DEFAULT_CONSTANTS.appName;
        let alertMessage = '회원가입을 하시겠습니까?';
        let alertbuttons = [
            {text: '확인', onPress: () => console.log(1)},
            {text: '취소', onPress: () => console.log(2)},
        ]
        let returnCode = await CommonFunction.showAsyncAlert(alertTitle, alertMessage, alertbuttons)

        if (returnCode === 0) {
            await dispatch(ActionCreator.saveNonUserToken({}));
            setTimeout(() => {
                navigation.popToTop();
            }, 500);
        } else {
            console.log('option else')
        }
    }
    return (
      <Stack.Navigator 
        initialRouteName="IntroScreen" 
        screenOptions={{          
            
            headerLeft : () => (
                    <TouchableHighlight 
                        underlayColor="transparent"
                        onPress={()=> CommonUtil.isEmpty(userToken) ? loginAlert() : null}
                        hitSlop={{left:10,right:10,bottom:10,top:10}}
                        style={CommonStyle.subHeaderLeftWrap}
                    >
                    <Image
                        source={CommonUtil.isEmpty(userToken) ? USER_IMAGE_OFF : USER_IMAGE_ON}
                        resizeMode={"contain"}
                        style={CommonUtil.isEmpty(userToken) ? CommonStyle.leftEmptyIcon : CommonStyle.LeftLoginIcon }
                    />
                </TouchableHighlight>
            ),                     
            headerTitle : () => (
                <TouchableHighlight 
                    underlayColor="transparent"
                    style={CommonStyle.subHeaderCenterWrap} 
                    onPress={()=>navigation.navigate('Tabs01Stack')}
                >
                    <Image
                        source={LOGO_IMAGE}
                        resizeMode={"contain"}
                        style={{width:CommonUtil.dpToSize(54),height:CommonUtil.dpToSize(32)}}
                    />
                </TouchableHighlight>
            ),
            headerRight : () => (
                !CommonUtil.isEmpty(userToken) ?
                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                    <CommonMyShop
                        menutext=""
                        //menustyle={{width:40,height:50,marginRight:0}}
                        menustyle={CommonStyle.subHeaderRightWrap}
                        textStyle={{color: '#fff'}}                                                
                        isIcon={true}
                        onPressModify={()=>this.modifyContent()}
                        onPressRemove={()=>this.removeContent()}
                        userCartCount={userCartCount}
                        userToken={userToken}
                        navigation={navigation}
                    />
                </View>
                :
                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}></View>
            )
          }}
      >
          <Stack.Screen name="IntroScreen">
                {props => <IntroScreen {...props} extraData={route} />}
          </Stack.Screen>     
      </Stack.Navigator>
    );
};

export default Tabs04Stack;
