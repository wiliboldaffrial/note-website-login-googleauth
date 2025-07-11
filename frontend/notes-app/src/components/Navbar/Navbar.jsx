import React, { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import ProfileInfo from "../Cards/ProfileInfo";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => {
  const isToken = localStorage.getItem("token");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery);
    }
  };

  const onClearSearch = () => {
    handleClearSearch();
    setSearchQuery("");
  };

  // Only show search bar on dashboard page ("/" or "/dashboard")
  const isDashboard =
    location.pathname === "/" || location.pathname === "/dashboard";

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
      <div className="flex-1 flex items-center">
        <h2 className="text-xl font-medium text-black py-2">Notes</h2>
      </div>
      <div className="flex-1 flex justify-center">
        {isDashboard && (
          <SearchBar
            value={searchQuery}
            onChange={({ target }) => {
              setSearchQuery(target.value);
            }}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
          />
        )}
      </div>
      <div className="flex-1 flex justify-end">
        {isDashboard && (
          <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
        )}
      </div>
    </div>
  );
};

export default Navbar;
