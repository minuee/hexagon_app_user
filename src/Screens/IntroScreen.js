import React from 'react';
import {createStackNavigator,SafeAreaView} from '@react-navigation/stack';
const Stack = createStackNavigator();

import MainScreen from './MainScreen'; 
import SampleScreen from '../Utils/SampleScreen'; 

import { ProductListStack,ProductDetailStack,ProductDetailStack2,EventProductStack}  from './Tabs02RouteStack';
import { SignInStack,CartStack,OrderingStack,OrderEndingStack,IntroduceStack }  from './CommonRouteStack'; 
import { NoticeListStack ,NoticeDetailStack,FaqListStack,CustomServiceStack,MyGradeStack,MyPointListStack,MyOrderListStack,OrderDetailStack,OrderCancelStack,OrderBaroCancelStack,OrderBankCancelStack,CouponListStack,ChatStack}  from './Tabs04RouteStack'; 
import { MyInfoStack,UseYakwanStack,RefundYakwanStack,PrivateYakwanStack,MyIDModifyStack,MyPWModifyStack,MyBookMarkStack,MyAlarmStack}  from './Tabs04RouteStack2'; 
import { CategoryListStack}  from './Tabs02/CategoryListStack'; 
//결제방법
import { PaymentStack,PaymentResultStack} from './Settle/PaymentStack';

const MainStack = ({navigation,route}) => {
  return (
    <Stack.Navigator 
        initialRouteName="MainScreen" 
        screenOptions={{headerShown: false}}
    >
        <Stack.Screen name="MainScreen" component={MainScreen} options={{ headerShown: false, }} />
        <Stack.Screen name="SampleScreen" >
          {props => <SampleScreen {...props} extraData={route} />}
        </Stack.Screen>

        <Stack.Screen name="ChatStack" >
          {props => <ChatStack {...props} extraData={route} />}
        </Stack.Screen> 
        <Stack.Screen name="CategoryListStack" >
          {props => <CategoryListStack {...props} extraData={route} />}
        </Stack.Screen> 

        <Stack.Screen name="CouponListStack" >
          {props => <CouponListStack {...props} extraData={route} />}
        </Stack.Screen> 
        <Stack.Screen name="IntroduceStack" >
          {props => <IntroduceStack {...props} extraData={route} />}
        </Stack.Screen> 
        <Stack.Screen name="SignInStack" >
          {props => <SignInStack {...props} extraData={route} />}
        </Stack.Screen> 
        <Stack.Screen name="CartStack" >
          {props => <CartStack {...props} extraData={route} />}
        </Stack.Screen> 
        <Stack.Screen name="OrderingStack" >
          {props => <OrderingStack {...props} extraData={route} />}
        </Stack.Screen> 
        <Stack.Screen name="OrderEndingStack" >
          {props => <OrderEndingStack {...props} extraData={route} />}
        </Stack.Screen> 
        <Stack.Screen name="PaymentStack" >
          {props => <PaymentStack {...props} extraData={route} />}
        </Stack.Screen> 
        <Stack.Screen name="PaymentResultStack" >
          {props => <PaymentResultStack {...props} extraData={route} />}
        </Stack.Screen> 

        <Stack.Screen name="ProductDetailStack" >
          {props => <ProductDetailStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="ProductDetailStack2" >
          {props => <ProductDetailStack2 {...props} extraData={route} />}
        </Stack.Screen>
         <Stack.Screen name="EventProductStack" >
          {props => <EventProductStack {...props} extraData={route} />}
        </Stack.Screen> 

        <Stack.Screen name="NoticeListStack" >
          {props => <NoticeListStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="NoticeDetailStack" >
          {props => <NoticeDetailStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="FaqListStack" >
          {props => <FaqListStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="CustomServiceStack" >
          {props => <CustomServiceStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="MyGradeStack" >
          {props => <MyGradeStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="MyPointListStack" >
          {props => <MyPointListStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="MyOrderListStack" >
          {props => <MyOrderListStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="OrderDetailStack" >
          {props => <OrderDetailStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="OrderCancelStack" >
          {props => <OrderCancelStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="OrderBaroCancelStack" >
          {props => <OrderBaroCancelStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="OrderBankCancelStack" >
          {props => <OrderBankCancelStack {...props} extraData={route} />}
        </Stack.Screen>
        
        
        <Stack.Screen name="ProductListStack" >
          {props => <ProductListStack {...props} extraData={route} />}
        </Stack.Screen> 
    
        <Stack.Screen name="MyInfoStack" >
          {props => <MyInfoStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="UseYakwanStack" >
          {props => <UseYakwanStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="RefundYakwanStack" >
          {props => <RefundYakwanStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="PrivateYakwanStack" >
          {props => <PrivateYakwanStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="MyIDModifyStack" >
          {props => <MyIDModifyStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="MyPWModifyStack" >
          {props => <MyPWModifyStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="MyBookMarkStack" >
          {props => <MyBookMarkStack {...props} extraData={route} />}
        </Stack.Screen>
        <Stack.Screen name="MyAlarmStack" >
          {props => <MyAlarmStack {...props} extraData={route} />}
        </Stack.Screen>

    </Stack.Navigator>
  );
};

export default MainStack;
