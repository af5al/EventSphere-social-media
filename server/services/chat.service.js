const User = require("../models/UserModel");
const Event = require("../models/EventModel");
const ChatConnection = require("../models/ChatConnection");
const Chats = require("../models/ChatsModel");
const ApiError = require("../util/ApiError");

class ChatService {
  async getUserContactsList(userId) {
    const user = await User.findById(userId).populate("following");
    if (!user) throw new ApiError(404, "User not found");

    const events = user.following || [];
    const contactsWithCounts = await Promise.all(
      events.map(async (event) => {
        const latestMessage = await Chats.findOne({
          eventId: event._id,
          userId: user._id,
        })
          .sort({ time: -1 })
          .exec();

        const unseenMessagesCount = await Chats.countDocuments({
          eventId: event._id,
          userId: user._id,
          isUserSeen: false,
        });

        return {
          ...event.toObject(),
          unseenMessagesCount,
          latestMessage: latestMessage?.message || null,
          time: latestMessage?.time || null,
          latestMessageSenderId: latestMessage?.senderId || null,
        };
      })
    );

    return contactsWithCounts;
  }

  async sendUserMessage({ roomId, userId, eventPartner, newMessage, time }) {
    const chat = new Chats({
      roomId,
      senderId: userId,
      userId,
      eventId: eventPartner,
      message: newMessage,
      time: time || new Date().toLocaleTimeString(),
    });
    return await chat.save();
  }

  async getUserMessages(userId, eventId) {
    let chatConnection = await ChatConnection.findOne({ userId, eventId }).populate("userId eventId");

    if (!chatConnection) {
      const newConnection = new ChatConnection({ userId, eventId });
      const saved = await newConnection.save();
      chatConnection = await ChatConnection.findById(saved._id).populate("userId eventId");
      return {
        chatConnectionData: chatConnection,
        messages: [],
        roomId: chatConnection._id,
        userId,
      };
    }

    const roomId = chatConnection._id;
    const messages = await Chats.find({ roomId }).sort({ time: 1 });

    await Chats.updateMany(
      { roomId, isUserSeen: false },
      { $set: { isUserSeen: true } }
    );

    return {
      chatConnectionData: chatConnection,
      messages,
      roomId,
      userId,
    };
  }

  async getEventContacts(eventId) {
    const connections = await ChatConnection.find({ eventId }).populate("userId eventId");

    const contactsWithCounts = await Promise.all(
      connections.map(async (conn) => {
        const latestMessage = await Chats.findOne({
          userId: conn.userId?._id,
          eventId,
        })
          .sort({ time: -1 })
          .exec();

        const unseenMessagesCount = await Chats.countDocuments({
          userId: conn.userId?._id,
          eventId,
          isEventSeen: false,
        });

        return {
          ...conn.toObject(),
          unseenMessagesCount,
          latestMessage: latestMessage?.message || null,
          time: latestMessage?.time || null,
          latestMessageSenderId: latestMessage?.senderId || null,
        };
      })
    );

    return contactsWithCounts;
  }

  async getEventMessages(eventId, userId) {
    let chatConnection = await ChatConnection.findOne({ userId, eventId }).populate("userId eventId");
    if (!chatConnection) {
      const newConn = new ChatConnection({ userId, eventId });
      const saved = await newConn.save();
      chatConnection = await ChatConnection.findById(saved._id).populate("userId eventId");
    }

    const roomId = chatConnection._id;
    const messages = await Chats.find({ roomId }).sort({ time: 1 });

    await Chats.updateMany(
      { roomId, isEventSeen: false },
      { $set: { isEventSeen: true } }
    );

    return {
      chatConnection,
      messages,
      roomId,
      eventId,
    };
  }

  async sendEventMessage({ roomId, eventId, partnerId, newMessage, time }) {
    const chat = new Chats({
      roomId,
      senderId: eventId,
      userId: partnerId,
      eventId,
      message: newMessage,
      time: time || new Date().toLocaleTimeString(),
    });
    return await chat.save();
  }
}

module.exports = new ChatService();
