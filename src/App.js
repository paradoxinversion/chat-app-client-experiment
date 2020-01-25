import React from "react";
import "./styles.css";
import Message from "./components/message";

export default function App(props) {
  return (
    <div className="App">
      <div id="chat-container" className="max-h-screen h-full flex flex-col">
        <h1 className="m-4 font-bold text-xl">Chat App</h1>
        <div
          id="chat-data"
          className="border flex flex-col overflow-y-hidden sm:flex-row"
        >
          <div id="chat-area" className="sm:w-3/4 p-4 overflow-y-scroll">
            {props.data.messages.map(message => (
              <Message key={message.id} message={message} />
            ))}
          </div>
          <div
            id="user-area"
            className="whitespace-no-wrap h-20 sm:border-l sm:h-auto sm:w-1/4 "
          >
            <div className="overflow-x-scroll sm:overflow-x-visible sm:h-full sm:flex sm:flex-col sm:overflow-y-scroll">
              {props.data.users.map(user => (
                <div
                  key={user.id}
                  className="inline-block p-1 hover:bg-blue-500 sm:block"
                >
                  <img
                    src={user.avatar}
                    alt="user-mini"
                    className="rounded w-16 sm:w-24 sm:ml-auto sm:mr-auto md:h-8 md:w-8 md:inline md:m-0 md:mr-2"
                  />
                  <span className="hidden md:inline text-sm">
                    {user.username}
                  </span>
                </div>
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
