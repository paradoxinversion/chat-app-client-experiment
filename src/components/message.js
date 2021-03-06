import React, { useState } from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { renderPNGFromArrayBuffer } from "../utils";
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
        <p>
          <strong>{message.message}</strong>
        </p>
      ) : (
        <React.Fragment>
          <img
            className="rounded-full mr-4 h-16 w-16 object-scale-down"
            src={
              message.user.profilePhotoURL
                ? message.user.profilePhotoURL
                : renderPNGFromArrayBuffer(message.user.avatar)
            }
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

Message.propTypes = {
  message: PropTypes.shape({
    time: PropTypes.number,
    id: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    fromUID: PropTypes.string,
    user: PropTypes.shape({
      username: PropTypes.string.isRequired,
      avatar: PropTypes.object.isRequired
    })
  }),
  clickFn: PropTypes.func
};

export default Message;
