import React from "react";
import { List, Typography } from "antd";

import MessageItem from "./MessageItem";

const { Title } = Typography;

const MessageList = ({
  authUser,
  users,
  messages,
  onRemoveMessage,
  onEditMessage
}) => (
  <div>
    <List
      itemLayout="vertical"
      header={<Title level={2}>Messages</Title>}
      dataSource={messages}
      renderItem={message => (
        <MessageItem
          key={message.uid}
          authUser={authUser}
          users={users}
          message={message}
          onRemoveMessage={onRemoveMessage}
          onEditMessage={onEditMessage}
        />
      )}
    />
  </div>
);

export default MessageList;
