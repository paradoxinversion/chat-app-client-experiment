import React, { useEffect, useState } from "react";
import axios from "axios";
import store from "store";
const AdminAllUsers = ({ clientUser }) => {
  const [users, setUsers] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}chattr/users`, {
        withCredentials: true,
        headers: { Bearer: store.get("chattr") }
      })
      .then(res => {
        if (res.status === 200) {
          setUsers(res.data.users);
        } else {
          setFetchError(res.data.error);
        }
      });
  }, []);
  return (
    <div className="border mt-4 md:mt-0 md:flex-grow md:max-w-sm">
      <p className="text-center">Pending Users</p>
      <div className="p-4">
        {users
          .filter(user => user._id !== clientUser.iid)
          .map(user => (
            <div className=" rounded flex justify-between">
              <span className="mr-4">{user.username}</span>
              <button
                className="border px-2 py-1 rounded items-center"
                onClick={async () => {
                  const deleteConfirmation = window.confirm(
                    `You are about to delete ${user.username}. Are you sure?`
                  );
                  if (deleteConfirmation) {
                    await axios.delete(
                      `${process.env.REACT_APP_SERVER_URL}chattr/user`,
                      {
                        withCredentials: true,
                        headers: { Bearer: store.get("chattr") },
                        data: { userId: user._id }
                      }
                    );
                    setUsers(users.filter(u => u._id !== user._id));
                  }
                }}>
                Delete
              </button>
            </div>
          ))}
      </div>
      {fetchError && <p className="text-red-700">{fetchError}</p>}
    </div>
  );
};

export default AdminAllUsers;
