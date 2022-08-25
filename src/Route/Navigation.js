import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {useSelector,useDispatch} from 'react-redux';
//공통상수 필요에 의해서 사용
//공통상수
import CommonUtil from '../Utils/CommonUtil';
/* 로그인 홈 */
import MainHomeStack from '../Screens/IntroScreen';
import AuthStack from '../Screens/Auth/IntroScreen';

const Stack = createStackNavigator();

const AuthScreenStack = ({navigation,route,rootState}) => {
   
    return (
        <Stack.Navigator
            initialRouteName="AuthStack"
            screenOptions={{headerShown: false}}
        >
        <Stack.Screen name="AuthStack" >
          {props => <AuthStack {...props} extraData={route} rootState={rootState} />} 
        </Stack.Screen>
      </Stack.Navigator>
    );
};

export default function Navigation(props) {
    //const {userToken} = useContext(UserTokenContext);
    const dispatch = useDispatch();
    //const userToken = useSelector((store) => store);
    const reduxData = useSelector(state => state);
    const {userToken,nonUserToken} = reduxData.GlabalStatus;    
    if ( CommonUtil.isEmpty(nonUserToken) ) {
        if ( props.screenState.loginInfo != null ) {
            return (    
                <NavigationContainer >
                    <MainHomeStack rootState={props.screenState} />
                </NavigationContainer>
            )
        }else{
            return (      
                <NavigationContainer >
                    <AuthScreenStack rootState={props.screenState} />
                </NavigationContainer>
            );
        }
    }else{
        return (    
            <NavigationContainer >
                <MainHomeStack rootState={props.screenState} />
            </NavigationContainer>
        )
    }   
}