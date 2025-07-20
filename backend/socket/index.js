export function setupChatSocket(io) {
  io.of('/chat').on('connection', (socket) => {
    socket.on('join_room', (room) => {
      socket.join(room);
    });
    socket.on('send_message', ({ room, message }) => {
      io.of('/chat').to(room).emit('receive_message', message);
    });
  });
}

export function setupMeetingSocket(io) {
  io.of('/meeting').on('connection', (socket) => {
    socket.on('join_meeting', (room) => {
      socket.join(room);
      socket.to(room).emit('user_joined', socket.id);
    });
    socket.on('offer', (data) => {
      socket.to(data.targetSocketId).emit('offer', data.sdp);
    });
    socket.on('answer', (data) => {
      socket.to(data.targetSocketId).emit('answer', data.sdp);
    });
    socket.on('ice_candidate', (data) => {
      socket.to(data.targetSocketId).emit('ice_candidate', data.candidate);
    });
    socket.on('leave_meeting', (room) => {
      socket.leave(room);
      socket.to(room).emit('user_left', socket.id);
    });
  });
}
