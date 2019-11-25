import React from "react";
import { withFirebase } from "../Firebase";

import DefaultLoginToggle from "./DefaultLoginToggle";
import SocialLoginToggle from "./SocialLoginToggle";

const SIGN_IN_METHODS = [
  {
    id: "password",
    provider: null
  },
  {
    id: "google.com",
    provider: "googleProvider"
  },
  {
    id: "facebook.com",
    provider: "facebookProvider"
  },
  {
    id: "twitter.com",
    provider: "twitterProvider"
  }
];

class LoginManagementBase extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      activeSignInMethods: [],
      error: null
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.fetchSignInMethods();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  fetchSignInMethods = () => {
    const { firebase, authUser } = this.props;

    firebase.auth
      .fetchSignInMethodsForEmail(authUser.email)
      .then(
        activeSignInMethods =>
          this._isMounted && this.setState({ activeSignInMethods, error: null })
      )
      .catch(error => this.setState({ error }));
  };

  /**
   * 将电子邮件地址和密码凭据与用户帐号相关联
   * @param {string} password
   * @external https://firebase.google.com/docs/auth/web/account-linking
   */
  onDefaultLoginLink = password => {
    const { firebase, authUser } = this.props;
    const credential = firebase.EmailAuthProvider.credential(
      authUser.email,
      password
    );

    firebase.auth.currentUser
      .linkAndRetrieveDataWithCredential(credential)
      .then(this.fetchSignInMethods)
      .catch(error => this.setState({ error }));
  };

  /**
   * 将当前登录用户的指定社交账号与用户帐号相关联
   * @param {object} provider
   * @external https://firebase.google.com/docs/auth/web/account-linking
   */
  onSocialLoginLink = provider => {
    this.props.firebase.auth.currentUser
      .linkWithPopup(this.provider.firebase[provider])
      .then(result => {
        // 账户关联成功，获取最新的已激活登录方法
        // const user = result.user
        this.fetchSignInMethods();
      })
      .catch(error => {
        // Handle Errors here.
        this.setState({ error });
      });
  };

  /**
   * 取消用户账号与指定社交账号的关联
   * @param {string} providerId
   */
  onUnLink = providerId => {
    this.props.firebase.auth.currentUser
      .unlink(providerId)
      .then(() => {
        // 账户取消关联成功，获取最新的已激活登录方法
        this.fetchSignInMethods();
      })
      .catch(error => {
        // An error happened
        this.setState({ error });
      });
  };

  render() {
    const { activeSignInMethods, error } = this.state;
    return (
      <div>
        Sign in methods:
        <ul>
          {SIGN_IN_METHODS.map(signInMethod => {
            const isSignInWithPassword = signInMethod.id === "password";
            const isEnabled = activeSignInMethods.includes(signInMethod.id);
            const isOnlyOneLeft = activeSignInMethods.length === 1;

            return (
              <li key={signInMethod.id}>
                {isSignInWithPassword ? (
                  <DefaultLoginToggle
                    isEnabled={isEnabled}
                    isOnlyOneLeft={isOnlyOneLeft}
                    signInMethod={signInMethod}
                    onLink={this.onDefaultLoginLink}
                    onUnLink={this.onUnLink}
                  />
                ) : (
                  <SocialLoginToggle
                    isEnabled={isEnabled}
                    isOnlyOneLeft={isOnlyOneLeft}
                    signInMethod={signInMethod}
                    onLink={this.onSocialLoginLink}
                    onUnLink={this.onUnLink}
                  />
                )}
              </li>
            );
          })}
        </ul>
        {error && <p>{error.message}</p>}
      </div>
    );
  }
}

const LoginManagement = withFirebase(LoginManagementBase);

export default LoginManagement;
