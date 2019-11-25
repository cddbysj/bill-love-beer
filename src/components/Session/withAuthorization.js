import React from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";

import { withFirebase } from "../Firebase";
import AuthUserContext from "./context";
import * as ROUTES from "../../constants/routes";

// 用户权限管理
const withAuthorization = checkAuthorization => Component => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
      // 监听用户登陆状态：sign up, sign in, sign out
      // 一旦发生变化，执行回调函数
      // 举例：
      // 当用户登出时，有些仅限登录用户访问的页面就不可访问，将用户导航到登录页面或者 landing 页面
      this.unsubscribe = this.props.firebase.onAuthUserListener(
        authUser =>
          !checkAuthorization(authUser) && this.props.history.push(ROUTES.HOME),
        () => this.props.history.push(ROUTES.SIGN_IN)
      );
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    render() {
      return (
        <AuthUserContext.Consumer>
          {/* 修复画面闪烁 */}
          {authUser => (authUser ? <Component {...this.props} /> : null)}
        </AuthUserContext.Consumer>
      );
    }
  }
  return compose(withFirebase, withRouter)(WithAuthorization);
};

export default withAuthorization;
