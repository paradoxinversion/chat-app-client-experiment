import React, { useState } from "react";
const SetUsername = ({ clientUser, socket }) => {
  const [username, setUsername] = useState(clientUser.username);

  return (
    <form className="m-4 inline-block border p-4">
      <p className="text-center mb-2">Change Username</p>
      <p>
        Here you can change your username.{" "}
        <strong>
          Your username is your login. Don't change it if you want to keep it,
          and <em>do not forget it or you will be unable to log in</em>
        </strong>
      </p>
      <input
        className="border"
        type="text"
        name="usernameChange"
        onChange={e => {
          setUsername(e.target.value);
        }}
        value={username}
      />
      <button
        className="block border w-full mt-2"
        onClick={e => {
          e.preventDefault();
          socket.emit("set-username", {
            username: username,
            user: clientUser.iid
          });
        }}>
        Change Username
      </button>
    </form>
  );
};

export default SetUsername;
