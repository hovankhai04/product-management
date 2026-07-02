const User = require('../../models/user.model');
const Chat = require('../../models/chat.model');
const RoomChat = require('../../models/rooms-chat.model');

const chatSocket = require('../../sockets/client/chat.socket');
// [GET] /chat/:roomChatId
module.exports.index = async (req, res) => {
  const roomChatId = req.params.roomChatId;
  // Socket.io
  chatSocket(req, res);
  // End Socket.io

  const chats = await Chat.find({
    room_chat_id: roomChatId,
    deleted: false
  });

  for (const chat of chats) {
    const infoUser = await User.findOne({
      _id: chat.user_id
    }).select('fullName');

    chat.infoUser = infoUser;
  }

  const roomChat = await RoomChat.findOne({
    _id: roomChatId,
    deleted: false
  })


  res.render("client/pages/chat/index", {
    pageTitle: roomChat.title,
    chats: chats
  });
}