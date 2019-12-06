import React from "react";
import { Link } from "react-router-dom";
import { Form, Input, Button, message, Icon } from "antd";

import * as ROUTES from "../../constants/routes";
import { withFirebase } from "../Firebase";
import { compose } from "recompose";

const PasswordForgetLink = () => (
  <Link to={ROUTES.PASSWORD_FORGET}>Forgot password? </Link>
);

const INITIAL_STATE = {
  email: "",
  error: null
};

class PasswordForgetFormBase extends React.Component {
  state = { ...INITIAL_STATE };

  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  onSubmit = event => {
    const { email } = this.state;
    const { firebase } = this.props;
    firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => this.setState({ error }));
    event.preventDefault();
  };

  render() {
    const { email, error } = this.state;
    const isInvalid = email === "";
    const { getFieldDecorator } = this.props.form;

    return (
      <Form layout="inline">
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
              prefix={<Icon type="mail" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Email"
            />
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Send
          </Button>
        </Form.Item>
      </Form>
      // <form onSubmit={this.onSubmit}>
      //   <fieldset>
      //     <legend>Find my password</legend>
      //     <input
      //       name="email"
      //       value={email}
      //       onChange={this.onChange}
      //       type="email"
      //       placeholder="Email Address"
      //     />
      //     <button disabled={isInvalid} type="submit">
      //       Reset My Password
      //     </button>
      //     {error && <p>{error.message}</p>}
      //   </fieldset>
      // </form>
    );
  }
}

const PasswordForgetForm = compose(
  withFirebase,
  Form.create({})
)(PasswordForgetFormBase);

const PasswordForgetPage = () => (
  <div>
    <h1>PasswordForgetPage</h1>
    <PasswordForgetForm />
  </div>
);

export default PasswordForgetPage;

export { PasswordForgetForm, PasswordForgetLink };
