import React, { useState } from "react";

/**
 * A User, either in simple avator form at
 * lower resolutins or with a name at higher
 * ones.
 * @param {*} props
 */
const User = props => {
  const [open, setOpenState] = useState(false);
  return (
    // TODO: Make a tooltip or similar for the username at lower breakpoints
    <div
      key={props.user.id}
      className={`inline-block p-1 hover:bg-blue-500 sm:block${
        props.pmNotice ? " bg-red-500" : ""
      }${props.isClient ? " bg-blue-200" : ""}`}>
      <div
        onClick={() => {
          setOpenState(!open);
        }}>
        <img
          src={props.user.avatar}
          alt="user-mini"
          className="rounded w-16 sm:hidden"
          onClick={() => {
            if (props.isClient) {
              if (props.showUserCP) props.showUserCP(true);
            } else {
              if (props.onUserClick) props.onUserClick(props.user);
            }
          }}
        />
        <img
          src={props.user.avatar}
          alt="user-mini"
          className="hidden rounded w-16 sm:block sm:w-24 sm:ml-auto sm:mr-auto md:h-8 md:w-8 md:inline md:m-0 md:mr-2"
        />
        <span className="hidden md:inline text-sm">{props.user.username}</span>
      </div>
      {open && (
        <div className="hidden sm:block">
          {props.isClient ? (
            <button
              className="block rounded border mt-2 bg-gray-100 w-full"
              onClick={e => {
                if (props.showUserCP) props.showUserCP(true);
                setOpenState(false);
              }}>
              Control Panel
            </button>
          ) : (
            <button
              className="block rounded border mt-2 bg-gray-100 w-full"
              onClick={e => {
                if (props.onUserClick) props.onUserClick(props.user);
                setOpenState(false);
              }}>
              Private Chat
            </button>
          )}

          {!props.isClient && (
            <button
              className="block rounded border mt-2 bg-gray-100 w-full"
              onClick={e => {
                if (props.blockUserFn) props.blockUserFn(props.user);
              }}>
              Block
            </button>
          )}
        </div>
      )}
    </div>
  );
};
export default User;
