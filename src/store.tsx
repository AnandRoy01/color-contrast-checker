import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface ColorState {
  foregroundColor: string;
  backgroundColor: string;
  colorFormat: "hex" | "rgb" | "rgba" | "hsl";
  theme: "dark" | "light";
}

interface ColorActions {
  setForegroundColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  setColorFormat: (format: "hex" | "rgb" | "rgba" | "hsl") => void;
  toggleTheme: () => void;
  resetColors: () => void;
}

type StoreState = ColorState & ColorActions;

const DEFAULT_COLORS = {
  foregroundColor: "#000000",
  backgroundColor: "#ffffff",
  colorFormat: "hex" as const,
  theme: "dark" as const,
};

export const useStore = create<StoreState>()(
  devtools(
    persist(
      (set) => ({
        ...DEFAULT_COLORS,

        setForegroundColor: (color: string) => set({ foregroundColor: color }),
        setBackgroundColor: (color: string) => set({ backgroundColor: color }),
        setColorFormat: (format) => set({ colorFormat: format }),
        toggleTheme: () =>
          set((state) => ({
            theme: state.theme === "dark" ? "light" : "dark",
          })),
        resetColors: () => set(DEFAULT_COLORS),
      }),
      { name: "color-contrast-store" }
    )
  )
);
