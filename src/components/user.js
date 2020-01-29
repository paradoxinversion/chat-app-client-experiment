import React from "react";

/**
 * A User, either in simple avator form at
 * lower resolutins or with a name at higher
 * ones.
 * @param {*} props
 */
const User = props => (
  // TODO: Make a tooltip or similar for the username at lower breakpoints
  <div
    key={props.user.id}
    className={`inline-block p-1 hover:bg-blue-500 sm:block${
      props.pmNotice ? " bg-red-500" : ""
    }${props.isClient ? " bg-blue-200" : ""}`}
    onClick={() => {
      if (props.onUserClick) props.onUserClick(props.user);
    }}>
    <img
      src={props.user.avatar}
      alt="user-mini"
      className="rounded w-16 sm:w-24 sm:ml-auto sm:mr-auto md:h-8 md:w-8 md:inline md:m-0 md:mr-2"
    />
    <span className="hidden md:inline text-sm">{props.user.username}</span>
  </div>
);
export default User;
