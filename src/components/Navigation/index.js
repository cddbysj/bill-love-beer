import React from "react";
import { Link } from "react-router-dom";
import { Menu, Icon } from "antd";

import * as ROUTES from "../../constants/routes";
import * as ROLES from "../../constants/roles";
import SignOutButton from "../SignOut";
import { AuthUserContext } from "../Session";

const { SubMenu } = Menu;

const NavigationAuth = ({ authUser }) => (
  <Menu mode="horizontal" theme="dark" style={{ lineHeight: "64px" }}>
    <Menu.Item key="landing">
      <Link to={ROUTES.LANDING}>Landing</Link>
    </Menu.Item>
    <Menu.Item key="home">
      <Link to={ROUTES.HOME}>
        <Icon type="home" />
        Home
      </Link>
    </Menu.Item>
    {!!authUser.roles[ROLES.ADMIN] && (
      <Menu.Item key="admin">
        <Link to={ROUTES.ADMIN}>
          <Icon type="setting" />
          Admin
        </Link>
      </Menu.Item>
    )}
    <SubMenu
      title={
        <span>
          <Icon type="user" />
          Account
        </span>
      }
    >
      <Menu.Item key="email">
        <Link to={ROUTES.ACCOUNT}>{authUser.email}</Link>
      </Menu.Item>
      <Menu.Item key="signout">
        <SignOutButton />
      </Menu.Item>
    </SubMenu>
  </Menu>
);

const NavigationNonAuth = () => (
  <Menu mode="horizontal" theme="dark" style={{ lineHeight: "64px" }}>
    <Menu.Item>
      <Link to={ROUTES.LANDING}>Landing</Link>
    </Menu.Item>
    <Menu.Item>
      <Link to={ROUTES.SIGN_IN}>
        <Icon type="login" />
        Sign In
      </Link>
    </Menu.Item>
  </Menu>
);

const Navigation = () => (
  <AuthUserContext.Consumer>
    {authUser =>
      authUser ? <NavigationAuth authUser={authUser} /> : <NavigationNonAuth />
    }
  </AuthUserContext.Consumer>
);

export default Navigation;
