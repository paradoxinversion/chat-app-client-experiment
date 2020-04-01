import React, { useState } from "react";
import AdminBanUser from "./adminBanUser";
import UpdatePassword from "./updatePassword";
import SetPhoto from "./setPhoto";
import SetUsername from "./setUsername";
import AdminPendingUsers from "./adminPendingUsers";
const ControlPanel = ({
  blocklist,
  users,
  socket,
  showUserCP,
  banUserFn,
  isAdmin,
  clientUser
}) => {
  return (
    <div className="flex flex-col h-full">
      <header>
        <p>User Control Panel</p>
        <button
          className="border rounded mt-4 p-2 mb-4"
          onClick={() => {
            showUserCP(false);
          }}>
          Close
        </button>
      </header>
      {isAdmin && (
        <div
          id="cp-admin-controls "
          className="border bg-gray-100 rounded mb-4">
          <p className="ml-4">Admin Controls</p>
          <div className="border m-4 p-4">
            <AdminBanUser
              clientUser={clientUser}
              users={users}
              banUserFn={banUserFn}
              socket={socket}
            />
            <AdminPendingUsers />
          </div>
        </div>
      )}
      <div
        id="cp-user-controls"
        className="border bg-gray-100 rounded flex-grow">
        <SetUsername clientUser={clientUser} socket={socket} />
        <SetPhoto clientUser={clientUser} />
        <UpdatePassword />
        <div className="m-4 border p-4">
          <p className="mb-4">Blocked Users</p>
          <p>Here you can manage your block list.</p>
          {blocklist.length > 0 ? (
            blocklist.map(blockedUserId => {
              const blockedUser = users.find(
                user => user.iid === blockedUserId
              );
              if (blockedUser) {
                return (
                  <div>
                    <span>{blockedUser.username}</span>{" "}
                    <button
                      className="inline rounded bg-gray-200 p-2 border mt-2 ml-4"
                      onClick={() => {
                        socket.emit("unblock-user", blockedUser.id);
                      }}>
                      Unblock
                    </button>
                  </div>
                );
              }
              return null;
            })
          ) : (
            <p>You haven't blocked any users.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
