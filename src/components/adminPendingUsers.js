import React, { useEffect, useState } from "react";
import axios from "axios";
import store from "store";
const AdminPendingUsers = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}chattr/pending-users`, {
        withCredentials: true,
        headers: { Bearer: store.get("chattr") }
      })
      .then(res => {
        console.log(res);
        setPendingUsers(res.data.pendingUsers);
      });
  }, []);
  return (
    <div className="border mt-4 md:mt-0 md:flex-grow md:max-w-sm">
      <p className="text-center">Pending Users</p>
      <div className="p-4">
        {pendingUsers.map(user => (
          <div className=" rounded flex justify-between">
            <span className="mr-4">{user.username}</span>
            <button
              className="border px-2 py-1 rounded items-center"
              onClick={async () => {
                await axios.post(
                  `${process.env.REACT_APP_SERVER_URL}chattr/confirm-user`,
                  { userId: user._id },
                  {
                    withCredentials: true,
                    headers: { Bearer: store.get("chattr") }
                  }
                );
                const newPendingUsers = await axios.get(
                  `${process.env.REACT_APP_SERVER_URL}chattr/pending-users`,
                  {
                    withCredentials: true,
                    headers: { Bearer: store.get("chattr") }
                  }
                );
                setPendingUsers(newPendingUsers.data.pendingUsers);
              }}>
              Confirm
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPendingUsers;
