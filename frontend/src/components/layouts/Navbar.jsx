import { useLocation, Link } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../../auth/AuthContext";
import api from "../../api/axios";

const routeLabels = {
  "/student": "Overview",
  "/student/courses": "My Courses",
  "/student/results": "Results",

  "/teacher": "Overview",
  "/teacher/courses": "Courses",
  "/teacher/results": "Results",
  "/teacher/students": "Students",
};

function Navbar() {
  const location = useLocation();

  const { user, logout } = useContext(AuthContext);
  
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifs(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/users/notifications/", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchNotifications();
    }
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await api.post(`/users/notifications/${id}/read/`, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const pageLabel = routeLabels[location.pathname] || "Dashboard";

  const role = user?.role || "student";

  const roleLabel = role === "teacher" ? "Teacher" : "Student";

  const userName = user?.username || "User";
  
  const profilePicture = user?.profile_picture ? `http://127.0.0.1:8000${user.profile_picture}` : null;

  return (
    <header className="h-16 border-b border-white/[0.06] bg-[#080e1c]/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-30">
      {/* LEFT */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-500">{roleLabel}</span>

        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-slate-600"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>

        <span className="text-white font-medium">{pageLabel}</span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        {/* NOTIFICATIONS */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => { setShowNotifs(!showNotifs); setShowProfile(false); }}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.07] transition-all text-slate-400 hover:text-white cursor-pointer"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-red-500 text-[10px] font-bold text-white rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
          
          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 bg-[#0B1120] border border-white/[0.06] rounded-xl shadow-xl z-50 overflow-hidden transform origin-top-right transition-all duration-200">
              <div className="p-3 border-b border-white/[0.06] bg-white/[0.02] flex items-center justify-between">
                <h3 className="text-sm font-medium text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-xs text-indigo-400 font-medium bg-indigo-500/10 px-2 py-0.5 rounded-full">{unreadCount} new</span>
                )}
              </div>
              
              <div className="max-h-80 overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-white/[0.03] flex items-center justify-center mx-auto mb-3">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                      </svg>
                    </div>
                    <p className="text-sm text-slate-400">No new notifications</p>
                    <p className="text-xs text-slate-500 mt-1">You're all caught up!</p>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        onClick={() => !notif.is_read && markAsRead(notif.id)}
                        className={`p-4 border-b border-white/[0.02] transition-colors cursor-pointer ${notif.is_read ? 'opacity-60' : 'bg-white/[0.02] hover:bg-white/[0.04]'}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${notif.is_read ? 'bg-transparent' : 'bg-indigo-400'}`}></div>
                          <div>
                            <p className="text-sm text-white leading-tight mb-1">{notif.message}</p>
                            <p className="text-[11px] text-slate-500">{new Date(notif.created_at).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-white/[0.08]" />

        {/* PROFILE */}
        <div className="relative" ref={profileRef}>
          <div 
            onClick={() => { setShowProfile(!showProfile); setShowNotifs(false); }}
            className="flex items-center gap-2.5 pl-1 cursor-pointer hover:opacity-80 transition-opacity"
          >
            {profilePicture ? (
              <img 
                src={profilePicture} 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover border border-white/[0.06] shadow-md"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-md shadow-indigo-500/20">
                {userName[0]?.toUpperCase()}
              </div>
            )}

            <div className="hidden sm:block">
              <p className="text-sm font-medium text-white leading-none">
                {userName}
              </p>

              <p className="text-[11px] text-slate-500 mt-0.5 leading-none capitalize">
                {role}
              </p>
            </div>
            
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500 ml-1">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
          
          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 bg-[#0B1120] border border-white/[0.06] rounded-xl shadow-xl z-50 overflow-hidden transform origin-top-right transition-all duration-200">
              <div className="p-4 border-b border-white/[0.06] flex items-center gap-3 bg-white/[0.02]">
                {profilePicture ? (
                  <img src={profilePicture} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-white/[0.06]" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-sm font-bold text-white">
                    {userName[0]?.toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-white">{userName}</p>
                  <p className="text-xs text-slate-400 capitalize">{role}</p>
                </div>
              </div>
              <div className="p-2">
                <Link to="/profile" onClick={() => setShowProfile(false)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors cursor-pointer">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  My Profile
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
