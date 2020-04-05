import React, { Fragment } from "react";
import Message from "./message";
import PropTypes from "prop-types";

/**
 * The ChatMessageList is responsible for displaying the
 * messages in a chat, whether it's public or private.
 * @param {*} param0
 */
const ChatMessageList = ({ messages, blocklist = [], blockedBy = [] }) => (
  <Fragment>
    {messages &&
      messages
        .filter(message => {
          if (
            message.id === "system" ||
            (!blocklist.map(user => user.userId).includes(message.fromUID) &&
              !blockedBy.map(user => user.userId).includes(message.fromUID))
          )
            return true;
        })
        .map(message => (
          <Message key={`${message.id}-${message.time}`} message={message} />
        ))}
  </Fragment>
);

ChatMessageList.propTypes = {
  blocklist: PropTypes.arrayOf(PropTypes.object),
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      time: PropTypes.number,
      id: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      fromUID: PropTypes.string,
      user: PropTypes.shape({
        username: PropTypes.string.isRequired,
        avatar: PropTypes.object.isRequired
      })
    })
  )
};

export default ChatMessageList;
