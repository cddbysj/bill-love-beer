import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

class Firebase {
  constructor() {
    firebase.initializeApp(firebaseConfig);
    // firebase.analytics();
    this.EmailAuthProvider = firebase.auth.EmailAuthProvider;
    this.auth = firebase.auth();
    this.db = firebase.database();
    this.googleProvider = new firebase.auth.GoogleAuthProvider();
    this.twitterProvider = new firebase.auth.TwitterAuthProvider();
  }

  //////////////
  // Auth API //
  //////////////
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignInWithGoogle = () => this.auth.signInWithPopup(this.googleProvider);

  doSignInWithTwitter = () => this.auth.signInWithPopup(this.twitterProvider);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

  doSendEmailVerification = () =>
    this.auth.currentUser.sendEmailVerification({
      url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT
    });

  // 路由保护 //
  // ** 监听用户登录状态时，引入数据库内的用户数据，根据 roles 属性，对用户进行权限管理 ** //
  // ** 用户权限足够时调用 next，权限不够时调用 fallback ** //
  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(user => {
      //
      if (user) {
        this.user(user.uid)
          .once("value")
          .then(snapshot => {
            // 来自数据库的用户数据
            const dbUser = snapshot.val();
            // 默认权限为空
            if (!dbUser.roles) dbUser.roles = {};
            const authUser = {
              uid: user.uid,
              email: user.email,
              emailVerified: user.emailVerified,
              providerData: user.providerData,
              ...dbUser
            };
            next(authUser);
          });
      } else {
        fallback();
      }
    });

  //////////////////
  // User API //////
  //////////////////
  user = uid => this.db.ref(`users/${uid}`);

  users = () => this.db.ref("users");
}

export default Firebase;
