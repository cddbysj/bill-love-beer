import React from "react";
import { Link } from "react-router-dom";

import withUsersSubscription from "./withUsersSubscription";
import * as ROLES from "../../constants/roles";
import * as ROUTES from "../../constants/routes";

import { Table, Tag, Spin } from "antd";

const columns = [
  {
    title: "Name",
    dataIndex: "username",
    render: (text, record) => (
      <Link
        to={{
          pathname: `${ROUTES.ADMIN}/${record.uid}}`,
          state: { user: record }
        }}
      >
        {text}
      </Link>
    )
  },
  {
    title: "Email",
    dataIndex: "email"
  },
  {
    title: "Roles",
    dataIndex: "roles",
    render: roles => {
      const color = roles && roles[ROLES.ADMIN] ? "geekblue" : "green";
      return <Tag color={color}>{roles && roles[ROLES.ADMIN]}</Tag>;
    }
  },
  {
    title: "Action",
    dataIndex: "action",
    render: actions => (
      <span>
        <a href="/">Delete</a>
      </span>
    )
  }
];

const UserList = ({ users }) => (
  <>
    {users ? (
      <Table rowKey="uid" columns={columns} dataSource={users} />
    ) : (
      <Spin />
    )}
  </>
);

const selectData = ({ users }) => ({
  users: Object.keys(users).map(uid => ({ ...users[uid], uid }))
});

export default withUsersSubscription(selectData)(UserList);
