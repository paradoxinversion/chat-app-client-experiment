import React, { useState } from "react";
import axios from "axios";
const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");
  return (
    <form className="m-4 border p-4">
      <p>Change Password</p>
      <label htmlFor="old-password">Old Password</label>
      <input
        type="password"
        name="old-password"
        value={oldPassword}
        onChange={e => {
          setOldPassword(e.target.value);
        }}
      />
      <label htmlFor="new-password">New Password</label>
      <input
        type="password"
        name="new-password"
        value={newPassword}
        onChange={e => {
          setNewPassword(e.target.value);
        }}
      />
      <label htmlFor="new-password-repeat">Repeat New Password</label>
      <input
        type="password"
        name="new-password-repeat"
        value={repeatNewPassword}
        onChange={e => {
          setRepeatNewPassword(e.target.value);
        }}
      />
      <button
        onClick={async () => {
          if (newPassword == repeatNewPassword) {
            const res = await axios.post(
              `${process.env.REACT_APP_SERVER_URL}chattr/update-password`,
              { old: oldPassword, new: newPassword },
              { withCredentials: true }
            );
            console.log(res);
          } else {
            console.log("Password mismatch");
          }
        }}>
        Change Password
      </button>
    </form>
  );
};

export default UpdatePassword;
