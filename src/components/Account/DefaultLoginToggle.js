import React from "react";

class DefaultLoginToggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      passwordOne: "",
      passwordTwo: "",
      error: null
    };
  }

  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  onSubmit = event => {
    this.props.onLink(this.state.passwordOne);
  };

  render() {
    const { passwordOne, passwordTwo, error } = this.state;
    const { isEnabled, isOnlyOneLeft, signInMethod, onUnLink } = this.props;

    const isInvalid = passwordOne === "" || passwordTwo !== passwordOne;

    return (
      <>
        {isEnabled ? (
          <button
            disabled={isOnlyOneLeft}
            onClick={() => onUnLink(signInMethod.id)}
          >
            Deactive {signInMethod.id}
          </button>
        ) : (
          <form onSubmit={this.onSubmit}>
            <input
              name="passwordOne"
              value={this.state.passwordOne}
              onChange={this.onChange}
              type="password"
              placeholder="Password"
            />
            <input
              name="passwordTwo"
              value={this.state.passwordTwo}
              onChange={this.onChange}
              type="password"
              placeholder="Confirm password"
            />
            <button disabled={isInvalid} type="submit">
              Link {signInMethod.id}
            </button>
            {error && <p>{error.message}</p>}
          </form>
        )}
      </>
    );
  }
}

export default DefaultLoginToggle;
