import React from "react";
import axios from "axios";
import store from "store";

class AdminBanUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedUser: "",
      bannedUsers: [],
      initalCheck: false,
      allUsers: []
    };
  }

  async componentDidMount() {
    const usersRes = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}chattr/users`,
      {
        withCredentials: true,
        headers: { Bearer: store.get("chattr") }
      }
    );

    const bannedRes = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}chattr/banned-users`,
      {
        withCredentials: true,
        headers: { Bearer: store.get("chattr") },
        params: { accountStatus: 2 }
      }
    );
    this.setState({
      allUsers: usersRes.data.users,
      bannedUsers: bannedRes.data.users
    });
  }

  componentWillUnmount() {
    this.props.socket.off("get-banned-users");
    console.log("socket off?");
  }
  render() {
    return (
      <div className="border">
        <p className="text-center">User Banning</p>

        <div className="p-4">
          <form id="admin-ban-user-list">
            <select
              className="border rounded appearance-none p-1"
              onChange={e => {
                this.setState({ selectedUser: e.target.value });
              }}>
              <option value="">Select a user</option>
              {this.state.allUsers
                .filter(user => user._id !== this.props.clientUser.userId)
                .map(user => (
                  <option value={user._id}>{user.username}</option>
                ))}
            </select>
            <button
              className="inline rounded bg-gray-200 p-2 border mt-2 ml-4"
              onClick={e => {
                e.preventDefault();
                this.props.banUserFn(this.state.selectedUser);
                this.setState({
                  allUsers: this.state.bannedUsers.filter(
                    user => user._id !== this.state.selectedUser
                  )
                });
              }}>
              Ban User
            </button>
          </form>
          <form id="admin-unban-user-list">
            <select
              className="border rounded appearance-none p-1"
              onChange={e => {
                this.setState({ selectedUser: e.target.value });
              }}>
              <option value="">Select a user</option>
              {this.state.bannedUsers
                .filter(user => user.id !== this.props.clientUser.id)
                .map(user => (
                  <option value={user._id}>{user.username}</option>
                ))}
            </select>
            <button
              className="inline rounded bg-gray-200 p-2 border mt-2 ml-4"
              onClick={e => {
                e.preventDefault();
                this.props.socket.emit("change-user-account-status", {
                  userIID: this.state.selectedUser,
                  status: 0
                });
                this.setState({
                  bannedUsers: this.state.bannedUsers.filter(
                    user => user._id !== this.state.selectedUser
                  )
                });
              }}>
              Unban User
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default AdminBanUser;

// ! The hooks version of this breaks when trying to get user data...
// import React, { useState, useEffect } from "react";

// const AdminBanUser = ({ clientUser, users, banUserFn, socket }) => {
//   const [selectedUser, setSelectedUser] = useState("");
//   const [bannedUsers, setBannedUsers] = useState({
//     initialCheck: false,
//     users: []
//   });
//   socket.emit("get-banned-users");
//   useEffect(() => {
//     function getBannedUsers() {
//       if (!bannedUsers.initialCheck) {
//         setBannedUsers({ initialCheck: true });
//       }
//       setBannedUsers({ initialCheck: true });
//     }
//     getBannedUsers();
//     socket.on("get-banned-users", ({ users }) => {
//       console.log("BANNED USERS", users);
//       setBannedUsers(users);
//     });
//   }, [bannedUsers.initialCheck]);
//   return (
//     <form>
//       <select
//         onChange={e => {
//           setSelectedUser(e.target.value);
//         }}>
//         <option value="">Select a user</option>
//         {users
//           .filter(user => user.id !== clientUser.id)
//           .map(user => (
//             <option value={user.id}>{user.username}</option>
//           ))}
//       </select>
//       <button
//         onClick={e => {
//           e.preventDefault();
//           banUserFn(selectedUser);
//         }}>
//         Ban User
//       </button>
//     </form>
//   );
// };

// export default AdminBanUser;
