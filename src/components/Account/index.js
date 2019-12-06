import React from "react";
import { Tabs, Typography, Avatar, Card } from "antd";
import { compose } from "recompose";

import { PasswordForgetForm } from "../PasswordForget";
import { PasswordChangeForm } from "../PasswordChange";
import { withAuthorization, withEmailVerification } from "../Session";
import { AuthUserContext } from "../Session";

import LoginManagement from "./LoginManagement";

const { TabPane } = Tabs;
const { Title, Paragraph, Text } = Typography;

const Account = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div className="Account">
        <Title level={2}>Account Management</Title>
        <Tabs tabPosition="left" defaultActiveKey="1">
          <TabPane tab="Account Info" key="1">
            <Card
              title={
                <Text strong>
                  <Avatar
                    style={{ backgroundColor: "#87d068", marginRight: 5 }}
                    icon="user"
                  />
                  {authUser.username}
                </Text>
              }
              style={{ width: 500 }}
            >
              <Paragraph copyable>{authUser.email}</Paragraph>
              <p>Card content</p>
              <p>Card content</p>
              <p>Card content</p>
            </Card>
          </TabPane>
          <TabPane tab="Forget Password" key="2">
            <PasswordForgetForm />
          </TabPane>
          <TabPane tab="Change Password" key="3">
            <PasswordChangeForm />
          </TabPane>
          <TabPane tab="Login Management" key="4">
            <LoginManagement authUser={authUser} />
          </TabPane>
        </Tabs>
      </div>
    )}
  </AuthUserContext.Consumer>
);

export default compose(
  withEmailVerification,
  withAuthorization(authUser => !!authUser)
)(Account);
