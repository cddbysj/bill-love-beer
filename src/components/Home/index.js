import React from "react";
import { compose } from "recompose";

import { withEmailVerification, withAuthorization } from "../Session";

import Messages from "../Messages";

const HomePage = props => (
  <div>
    <h1>Welcome!</h1>
    <p>The Home Page is accessible by every signed in user.</p>
    <Messages />
  </div>
);

export default compose(
  withEmailVerification,
  withAuthorization(authUser => !!authUser)
)(HomePage);
