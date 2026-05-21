// pullRequestController.js
import { PullRequest } from "../models/PullRequest.js";
import { Repository } from '../models/Repository.js'
import {
  sendRepoNotification,
  sendNotification
} from "../services/notificationService.js";
import {User} from "../models/User.js";
import { File } from "../models/File.js";

export const createPR = async (
  req,
  res
) => {
  try {
    const {
  repository,
  title,
  description,
  commits,
  sourceBranch,
  targetBranch
  } = req.body;
    const sender =
    await User.findById(
    req.user.userId
  );
  console.log(sender)
    // CREATE PR
    const pr = await PullRequest.create({
     repository,
    title,
    description,
    commits,
    sourceBranch,
    targetBranch,
    author: sender._id
  });
    // GET REPO
    const repo =
      await Repository.findById(
        repository
      )
      .populate(
        "owner",
        "username"
      );
    const io =
      req.app.get("io");
    // =========================
    // PERSONAL OWNER NOTIFICATION
    // =========================
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
          "newPR",
        message:
          `${sender.username} created a pull request in ${repo.name}`,
        repoId:
          repo._id,
        data: {
          prId: pr._id
        }
      });
    }
    // =========================
    // REPO REALTIME EVENT
    // =========================
  //   await sendRepoNotification(io, {
  //     users: repo.collaborators.map(
  //       c => c.user
  //     ),
  //     sender:
  //       sender.userId,
  //     repoId:
  //       repo._id,
  //     type:
  //       "newPR",
  //     message:
  //       "New Pull Request Created",
  //     data: pr
  //   });
    console.log(
      "PR notifications sent"
    );
    res.status(201).json({
      message:
        "Pull request created",
      pr
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message
    });
  }
};

export const getPRs = async (req, res) => {
  try {
    const prs = await PullRequest.find({
      repository: req.params.repoId
    }).populate("author", "username");

    res.status(200).json(prs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getIncomingPullRequests = async (req, res) => {
  try {

    const { userId } = req.params;

    const ownedRepos = await Repository.find({
      owner: userId
    }).select("_id");

    const repoIds = ownedRepos.map(repo => repo._id);

    const incomingPRs = await PullRequest.find({
      repository: { $in: repoIds }
    })
      .populate("repository", "name")
      .populate("author", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json(incomingPRs);

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch incoming pull requests",
      error: error.message
    });

  }
};

export const getPRByUser = async(req,res) =>{
  try{
    const prs=await PullRequest.find({
      author: req.params.id
    }).populate("repository","name")
    res.status(200).json(prs);
  }catch(err){
    res.status(500).json({message:err.message});
  }
}

// merge pr
export const mergePR = async (req, res) => {
  try {

    // Find PR
    const pr = await PullRequest.findById(req.params.id);

    if (!pr) {
      return res.status(404).json({
        success: false,
        message: "Pull request not found",
      });
    }

    // Prevent duplicate merge
    if (pr.status === "merged") {
      return res.status(400).json({
        success: false,
        message: "PR already merged",
      });
    }

    // Get source branch files
    const sourceFiles = await File.find({
      repository: pr.repository,
      branch: pr.sourceBranch,
    });
    // Merge files
    for (const sourceFile of sourceFiles) {
      // Find matching file in target branch
      const targetFile = await File.findOne({
        repository: pr.repository,
        branch: pr.targetBranch,
        name: sourceFile.name,
      });
      // UPDATE existing file
      if (targetFile) {
        targetFile.fileUrl = sourceFile.fileUrl;
        targetFile.path = sourceFile.path;
        targetFile.fileType =
          sourceFile.fileType || "text/plain";
        targetFile.uploadedBy =
          sourceFile.uploadedBy;
        await targetFile.save();
      }
      // CREATE new file
      else {
        await File.create({
          repository: pr.repository,
          branch: pr.targetBranch,
          name: sourceFile.name,
          path: sourceFile.path,
          fileUrl: sourceFile.fileUrl,
          fileType:
            sourceFile.fileType || "text/plain",
          uploadedBy: sourceFile.uploadedBy,
        });
      }
    }
    // Update PR status
    pr.status = "merged";
    pr.mergedAt = new Date();
    pr.mergedBy = req.user.id;
    await pr.save();
    await pr.populate("author", "username _id");
    return res.status(200).json({
      success: true,
      message: "Pull request merged successfully",
      pr,
    });
  } catch (err) {
    console.log("Merge PR Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getPRById = async (req, res) => {
  try {
    const pr = await PullRequest.findById(req.params.id)
      .populate("author", "username _id")
    if (!pr) {
      return res.status(404).json({ message: "Pull request not found" });
    }
    res.json({success: true,pr,});

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const closePR = async (req, res) => {
  try {
    const pr = await PullRequest.findById(req.params.id);

    if (!pr) {
      return res.status(404).json({ message: "Pull request not found" });
    }

    pr.status = "closed";
    await pr.save();
    await pr.populate("author", "username _id");
    res.json({success: true, pr,});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const reopenPR = async (req, res) => {
  try {
    const pr = await PullRequest.findById(req.params.id);

    if (!pr) {
      return res.status(404).json({ message: "Pull request not found" });
    }

    pr.status = "open";
    await pr.save();
    await pr.populate("author", "username _id");
    res.json({success: true,pr});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updatePR = async (req, res) => {
  try {
    const pr = await PullRequest.findById(req.params.id);

    if (!pr) {
      return res.status(404).json({ message: "Pull request not found" });
    }

    const { title, description } = req.body;

    if (title) pr.title = title;
    if (description) pr.description = description;

    await pr.save();
    await pr.populate("author", "username _id");

   res.json({success: true,pr,});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deletePR = async (req, res) => {
  try {
    const pr = await PullRequest.findById(req.params.id);

    if (!pr) {
      return res.status(404).json({ message: "Pull request not found" });
    }

    await pr.deleteOne();

    res.json({
      message: "Pull request deleted"
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPRComments = async (req,res)=>{

 const comments = await Comment
   .find({ pullRequest:req.params.prId })
   .populate("user","username");

 res.json(comments);

};