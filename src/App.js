import React from "react";
import ChatRoom from "./components/chatRoom";
import "./styles.css";

export default function App(props) {
  return (
    <div className="App h-screen">
      <div id="chat-container" className="max-h-screen h-full flex flex-col">
        <h1 className="m-4 font-bold text-xl">Chat App Client</h1>
        <ChatRoom />
      </div>
    </div>
  );
}
