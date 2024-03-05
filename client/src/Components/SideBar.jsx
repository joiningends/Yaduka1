import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaCog,
  FaEnvelope,
  FaBars,
  FaSearch,
  FaUser,
  FaBox,
  FaGlobe,
  FaArchive,
  FaCubes,
  FaTags,
  FaWrench,
  FaBuilding,
  FaExchangeAlt,
  FaClock,
  FaMapMarker,
  FaFileInvoice,
  FaFileContract,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setUserRole(storedRole);

    switch (storedRole) {
      case "coldstorageadmin":
        setMenuItems([
          { name: "Dashboard", icon: <FaHome />, path: "/dashboard" },
          { name: "Employee", icon: <FaUser />, path: "/employee" },
          { name: "Party", icon: <FaEnvelope />, path: "/party" },
          { name: "Settings", icon: <FaCog />, path: "/settings" },
          { name: "Commodity Type", icon: <FaBox />, path: "/CommodityType" },
          { name: "Packaging Type", icon: <FaTags />, path: "/PackagingType" },
          { name: "Size", icon: <FaWrench />, path: "/Size" },
          { name: "Quality", icon: <FaBuilding />, path: "/Quality" },
          { name: "Variant", icon: <FaGlobe />, path: "/Variant" },
          { name: "Product", icon: <FaCubes />, path: "/product" },
          { name: "Location", icon: <FaMapMarker />, path: "/Location" },
          { name: "Contract", icon: <FaFileContract />, path: "/Contract" },
          {
            name: "Material Movement",
            icon: <FaArchive />,
            path: "/MaterialMovement",
          },
          { name: "Ongoing", icon: <FaClock />, path: "/Ongoing" },
          { name: "Invoice", icon: <FaFileInvoice />, path: "/Invoice" },
        ]);
        break;
      case "manufectureadmin":
        setMenuItems([
          { name: "Employee", icon: <FaUser />, path: "/employee" },
          { name: "Invoice", icon: <FaFileInvoice />, path: "/Invoice" },
          {
            name: "Requisition",
            icon: <FaCog />, // Adjusted icon to FaCog for relevance
            path: "/Requisition",
          },
          { name: "Ongoing", icon: <FaClock />, path: "/Ongoing" },
        ]);
        break;
      case "coldstorageemployee":
        setMenuItems([
          { name: "Party", icon: <FaEnvelope />, path: "/party" },
          { name: "Size", icon: <FaWrench />, path: "/Size" },
          { name: "Quality", icon: <FaBuilding />, path: "/Quality" },
          { name: "Product", icon: <FaCubes />, path: "/product" },
          { name: "Location", icon: <FaMapMarker />, path: "/Location" },
          { name: "Contract", icon: <FaFileContract />, path: "/Contract" },
          {
            name: "Material Movement",
            icon: <FaArchive />,
            path: "/MaterialMovement",
          },
          { name: "Ongoing", icon: <FaClock />, path: "/Ongoing" },
          { name: "Invoice", icon: <FaFileInvoice />, path: "/Invoice" },
        ]);
        break;
      case "manufectureemployee":
        setMenuItems([
          { name: "Dashboard", icon: <FaHome />, path: "/dashboard" },
          { name: "Employee", icon: <FaUser />, path: "/employee" },
          { name: "Party", icon: <FaEnvelope />, path: "/party" },
          { name: "Settings", icon: <FaCog />, path: "/settings" },
          { name: "Commodity Type", icon: <FaBox />, path: "/CommodityType" },
          { name: "Packaging Type", icon: <FaTags />, path: "/PackagingType" },
          { name: "Size", icon: <FaWrench />, path: "/Size" },
          { name: "Quality", icon: <FaBuilding />, path: "/Quality" },
          { name: "Variant", icon: <FaGlobe />, path: "/Variant" },
          { name: "Product", icon: <FaCubes />, path: "/product" },
          { name: "Location", icon: <FaMapMarker />, path: "/Location" },
          { name: "Contract", icon: <FaFileContract />, path: "/Contract" },
          {
            name: "Material Movement",
            icon: <FaArchive />,
            path: "/MaterialMovement",
          },
          { name: "Ongoing", icon: <FaClock />, path: "/Ongoing" },
          { name: "Invoice", icon: <FaFileInvoice />, path: "/Invoice" },
        ]);
        break;
      default:
        setMenuItems([]);
        break;
    }
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSearchChange = e => {
    setSearchQuery(e.target.value);
  };

  const handleMenuItemClick = path => {
    navigate(path);
  };

  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container-fluid mt-3">
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-md">
        <div className="container-fluid p-2">
          <Link to="/" className="navbar-brand text-primary mr-0">
            Company Logo
          </Link>
          <div className="form-inline ml-auto">
            <div className="btn btn-primary" onClick={toggleSidebar}>
              <FaBars />
            </div>
          </div>
        </div>
      </nav>
      <div className={`sidebar ${isOpen ? "active" : ""}`}>
        <div className="sd-header">
          <h4 className="mb-0">Yaduka</h4>
          <div className="btn btn-primary" onClick={toggleSidebar}>
            <FaBars />
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
                <Link
                  to={item.path}
                  className="sd-link"
                  onClick={() => handleMenuItemClick(item.path)}
                >
                  {item.icon} {item.name}
                </Link>
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
