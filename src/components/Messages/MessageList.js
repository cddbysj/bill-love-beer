import React from "react";

import MessageItem from "./MessageItem";

const MessageList = ({
  authUser,
  users,
  messages,
  onRemoveMessage,
  onEditMessage
}) => (
  <ul>
    {messages.map(message => (
      <MessageItem
        key={message.uid}
        authUser={authUser}
        users={users}
        message={message}
        onRemoveMessage={onRemoveMessage}
        onEditMessage={onEditMessage}
      />
    ))}
  </ul>
);

export default MessageList;
