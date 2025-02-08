module.exports = {
  mode: "jit",
  content: ["./src/views/**/*.html", "./public/**/*.html"],
  safelist: [
    "text-red-400",
    "text-green-400",
    "text-yellow-500",
    "border-green-500",
    "bg-yellow-200",
    "text-2xl",
    "p-10",
    "m-5",
    "border-4"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
