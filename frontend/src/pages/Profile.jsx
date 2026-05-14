import { useState, useContext, useRef } from "react";
import { AuthContext } from "../auth/AuthContext";
import api from "../api/axios";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });

  const [preview, setPreview] = useState(
    user?.profile_picture ? `http://127.0.0.1:8000${user.profile_picture}` : null
  );

  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    if (file) {
      data.append("profile_picture", file);
    }

    try {
      await api.put("/users/profile/update/", data, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess("Profile updated successfully! Please re-login to see the new profile picture everywhere.");
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
        <p className="text-slate-400">Manage your personal information and preferences.</p>
      </div>

      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 lg:p-8">
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
            {success}
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* AVATAR UPLOAD */}
          <div className="flex items-center gap-6 mb-8">
            <div className="relative group">
              {preview ? (
                <img 
                  src={preview} 
                  alt="Avatar" 
                  className="w-24 h-24 rounded-full object-cover border-2 border-white/[0.06] group-hover:border-indigo-500 transition-colors"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white">
                  {formData.username[0]?.toUpperCase()}
                </div>
              )}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden"
              />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-1">Profile Picture</h3>
              <p className="text-sm text-slate-400 mb-3">PNG, JPG up to 5MB</p>
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl text-sm font-medium text-white transition-colors"
              >
                Upload new image
              </button>
            </div>
          </div>

          <div className="h-px bg-white/[0.06] mb-8"></div>

          {/* FORM FIELDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Username</label>
              <input 
                type="text" 
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full bg-[#080e1c] border border-white/[0.06] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-[#080e1c] border border-white/[0.06] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Role</label>
              <input 
                type="text" 
                value={user?.role === "teacher" ? "Teacher" : "Student"}
                disabled
                className="w-full bg-[#080e1c]/50 border border-white/[0.02] rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-xl font-medium transition-colors"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
