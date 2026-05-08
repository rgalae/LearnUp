function Input({ type = "text", placeholder, name, value, onChange }) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-gray-400 outline-none focus:border-indigo-400 transition-all"
    />
  );
}

export default Input;
