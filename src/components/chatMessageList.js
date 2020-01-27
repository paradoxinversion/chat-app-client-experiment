import React, { Fragment } from "react";
import Message from "./message";

/**
 * The ChatMessageList is responsible for displaying the
 * messages in a chat, whether it's public or private.
 * @param {*} param0
 */
const ChatMessageList = ({ messages }) => (
  <Fragment>
    {messages &&
      messages.map(message => (
        <Message key={`${message.id}-${message.time}`} message={message} />
      ))}
  </Fragment>
);

export default ChatMessageList;
