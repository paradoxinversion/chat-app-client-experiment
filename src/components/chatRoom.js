import React from "react";
import User from "./user";
import ChatMessageList from "./chatMessageList";
import io from "socket.io-client";
import PrivateChat from "./privateChat";

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
      blocklist: []
    };
    this.chatTextAreaRef = React.createRef();
    this.chatInputForm = React.createRef();
    this.handleInput = this.handleInput.bind(this);
    this.initiatePrivateChat = this.initiatePrivateChat.bind(this);
    this.blockUser = this.blockUser.bind(this);
    this.closePrivateChat = this.closePrivateChat.bind(this);
    this.setChatScrollState = this.setChatScrollState.bind(this);
  }
  componentDidMount() {
    const serverURL =
      process.env.NODE_ENV === "development"
        ? process.env.REACT_APP_SERVER_URL_DEV
        : process.env.REACT_APP_SERVER_URL_PROD;

    const serverPath =
      process.env.NODE_ENV === "development"
        ? process.env.REACT_APP_SERVER_SOCKET_PATH
        : "/chattr-app";
    // const socket = io(serverURL, {
    //   path: serverPath,
    //   transports: ["websocket"]
    // });
    // const socketUrl = `${serverURL}socket.io`;
    const socketUrl = `${serverURL}`;
    const socket = io(socketUrl, {
      transports: ["websocket"]
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
      messages.push(message);
      this.setState({
        chatMessages: messages
      });
      if (this.state.scrollToNewMessages) this.scrollToChatBottom();
    });

    socket.on("user-connected", ({ user }) => {
      this.setState({
        me: user
      });
    });

    socket.on("room-user-change", data => {
      const messages = this.state.chatMessages;
      messages.push({
        id: "system",
        time: Date.now(),
        message: data.message
      });
      this.setState({
        chatMessages: messages,
        users: data.users
      });
    });

    socket.on("pm", data => {
      // get the pm history w/ that user key
      // copy it, add as with normal messages
      // the to for sender, and from for reciever
      const allPms = this.state.privateChatMessages;
      // debugger;
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
  openPrivateChat(user) {
    this.setState({ userSelected: user, privateChannel: user.id });
    this.state.socket.emit("private-chat-initiated", user.id);
  }
  closePrivateChat() {
    this.setState({ userSelected: null, privateChannel: "" });
  }

  scrollToChatBottom() {
    const chatBottom = document.getElementById("chat-bottom");
    chatBottom && chatBottom.scrollIntoView();
  }

  scrollToPMBottom() {
    const pmBottom = document.getElementById("pm-bottom");
    pmBottom && pmBottom.scrollIntoView();
  }

  setChatScrollState(e) {
    const chatScrolledToEnd =
      e.target.scrollTop + e.target.clientHeight === e.target.scrollHeight;
    if (chatScrolledToEnd) {
      this.setState({ scrollToNewMessages: true });
    } else {
      this.setState({ scrollToNewMessages: false });
    }
  }

  sendMessage(e, socket, chatInput, user) {
    if (chatInput) {
      if (!user) {
        socket.emit("chat-message-sent", {
          message: chatInput,
          from: this.state.me.id
        });
      } else {
        // evt, msg, user
        socket.emit("chat-message-sent", {
          message: chatInput,
          to: user.id,
          from: this.state.me.id
        });
      }
      this.setState({
        chatInput: ""
      });
      e.target.value = "";
    }
  }

  blockUser(user) {
    const blocklist = this.state.blocklist;
    blocklist.push(user.id);
    this.setState({ blocklist });
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
              <div className="flex flex-col h-full">
                <header>
                  <p>Control Panel</p>
                  <button
                    className="border mt-4 p-2 mb-4"
                    onClick={() => {
                      this.setState({ showUserCP: false });
                    }}>
                    Close Panel
                  </button>
                </header>
                <div className="border bg-gray-100 rounded flex-grow">
                  <form className="m-4 inline-block border p-4">
                    <p className="text-center mb-2">Change Username</p>
                    <input
                      className="border"
                      type="text"
                      name="usernameChange"
                      onChange={this.handleInput}
                      value={this.state.usernameChange}
                    />
                    <button
                      className="block border w-full mt-2"
                      onClick={e => {
                        e.preventDefault();
                        socket.emit("set-username", {
                          username: this.state.usernameChange
                        });
                        this.setState({ usernameChange: "" });
                      }}>
                      Change Username
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <React.Fragment>
                {userSelected ? (
                  <PrivateChat
                    onPrivateChatExit={this.closePrivateChat}
                    user={userSelected}
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
              {users.map(user => {
                return (
                  <User
                    key={user.id}
                    onUserClick={this.initiatePrivateChat}
                    initiatePrivateChatFn={this.initiatePrivateChat}
                    blockUserFn={this.blockUser}
                    user={user}
                    isClient={user.id === this.state.me.id}
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
                className="flex-grow resize-none border m-2"
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
                onClick={e => {
                  e.preventDefault();
                  this.sendMessage(e, socket, chatInput, userSelected);
                }}
                className="border p-2 m-2">
                Send
              </button>
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ChatRoom;
