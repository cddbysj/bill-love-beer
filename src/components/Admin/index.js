import React from "react";
import { Switch, Route } from "react-router-dom";
import { compose } from "recompose";

import { withAuthorization } from "../Session";
import { withEmailVerification } from "../Session";

import * as ROLES from "../../constants/roles";
import * as ROUTES from "../../constants/routes";

import UserItem from "./UserItem";
import UserList from "./UserList";

import "./index.scss";

const AdminPage = () => (
  <div className="Admin">
    <h1>Admin page</h1>
    <p>The admin page is accessible by every signed in admin user.</p>
    <Switch>
      <Route exact path={ROUTES.ADMIN_DETAILS} component={UserItem}></Route>
      <Route exact path={ROUTES.ADMIN} component={UserList}></Route>
    </Switch>
  </div>
);

const checkAuthorization = authUser =>
  authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(
  withEmailVerification,
  withAuthorization(checkAuthorization)
)(AdminPage);
