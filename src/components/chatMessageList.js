import React, { Fragment } from "react";
import Message from "./message";

/**
 * The ChatMessageList is responsible for displaying the
 * messages in a chat, whether it's public or private.
 * @param {*} param0
 */
const ChatMessageList = ({ messages, blocklist = [] }) => (
  <Fragment>
    {messages &&
      messages
        .filter(message => !blocklist.includes(message.fromUID))
        .map(message => (
          <Message key={`${message.id}-${message.time}`} message={message} />
        ))}
  </Fragment>
);

export default ChatMessageList;
