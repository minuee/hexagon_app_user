import React from 'react';
import {createStackNavigator,SafeAreaView} from '@react-navigation/stack';
const Stack = createStackNavigator();

import SignUpScreen from './SignUpScreen'; //로그인페이지
import {FindIDStack,AuthCheckStack,PassWordResetStack,SignInStack,NoticeDetailStack,OrderDetailStack} from './AuthRouteStack'; //로그인페이지


const AuthStack = ({navigation,route,rootState}) => {
    
    return (
        <Stack.Navigator initialRouteName="SignUpScreen" screenOptions={{headerShown: false}}>
            <Stack.Screen name="SignUpScreen" >
                {props => <SignUpScreen {...props} extraData={route} rootState={rootState} />}
            </Stack.Screen> 
            <Stack.Screen name="AuthCheckStack" >
                {props => <AuthCheckStack {...props} extraData={route} />}
            </Stack.Screen> 
            <Stack.Screen name="FindIDStack" >
                {props => <FindIDStack {...props} extraData={route} />}
            </Stack.Screen> 
            <Stack.Screen name="PassWordResetStack" >
                {props => <PassWordResetStack {...props} extraData={route} />}
            </Stack.Screen>             
            <Stack.Screen name="SignInStack"  >
                {props => <SignInStack {...props} extraData={route} rootState={rootState} />}
            </Stack.Screen> 

            <Stack.Screen name="NoticeDetailStack" >
                {props => <NoticeDetailStack {...props} extraData={route} />}
            </Stack.Screen> 
            <Stack.Screen name="OrderDetailStack" >
                {props => <OrderDetailStack {...props} extraData={route} />}
            </Stack.Screen> 
        </Stack.Navigator>
    );
};

export default AuthStack;