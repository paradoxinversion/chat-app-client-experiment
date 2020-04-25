import Faker from "faker";

export const generateUser = () => {
  return {
    id: Faker.random.uuid(),
    username: Faker.internet.userName(),
    avatar: Faker.internet.avatar(),
  };
};

export const generateAppData = (totalUsers = 20, totalMessages = 150) => {
  // 1. Get get our users
  const users = [];
  const messages = [];
  const startDate = new Date("January 1, 2020 03:00:00");
  let currentTime = Date.parse(startDate);
  for (let x = 0; x < totalUsers; x++) {
    users.push(generateUser());
  }
  // 2. For X messages, choose a user at random, create a message data lump
  for (let x = 0; x < totalMessages; x++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const message = {
      id: Faker.random.uuid(),
      user: user,
      message: Faker.lorem.sentences(Math.floor(Math.random() * 5) || 1),
      time: new Date(currentTime),
    };
    currentTime += Math.floor(Math.random() * 60000);
    messages.push(message);
  }
  return { messages, users };
};

export const renderPNGFromArrayBuffer = (arrayBuffer) => {
  const avatarBlob = new Blob([arrayBuffer]);
  const urlCreator = window.URL || window.webkitURL;
  return urlCreator.createObjectURL(avatarBlob);
};
