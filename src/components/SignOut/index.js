import React from "react";
import { withFirebase } from "../Firebase";
import { Button, Icon } from "antd";

const SignOutButton = ({ firebase }) => (
  <Button ghost size="small" onClick={firebase.doSignOut}>
    <Icon type="logout" />
    Sign out
  </Button>
);

export default withFirebase(SignOutButton);
