import React from "react";
import PropTypes from "prop-types";
/**
 * ChatNotices should appear at the top of a chat, or during
 * chat.
 * @param {*} param0
 */
const ChatNotice = ({ heading, text }) => (
  <div className="rounded bg-orange-400 m-auto mt-4 mb-4 p-4 text-center max-w-md md:ml-4">
    <p className="font-bold text-lg">{heading}</p>
    <p>{text}</p>
  </div>
);

ChatNotice.proTypes = {
  heading: PropTypes.string,
  text: PropTypes.string.isRequired
};

export default ChatNotice;
