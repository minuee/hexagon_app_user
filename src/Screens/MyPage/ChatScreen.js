import React, { useState, useContext, useEffect } from 'react';
import {GiftedChat,Bubble,Send,SystemMessage} from 'react-native-gifted-chat';
import { ActivityIndicator, View, StyleSheet ,Image,PixelRatio} from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
//공통상수 필요에 의해서 사용
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import CommonStyle from '../../Style/CommonStyle';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import  * as SpamWords   from '../../Constants/FilterWords';
import CommonFunction from '../../Utils/CommonFunction';

import firestore from '@react-native-firebase/firestore';
import TextTicker from '../../Utils/TextTicker';
const ChatScreen = (props) => {
    
    const [messages, setMessages] = useState([]);
    const [toBottom, settoBottom] = useState(true);
    const {uid, email,uname,thread} = props.extraData.params;
    
    async function handleSend(messages) {
        const textOrigin = messages[0].text;
        let text = await CommonFunction.isForbiddenWord( textOrigin, SpamWords.FilterWords.badWords); 

        firestore().collection('THREADS').doc(thread._id).collection('MESSAGES')
        .add({
            text,
            createdAt: new Date().getTime(),
            user: {
                _id: uid,
                email: email,
                name : uname
            }
        });

        await firestore().collection('THREADS').doc(thread._id)
        .set(
            {
                latestMessage: {
                    text,
                    createdAt: new Date().getTime()
                }
            },
            { merge: true }
        );
    }

    useEffect(() => {
        const messagesListener = firestore().collection('THREADS').doc(thread._id).collection('MESSAGES')
        .orderBy('createdAt', 'desc').onSnapshot(querySnapshot => {
            const messages = querySnapshot.docs.map(doc => {
            const firebaseData = doc.data();
            const data = {
                _id: doc.id,
                text: '',
                createdAt: new Date().getTime(),
                ...firebaseData
            };

            if (!firebaseData.system) {
                data.user = {
                ...firebaseData.user,
                name: firebaseData.user.name
                };
            }
            return data;
        });
        setMessages(messages);
      });

        // Stop listening for updates whenever the component unmounts
        return () => messagesListener();
    }, []);

    function renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {backgroundColor: DEFAULT_COLOR.base_color}
                }}
                textStyle={{right: {color: '#fff'}}}
            />
        );
    }

    function renderLoading() {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size='large' color={DEFAULT_COLOR.base_color} />
            </View>
        );
    }

    function renderSend(props) {
        return (
            <Send {...props}>
                <View style={styles.sendingContainer}>
                    <Button
                        type={'clear'}
                        onPress={() => handleSend()}
                        icon={<Icon name="enter" size={25} color={DEFAULT_COLOR.base_color} />}
                        title={""}
                    />
                </View>
            </Send>
        );
    }

    function scrollToBottomComponent() {
        return (
            <View style={styles.bottomComponentContainer}>
                <Button
                    type={'clear'}
                    onPress={() => this.giftedChatRef.scrollToBottom()}
                    icon={<Icon name="arrowdown" size={25} color={DEFAULT_COLOR.base_color} />}
                    title={""}
                />
            </View>
        );
    }

 
    function renderSystemMessage(props) {
        return (
            <SystemMessage
                {...props}
                wrapperStyle={styles.systemMessageWrapper}
                textStyle={styles.systemMessageText}
            />
        );
    }

    return (
        <View style={{flex:1}}>
            <View style={styles.headerWrap}>
                <View style={{flex:5,paddingTop:10,paddingLeft:10}}>
                    <TextTicker
                        marqueeOnMount={true} 
                        style={{fontFamily: DEFAULT_CONSTANTS.defaultFontFamilyRegular,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:'#999',lineHeight: DEFAULT_TEXT.fontSize13 * 1.42,}}
                        shouldAnimateTreshold={10}
                        duration={8000}
                        loop
                        bounce
                        repeatSpacer={100}
                        marqueeDelay={2000}
                    >
                        상대방에게 불쾌감을 주거나 모욕적인 말들은 삼가해주세요
                    </TextTicker>
                </View>
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                 <Image source={require('../../../assets/icons/icon_report.png')} style={{width:35,height:35}} />
                </View>
            </View>
            <GiftedChat
                ref={ref => this.giftedChatRef = ref}
                listViewProps={{
                    style: {backgroundColor: '#fff',},
                }}
                messages={messages}
                onSend={handleSend}
                user={{
                    _id: uid 
                    //name: uname
                    //avatar: 'https://facebook.github.io/react/img/logo_og.png',
                }}
                placeholder='내용을 입력하세요'
                alwaysShowSend
                showUserAvatar
                scrollToBottom={toBottom}
                renderUsernameOnMessage={true}
                renderBubble={renderBubble}
                renderLoading={renderLoading}
                //renderSend={(props) => renderSend(props)}
                scrollToBottomComponent={scrollToBottomComponent}
                renderSystemMessage={renderSystemMessage}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerWrap : {
        height:40,borderBottomColor:'#ccc',flexDirection:'row'
    },
    sendingContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomComponentContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    systemMessageWrapper: {
        backgroundColor: '#6646ee',
        borderRadius: 4,
        padding: 5
    },
    systemMessageText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold'
    }
});


export default ChatScreen;