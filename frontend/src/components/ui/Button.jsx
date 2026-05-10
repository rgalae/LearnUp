function Button({
  children,
  type = "button",
  className = "",
  variant = "primary",
  ...props
}) {
  const variants = {
    primary:
      "bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/20",

    secondary:
      "border border-white/10 hover:border-indigo-400 bg-transparent text-white",

    danger: "bg-red-500 hover:bg-red-400 text-white",

    ghost: "bg-white/5 hover:bg-white/10 text-white border border-white/10",
  };

  return (
    <button
      type={type}
      className={`py-3 px-5 rounded-2xl transition-all duration-300 font-semibold ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
