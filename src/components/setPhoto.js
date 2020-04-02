import React, { useState, useEffect } from "react";
import axios from "axios";
import store from "store";
const SetPhoto = ({ clientUser, socket }) => {
  const [photoURL, setPhotoURL] = useState("");
  return (
    <form className="m-4 border p-4 lg:flex-grow lg:max-w-md">
      <p className="text-center mb-2">
        {" "}
        <strong>Profile Photo</strong>
      </p>
      <p>
        Here, you can link to a profile photo on the internet. If you're not
        sure where to upload a photo, try imgur. Be sure to include the full
        address, including 'http://' or 'https://.'
      </p>
      <div className="flex">
        <label htmlFor="photo-url">Photo URL</label>
        <input
          type="url"
          name="photo-url"
          value={photoURL}
          autoComplete="off"
          onChange={e => {
            setPhotoURL(e.target.value);
          }}
        />
        <button
          className="btn inline"
          onClick={async e => {
            e.preventDefault();
            socket.emit("set-user-photo", {
              userId: clientUser.iid,
              photoURL
            });
          }}>
          Set
        </button>
      </div>
      {clientUser.profilePhotoURL && (
        <div>
          <p>Current Photo</p>
          <img alt="" className="max-w-xs" src={clientUser.profilePhotoURL} />
        </div>
      )}
    </form>
  );
};

export default SetPhoto;
