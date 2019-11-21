import React from "react";
import { Link } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import { withFirebase } from "../Firebase";

const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>Forgot password? </Link>
  </p>
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
    return (
      <form onSubmit={this.onSubmit}>
        <fieldset>
          <legend>Find my password</legend>
          <input
            name="email"
            value={email}
            onChange={this.onChange}
            type="email"
            placeholder="Email Address"
          />
          <button disabled={isInvalid} type="submit">
            Reset My Password
          </button>
          {error && <p>{error.message}</p>}
        </fieldset>
      </form>
    );
  }
}

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

const PasswordForgetPage = () => (
  <div>
    <h1>PasswordForgetPage</h1>
    <PasswordForgetForm />
  </div>
);

export default PasswordForgetPage;

export { PasswordForgetForm, PasswordForgetLink };
