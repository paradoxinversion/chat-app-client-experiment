import React, { useState } from "react";
import moment from "moment";
const Message = props => {
  const m = moment(props.message.time).format("dddd, MMMM Do YYYY, h:mm:ss a");
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className="flex rounded inline-block items-center mb-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        className="rounded-full mr-4 h-16"
        src={props.message.user.avatar}
        alt="the-user"
      />
      <div>
        <p className="font-bold">{props.message.user.username}</p>
        <p>{props.message.message}</p>
        {isHovered ? <p className="text-xs h-4">{m}</p> : <p className="h-4" />}
      </div>
    </div>
  );
};

export default Message;
