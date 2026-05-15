// commentController.js
import { Comment } from "../models/Comment.js";
import { PullRequest } from "../models/PullRequest.js";
import { Issue } from "../models/Issue.js";

export const addComment = async (req, res) => {
  try {

    const { text, issue, pullRequest } = req.body;

    if (!text) {

      return res.status(400).json({
        message: "Comment text required"
      });

    }

    if (!issue && !pullRequest) {

      return res.status(400).json({
        message: "Comment must belong to issue or pull request"
      });

    }

    const comment = await Comment.create({
      text,
      issue,
      pullRequest,
      user: req.user.userId
    });

    res.status(201).json(comment);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};

export const getPRComments = async (req, res) => {

  try {

    const comments = await Comment
      .find({ pullRequest: req.params.prId })
      .populate("user", "username")
      .sort({ createdAt: 1 });

    res.status(200).json(comments);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};

export const getComments = async (req, res) => {

  try {

    const comments = await Comment
      .find({ issue: req.params.issueId })
      .populate("user", "username")
      .sort({ createdAt: 1 });

    res.status(200).json(comments);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};

export const getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)
      .populate("user", "username");

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found"
      });
    }

    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        message: "Comment not found"
      });
    }
    if (comment.user.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You can only edit your comments"
      });
    }
    comment.text = req.body.text || comment.text;
    await comment.save();
    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        message: "Comment not found"
      });
    }
    let repoOwner = false;
    if (comment.issue) {
      const issue = await Issue.findById(comment.issue)
        .populate("repository");
      repoOwner =
        issue.repository.owner.toString() ===
        req.user.userId;
    }
    if (comment.pullRequest) {
      const pr = await PullRequest.findById(comment.pullRequest)
        .populate("repository");
      repoOwner =
        pr.repository.owner.toString() ===
        req.user.userId;
    }
    if (
      comment.user.toString() !== req.user.userId &&
      !repoOwner
    ) {
      return res.status(403).json({
        message: "Not authorized to delete comment"
      });
    }
    await comment.deleteOne();
    res.json({
      message: "Comment deleted"
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};