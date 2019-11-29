// ** 高阶组件实践 ** //
// 复用原本分散在各个生命周期方法内的逻辑:
// 1. 组件挂载时，订阅来自 firebase 的用户数据源
// 2. 当数据源发生变化，调用 setState 刷新状态
// 3. 组件卸载时，取消订阅
// 参考：https://zh-hans.reactjs.org/docs/higher-order-components.html

import React from "react";
import { withFirebase } from "../Firebase";

const getDisplayName = WrappedComponent =>
  WrappedComponent.displayName || WrappedComponent.name || "Component";

const withUsersSubscription = selectData => Component => {
  class WithUsers extends React.Component {
    constructor(props) {
      super(props);
      this.state = { users: null, loading: false };
    }

    componentDidMount() {
      this.setState({ loading: true });
      this.props.firebase.users().on("value", snapshot => {
        const selectedData = selectData(
          { users: snapshot.val(), loading: false },
          this.props
        );
        this.setState(selectedData);
      });
    }

    componentWillUnmount() {
      this.props.firebase.users().off();
    }

    render() {
      return (
        <Component
          users={this.state.users}
          {...this.props}
        />
      );
    }
  }

  WithUsers.displayName = `WithUsers(${getDisplayName(Component)})`;
  return withFirebase(WithUsers);
};

export default withUsersSubscription;
