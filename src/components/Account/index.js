import React from "react";
import { PasswordForgetForm } from "../PasswordForget";
import { PasswordChangeForm } from "../PasswordChange";
import { withAuthorization, withEmailVerification } from "../Session";
import { AuthUserContext } from "../Session";

import "./index.scss";
import LoginManagement from "./LoginManagement";
import { compose } from "recompose";

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

export default compose(
  withEmailVerification,
  withAuthorization(authUser => !!authUser)
)(Account);
