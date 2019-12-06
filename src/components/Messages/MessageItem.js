import React from "react";
import { Button, Typography, List, Icon, Avatar, Input } from "antd";

const FAKE_AVATAR_URL =
  "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png";

const { Text } = Typography;
const { TextArea } = Input;

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
    const { editText } = this.state;
    if (!editText || !editText.trim()) return;
    this.props.onEditMessage(this.props.message.uid, editText);
    this.setState({ editMode: false });
  };

  render() {
    const { authUser, users, message, onRemoveMessage } = this.props;
    const { editMode, editText } = this.state;
    const isMessageOwner = authUser.uid === message.userId;
    const messageAuthor = users && users[message.userId].username;
    const messageTime = message.editedAt
      ? `edited at ${new Date(message.editedAt).toLocaleString()}`
      : `created at ${new Date(message.createdAt).toLocaleString()}`;

    return (
      <List.Item className="message-item">
        <List.Item.Meta
          avatar={<Avatar src={message.photoURL || FAKE_AVATAR_URL} />}
          title={<Text>{messageAuthor}</Text>}
          description={
            <Text type="secondary" className="message-time">
              {messageTime}
            </Text>
          }
        />
        {isMessageOwner && editMode ? (
          <div>
            <TextArea
              value={editText}
              onChange={this.onChangeEditText}
              type="text"
              placeholder="Edit your message"
              autoSize
              autoFocus
            />
            <Button.Group>
              <Button type="primary" onClick={this.onSaveEditText}>
                <Icon type="enter" title="update" />
                Enter
              </Button>
              <Button onClick={this.onToggleEditMode}>
                <Icon type="undo" title="reset" />
                Reset
              </Button>
            </Button.Group>
          </div>
        ) : (
          <Text className="message-text">{message.text}</Text>
        )}
        {isMessageOwner && !editMode && (
          <div>
            <Button type="link" shape="circle" onClick={this.onToggleEditMode}>
              <Icon type="edit" theme="twoTone" title="edit" />
            </Button>
            <Button
              type="link"
              shape="circle"
              onClick={() => onRemoveMessage(message.uid)}
            >
              <Icon type="delete" theme="twoTone" title="delete" />
            </Button>
          </div>
        )}
      </List.Item>
    );
  }
}

export default MessageItem;
