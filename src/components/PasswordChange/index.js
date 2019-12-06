import React from "react";
import { Form, Input, Button, message } from "antd";
import { withFirebase } from "../Firebase";
import { compose } from "recompose";

const UPDATE_PASSWORD_KEY = "UPDATE_PASSWORD_KEY";

const INITIAL_STATE = {
  error: null,
  confirmDirty: false
};

class PasswordChangeFormBase extends React.Component {
  state = { ...INITIAL_STATE };

  onSubmit = event => {
    event.preventDefault();
    const { firebase } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { password } = values;
        console.log("Received values of form: ", values);
        message.loading({ content: "Updating...", key: UPDATE_PASSWORD_KEY });
        firebase
          .doPasswordUpdate(password)
          .then(() =>
            message.success({ content: "Updated", key: UPDATE_PASSWORD_KEY })
          )
          .catch(error => this.setState({ error }));
      }
    });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue("password")) {
      callback("Two passwords that you enter is inconsistent!");
    } else {
      callback();
    }
  };

  // 这一步的目的：在用户输入确认密码后，回来修改第一密码的时候进行校验
  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 8 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 8 },
        sm: { span: 8 }
      }
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
      }
    };

    return (
      <Form {...formItemLayout} onSubmit={this.onSubmit}>
        <Form.Item label="Password" hasFeedback>
          {getFieldDecorator("password", {
            rules: [
              {
                required: true,
                message: "Please input your password!"
              },
              {
                min: 6,
                max: 28,
                mesaage: "The password must be between 6-28 characters."
              },
              {
                validator: this.validateToNextPassword
              }
            ]
          })(<Input.Password />)}
        </Form.Item>
        <Form.Item label="Confirm Password" hasFeedback>
          {getFieldDecorator("confirm", {
            rules: [
              {
                required: true,
                message: "Please confirm your password!"
              },
              {
                validator: this.compareToFirstPassword
              }
            ]
          })(<Input.Password onBlur={this.handleConfirmBlur} />)}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Reset
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const PasswordChangeForm = compose(
  withFirebase,
  Form.create({})
)(PasswordChangeFormBase);

const PasswordChangePage = () => (
  <div>
    <h1>PasswordChangePage</h1>
    <PasswordChangeForm />
  </div>
);

export default PasswordChangePage;
export { PasswordChangeForm };
