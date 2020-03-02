import React, { useState, useEffect } from "react";

class AdminBanUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedUser: "",
      bannedUsers: [],
      initalCheck: false
    };
  }

  componentDidMount() {
    this.props.socket.emit("get-banned-users");
    this.props.socket.on("get-banned-users", ({ users }) => {
      console.log("BANNED USERS", users);
      this.setState({ bannedUsers: users });
    });
  }
  render() {
    return (
      <div>
        <form id="admin-ban-user-list">
          <select
            onChange={e => {
              this.setState({ selectedUser: e.target.value });
            }}>
            <option value="">Select a user</option>
            {this.props.users
              .filter(user => user.id !== this.props.clientUser.id)
              .map(user => (
                <option value={user.id}>{user.username}</option>
              ))}
          </select>
          <button
            onClick={e => {
              e.preventDefault();
              this.props.banUserFn(this.state.selectedUser);
            }}>
            Ban User
          </button>
        </form>
        <form id="admin-unban-user-list">
          <select
            onChange={e => {
              debugger;
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
            onClick={e => {
              e.preventDefault();
              this.props.socket.emit("change-user-account-status", {
                userIID: this.state.selectedUser,
                status: 0
              });
            }}>
            Unban User
          </button>
        </form>
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
