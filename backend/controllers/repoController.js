// repoController.js
import { Repository } from "../models/Repository.js";
import {User} from "../models/User.js"

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
    const repos = await Repository.find()
      .populate("owner", "username email")
      .populate("collaborators.user", "username email");

    res.status(200).json(repos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const ownRepos=async(req,res) =>{
   try{
    const repos= await Repository.find({owner:req.params.id})
      .populate("owner", "username email")
      .populate("collaborators.user", "username email");
    res.status(200).json({message:"repositories are",payload:repos})
   }catch(err){
    res.status(500).json({message:err.message})
   }
}

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

    const { name, description, visibility } = req.body;

    if (name) repo.name = name;
    if (description) repo.description = description;
    if (visibility) repo.visibility = visibility;

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
    res.json(repo);
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