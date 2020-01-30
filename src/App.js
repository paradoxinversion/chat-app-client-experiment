import React, { useState } from "react";
import ChatRoom from "./components/chatRoom";
import axios from "axios";
import "./styles.css";
//
export default function App(props) {
  const [appState, setAppState] = useState({
    loggedIn: false
  });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="App h-screen">
      <div id="chat-container" className="max-h-screen h-full flex flex-col">
        <h1 className="m-4 font-bold text-xl">Chat App Client</h1>
        <p>You are highlighted in light blue.</p>
        {appState.loggedIn ? (
          <ChatRoom />
        ) : (
          <div>
            <form>
              <label htmlFor="username">Username</label>
              <input
                className="border"
                name="username"
                id="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
              <label htmlFor="password">Password</label>
              <input
                className="border"
                name="password"
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button
                className="border"
                onClick={async e => {
                  e.preventDefault();
                  const serverURL =
                    process.env.NODE_ENV === "development"
                      ? process.env.REACT_APP_SERVER_URL_DEV
                      : process.env.REACT_APP_SERVER_URL_PROD;
                  const result = await axios.post(
                    `${serverURL}sign-in`,
                    {
                      username,
                      password
                    },
                    { withCredentials: true }
                  );
                  if (result.data.login === "success") {
                    setAppState({ loggedIn: true });
                  }
                }}>
                Log In
              </button>
              <button
                className="border"
                onClick={async e => {
                  e.preventDefault();
                  const serverURL =
                    process.env.NODE_ENV === "development"
                      ? process.env.REACT_APP_SERVER_URL_DEV
                      : process.env.REACT_APP_SERVER_URL_PROD;
                  const result = await axios.post(
                    `${serverUrl}sign-up`,
                    {
                      username,
                      password
                    },
                    { withCredentials: true }
                  );
                }}>
                Sign Up
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
