import React from "react";
import User from "./user";
import ChatMessageList from "./chatMessageList";
import io from "socket.io-client";
import PrivateChat from "./privateChat";
import ControlPanel from "./controlPanel";
import store from "store";
/**
 * At ChatRoom represents a space where many users
 * take part in a discussion.
 */
class ChatRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: null,
      chatMessages: [],
      privateChatMessages: {},
      users: [],
      chatInput: "",
      userSelected: null,
      privateChannel: "",
      scrollToNewMessages: true,
      unacknowledgedPms: [],
      showUserCP: false,
      usernameChange: "",
      blocklist: [],
      blockedBy: [],
      me: null
    };
    this.chatTextAreaRef = React.createRef();
    this.chatInputForm = React.createRef();
    this.handleInput = this.handleInput.bind(this);
    this.initiatePrivateChat = this.initiatePrivateChat.bind(this);
    this.blockUser = this.blockUser.bind(this);
    this.closePrivateChat = this.closePrivateChat.bind(this);
    this.setChatScrollState = this.setChatScrollState.bind(this);
    this.showUserCP = this.showUserCP.bind(this);
    this.banUser = this.banUser.bind(this);
  }

  componentDidMount() {
    const serverURL = process.env.REACT_APP_SERVER_URL;

    const socketUrl = `${serverURL}`;
    const socket = io(socketUrl, {
      transports: ["websocket"],
      query: {
        token: store.get("chattr")
      }
    });
    this.setState({ socket });
    socket.on("set-username", username => {
      const me = this.state.me;
      me.username = username.username;
      this.setState({
        me
      });
    });
    socket.on("chat-message-broadcast", message => {
      const messages = this.state.chatMessages;
      if (
        !this.state.blocklist.includes(message.fromUID) &&
        !this.state.blockedBy.includes(message.fromUID)
      ) {
        messages.push(message);
        this.setState({
          chatMessages: messages
        });
        if (this.state.scrollToNewMessages) this.scrollToChatBottom();
      }
    });

    socket.on("user-connected", ({ user }) => {
      this.setState({
        me: user,
        blocklist: user.blockList || [],
        blockedBy: user.blockedBy || []
      });
    });

    socket.on("ban-user", ({ bannedUser }) => {
      const messages = this.state.chatMessages.slice();
      messages.push({
        id: "system",
        time: Date.now(),
        message: `${bannedUser} has been banned from chat.`
      });
      this.setState({
        chatMessages: messages
        // users: data.users
      });
    });
    socket.on("block-user", ({ blocklist, blockedBy }) => {
      if (blocklist) {
        this.setState({
          blocklist
        });
      }
      if (blockedBy) {
        this.setState({
          blockedBy
        });
      }
    });
    socket.on("unblock-user", ({ blocklist, blockedBy }) => {
      if (blocklist) {
        this.setState({
          blocklist
        });
      }

      if (blockedBy) {
        this.setState({
          blockedBy
        });
      }
    });

    socket.on("room-user-change", data => {
      if (
        !this.state.blockedBy.includes(data.user.iid) &&
        !this.state.blocklist.includes(data.user.iid)
      ) {
        const messages = this.state.chatMessages.slice();
        messages.push({
          id: "system",
          time: Date.now(),
          message: data.message
        });
        this.setState({
          chatMessages: messages,
          users: data.users
        });
      }
    });

    socket.on("room-user-update", ({ users }) => {
      const me = users.find(user => {
        return user.iid === this.state.me.iid;
      });

      this.setState({
        users,
        me
      });
    });

    socket.on("pm", data => {
      // get the pm history w/ that user key
      // copy it, add as with normal messages
      // the to for sender, and from for reciever
      const allPms = this.state.privateChatMessages;
      if (data.to === this.state.me.id) {
        // this is something we recieved.
        let userPmHistory = allPms[data.from];
        if (!userPmHistory) allPms[data.from] = [];
        allPms[data.from].push(data);
      }

      if (data.from === this.state.me.id) {
        // this is to someone else
        let userPmHistory = allPms[data.to];
        if (!userPmHistory) allPms[data.to] = [];
        allPms[data.to].push(data);
      }

      if (data.from !== this.state.me.id) {
        if (
          !this.state.userSelected ||
          (this.state.userSelected && this.state.userSelected.id !== data.from)
        ) {
          const unacknowledgedPms = this.state.unacknowledgedPms;
          unacknowledgedPms.push(data.from);
          this.setState({
            unacknowledgedPms
          });
        }
      }
      this.setState({
        privateChatMessages: allPms
      });
      if (this.state.scrollToNewMessages) this.scrollToPMBottom();
    });
  }

  handleInput(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  /**
   * Opens a new PM channel with the specified user.
   * @param {*} user
   */
  initiatePrivateChat(user) {
    if (user.id !== this.state.me.id) {
      this.openPrivateChat(user);
      const unacknowledgedPms = this.state.unacknowledgedPms.filter(
        unacknowledgedUser => user.id !== unacknowledgedUser
      );
      this.setState({
        unacknowledgedPms
      });
    } else {
      if (this.state.privateChannel) {
        this.closePrivateChat();
      }
      this.setState({ showUserCP: true });
    }
  }

  /**
   * Show the user's control panel, closing private chat if necessary.
   * @param {*} show
   */
  showUserCP(show) {
    if (this.state.privateChannel) {
      this.closePrivateChat();
    }
    this.setState({ showUserCP: show });
  }
  /**
   * Open a new chat with the selected user.
   * @param {*} user
   */
  openPrivateChat(user) {
    this.setState({ userSelected: user, privateChannel: user.id });
    this.state.socket.emit("private-chat-initiated", user.id);
  }

  /**
   * Close private chat and unset the selected user/channel.
   */
  closePrivateChat() {
    this.setState({ userSelected: null, privateChannel: "" });
  }

  /**
   * Scroll public chst to the end of chst history
   */
  scrollToChatBottom() {
    const chatBottom = document.getElementById("chat-bottom");
    chatBottom && chatBottom.scrollIntoView();
  }

  /***
   * Scroll a Private chat to the end of chat history
   */
  scrollToPMBottom() {
    const pmBottom = document.getElementById("pm-bottom");
    pmBottom && pmBottom.scrollIntoView();
  }

  /***
   * Determines whether the chat is scroll all the way to the bottom
   * according to its current clientHeight/scrolltop. If scrolled
   * to the end, will set state to scroll to new messages.
   */
  setChatScrollState(e) {
    const chatScrolledToEnd =
      e.target.scrollTop + e.target.clientHeight === e.target.scrollHeight;
    if (chatScrolledToEnd) {
      this.setState({ scrollToNewMessages: true });
    } else {
      this.setState({ scrollToNewMessages: false });
    }
  }

  /***
   * Send a message (to chat or another specific user).
   * Messages to specific users have the `toUID` & `to`
   * properties. General chat messages do not.
   */
  sendMessage(e, socket, chatInput, user, isServerMessage) {
    if (chatInput.length > 0) {
      if (!user) {
        socket.emit("chat-message-sent", {
          message: chatInput,
          from: this.state.me.id,
          fromUID: this.state.me.iid,
          isServerMessage
        });
      } else {
        // evt, msg, user
        socket.emit("chat-message-sent", {
          message: chatInput,
          to: user.id,
          toUID: user.iid,
          from: this.state.me.id,
          fromUID: this.state.me.iid
        });
      }
      this.setState({
        chatInput: ""
      });
      e.target.value = "";
    }
  }

  /***
   * Add a specified user to the current user's blocklist.
   */
  blockUser(user) {
    const blocklist = this.state.blocklist.slice();
    blocklist.push(user.id);
    this.setState({ blocklist });
    this.state.socket.emit("block-user", user.id);
  }

  banUser(userId) {
    if (this.state.me.role === process.env.REACT_APP_ADMIN_USER_ROLE) {
      const client = this.state.users.find(user => user.iid === userId);
      this.state.socket.emit("ban-user", client.id);
    }
  }
  render() {
    const { socket, chatMessages, users, chatInput, userSelected } = this.state;
    return (
      <React.Fragment>
        <div
          id="chat-room"
          className="border flex flex-col flex-grow overflow-y-hidden sm:flex-row">
          <div
            onScroll={this.setChatScrollState}
            id="chat-area"
            className="flex-grow sm:w-3/4 p-4 overflow-y-scroll">
            {this.state.showUserCP ? (
              <ControlPanel
                blocklist={this.state.blocklist}
                users={this.state.users}
                socket={this.state.socket}
                showUserCP={this.showUserCP}
                banUserFn={this.banUser}
                isAdmin={
                  this.state.me.role === process.env.REACT_APP_ADMIN_USER_ROLE
                }
                clientUser={this.state.me}
              />
            ) : (
              <React.Fragment>
                {userSelected ? (
                  <PrivateChat
                    onPrivateChatExit={this.closePrivateChat}
                    user={userSelected}
                    blockUser={this.blockUser}
                    userChatMessages={
                      this.state.privateChatMessages[userSelected.id]
                    }
                    scrollCallback={this.setChatScrollState}
                    socket={socket}
                  />
                ) : (
                  <React.Fragment>
                    <ChatMessageList
                      blocklist={this.state.blocklist}
                      messages={chatMessages}
                    />
                    <div id="chat-bottom" />
                  </React.Fragment>
                )}
              </React.Fragment>
            )}
          </div>
          <div
            id="user-area"
            className="whitespace-no-wrap h-20 sm:border-l sm:h-auto sm:w-1/4 ">
            <div className="overflow-x-scroll sm:overflow-x-visible sm:h-full sm:flex sm:flex-col sm:overflow-y-scroll">
              {users
                .filter(
                  user =>
                    !this.state.blockedBy.includes(user.iid) &&
                    !this.state.blocklist.includes(user.iid)
                )
                .map(user => {
                  return (
                    <User
                      key={user.id}
                      onUserClick={this.initiatePrivateChat}
                      initiatePrivateChatFn={this.initiatePrivateChat}
                      blockUserFn={this.blockUser}
                      showUserCP={this.showUserCP}
                      user={user}
                      isClient={user.id === this.state.me.id}
                      isAdmin={
                        user.role === process.env.REACT_APP_ADMIN_USER_ROLE
                      }
                      pmNotice={this.state.unacknowledgedPms.includes(user.id)}
                    />
                  );
                })}
            </div>
          </div>
        </div>
        <div id="user-input">
          <div id="input-area" className="flex">
            <form
              ref={this.chatInputForm}
              className="flex flex-grow border m-2">
              <textarea
                id="chatInput"
                name="chatInput"
                className="flex-grow resize-none border m-2 rounded"
                value={chatInput}
                onChange={this.handleInput}
                onKeyDown={e => {
                  if (e.keyCode === 13 && !e.shiftKey) {
                    this.sendMessage(e, socket, chatInput, userSelected);
                  }
                }}
                onKeyUp={e => {
                  if (e.keyCode === 13 && !e.shiftKey) {
                    e.target.value = "";
                  }
                }}
              />
              <button
                className="rounded border p-2 m-2"
                onClick={e => {
                  e.preventDefault();
                  this.sendMessage(e, socket, chatInput, userSelected, false);
                }}>
                Send
              </button>
              {this.state.me &&
                this.state.me.role ===
                  process.env.REACT_APP_ADMIN_USER_ROLE && (
                  <button
                    className="rounded border p-2 m-2"
                    onClick={e => {
                      e.preventDefault();
                      this.sendMessage(
                        e,
                        socket,
                        chatInput,
                        userSelected,
                        true
                      );
                    }}>
                    SERVER MESSAGE
                  </button>
                )}
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ChatRoom;
