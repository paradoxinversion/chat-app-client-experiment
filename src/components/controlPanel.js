import React, { useEffect, useState } from "react";
import AdminBanUser from "./adminBanUser";
import UpdatePassword from "./updatePassword";
import SetPhoto from "./setPhoto";
import SetUsername from "./setUsername";
import AdminPendingUsers from "./adminPendingUsers";
import AdminAllUsers from "./adminAllUsers";
import axios from "axios";
import store from "store";
const ControlPanel = ({
  blocklist,
  users,
  socket,
  showUserCP,
  banUserFn,
  isAdmin,
  clientUser,
}) => {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  useEffect(() => {
    if (blocklist.length > 0) {
      axios
        .get(`${process.env.REACT_APP_SERVER_URL}chattr/blocked-users`, {
          withCredentials: true,
          params: { userIds: blocklist },
          headers: { Bearer: store.get("chattr") },
        })
        .then((res) => {
          if (res.status === 200) {
            setBlockedUsers(res.data.names);
          } else {
            setFetchError(res.data.error);
          }
        });
    }
  }, []);
  return (
    <div className="flex flex-col h-full">
      <header>
        <p className="text-xl">User Control Panel</p>
        <button
          className="border rounded mt-4 p-2 mb-4"
          onClick={() => {
            showUserCP(false);
          }}
        >
          Close
        </button>
      </header>
      {isAdmin && (
        <div
          id="cp-admin-controls "
          className="border bg-gray-100 rounded p-2 mt-4"
        >
          <p className="text-lg">Admin Controls</p>
          <div className="flex flex-col md:flex-row">
            <AdminBanUser
              clientUser={clientUser}
              users={users}
              banUserFn={banUserFn}
              socket={socket}
            />
            <AdminPendingUsers />
            <AdminAllUsers clientUser={clientUser} />
          </div>
        </div>
      )}
      <div
        id="cp-user-controls"
        className="border bg-gray-100 rounded flex-grow lg:flex lg:flex-wrap lg:justify-between"
      >
        <div className="m-4 border p-4 flex-grow lg:max-w-sm xl:w-1/2">
          <p className="mb-4">Blocked Users</p>
          <p>Here you can manage your block list.</p>
          {blockedUsers.length > 0 ? (
            blockedUsers.map((blockedUser) => {
              return (
                <div>
                  <span>{blockedUser.username}</span>{" "}
                  <button
                    className="inline rounded bg-gray-200 p-2 border mt-2 ml-4"
                    onClick={() => {
                      socket.emit("unblock-user", blockedUser.userId);
                      axios
                        .get(
                          `${process.env.REACT_APP_SERVER_URL}chattr/blocked-users`,
                          {
                            withCredentials: true,
                            params: { userIds: blocklist },
                            headers: { Bearer: store.get("chattr") },
                          }
                        )
                        .then((res) => {
                          if (res.status === 200) {
                            setBlockedUsers(res.data.names);
                          } else {
                            setFetchError(res.data.error);
                          }
                        });
                    }}
                  >
                    Unblock
                  </button>
                </div>
              );
            })
          ) : (
            <p>You haven't blocked any users.</p>
          )}
        </div>
        <SetUsername clientUser={clientUser} socket={socket} />
        <SetPhoto clientUser={clientUser} socket={socket} />
        <UpdatePassword />
      </div>
    </div>
  );
};

export default ControlPanel;
