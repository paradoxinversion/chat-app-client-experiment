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
      scrollToNewMessages: true
    };
    this.chatTextAreaRef = React.createRef();
    this.chatInputForm = React.createRef();
    this.handleChatInput = this.handleChatInput.bind(this);
    this.openPrivateChat = this.openPrivateChat.bind(this);
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
        : "/chattr";
    const socket = io(serverURL, {
      path: serverPath,
      transports: ["websocket"]
    });
    this.setState({ socket });

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

    socket.on("private-chat-initiated", data => {
      console.log(data);
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
      this.setState({
        privateChatMessages: allPms
      });
      if (this.state.scrollToNewMessages) this.scrollToPMBottom();
    });
  }

  handleChatInput(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  openPrivateChat(user) {
    this.setState({ userSelected: user, privateChannel: user.id });
    this.state.socket.emit("private-chat-initiated", user.id);
  }
  closePrivateChat() {
    this.setState({ userSelected: null, privateChannel: "" });
  }

  scrollToChatBottom() {
    document.getElementById("chat-bottom").scrollIntoView();
  }

  scrollToPMBottom() {
    document.getElementById("pm-bottom").scrollIntoView();
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
                <ChatMessageList messages={chatMessages} />
                <div id="chat-bottom" />
              </React.Fragment>
            )}
          </div>
          <div
            id="user-area"
            className="whitespace-no-wrap h-20 sm:border-l sm:h-auto sm:w-1/4 ">
            <div className="overflow-x-scroll sm:overflow-x-visible sm:h-full sm:flex sm:flex-col sm:overflow-y-scroll">
              {users.map(user => (
                <User
                  key={user.id}
                  onUserClick={this.openPrivateChat}
                  user={user}
                />
              ))}
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
                onChange={this.handleChatInput}
                onKeyDown={e => {
                  if (e.keyCode === 13 && !e.shiftKey) {
                    if (!userSelected) {
                      socket.emit("chat-message-sent", { message: chatInput });
                    } else {
                      // evt, msg, user
                      console.log("to", this.state.privateChannel);
                      socket.emit("chat-message-sent", {
                        message: chatInput,
                        to: userSelected.id,
                        from: this.state.me.id
                      });
                    }
                    this.setState({
                      chatInput: ""
                    });
                    e.target.value = "";
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
                  if (!userSelected) {
                    socket.emit("chat-message-sent", {
                      message: this.state.chatInput
                    });
                  } else {
                    // evt, msg, user
                    console.log("to", this.state.privateChannel);
                    socket.emit("chat-message-sent", {
                      message: this.state.chatInput,
                      to: userSelected.id,
                      from: this.state.me.id
                    });
                  }
                  this.setState({
                    chatInput: ""
                  });
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
