import React, { useState } from "react";
import {
  FaHome,
  FaInfo,
  FaCog,
  FaEnvelope,
  FaBars,
  FaSearch,
  FaUser,
  FaShoppingCart,
} from "react-icons/fa";
import "./Sidebar.css";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuItems, setMenuItems] = useState([
    { name: "Dashboard", icon: <FaHome /> },
    { name: "Emplyee", icon: <FaUser /> },
    { name: "Party", icon: <FaEnvelope /> },
    { name: "Settings", icon: <FaCog /> },
    { name: "Shop", icon: <FaShoppingCart /> },
    // Add other menu items here
  ]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSearchChange = e => {
    setSearchQuery(e.target.value);
  };

  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container-fluid mt-3">
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-md">
        <div className="container-fluid p-2">
          <a className="navbar-brand text-primary mr-0">Company Logo</a>
          <div className="form-inline ml-auto">
            <div className="btn btn-primary" onClick={toggleSidebar}>
              <FaBars />
            </div>
          </div>
        </div>
      </nav>
      <div className={`sidebar ${isOpen ? "active" : ""}`}>
        <div className="sd-header">
          <h4 className="mb-0">Sidebar Header</h4>
          <div className="btn btn-primary" onClick={toggleSidebar}>
            <i className="fa fa-times"></i>
          </div>
        </div>
        <div className="sd-body">
          <div className="search-container">
            <input
              type="text"
              className="form-control search-input"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <FaSearch className="search-icon" />
          </div>
          <ul>
            {filteredMenuItems.map((item, index) => (
              <li key={index}>
                <a className="sd-link">
                  {item.icon} {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div
        className={`sidebar-overlay ${isOpen ? "active" : ""}`}
        onClick={toggleSidebar}
      ></div>
    </div>
  );
};

export default SideBar;
