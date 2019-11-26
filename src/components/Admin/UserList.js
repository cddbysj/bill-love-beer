import React from "react";
import { Link } from "react-router-dom";

import * as ROLES from "../../constants/roles";
import * as ROUTES from "../../constants/routes";
import { withFirebase } from "../Firebase";

class UserListBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      loading: false,
      error: null
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.props.firebase.users().on("value", snapshot => {
      const usersObject = snapshot.val();
      // usersObject shape:
      // { uid1: { user1 }, uid2: { user2 } ... }
      const users = Object.keys(usersObject).map(uid => ({
        ...usersObject[uid],
        uid
      }));
      this.setState({ loading: false, users });
    });
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  render() {
    const { loading, users } = this.state;

    return (
      <div className="admin-user-list">
        <div>{loading && "Loading..."}</div>
        <ul>
          <li className="user-list-title">
            <span>Username</span>
            <span>Email</span>
            <span>Admin</span>
            <span>Detail</span>
          </li>
          {users.map(user => (
            <li key={user.uid}>
              <span>{user.username}</span>
              <span>{user.email}</span>
              <span>{user.roles && user.roles[ROLES.ADMIN] ? "√" : "×"}</span>
              <span>
                <Link
                  to={{
                    pathname: `${ROUTES.ADMIN}/${user.uid}`,
                    state: { user }
                  }}
                >
                  →
                </Link>
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

const UserList = withFirebase(UserListBase);

export default UserList;
