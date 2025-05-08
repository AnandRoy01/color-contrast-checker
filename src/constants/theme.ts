export const THEME = {
  dark: {
    app: {
      background:
        "bg-zinc-900 bg-[radial-gradient(#333333_1px,transparent_1px)]",
      section: "bg-zinc-800",
      text: "text-white",
      border: "border-gray-700",
    },
    input: {
      background: "bg-white/5",
      text: "text-white",
      placeholder: "text-gray-400",
      border: "border-gray-700",
      focus: "focus:ring-white/25",
    },
    button: {
      primary: "bg-blue-600 hover:bg-blue-700",
      secondary: "bg-white/10 hover:bg-white/20",
    },
    preview: {
      section: "bg-black/20",
    },
  },
  light: {
    app: {
      background:
        "bg-gray-100 bg-[radial-gradient(#cccccc_1px,transparent_1px)]",
      section: "bg-white",
      text: "text-gray-800",
      border: "border-gray-200",
    },
    input: {
      background: "bg-gray-100",
      text: "text-gray-800",
      placeholder: "text-gray-500",
      border: "border-gray-300",
      focus: "focus:ring-blue-300",
    },
    button: {
      primary: "bg-blue-500 hover:bg-blue-600",
      secondary: "bg-gray-200 hover:bg-gray-300",
    },
    preview: {
      section: "bg-gray-100",
    },
  },
};
