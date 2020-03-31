import React, { useState } from "react";
import axios from "axios";
const SetPhoto = () => {
  // const httpRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
  const [photoURL, setPhotoURL] = useState("");
  return (
    <form>
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
    </form>
  );
};

export default SetPhoto;
