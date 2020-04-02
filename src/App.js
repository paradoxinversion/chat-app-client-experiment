import React, { useState, useEffect } from "react";
import ChatRoom from "./components/chatRoom";
import axios from "axios";
import store from "store";
import "./styles/tailwind.css";

export default function App(props) {
  const [appState, setAppState] = useState({
    loggedIn: false
  });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [signinError, setSigninError] = useState(null);

  async function checkStatus() {
    const res = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}chattr/check-auth`,
      { withCredentials: true, headers: { Bearer: store.get("chattr") } }
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
        <div className="flex justify-between items-center p-4">
          <p className=" font-bold text-xl">chattr</p>
          {appState.loggedIn && (
            <button
              className="btn py-2 px-2"
              onClick={async () => {
                const logoutConfirmation = window.confirm("Log out?");
                if (logoutConfirmation) {
                  await axios.get(
                    `${process.env.REACT_APP_SERVER_URL}chattr/logout`,
                    {
                      withCredentials: true,
                      headers: { Bearer: store.get("chattr") }
                    }
                  );
                  store.remove("chattr");
                  document.location.reload();
                }
              }}>
              Log Out
            </button>
          )}
        </div>

        {appState.loggedIn ? (
          <React.Fragment>
            <ChatRoom />
          </React.Fragment>
        ) : (
          <div className="border-t">
            {signupSuccess ? (
              <p className="m-4 text-center">
                You've successfully signed up. You'll need to be confirmed as
                user before you can log in.
              </p>
            ) : (
              <div className="m-4">
                <p className="max-w-lg text-center ml-auto mr-auto">
                  Welcome to the chat room. You'll need to sign up and sign in
                  to get in in the conversation. <br />
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
                    className="border rounded bg-gray-200 mt-4 mb-4"
                    onClick={async e => {
                      e.preventDefault();
                      const serverURL = process.env.REACT_APP_SERVER_URL;
                      try {
                        const result = await axios.post(
                          `${serverURL}chattr/sign-in`,
                          {
                            username,
                            password
                          },
                          { withCredentials: true }
                        );
                        if (result.status === 200) {
                          store.set("chattr", result.data.token);
                          setAppState({ loggedIn: true });
                        } else {
                          setSigninError(result.data.error);
                        }
                      } catch (e) {
                        throw e;
                      }
                    }}>
                    Log In
                  </button>
                  {signinError && <p className="text-red-700">{signinError}</p>}
                  <label htmlFor="password-repeat">
                    If signing up, repeat your password below
                  </label>
                  <input
                    className="border rounded"
                    type="password"
                    name="password-repeat"
                    value={passwordRepeat}
                    onChange={e => {
                      setPasswordRepeat(e.target.value);
                    }}
                    onBlur={() => {
                      debugger;
                      if (password !== passwordRepeat) {
                        setPasswordMismatch(true);
                      } else {
                        setPasswordMismatch(false);
                      }
                    }}
                  />
                  {passwordMismatch && <p>Passwords don't match!</p>}
                  <button
                    className="btn mt-4"
                    onClick={async e => {
                      e.preventDefault();
                      if (!passwordMismatch) {
                        const serverURL = process.env.REACT_APP_SERVER_URL;

                        const signupResult = await axios.post(
                          `${serverURL}chattr/sign-up`,
                          {
                            username,
                            password
                          },
                          { withCredentials: true }
                        );
                        if (signupResult.data.signup === "success") {
                          setSignupSuccess(true);
                        }
                      }
                    }}>
                    Sign Up
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
