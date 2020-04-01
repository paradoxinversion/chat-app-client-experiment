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
    <div>
      <p>Pending Users</p>
      <div>
        {pendingUsers.map(user => (
          <div>
            <p>{user.username}</p>
            <button
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
