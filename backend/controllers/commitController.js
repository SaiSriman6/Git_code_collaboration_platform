import { Commit } from "../models/Commit.js";
import { Repository } from "../models/Repository.js";


// Create commit
export const createCommit = async (req, res) => {
  try {

    const { repository, message, files } = req.body;
    // check repository exists
    const repo = await Repository.findById(repository);
    
    if (!repo) {
      return res.status(404).json({
        message: "Repository not found"
      });
    }
    
    if (!files || files.length === 0) {
 return res.status(400).json({
  message: "Commit must include at least one file"
 });
} 

    // check permission (owner or collaborator)
    const isOwner = repo.owner.toString() === req.user.userId;
    
    const isCollaborator = repo.collaborators.some(
      c => c.user.toString() === req.user.userId
    );
    
    if (!isOwner && !isCollaborator) {
      return res.status(403).json({
        message: "You don't have permission to commit to this repository"
      });
    }
  
    const commit = await Commit.create({
      repository,
      message,
      files,
      author: req.user.userId
    });

    res.status(201).json({
      message: "Commit created successfully",
      commit
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Get all commits of a repository
export const getCommits = async (req, res) => {
  try {

    const repo = await Repository.findById(req.params.repoId);

    if (!repo) {
      return res.status(404).json({
        message: "Repository not found"
      });
    }

    const commits = await Commit
      .find({ repository: req.params.repoId })
      .populate("author", "username");

    res.json(commits);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Get single commit
export const getCommitById = async (req, res) => {
  try {

    const commit = await Commit
      .findById(req.params.id)
      .populate("author", "username");

    if (!commit) {
      return res.status(404).json({
        message: "Commit not found"
      });
    }

    res.json(commit);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Delete commit
export const deleteCommit = async (req, res) => {
  try {

    const commit = await Commit.findById(req.params.id);

    if (!commit) {
      return res.status(404).json({
        message: "Commit not found"
      });
    }

    // only author can delete commit
    if (commit.author.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You can only delete your own commits"
      });
    }

    await commit.deleteOne();

    res.json({
      message: "Commit deleted successfully"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Update commit message
export const updateCommitMessage = async (req, res) => {
  try {

    const commit = await Commit.findById(req.params.id);

    if (!commit) {
      return res.status(404).json({
        message: "Commit not found"
      });
    }

    // only author can update commit
    if (commit.author.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You can only update your own commits"
      });
    }

    commit.message = req.body.message || commit.message;

    await commit.save();

    res.json({
      message: "Commit updated successfully",
      commit
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Get commits by author
export const getCommitsByAuthor = async (req, res) => {
  try {

    const commits = await Commit
      .find({ author: req.params.userId })
      .populate("author", "username");

    res.json(commits);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};