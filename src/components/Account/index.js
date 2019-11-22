import React from "react";
import { PasswordForgetForm } from "../PasswordForget";
import { PasswordChangeForm } from "../PasswordChange";
import { withAuthorization } from "../Session";
import { AuthUserContext } from "../Session";

import "./index.scss";
import LoginManagement from "./LoginManagement";

const Account = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div className="Account">
        <h1>Account: {authUser.email}</h1>
        <PasswordForgetForm />
        <PasswordChangeForm />
        <LoginManagement authUser={authUser} />
      </div>
    )}
  </AuthUserContext.Consumer>
);

export default withAuthorization(authUser => !!authUser)(Account);
