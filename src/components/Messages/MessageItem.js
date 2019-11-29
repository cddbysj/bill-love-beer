import React from "react";

import "./MessageItem.scss";

const EVENT_KEY_ENTER = "Enter";
const EVENT_TYPE_CLICK = "click";

class MessageItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      editText: ""
    };
  }

  onToggleEditMode = () => {
    this.setState(state => ({
      editMode: !state.editMode,
      editText: this.props.message.text
    }));
  };

  onChangeEditText = event => {
    this.setState({ editText: event.target.value });
  };

  onSaveEditText = event => {
    if (event.key === EVENT_KEY_ENTER || event.type === EVENT_TYPE_CLICK) {
      this.props.onEditMessage(this.props.message.uid, this.state.editText);
      this.setState({ editMode: false });
    }
  };

  render() {
    const { authUser, users, message, onRemoveMessage } = this.props;
    const { editMode } = this.state;
    const isMessageOwner = authUser.uid === message.userId;
    const messageAuthor = users && users[message.userId].username;
    const messageTime = message.editedAt
      ? `edited at ${new Date(message.editedAt).toLocaleString()}`
      : `created at ${new Date(message.createdAt).toLocaleString()}`;

    return (
      <li className="message-item">
        {isMessageOwner && editMode ? (
          <div>
            <input
              value={this.state.editText}
              onChange={this.onChangeEditText}
              type="text"
              onKeyDown={this.onSaveEditText}
              placeholder="Edit your message"
              autoFocus
            />
            <button onClick={this.onSaveEditText}>Update</button>
            <button onClick={this.onToggleEditMode}>Reset</button>
          </div>
        ) : (
          <div className="message-text">{message.text}</div>
        )}
        <span className="message-author">{messageAuthor}</span>{" "}
        <span className="message-time">{messageTime}</span>
        {isMessageOwner && !editMode && (
          <div>
            <button onClick={this.onToggleEditMode}>Edit</button>
            <button onClick={() => onRemoveMessage(message.uid)}>Delete</button>
          </div>
        )}
      </li>
    );
  }
}

export default MessageItem;
