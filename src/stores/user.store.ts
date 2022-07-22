import create from "zustand";
import { trpc } from "../utils/trpc";
import { persist } from "zustand/middleware";

const userStore = create(
  persist((set, get) => ({
    isLoading: true,
    user: {},
    getSession: async () => {
      const { data, error, isLoading } = trpc.useQuery(["users.me"]);
      if (data) {
        set({
          isLoading: false,
          user: data,
        });
      }
      return {
        data,
        error,
        isLoading,
      };
    },
    loginWithHash: async (hash: string) => {
      const { data, isLoading } = trpc.useQuery([
        "users.verify-otp",
        {
          hash: hash,
        },
      ]);

      if (data) {
        set({
          isLoading: false,
          user: data,
        });
      }
      return {
        data,
        isLoading,
      };
    },
    logout: async () => {},
  }))
);

export default userStore;
