import { useState } from "react";
import { Link } from "react-router-dom";

import AuthLayout from "../../components/ui/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);
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
