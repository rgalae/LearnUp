function Button({ children, type = "button", className = "", ...props }) {
  return (
    <button
      type={type}
      className={`w-full py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-400 transition-all duration-300 text-white font-semibold shadow-lg shadow-indigo-500/20 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
