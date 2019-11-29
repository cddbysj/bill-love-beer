import React from "react";
import { withFirebase } from "../Firebase";

class UserItemBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loading: false,
      ...props.location.state
    };
  }

  componentDidMount() {
    // 如果用户是从 UserList 组件导航到这里
    // 则 user 已经通过 React Router 的 Link 传递过来了
    if (this.state.user) {
      return;
    }

    this.setState({ loading: true });
    const { firebase, match } = this.props;
    const uid = match.params.id;
    console.log("uid", uid);
    firebase.user(uid).on("value", snapshot => {
      this.setState({
        user: snapshot.val(),
        loading: false
      });
    });
  }

  componentWillUnmount() {
    const { firebase, match } = this.props;
    const uid = match.params.id;
    firebase.user(uid).off();
  }

  onSendPasswordResetEmail = () => {
    this.props.firebase.doPasswordReset(this.state.user.email);
  };

  render() {
    const { user, loading } = this.state;
    return (
      <div className="admin-detail">
        <h2>User ({user.username})</h2>
        {loading && <div>Loading...</div>}

        {user && (
          <ul>
            <li>
              <strong>Name: </strong>
              {user.username}
            </li>
            <li>
              <strong>Email:</strong>
              {user.email}
            </li>
            <li>
              <strong>ID: </strong>
              {user.uid}
            </li>
            <li>
              <button onClick={this.onSendPasswordResetEmail}>
                Send Reset Email
              </button>
            </li>
          </ul>
        )}
      </div>
    );
  }
}

const UserItem = withFirebase(UserItemBase);

export default UserItem;
