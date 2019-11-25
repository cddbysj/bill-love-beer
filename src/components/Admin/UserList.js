import React from "react";
import * as ROLES from "../../constants/roles";

const UserList = ({ users }) => (
  <ul>
    <li className="list-title">
      <span>Username</span>
      <span>Email</span>
      <span>Admin</span>
    </li>
    {users.map(user => (
      <li key={user.uid}>
        <span>{user.username}</span>
        <span>{user.email}</span>
        <span>{user.roles && user.roles[ROLES.ADMIN] ? "Yes" : "No"}</span>
      </li>
    ))}
  </ul>
);

export default UserList;
