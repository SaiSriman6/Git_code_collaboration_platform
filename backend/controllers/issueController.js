// issueController.js
import { Issue } from "../models/Issue.js";
import { Repository } from '../models/Repository.js'
import {User} from "../models/User.js";

import {
  sendNotification
} from "../services/notificationService.js";

export const createIssue = async(req,res) => {
  try {
    const {
      repository,
      title,
      description
    } = req.body;
    // GET SENDER
    const sender =
      await User.findById(
        req.user.userId
      );

    // CREATE ISSUE
    const issue =
      await Issue.create({
        repository,
        title,
        description,
        author: sender._id
      });

    // GET REPOSITORY
    const repo =
      await Repository.findById(
        repository
      )
      .populate(
        "owner",
        "username"
      );

    // GET SOCKET IO
    const io =
      req.app.get("io");
    // =========================
    // PERSONAL OWNER NOTIFICATION
    // ========================
    if (
      repo.owner._id.toString() !==
      sender._id.toString()
    ) {
      await sendNotification(io, {
        receiver:
          repo.owner._id,
        sender:
          sender._id,
        type:
          "newIssue",
        message:
          `${sender.username} created an issue in ${repo.name}`,
        repoId:
          repo._id,
        data: {
          issueId: issue._id
        }
      });
    }
    console.log(
      "Issue notification sent"
    );
    res.status(201).json({
      message:
        "Issue created",
      issue
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message
    });
  }
};

export const getIssues = async (req, res) => {
  try {
    
    const issues = await Issue.find({
      repository: req.params.repoId
    }).populate("author", "username");

    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const closeIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    issue.status = "closed";
    await issue.save();

    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        message: "Issue not found"
      });
    }

    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const reopenIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    issue.status = "open";
    await issue.save();

    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const { title, description } = req.body;

    if (title) issue.title = title;
    if (description) issue.description = description;

    await issue.save();

    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        message: "Issue not found"
      });
    }

    await issue.deleteOne();

    res.json({
      message: "Issue deleted"
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getIncomingIssues = async (req, res) => {
  try {
    const { userId } = req.params;
    const ownedRepos = await Repository.find({
      owner: userId
    }).select("_id");
    const repoIds = ownedRepos.map(repo => repo._id);
    const issues = await Issue.find({
      repository: { $in: repoIds }
    })
      .populate({
        path: "repository",
        select: "name _id owner",
        populate: {
          path: "owner",
          select: "username email"
        }
      })
      .populate("author", "username email")
      .sort({ createdAt: -1 });
    res.status(200).json(issues);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch issues",
      error: error.message
    });
  }
};