import React, { useState, useEffect } from "react";
import ChatRoom from "./components/chatRoom";
import axios from "axios";
import "./styles/tailwind.css";

export default function App(props) {
  const [appState, setAppState] = useState({
    loggedIn: false
  });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  async function checkStatus() {
    const res = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}chattr/check-auth`,
      { withCredentials: true }
    );
    if (res.data.login === "success") {
      setAppState({ loggedIn: true });
      setUsername("");
      setPassword("");
    }
  }
  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <div className="App h-screen">
      <div id="chat-container" className="max-h-screen h-full flex flex-col">
        <h1 className="m-4 mb-0 font-bold text-xl ml-auto mr-auto">chattr</h1>

        {appState.loggedIn ? (
          <React.Fragment>
            {/* <div
              className="btn w-40 self-end mb-2 content-center flex"
              onClick={async () => {
                const logoutResult = await axios.get(
                  `${process.env.REACT_APP_SERVER_URL}chattr/logout`,
                  { withCredentials: true }
                );
                document.location.reload();
              }}>
              <span>Logout</span>
              <svg
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-8 h-8 inline">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div> */}
            <button
              className="btn w-40 self-end mb-2 justify-center flex py-2"
              onClick={async () => {
                const logoutResult = await axios.get(
                  `${process.env.REACT_APP_SERVER_URL}chattr/logout`,
                  { withCredentials: true }
                );
                document.location.reload();
              }}>
              Log Out
            </button>
            <ChatRoom />
          </React.Fragment>
        ) : (
          <div className="border-t">
            <div className="m-4">
              <p className="max-w-lg text-center ml-auto mr-auto">
                Welcome to the chat room. You'll need to sign up and sign in to
                get in in the conversation. <br />
                Don't be a jerk.
              </p>
              <form className="bg-gray-100 flex flex-col max-w-md p-4 ml-auto mr-auto mt-4 border rounded">
                <label htmlFor="username">Username</label>
                <input
                  className="border rounded"
                  name="username"
                  id="username"
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
                <label htmlFor="password">Password</label>
                <input
                  className="border rounded"
                  name="password"
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  className="border rounded bg-gray-200 mt-4"
                  onClick={async e => {
                    e.preventDefault();
                    const serverURL = process.env.REACT_APP_SERVER_URL;
                    const result = await axios.post(
                      `${serverURL}chattr/sign-in`,
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
                  className="btn"
                  onClick={async e => {
                    e.preventDefault();
                    const serverURL = process.env.REACT_APP_SERVER_URL;

                    const result = await axios.post(
                      `${serverURL}chattr/sign-up`,
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
          </div>
        )}
      </div>
    </div>
  );
}
