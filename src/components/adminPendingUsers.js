import React, { useEffect, useState } from "react";
import axios from "axios";
const AdminPendingUsers = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}chattr/pending-users`, {
        withCredentials: true
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
                const res = await axios.post(
                  `${process.env.REACT_APP_SERVER_URL}chattr/confirm-user`,
                  { userId: user._id },
                  {
                    withCredentials: true
                  }
                );
                const newPendingUsers = await axios.get(
                  `${process.env.REACT_APP_SERVER_URL}chattr/pending-users`,
                  {
                    withCredentials: true
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
