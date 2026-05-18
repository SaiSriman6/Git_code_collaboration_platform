import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

export const useAuth = create(
  persist((set) => ({
  currentUser: null,
  loading: false,
  isAuthenticated: false,
  error: null,

  login: async (userCred) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,userCred,{withCredentials:true}
      );
      set({
        loading: false,
        isAuthenticated: true,
        currentUser: res.data.user
        });

    } catch (err) {
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: err.response?.data?.error || "Login failed",
      });
    }
  },

  logout: async () => {
    try {
      set({ loading: true });

      await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/logout`,{withCredentials:true})
      

      set({
        currentUser: null,
        loading: false,
        isAuthenticated: false
      });

    } catch (err) {
      set({
        
        loading: false,
        error: err.message
      });
    }
  },
  setCurrentUser: (user) =>
        set({
          currentUser: user
        }),
})));