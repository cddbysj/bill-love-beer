import React from "react";
import { Descriptions, Button, Spin } from "antd";
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
      <div>
        {loading && (
          <div>
            <Spin loading={loading} />
          </div>
        )}

        {user && (
          <Descriptions title="User Info" layout="vertical" bordered>
            <Descriptions.Item label="UserName">
              {user.username}
            </Descriptions.Item>
            <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
            <Descriptions.Item label="ID">{user.uid}</Descriptions.Item>
          </Descriptions>
        )}
        <Button
          style={{ margin: 20 }}
          type="primary"
          onClick={this.onSendPasswordResetEmail}
        >
          Send Reset Email
        </Button>
      </div>
    );
  }
}

const UserItem = withFirebase(UserItemBase);

export default UserItem;
