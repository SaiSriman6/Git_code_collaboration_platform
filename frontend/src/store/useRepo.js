import { create } from "zustand";
import { fetchRepositories } from "../api/repoApi";
export const useRepoStore = create((set) => ({
  repos: [],
  loading: false,
  error: null,
  getRepos: async (userId) => {
    try {

      set({ loading: true });

      const res = await fetchRepositories(userId);
      set({
        repos:res.data,
        loading: false,
      });

    } catch (err) {

      set({
        error: err.message,
        loading: false,
      });

    }

  }

}));