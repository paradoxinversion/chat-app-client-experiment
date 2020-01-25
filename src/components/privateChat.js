import React from "react";

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
    <div className="border flex-grow p-4">
      {/* TODO: Make some fake data  */}
    </div>
  </div>
);

export default PrivateChat;
