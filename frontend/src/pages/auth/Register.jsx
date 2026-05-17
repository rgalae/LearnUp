import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../../components/ui/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

import { registerUser } from "../../services/authService";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "student",
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
      await registerUser(formData);

      alert("Account created successfully");

      navigate("/login");
    } catch (error) {
      console.log(error.response?.data);

      alert(JSON.stringify(error.response?.data || "Registration failed"));
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Start learning with LearnUp today"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />

        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="
    w-full p-4 rounded-2xl
    bg-white/5 border border-white/10
    text-white outline-none
  "
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>

        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        <Button type="submit">Create Account</Button>

        <p className="text-center text-gray-400 text-sm pt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Register;
