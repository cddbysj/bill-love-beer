import React from "react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import * as ROLES from "../../constants/roles";

const ERROR_CODE_ACCOUNT_EXISTS = "auth/email-already-in-use";
const ERROR_MSG_ACCOUNT_EXISTS = `
An account with this E-Mail address already exists.
Try to login with this account instead. If you think the
account is already used from one of the social logins, try
to sign-in with one of them. Afterward, associate your accounts
on your personal account page.
`;

const INITIAL_STATE = {
  username: "",
  email: "",
  passwordOne: "",
  passwordTwo: "",
  isAdmin: false,
  error: null
};

class SignUpFormBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { username, email, passwordOne, isAdmin } = this.state;
    const { firebase } = this.props;

    const roles = {};
    if (isAdmin) roles[ROLES.ADMIN] = ROLES.ADMIN;

    firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser =>
        firebase.user(authUser.user.uid).set({ username, email, roles })
      )
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  onCheckboxChange = event => {
    this.setState({
      [event.target.name]: event.target.checked
    });
  };

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      isAdmin,
      error
    } = this.state;

    const isInvalid =
      username === "" ||
      email === "" ||
      passwordOne === "" ||
      passwordOne !== passwordTwo;

    return (
      <form onSubmit={this.onSubmit}>
        <input
          name="username"
          value={username}
          onChange={this.onChange}
          type="text"
          placeholder="Full name"
        />
        <input
          name="email"
          value={email}
          onChange={this.onChange}
          type="email"
          placeholder="Email Address"
        />
        <input
          name="passwordOne"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          placeholder="Password"
        />
        <input
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
          placeholder="Confirm password"
        />
        <label>
          Admin:
          <input
            name="isAdmin"
            checked={isAdmin}
            onChange={this.onCheckboxChange}
            type="checkbox"
          />
        </label>
        <button disabled={isInvalid} type="submit">
          Sign Up
        </button>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const SignUpForm = compose(withRouter, withFirebase)(SignUpFormBase);

const SignUpPage = () => (
  <div>
    <h1>Sign up</h1>
    <SignUpForm />
  </div>
);

const SignUpLink = () => (
  <p>
    Don't have an account yet? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

export default SignUpPage;

export { SignUpForm, SignUpLink };
