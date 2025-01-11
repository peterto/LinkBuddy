import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as SecureStore from "expo-secure-store";


const checkPersistedState = async () => {
  const state = await SecureStore.getItemAsync("userLoginStatus");
};

export const clearPersistedState = async () => {
  await SecureStore.deleteItemAsync("userLoginStatus");
  await SecureStore.deleteItemAsync("isLoggedIn");
};

const secureStorage = {
  getItem: async (name) => {
    const value = await SecureStore.getItemAsync(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: async (name, value) => {
    await SecureStore.setItemAsync(name, JSON.stringify(value));
  },
  removeItem: async (name) => {
    await SecureStore.deleteItemAsync(name);
  },
};

const useAuthStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      login: async () => {
        try {
        // console.log(
        //   "Before login - isLoggedIn:",
        //   useAuthStore.getState().isLoggedIn
        // );
        await SecureStore.setItemAsync("isLoggedIn", "true");
        set({ isLoggedIn: true });
        // console.log(
        //   "After login - isLoggedIn:",
        //   useAuthStore.getState().isLoggedIn
        // );
        await checkPersistedState();
      } catch (error) {
        console.error("Login failed:", error);
      }
    },
      logout: async () => {
        // console.log(
        //   "Before logout - isLoggedIn:",
        //   useAuthStore.getState().isLoggedIn
        // );
        await SecureStore.deleteItemAsync("isLoggedIn");
        set({ isLoggedIn: false });
        // console.log(
        //   "After logout - isLoggedIn:",
        //   useAuthStore.getState().isLoggedIn
        // );
      },
    }),
    {
      name: "userLoginStatus",
      storage: createJSONStorage(() => secureStorage),
      skipHydration: false,
    }
  )
);


export default useAuthStore;
