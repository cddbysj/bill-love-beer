import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import * as ROUTES from "../../constants/routes";
import { withAuthentication } from "../Session";

import Navigation from "../Navigation";
import LandingPage from "../Landing";
import SignUpPage from "../SignUp";
import SignInPage from "../SignIn";
import PasswordForgetPage from "../PasswordForget";
import HomePage from "../Home";
import AccountPage from "../Account";
import AdminPage from "../Admin";

import { Layout } from "antd";

const { Header, Footer, Content } = Layout;

class App extends React.Component {
  render() {
    return (
      <Router>
        <Layout>
          <Header>
            <Navigation />
          </Header>
          <Content style={{ padding: "0 50px" }}>
            <div style={{ minHeight: "500px", padding: "24px" }}>
              <Switch>
                <Route exact path={ROUTES.LANDING} component={LandingPage} />
                <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
                <Route path={ROUTES.SIGN_IN} component={SignInPage} />
                <Route
                  path={ROUTES.PASSWORD_FORGET}
                  component={PasswordForgetPage}
                />
                <Route path={ROUTES.HOME} component={HomePage} />
                <Route path={ROUTES.ACCOUNT} component={AccountPage} />
                <Route path={ROUTES.ADMIN} component={AdminPage} />
              </Switch>
            </div>
          </Content>
          <Footer>Copyright ©2019 By Bill Studio</Footer>
        </Layout>
      </Router>
    );
  }
}

export default withAuthentication(App);
