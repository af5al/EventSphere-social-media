import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ServerVariables } from "../utils/ServerVariables";
import { API_BASE_URL } from "../config/api";

const UserCard = ({ profile, username, email, role }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const handleClick = () => {
    if (role === "user") {
      navigate(ServerVariables.userProfile);
    } else if (role === "event") {
      navigate(ServerVariables.eventHome);
    }
  };

  const initial = username ? username.charAt(0).toUpperCase() : "U";

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-3 mx-2 my-2 px-3 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-800/40 cursor-pointer transition-all duration-200 w-[calc(100%-16px)]"
    >
      <div className="relative shrink-0">
        {profile && !imgError ? (
          <img
            className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30"
            src={`${API_BASE_URL}/profiles/${profile}`}
            alt={username || "avatar"}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm ring-2 ring-indigo-500/30">
            {initial}
          </div>
        )}
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#090C15] rounded-full"></span>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-slate-100 truncate group-hover:text-indigo-300">
          {username || "User"}
        </h3>
        <p className="text-xs text-slate-400 truncate">
          {email || "user@eventsphere.online"}
        </p>
      </div>
    </div>
  );
};

export default UserCard;
