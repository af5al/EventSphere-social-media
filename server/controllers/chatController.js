const chatService = require("../services/chat.service");
const CatchAsync = require("../util/CatchAsync");

exports.getContactsList = CatchAsync(async (req, res) => {
  const followingContacts = await chatService.getUserContactsList(req.userId);
  res.status(200).json({ success: "ok", followingContacts });
});

exports.sendNewMessage = CatchAsync(async (req, res) => {
  const savedData = await chatService.sendUserMessage({
    roomId: req.body.roomId,
    userId: req.userId,
    eventPartner: req.body.eventPartner,
    newMessage: req.body.newMessage,
    time: req.body.time,
  });
  res.status(200).json({ success: true, savedChat: savedData });
});

exports.getMessages = CatchAsync(async (req, res) => {
  const result = await chatService.getUserMessages(req.userId, req.body.eventId);
  res.status(200).json({
    success: true,
    Data: result.chatConnectionData,
    mes: result.messages,
    roomId: result.roomId,
    userId: result.userId,
  });
});

exports.getEventContacts = CatchAsync(async (req, res) => {
  const eventContacts = await chatService.getEventContacts(req.eventId);
  res.status(200).json({ success: true, eventContacts });
});

exports.getEventMessages = CatchAsync(async (req, res) => {
  const result = await chatService.getEventMessages(req.eventId, req.body.userId);
  res.status(200).json({
    success: true,
    chatConnection: result.chatConnection,
    messages: result.messages,
    roomId: result.roomId,
    eventId: result.eventId,
  });
});

exports.sendMessage = CatchAsync(async (req, res) => {
  const savedData = await chatService.sendEventMessage({
    roomId: req.body.roomId,
    eventId: req.eventId,
    partnerId: req.body.partnerId,
    newMessage: req.body.newMessage,
    time: req.body.time,
  });
  res.status(200).json({ success: true, savedChat: savedData });
});
