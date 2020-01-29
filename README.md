# Chat Client

This is a client for a simple chat room, using socketio. Right now there is one main room, and users can send private messages to other users.

## Development

Install dependencies via `npm` or `yarn`.

### Scripts

#### start

Starts the server in development mode

## Socket Events

This project interacts with socketio via `socket.io-client`.

### on-events

`connection`: Add a new chat client

`chat-message-broadcast`: Fires when the server emits `chat-message-broadcast` (when a user has posted a message to general chat)

`user-connected`: Fires when a user has been connected, returned data is the socket's corresponding user object.

`room-user-change`: Fires when a user enter or leaves the main chat.

`pm`: Adds a pm to the client's privateChatMessages map

### emit-events

`chat-message-sent`: sends a chat message to the server-- whether it is private or public depends on whether ot not `to` is defined in the message object.

`private-chat-initiated` (socket): Sends an event to initiate a private chat, which includes the socketid of the user to chat with

## TODO

- Blocking of PMs
  - All Users
  - Individual users
- Filtering Messages in chat
  - By User
  - By text in message
- Moderation
  - Word filter
  - Word
