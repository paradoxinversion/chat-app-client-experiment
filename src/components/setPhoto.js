import React, { useState } from "react";
import axios from "axios";
const SetPhoto = ({ clientUser }) => {
  // const httpRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
  const [photoURL, setPhotoURL] = useState("");
  return (
    <form className="m-4 border p-4">
      <p>Profile Photo</p>
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
          className="inline"
          onClick={async e => {
            e.preventDefault();
            // console.log(photoURL.match(httpRegex));
            // if (photoURL.match(httpRegex)) {
            await axios.post(
              `${process.env.REACT_APP_SERVER_URL}chattr/set-photo`,
              { photoURL },
              { withCredentials: true }
            );
            // }
          }}>
          Set
        </button>
      </div>
      {clientUser.profilePhotoURL && (
        <div>
          <p>Current Photo</p>
          <img alt="" src={clientUser.profilePhotoURL} />
        </div>
      )}
    </form>
  );
};

export default SetPhoto;
