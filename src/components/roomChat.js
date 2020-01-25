import React, { Fragment } from "react";
import Message from "./message";

const RoomChat = props => (
  <Fragment>
    <div className="rounded bg-orange-400 m-auto mt-4 mb-4 p-4 text-center max-w-md md:ml-4">
      <p className="font-bold text-lg">Notice</p>
      <p>
        This client has no backend architecture (yet). It's just an example of
        what could be.
      </p>
    </div>
    {props.messages.map(message => (
      <Message key={message.id} message={message} />
    ))}
  </Fragment>
);

export default RoomChat;
