import simpleGit from "simple-git";

const git = simpleGit();

export const initRepo = async (path) => {
  await git.init(path);
};

export const commitChanges = async (path, message) => {
  await git.cwd(path);
  await git.add(".");
  await git.commit(message);
};

// Clone repository
export const cloneRepo = async (repoUrl, path) => {

const gitClient = simpleGit();

await gitClient.clone(repoUrl, path);

};


// Create new branch
export const createBranch = async (path, branchName) => {

const gitClient = simpleGit(path);

await gitClient.checkoutLocalBranch(branchName);

};


// Switch branch
export const switchBranch = async (path, branchName) => {

const gitClient = simpleGit(path);

await gitClient.checkout(branchName);

};


// Merge branch
export const mergeBranch = async (path, branchName) => {

const gitClient = simpleGit(path);

await gitClient.merge([branchName]);

};


// Get commit history
export const getCommitHistory = async (path) => {

const gitClient = simpleGit(path);

const log = await gitClient.log();

return log.all;

};


// Push changes
export const pushChanges = async (path, remote="origin", branch="main") => {

const gitClient = simpleGit(path);

await gitClient.push(remote, branch);

};


// Pull changes
export const pullChanges = async (path, remote="origin", branch="main") => {

const gitClient = simpleGit(path);

await gitClient.pull(remote, branch);

};