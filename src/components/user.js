import React from "react";

const User = props => (
  <div
    key={props.user.id}
    className="inline-block p-1 hover:bg-blue-500 sm:block"
  >
    <img
      src={props.user.avatar}
      alt="user-mini"
      className="rounded w-16 sm:w-24 sm:ml-auto sm:mr-auto md:h-8 md:w-8 md:inline md:m-0 md:mr-2"
    />
    <span className="hidden md:inline text-sm">{props.user.username}</span>
  </div>
);
export default User;
