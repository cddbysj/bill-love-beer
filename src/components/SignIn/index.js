import React from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { Form, Button, Icon, Input, Checkbox, Divider } from "antd";

import "./index.scss";

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

class SignInFormBase extends React.Component {
  state = { error: null };

  onSubmit = event => {
    const {
      firebase,
      history,
      form: { validateFields }
    } = this.props;

    validateFields((err, values) => {
      if (!err) {
        console.log(values);
        const { email, password } = values;
        firebase
          .doSignInWithEmailAndPassword(email, password)
          .then(() => {
            // 导航到主页
            history.push(ROUTES.HOME);
          })
          .catch(error => {
            this.setState({ error });
          });
      }
    });

    event.preventDefault();
  };

  render() {
    const {
      form: { getFieldDecorator }
    } = this.props;

    return (
      <Form onSubmit={this.onSubmit} className="sign-in-form">
        <Form.Item>
          {getFieldDecorator("email", {
            rules: [
              {
                type: "email",
                message: "The input is not valid E-mail!"
              },
              {
                required: true,
                message: "Please input your E-mail!"
              }
            ]
          })(
            <Input
              size="large"
              prefix={<Icon type="mail" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Email"
            />
          )}
        </Form.Item>
        <Form.Item hasFeedback>
          {getFieldDecorator("password", {
            rules: [
              {
                required: true,
                message: "Please input your password!"
              },
              {
                validator: this.validateToNextPassword
              }
            ]
          })(
            <Input
              size="large"
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="password"
              placeholder="Password"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("remember", {
            valuePropName: "checked",
            initialValue: true
          })(<Checkbox>Remember me</Checkbox>)}
          <PasswordForgetLink />
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
          <SignUpLink />
        </Form.Item>
        {this.state.error && <p>{this.state.error.message}</p>}
      </Form>
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
      <Form className="sign-in-form" onSubmit={this.onSubmit}>
        <Form.Item>
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            <Icon type="google" />
            Log in with Google
          </Button>
        </Form.Item>
        {error && <p>{error.message}</p>}
      </Form>
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
      <Form className="sign-in-form" onSubmit={this.onSubmit}>
        <Form.Item>
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            <Icon type="twitter" theme="outlined" />
            Log in with Twitter
          </Button>
        </Form.Item>
        {error && <p>{error.message}</p>}
      </Form>
    );
  }
}

// 通过高阶组件的方式注入 form 校验、react-router、firebase 实例
const SignInForm = compose(
  Form.create({}),
  withRouter,
  withFirebase
)(SignInFormBase);
const SignInGoogle = compose(withRouter, withFirebase)(SignInGoogleBase);
const SignInTwitter = compose(withRouter, withFirebase)(SignInTwitterBase);

const SignInPage = () => (
  <div className="sign-in-page">
    <h1>SignInPage</h1>
    <SignInForm />
    <Divider>OR</Divider>
    <SignInGoogle />
    <SignInTwitter />
  </div>
);

export default SignInPage;
export { SignInForm, SignInGoogle, SignInTwitter };
