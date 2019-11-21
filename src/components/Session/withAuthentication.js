import React from "react";
import AuthUserContext from "./context";
import { withFirebase } from "../Firebase";

// 由于需要通过生命周期钩子来获取 firebase 的验证用户
// 这里使用 class 组件
const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);
      this.state = { authUser: JSON.parse(localStorage.getItem("authUser")) };
    }

    // 启动 firebase 提供的监听用户验证状态的函数
    componentDidMount() {
      this.unsubscribe = this.props.firebase.onAuthUserListener(
        authUser => {
          // 用户验证本地持久化
          localStorage.setItem("authUser", JSON.stringify(authUser));
          this.setState({ authUser });
        },
        () => {
          localStorage.removeItem("authUser");
          this.setState({ authUser: null });
        }
      );
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    render() {
      return (
        <AuthUserContext.Provider value={this.state.authUser}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }
  return withFirebase(WithAuthentication);
};

export default withAuthentication;
