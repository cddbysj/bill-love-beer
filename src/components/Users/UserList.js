import React from "react";
import { Link } from "react-router-dom";

import withUsersSubscription from "./withUsersSubscription";
import * as ROLES from "../../constants/roles";
import * as ROUTES from "../../constants/routes";

const UserList = ({ users, loading }) => (
  <ul className="admin-user-list">
    {loading && <div>Loading users...</div>}
    <li className="user-list-title">
      <span>Username</span>
      <span>Email</span>
      <span>Admin</span>
      <span>Detail</span>
    </li>
    {users &&
      users.map(user => (
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
);

const selectData = ({ users }) => ({
  users: Object.keys(users).map(uid => ({ ...users[uid], uid })),
});

export default withUsersSubscription(selectData)(UserList);
