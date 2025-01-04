import { create } from "zustand"

export const useContentStore = create((set) => ({
  contentType: "movie",
  setcontentType: (type) => set({ contentType: type }),
}))
