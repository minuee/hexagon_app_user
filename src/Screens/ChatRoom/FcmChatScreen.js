
import React, {Component} from "react";
import {GiftedChat, SystemMessage} from "react-native-gifted-chat";
import db from '@react-native-firebase/database';
import auth from "@react-native-firebase/auth";
import {View, TouchableOpacity, Text} from 'react-native';
//import Toast from 'react-native-toast-message';

const database = db().ref("chat");
export default class ChatScreen extends Component {
  state = {
    messages: //[],
    [{
      _id: 0,
      text: '부적절하거나 불쾌감을 줄 수 있는 대화는 삼가 부탁드립니다. 회원제재를 받을 수 있습니다.',
      createdAt: new Date().getTime(),
      system: true,
    }],
    uid: "",
    reportUser: null,
  };
 
  loadMessages(callback) {
    database.off(); //Detaches a callback previously attached with on()
    const onReceive = data => {
      const message = data.val();
      callback({
        _id: data.key,
        text: message.text,
        createdAt: message.createdAt,
        user: {
          _id: message.user._id,
          name: message.user.name,
        }
      });
    };
    // let d = this.getLimit();
    // console.log(d);
    database.orderByChild('locationInfo')
      .equalTo(this.props.route.params.city)
      .limitToLast(mChatLimit).on("child_added", onReceive);
  }
  sendMessage(message) {
    let today = new Date();
    let timestamp = today.toISOString();
    for (let i = 0; i < message.length; i++) {

        database.push({
          text: message[i].text,
          user: message[i].user,
          createdAt: timestamp,
          locationInfo: this.props.route.params.city,
          email: this.props.route.params.email,
        });
     
    }
  }
  onRenderSystemMessage = (props) => (
    <SystemMessage
      {...props}
      containerStyle={{backgroundColor:'#7cc8c3'}}
      textStyle={{ color: "white", fontWeight:"500", fontSize: 17, textAlign:'center'}}
    />
  );
  closeChat() {
    if (database) {
      database.off();
    }
  }
  getLimit() {
    let today = new Date();
    today.setDate(today.getDate() - 31); // last 30 Days
    let changedISODate = new Date(today).toISOString();
    // console.log(changedISODate);
    return changedISODate;
  }
  componentDidMount() {
    auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({uid:user.uid});
      }
    });
    this.loadMessages(message => {
      this.setState(previousState => {
        return {
          messages: GiftedChat.append(previousState.messages, message)
        };
      });
    });
  }

  onPressAvatar = (user) => {
    this.setState({reportUser: user.name});
    this.Standard.open();
  }
  componentWillUnmount() {
    this.closeChat();
  }
 
  render() {
    return (
      <View style={{ flex: 1 }}>
       <GiftedChat
          messages={this.state.messages}
          onSend={message => {
            this.sendMessage(message);
          }}
          user={{
            _id: this.state.uid,
            name: this.props.route.params.nickname,
          }}
          renderSystemMessage={this.onRenderSystemMessage}
          placeholder="message 입력"
          onPressAvatar={this.onPressAvatar}
          // onPressActionButton={this.onPressActionButton}
          // renderUsernameOnMessage
        />
        
      </View>
    );
  }
}