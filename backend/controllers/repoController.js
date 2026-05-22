// repoController.js
import { Repository } from "../models/Repository.js";
import {User} from "../models/User.js"
import { File } from "../models/File.js";

export const createRepo = async (req, res) => {
  try {
    const { name, description, visibility } = req.body;

    const repo = await Repository.create({
      name,
      description,
      visibility,
      owner: req.user.userId,
      collaborators: []
    });

    res.status(201).json(repo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRepos = async (req, res) => {
  try {
    const userId = req.params.id;
    const repos = await Repository.find({
      visibility: "public",
      // not owned by current user
      owner: { $ne: userId },
      // current user should not be collaborator
      "collaborators.user": { $ne: userId },
    })
      .populate("owner", "username email")
      .populate("collaborators.user", "username email");
    res.status(200).json(repos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const ownRepos = async (req, res) => {
  try {
    const userId = req.params.id;
    const repos = await Repository.find({
      $or: [
        { owner: userId },
        { "collaborators.user": userId }
      ]
    })
      .populate("owner", "username email")
      .populate("collaborators.user", "username email");
    res.status(200).json({
      message: "repositories are",
      payload: repos
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getRepoById = async (req, res) => {
  try {
    const repo = await Repository.findById(req.params.id)
      .populate("owner", "username email")
      .populate("collaborators.user", "username email");

    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    res.json(repo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRepo = async (req, res) => {
  try {
    const repo = await Repository.findById(req.params.id);

    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    if (repo.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Only owner can delete repository" });
    }

    await repo.deleteOne();

    res.status(200).json({ message: "Repository deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRepo = async (req, res) => {
  try {
    const repo = await Repository.findById(req.params.id);

    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    if (repo.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Only owner can update repository" });
    }

    const { name, description } = req.body;

    if (name) repo.name = name;
    if (description) repo.description = description;

    await repo.save();

    res.status(200).json(repo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addCollaborator = async (req, res) => {
  try {
    const repo = await Repository.findById(req.params.id);
    if (!repo) {
      return res.status(404).json({
        message: "Repository not found"
      });
    }
    // only owner can add collaborators
    if (repo.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "Only owner can add collaborators"
      });
    }
    const { username, role } = req.body;
    // find user by username
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }
    // check if already collaborator
    const exists = repo.collaborators.find(
      c => c.user.toString() === user._id.toString()
    );
    if (exists) {
      return res.status(400).json({
        message: "User already collaborator"
      });
    }
    // add collaborator
   repo.collaborators.push({
    user: user._id,
    role: role || "collaborator"
   });
   await repo.save();

  // POPULATE USER DETAILS
  const updatedRepo = await Repository.findById(repo._id)
  .populate("owner", "username email")
  .populate("collaborators.user", "username email");

   res.json(updatedRepo);
    } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const removeCollaborator = async (req, res) => {
  try {
    const repo = await Repository.findById(req.params.id);

    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    if (repo.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Only owner can remove collaborators" });
    }

    repo.collaborators = repo.collaborators.filter(
      c => c.user.toString() !== req.params.userId
    );

    await repo.save();

    res.json(repo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCollaboratorRole = async (req, res) => {
  try {
    const repo = await Repository.findById(req.params.id);

    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    if (repo.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Only owner can update roles" });
    }

    const collaborator = repo.collaborators.find(
      c => c.user.toString() === req.params.userId
    );

    if (!collaborator) {
      return res.status(404).json({ message: "Collaborator not found" });
    }

    collaborator.role = req.body.role;

    await repo.save();

    res.json(repo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCollaborators = async (req, res) => {
  try {
    const repo = await Repository.findById(req.params.id)
      .populate("collaborators.user", "username email");

    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    res.json(repo.collaborators);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changeVisibility = async(req,res) => {

  const repo = await Repository.findById(req.params.id);

  if (!repo) {
    return res.status(404).json({ message: "Repo not found" });
  }

  repo.visibility = req.body.visibility;

  await repo.save();

  res.status(200).json({
    message: "Visibility updated",
    repo
  });

};

export const createBranch = async (req, res) => {
  try {
    const { branchName, sourceBranch } = req.body;
    // Validate input
    if (!branchName || !sourceBranch) {
      return res.status(400).json({
        success: false,
        message: "Branch name and source branch are required",
      });
    }
    // Find repository
    const repo = await Repository.findById(req.params.repoId)
    .populate("owner", "username email")
    .populate("collaborators.user", "username email");;
    if (!repo) {
      return res.status(404).json({
        success: false,
        message: "Repository not found",
      });
    }
    // Check if branch already exists
    if (repo.branches.includes(branchName)) {
      return res.status(400).json({
        success: false,
        message: "Branch already exists",
      });
    }
    // Check if source branch exists
    if (!repo.branches.includes(sourceBranch)) {
      return res.status(400).json({
        success: false,
        message: "Source branch not found",
      });
    }

    // Add branch to repository
    repo.branches.push(branchName);
    await repo.save();

    // Get all files from source branch
    const sourceFiles = await File.find({
      repository: repo._id,
      branch: sourceBranch,
    });

    // Copy files into new branch
    if (sourceFiles.length > 0) {
      const copiedFiles = sourceFiles.map((file) => ({
        repository: repo._id,
        branch: branchName,
        name: file.name,
        path: file.path,
        fileUrl: file.fileUrl,
        fileType: file.fileType || "text/plain",
        uploadedBy: file.uploadedBy,
      }));
      await File.insertMany(copiedFiles);
    }
    return res.status(201).json({
     success: true,
     message: "Branch created successfully",
     repo
    });
    } catch (err) {
    console.log("Create Branch Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//deleting branch

export const deleteBranch = async (req, res) => {
  try {
    const { repoId, branchName } = req.params;
    const repo = await Repository.findById(repoId);
    if (!repo) {
      return res.status(404).json({
        message: "Repository not found"
      });
    }
    console.log(repo);
    console.log(req.user)
    // only owner can delete branch
    if (repo.owner.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }
    // prevent deleting main branch
    if (branchName === "main") {
      return res.status(400).json({
        message: "Cannot delete main branch"
      });
    }
    // check branch exists
    if (!repo.branches.includes(branchName)) {
      return res.status(404).json({
        message: "Branch not found"
      });
    }
    // remove branch
    repo.branches = repo.branches.filter(
      branch => branch !== branchName
    );
    await repo.save();
    res.status(200).json({
      message: "Branch deleted successfully",
      branches: repo.branches
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};