import React from "react";
import ChatMessageList from "./chatMessageList";
import PropTypes from "prop-types";

const PrivateChat = props => (
  <div className="flex flex-col h-full">
    <div className="flex items-center mb-8">
      <img
        src={props.user.avatar}
        alt={props.user.username}
        className="border-2 mr-4 inline-block rounded-full w-16 h-16"
      />
      <div>
        <p>Private chat with</p>
        <p className="text-2xl">{props.user.username}</p>
        <button
          className="border rounded p-4"
          onClick={() => {
            props.blockUser(props.user);
            props.onPrivateChatExit();
          }}>
          Block {props.user.username}
        </button>
      </div>
    </div>
    <div onChange={props.setChatScrollState} className="border flex-grow p-4">
      <ChatMessageList messages={props.userChatMessages} />
      <div id="pm-bottom" />
      <button className="border rounded p-4" onClick={props.onPrivateChatExit}>
        Exit Private Chat
      </button>
    </div>
  </div>
);

PrivateChat.propTypes = {
  user: PropTypes.shape({
    avatar: PropTypes.string,
    username: PropTypes.string
  }),
  userChatMessages: PropTypes.arrayOf(
    PropTypes.shape({
      time: PropTypes.number,
      id: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      fromUID: PropTypes.string,
      user: PropTypes.shape({
        username: PropTypes.string.isRequired,
        avatar: PropTypes.string.isRequired
      })
    })
  ),
  setChatScrollState: PropTypes.func.isRequired,
  onPrivateChatExit: PropTypes.func.isRequired,
  blockUser: PropTypes.func.isRequired
};

export default PrivateChat;
