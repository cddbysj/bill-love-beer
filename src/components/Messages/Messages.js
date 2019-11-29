import React from "react";

import { AuthUserContext } from "../Session";
import { withUsersSubscription } from "../Users";

import MessageList from "./MessageList";

class MessagesBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
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
    event.preventDefault();

    this.props.firebase.messages().push({
      text: this.state.text,
      userId: authUser.uid,
      createdAt: this.props.firebase.serverValue.TIMESTAMP
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
            <form onSubmit={event => this.onCreateMessage(event, authUser)}>
              <input
                name="message"
                value={text}
                type="text"
                onChange={this.onTextChange}
              />
              <button type="submit">Send</button>
            </form>
            {!loading && messages && (
              <button onClick={this.onNextPage}>More</button>
            )}
            {loading && <div>Loading...</div>}
            {messages ? (
              <MessageList
                authUser={authUser}
                users={users}
                messages={messages}
                onRemoveMessage={this.onRemoveMessage}
                onEditMessage={this.onEditMessage}
              />
            ) : (
              <div>No messages yet.</div>
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
