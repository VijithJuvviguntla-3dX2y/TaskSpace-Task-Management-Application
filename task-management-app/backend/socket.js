let io = null;

// Set Socket.IO instance
const setSocketIO = (socketIO) => {
  io = socketIO;
};

// Get Socket.IO instance
const getSocketIO = () => {
  return io;
};

module.exports = {
  setSocketIO,
  getSocketIO,
};

