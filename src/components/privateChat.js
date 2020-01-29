import React from "react";
import ChatMessageList from "./chatMessageList";

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
      </div>
    </div>
    <div onChange={props.setChatScrollState} className="border flex-grow p-4">
      <ChatMessageList messages={props.userChatMessages} />
      <div id="pm-bottom" />
      <button className="border p-4" onClick={props.onPrivateChatExit}>
        Exit Private Chat
      </button>
    </div>
  </div>
);

export default PrivateChat;
