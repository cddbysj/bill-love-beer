import React from "react";
import { withAuthorization } from "../Session";
import UserList from "./UserList";
import * as ROLES from "../../constants/roles";

import './index.scss';

class AdminPage extends React.Component {
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
      <div className="Admin">
        <h1>AdminPage</h1>
        <p>Restricted area! Only users with the admin role are authorized.</p>
        <div>{loading ? "Loading..." : <UserList users={users} />}</div>
      </div>
    );
  }
}

const checkAuthorization = authUser => authUser && !!authUser.roles[ROLES.ADMIN];

export default withAuthorization(checkAuthorization)(AdminPage);
