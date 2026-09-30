const commentService = require("../../services/comment.service");
const CatchAsync = require("../../util/CatchAsync");

exports.createComment = CatchAsync(async (req, res) => {
  const { comment, id, username } = req.body;
  const createdComment = await commentService.createComment({
    postId: id,
    comment,
    userId: req.userId,
    username,
  });
  res.status(201).json({ success: "ok", createdComment });
});

exports.getAllComments = CatchAsync(async (req, res) => {
  const comments = await commentService.getAllComments(req.params.postId);
  res.status(200).json({ success: true, comments });
});

exports.deleteComment = CatchAsync(async (req, res) => {
  await commentService.deleteComment(req.body.commentId);
  res.status(200).json({ success: true });
});

exports.addReply = CatchAsync(async (req, res) => {
  const { commentId, reply, username } = req.body;
  const newComment = await commentService.addReply({
    commentId,
    reply,
    username,
    userId: req.userId,
  });
  res.status(200).json({ success: true, newComment });
});

exports.deleteReply = CatchAsync(async (req, res) => {
  const { commentId, replyId } = req.body;
  const newComment = await commentService.deleteReply(commentId, replyId);
  res.status(200).json({ success: true, newComment });
});
