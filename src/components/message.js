import React, { useState } from "react";
import moment from "moment";

/**
 * A Message is visual representation of data sent
 * from a user to the server. It is rendered in a
 * ChatMessageList.
 * @param {*} props
 */
const Message = ({ message, clickFn }) => {
  const m = moment(message.time).format("dddd, MMMM Do YYYY, h:mm:ss a");
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className="flex rounded inline-block items-center mb-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      {message.id === "system" ? (
        <p>{message.message}</p>
      ) : (
        <React.Fragment>
          <img
            className="rounded-full mr-4 h-16"
            src={message.user.avatar}
            alt="the-user"
            onClick={e => {
              if (clickFn) clickFn(e);
            }}
          />
          <div>
            <p className="font-bold">{message.user.username}</p>
            <p>{message.message}</p>
            {isHovered ? (
              <p className="text-xs h-4">{m}</p>
            ) : (
              <p className="h-4" />
            )}
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default Message;
