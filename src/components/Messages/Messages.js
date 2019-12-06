import React from "react";
import { Button, Input, Spin } from "antd";

import { AuthUserContext } from "../Session";
import { withUsersSubscription } from "../Users";

import MessageList from "./MessageList";

const { TextArea } = Input;

class MessagesBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: null,
      text: "",
      limit: 5,
      loading: false,
      error: null
    };
  }

  componentDidMount() {
    this.onListenForMessages();
  }

  componentWillUnmount() {
    this.props.firebase.messages().off();
  }

  onListenForMessages = () => {
    this.setState({ loading: true });

    this.props.firebase
      .messages()
      .orderByChild("createdAt")
      .limitToLast(this.state.limit)
      .on("value", snapshot => {
        const messagesObject = snapshot.val();
        if (messagesObject) {
          const messages = Object.keys(messagesObject)
            .map(key => ({
              ...messagesObject[key],
              uid: key
            }))
            .reverse();
          this.setState({ loading: false, messages });
        } else {
          this.setState({ loading: false, messages: null });
        }
      });
  };

  // 数据库分页
  onNextPage = () => {
    this.setState(
      state => ({ limit: state.limit + 5 }),
      this.onListenForMessages
    );
  };

  onTextChange = event => {
    this.setState({
      text: event.target.value
    });
  };

  onCreateMessage = (event, authUser) => {
    const { text } = this.state;
    if (!text || !text.trim()) return;
    this.props.firebase.messages().push({
      userId: authUser.uid,
      createdAt: this.props.firebase.serverValue.TIMESTAMP,
      text
    });

    this.setState({ text: "" });
  };

  onRemoveMessage = uid => {
    this.props.firebase
      .message(uid)
      .remove()
      .catch(error => this.setState({ error }));
  };

  onEditMessage = (uid, text) => {
    const { firebase } = this.props;
    firebase
      .message(uid)
      .update({ editedAt: firebase.serverValue.TIMESTAMP, text })
      .catch(error => this.setState({ error }));
  };

  render() {
    const { loading, messages, text, error } = this.state;
    const { users } = this.props;

    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            <TextArea
              name="message"
              value={text}
              onChange={this.onTextChange}
              type="text"
              placeholder="Enter a new message"
              autoSize
              autoFocus
              allowClear
            />
            <Button
              onClick={event => this.onCreateMessage(event, authUser)}
              type="primary"
            >
              Send
            </Button>
            {messages && (
              <MessageList
                authUser={authUser}
                users={users}
                messages={messages}
                onRemoveMessage={this.onRemoveMessage}
                onEditMessage={this.onEditMessage}
              />
            )}
            {loading && (
              <div
                style={{
                  textAlign: "center",
                  padding: 30,
                  borderRadius: "4px"
                }}
              >
                <Spin delay={500} />
              </div>
            )}
            {!loading && messages && (
              <div
                style={{
                  textAlign: "center",
                  marginTop: 12
                }}
              >
                <Button loading={loading} onClick={this.onNextPage}>
                  More
                </Button>
              </div>
            )}

            {error && <div>{error.message}</div>}
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

const selectData = ({ users }) => ({ users });
const Messages = withUsersSubscription(selectData)(MessagesBase);

export default Messages;
