import React from "react";
import { withFirebase } from "../Firebase";

const INITIAL_STATE = {
  passwordOne: "",
  passwordTwo: "",
  error: null
};

class PasswordChangeFormBase extends React.Component {
  state = { ...INITIAL_STATE };

  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  onSubmit = event => {
    const { passwordOne } = this.state;
    const { firebase } = this.props;
    firebase
      .doPasswordUpdate(passwordOne)
      .then(() => this.setState({ ...INITIAL_STATE }))
      .catch(error => this.setState({ error }));
  };

  render() {
    const { passwordOne, passwordTwo, error } = this.state;
    const isInvalid = passwordOne === "" || passwordOne !== passwordTwo;

    return (
      <form onSubmit={this.onSubmit}>
        <fieldset>
          <legend>Update my password</legend>
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
            placeholder="Confirm your password"
          />
          {error && <p>{error.message}</p>}
          <button type="submit" disabled={isInvalid}>
            Reset My Password
          </button>
        </fieldset>
      </form>
    );
  }
}

const PasswordChangeForm = withFirebase(PasswordChangeFormBase);

const PasswordChangePage = () => (
  <div>
    <h1>PasswordChangePage</h1>
    <PasswordChangeForm />
  </div>
);

export default PasswordChangePage;
export { PasswordChangeForm };
