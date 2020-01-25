import React from "react";
import "./styles.css";
import User from "./components/user";
import RoomChat from "./components/roomChat";
import PrivateChat from "./components/privateChat";

export default function App(props) {
  return (
    <div className="App h-screen">
      <div id="chat-container" className="max-h-screen h-full flex flex-col">
        <h1 className="m-4 font-bold text-xl">Chat App Client</h1>
        <div
          id="chat-data"
          className="border flex flex-col flex-grow overflow-y-hidden sm:flex-row"
        >
          <div
            id="chat-area"
            className="flex-grow sm:w-3/4 p-4 overflow-y-scroll"
          >
            <RoomChat messages={props.data.messages} />
            {/* <PrivateChat user={props.data.users[0]}/> */}
          </div>
          <div
            id="user-area"
            className="whitespace-no-wrap h-20 sm:border-l sm:h-auto sm:w-1/4 "
          >
            <div className="overflow-x-scroll sm:overflow-x-visible sm:h-full sm:flex sm:flex-col sm:overflow-y-scroll">
              {props.data.users.map(user => (
                <User user={user} />
              ))}
            </div>
          </div>
        </div>
        <div id="user-input">
          <div id="input-area" className="flex">
            <textarea className="flex-grow resize-none border m-2" />
            <button className="border p-2 m-2">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
