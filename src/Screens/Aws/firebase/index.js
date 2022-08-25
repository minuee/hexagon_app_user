import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import 'moment/locale/ko'
import  moment  from  "moment";
const showAlert = (text) => {
  alert(text);
};


export const adminLogin = async (email, password) => {
    let isSuccess = null;
    await auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
            const adminUser = auth().currentUser ? auth().currentUser.uid : '';
            //console.log('adminUser',adminUser)
            isSuccess = adminUser;
        })
        .catch((error) => {
            console.log(error);
        });
    return isSuccess;
};

export const login = async (email, password) => {
    //console.log('email',email)
    //console.log('password',password)
    let isSuccess = false;
    await auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
            const currentUser = auth().currentUser ? auth().currentUser.uid : '';
            console.log('currentUser',currentUser)
            isSuccess = currentUser;
        })
        .catch((error) => {
            if (error.code === 'auth/wrong-password') {
                showAlert('Wrong password!');
            }
        });
    return isSuccess;
};

export const signUp = async (email, password) => {
    //console.log('signUpemail',email)
    //console.log('signUppassword',password)
    let loginResult = null;
    await auth()
    .createUserWithEmailAndPassword(email, password)
    .then((res) => {
        //console.log('signUp res',res)
        return true;
    })
    .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
            loginResult = login(email, password);
        }
        if (error.code === 'auth/weak-password') {
            showAlert('Weak password');
        }
        if (error.code === 'auth/invalid-email') {
            showAlert('Invalid Email!');
        }
    });
    //console.log('loginResult',loginResult)
    return loginResult;
};

export const saveUser = async(id, name) => {
    const checkId = await firestore().collection('users').where('id','==', id).get()
    .then((querySnapshot) => {
        if ( querySnapshot._changes.length > 0 ) {
            return true;
        }else{
            return false;
        }
    })
    .catch((error) => {
        //console.log("Error getting documents: ", error);
    });
    if ( checkId === false) {
        try{
            const res = await firestore().collection('users').add({
                id,name,
            });
            return true;
        }catch(e) {
            return false;
        }
    }else{
        return true
    }
};

export const signOut = () => {
    //console.log('signOut')
    //auth().signOut();
    auth().signOut().then(() =>{
        //console.log("Sign-out successful.");
    }).catch(function(error) {
       // console.log("An error occured while signing out:"+error);
    });
     
};

export const currentUser = auth().currentUser ? auth().currentUser['uid'] : '';

export const sendMessage = (message, senderId, recipientId,username=null) => {
    firestore().collection('chats').add({
        message,
        senderId,
        recipientId,
        username,
        regdate : moment().unix(),
        date: new Date(),
    });
};
