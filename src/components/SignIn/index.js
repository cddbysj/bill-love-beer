import React from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";

import { SignUpLink } from "../SignUp";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import { PasswordForgetLink } from "../PasswordForget";

const ERROR_CODE_ACCOUNT_EXISTS =
  "auth/account-exists-with-different-credential";
const ERROR_MSG_ACCOUNT_EXISTS = `
An account with an E-Mail address to
this social account already exists. Try to login from
this account instead and associate your social accounts on
your personal account page.
`;

const INIITAL_STATE = {
  email: "",
  password: "",
  error: null
};

class SignInFormBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...INIITAL_STATE };
  }

  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  onSubmit = event => {
    const { email, password } = this.state;
    const { firebase, history } = this.props;
    firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(result => {
        this.setState({ ...INIITAL_STATE });
        // 导航到主页
        history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });
    event.preventDefault();
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = email === "" || password === "";

    return (
      <form onSubmit={this.onSubmit}>
        <input
          name="email"
          value={email}
          onChange={this.onChange}
          placeholder="Email Address"
          type="email"
        />
        <input
          name="password"
          value={password}
          onChange={this.onChange}
          placeholder="Password"
          type="password"
        />
        <button disabled={isInvalid} type="submit">
          Sign in
        </button>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

class SignInGoogleBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null
    };
  }

  onSubmit = event => {
    const { firebase, history } = this.props;
    firebase
      .doSignInWithGoogle()
      .then(googleUser =>
        firebase.user(googleUser.user.uid).set({
          username: googleUser.user.displayName,
          email: googleUser.user.email,
          roles: {}
        })
      )
      .then(() => {
        this.setState({ error: null });
        history.push(ROUTES.HOME);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }
        this.setState({ error });
      });

    event.preventDefault();
  };

  render() {
    const { error } = this.state;
    return (
      <form onSubmit={this.onSubmit}>
        <button type="submit">Sign in with Google</button>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

class SignInTwitterBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  onSubmit = event => {
    const { firebase, history } = this.props;
    firebase
      .doSignInWithTwitter()
      .then(result =>
        // 将通过 Twitter 登录的用户的数据保存到数据库
        firebase.user(result.user.uid).set({
          username: result.additionalUserInfo.profile.name,
          email: result.additionalUserInfo.profile.email
        })
      )
      .then(() => {
        this.setState({ error: null });
        history.push(ROUTES.HOME);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }
        this.setState({ error });
      });

    event.preventDefault();
  };

  render() {
    const { error } = this.state;
    return (
      <form onSubmit={this.onSubmit}>
        <button type="submit">Sign in with Twitter</button>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

// 通过高阶组件的方式注入 firebase 实例
const SignInForm = compose(withRouter, withFirebase)(SignInFormBase);
const SignInGoogle = compose(withRouter, withFirebase)(SignInGoogleBase);
const SignInTwitter = compose(withRouter, withFirebase)(SignInTwitterBase);

const SignInPage = () => (
  <div>
    <h1>SignInPage</h1>
    <SignInForm />
    <SignInGoogle />
    <SignInTwitter />
    <SignUpLink />
    <PasswordForgetLink />
  </div>
);

export default SignInPage;
export { SignInForm, SignInGoogle, SignInTwitter };
