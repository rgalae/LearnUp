import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../../services/authService";
import { AuthContext } from "../../auth/AuthContext";

function Login() {
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(formData);

      login(data.access);

      navigate("/student");
    } catch (error) {
      console.log(error);
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1120]">
      <form
        onSubmit={handleSubmit}
        className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl w-[400px] space-y-5"
      >
        <h1 className="text-3xl font-bold text-white">Login</h1>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white outline-none"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white outline-none"
        />

        <button
          type="submit"
          className="w-full p-4 rounded-xl bg-indigo-500 hover:bg-indigo-400 transition font-semibold"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
