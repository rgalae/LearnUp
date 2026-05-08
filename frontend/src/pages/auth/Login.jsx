import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";

import { loginUser } from "../../services/authService";
import { AuthContext } from "../../auth/AuthContext";

import AuthLayout from "../../components/ui/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

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
    <AuthLayout
      title="Welcome Back"
      subtitle="Login to continue your learning journey"
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
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        <Button type="submit">Login</Button>

        <p className="text-center text-gray-400 text-sm pt-4">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-400 hover:text-indigo-300"
          >
            Register
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Login;
