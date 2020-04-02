import React, { useState } from "react";
import axios from "axios";
import store from "store";
const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");
  const [passwordUpdateResult, setPasswordUpdateResult] = useState(null);
  const [passwordUpdateError, setPasswordUpdateError] = useState(null);
  return (
    <form className="m-4 border p-4 flex flex-col lg:flex-grow lg:max-w-sm">
      <p className="text-center mb-2">
        <strong>Change Password</strong>
      </p>
      <p>Here, you can update your password.</p>
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
        className="btn mt-2"
        onClick={async e => {
          e.preventDefault();
          if (newPassword === repeatNewPassword) {
            const res = await axios.post(
              `${process.env.REACT_APP_SERVER_URL}chattr/update-password`,
              { old: oldPassword, new: newPassword },
              {
                withCredentials: true,
                headers: { Bearer: store.get("chattr") }
              }
            );
            if (res.status === 200) {
              if (passwordUpdateError) setPasswordUpdateError(null);
              setPasswordUpdateResult(res.data.result);
            } else {
              if (passwordUpdateResult) setPasswordUpdateResult(null);
              setPasswordUpdateError(res.data.error);
            }
          } else {
            setPasswordUpdateError("New passwords do not match.");
          }
        }}>
        Change Password
      </button>
      {passwordUpdateResult && (
        <div className="text-green-700">{passwordUpdateResult}</div>
      )}
      {passwordUpdateError && (
        <div className="text-red-700">{passwordUpdateError}</div>
      )}
    </form>
  );
};

export default UpdatePassword;
