import React from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";

import { SignUpLink } from "../SignUp";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import { PasswordForgetLink } from "../PasswordForget";

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
      .catch(error => this.setState({ error }));
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

// 通过高阶组件的方式注入 firebase 实例
const SignInForm = compose(withRouter, withFirebase)(SignInFormBase);

const SignInPage = () => (
  <div>
    <h1>SignInPage</h1>
    <SignInForm />
    <SignUpLink />
    <PasswordForgetLink />
  </div>
);

export default SignInPage;
