// [GET] /chat/
module.exports.index = async (req, res) => {
  // Socket.io
  _io.on('connection', (socket) => {
    console.log('User connected', socket.id);


  });
  // End Socket.io


  res.render("client/pages/chat/index", {
    pageTitle: "Chat"
  });
}