import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
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
  FaAngleDown,
} from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [showContractDropdown, setShowContractDropdown] = useState(false);
  const [showRequisitionDropdown, setShowRequisitionDropdown] = useState(false);
  const [showMaterialMovementDropdown, setShowMaterialMovementDropdown] =
    useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setUserRole(storedRole);

    switch (storedRole) {
      case "coldstorageadmin":
        setMenuItems([
          { name: "Dashboard", icon: <FaHome />, path: "/Dashboard" },
          { name: "Employee", icon: <FaUser />, path: "/Employee" },
          { name: "Party", icon: <FaEnvelope />, path: "/Party" },
          { name: "Commodity Type", icon: <FaBox />, path: "/CommodityType" },
          { name: "Packaging Type", icon: <FaTags />, path: "/PackagingType" },
          { name: "Size", icon: <FaWrench />, path: "/Size" },
          { name: "Quality", icon: <FaBuilding />, path: "/Quality" },
          { name: "Variant", icon: <FaGlobe />, path: "/Variant" },
          { name: "Product", icon: <FaCubes />, path: "/Product" },
          { name: "Commodity", icon: <FaWrench />, path: "/Commodity" },
          { name: "Location", icon: <FaMapMarker />, path: "/Location" },
          {
            name: "Contract",
            icon: <FaFileContract />,
            path: "",
            subItems: [
              { name: "Draft", icon: <FaCog />, path: "/Contract" },
              { name: "Ongoing", icon: <FaClock />, path: "/Ongoing" },
              {
                name: "Completed",
                icon: <FaArchive />,
                path: "/CompletedContract",
              },
            ],
          },
          {
            name: "Material Movement",
            icon: <FaArchive />,
            path: "",
            subItems: [
              {
                name: "Pending",
                icon: <FaCog />,
                path: "/MaterialMovementPending",
              },
              {
                name: "Completed",
                icon: <FaClock />,
                path: "/MaterialMovementCompleted",
              },
            ],
          },
          { name: "Invoice", icon: <FaFileInvoice />, path: "/Invoices" },
          {
            name: "Inventory Report",
            icon: <FaFileInvoice />,
            path: "/InventoryReport",
          },
        ]);
        break;
      case "manufectureadmin":
        setMenuItems([
          { name: "Employee", icon: <FaUser />, path: "/Employee" },
          {
            name: "Inventory Report",
            icon: <FaUser />,
            path: "/InventoryReport",
          },
          {
            name: "Contract",
            icon: <FaFileContract />,
            path: "",
            subItems: [
              { name: "Ongoing", icon: <FaClock />, path: "/Ongoing" },
              {
                name: "Completed",
                icon: <FaArchive />,
                path: "/CompletedContract",
              },
            ],
          },
          { name: "Invoice", icon: <FaFileInvoice />, path: "/Invoices" },
          {
            name: "Requisition",
            icon: <FaCog />,
            path: "",
            subItems: [
              { name: "Pending", icon: <FaCog />, path: "/Requisition" },
              {
                name: "Completed",
                icon: <FaArchive />,
                path: "/CompletedRequisition",
              },
            ],
          },
          { name: "Commodity Type", icon: <FaBox />, path: "/CommodityType" },
          { name: "Packaging Type", icon: <FaTags />, path: "/PackagingType" },
          { name: "Size", icon: <FaWrench />, path: "/Size" },
          { name: "Quality", icon: <FaBuilding />, path: "/Quality" },
          { name: "Variant", icon: <FaGlobe />, path: "/Variant" },
          { name: "Product", icon: <FaCubes />, path: "/Product" },
          { name: "Commodity", icon: <FaWrench />, path: "/Commodity" },
        ]);
        break;
      case "coldstorageemployee":
        setMenuItems([
          { name: "Party", icon: <FaEnvelope />, path: "/Party" },
          { name: "Size", icon: <FaWrench />, path: "/Size" },
          { name: "Quality", icon: <FaBuilding />, path: "/Quality" },
          { name: "Product", icon: <FaCubes />, path: "/Product" },
          { name: "Location", icon: <FaMapMarker />, path: "/Location" },
          {
            name: "Contract",
            icon: <FaFileContract />,
            path: "",
            subItems: [
              { name: "Draft", icon: <FaCog />, path: "/Contract" },
              { name: "Ongoing", icon: <FaClock />, path: "/Ongoing" },
              {
                name: "Completed",
                icon: <FaArchive />,
                path: "/CompletedContract",
              },
            ],
          },
          {
            name: "Material Movement",
            icon: <FaArchive />,
            path: "/MaterialMovement",
            subItems: [
              {
                name: "Pending",
                icon: <FaCog />,
                path: "/MaterialMovementPending",
              },
              {
                name: "Completed",
                icon: <FaClock />,
                path: "/MaterialMovementCompleted",
              },
            ],
          },
          { name: "Invoice", icon: <FaFileInvoice />, path: "/Invoices" },
          {
            name: "Inventory Report",
            icon: <FaFileInvoice />,
            path: "/InventoryReport",
          },
        ]);
        break;
      case "manufectureemployee":
        setMenuItems([
          {
            name: "Contract",
            icon: <FaFileContract />,
            path: "",
            subItems: [
              { name: "Ongoing", icon: <FaClock />, path: "/Ongoing" },
              {
                name: "Completed",
                icon: <FaArchive />,
                path: "/CompletedContract",
              },
            ],
          },
          { name: "Product", icon: <FaCubes />, path: "/Product" },
          { name: "Invoice", icon: <FaFileInvoice />, path: "/Invoices" },
          {
            name: "Requisition",
            icon: <FaCog />,
            path: "",
            subItems: [
              { name: "Pending", icon: <FaCog />, path: "/Requisition" },
              {
                name: "Completed",
                icon: <FaArchive />,
                path: "/CompletedRequisition",
              },
            ],
          },
        ]);
        break;
      default:
        setMenuItems([]);
        break;
    }
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSearchChange = e => {
    setSearchQuery(e.target.value);
  };

  const handleMenuItemClick = path => {
    navigate(path);
    setShowContractDropdown(false);
    setShowRequisitionDropdown(false);
    setShowMaterialMovementDropdown(false);
    setIsOpen(!isOpen);
  };

  const handleContractClick = () => {
    setShowContractDropdown(!showContractDropdown);
    setShowRequisitionDropdown(false);
    setShowMaterialMovementDropdown(false);
  };

  const handleRequisitionClick = () => {
    setShowRequisitionDropdown(!showRequisitionDropdown);
    setShowContractDropdown(false);
    setShowMaterialMovementDropdown(false);
  };

  const handleMaterialMovementClick = () => {
    setShowMaterialMovementDropdown(!showMaterialMovementDropdown);
    setShowContractDropdown(false);
    setShowRequisitionDropdown(false);
  };

  const openLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  const handleLogout = () => {
    closeLogoutModal();
    localStorage.removeItem("user");
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    navigate("/Login");
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
            <button className="btn btn-danger ml-2" onClick={openLogoutModal}>
              Logout
            </button>
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
                {item.subItems ? (
                  <div
                    className={`sd-link ${
                      location.pathname.startsWith(item.path) ? "active" : ""
                    }`}
                    onClick={
                      item.name === "Contract"
                        ? handleContractClick
                        : item.name === "Requisition"
                        ? handleRequisitionClick
                        : item.name === "Material Movement"
                        ? handleMaterialMovementClick
                        : null
                    }
                  >
                    {item.icon} {item.name}{" "}
                    {item.name === "Contract" && <FaAngleDown />}
                    {item.name === "Requisition" && <FaAngleDown />}
                    {item.name === "Material Movement" && <FaAngleDown />}
                    {showContractDropdown && item.name === "Contract" && (
                      <ul className="sub-menu">
                        {item.subItems.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              to={subItem.path}
                              className={`sd-link ${
                                location.pathname === subItem.path
                                  ? "active"
                                  : ""
                              }`}
                              onClick={() => handleMenuItemClick(subItem.path)}
                            >
                              {subItem.icon} {subItem.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                    {showRequisitionDropdown && item.name === "Requisition" && (
                      <ul className="sub-menu">
                        {item.subItems.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              to={subItem.path}
                              className={`sd-link ${
                                location.pathname === subItem.path
                                  ? "active"
                                  : ""
                              }`}
                              onClick={() => handleMenuItemClick(subItem.path)}
                            >
                              {subItem.icon} {subItem.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                    {showMaterialMovementDropdown &&
                      item.name === "Material Movement" && (
                        <ul className="sub-menu">
                          {item.subItems.map((subItem, subIndex) => (
                            <li key={subIndex}>
                              <Link
                                to={subItem.path}
                                className={`sd-link ${
                                  location.pathname === subItem.path
                                    ? "active"
                                    : ""
                                }`}
                                onClick={() =>
                                  handleMenuItemClick(subItem.path)
                                }
                              >
                                {subItem.icon} {subItem.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`sd-link ${
                      location.pathname === item.path ? "active" : ""
                    }`}
                    onClick={() => handleMenuItemClick(item.path)}
                  >
                    {item.icon} {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div
        className={`sidebar-overlay ${isOpen ? "active" : ""}`}
        onClick={toggleSidebar}
      ></div>

      {/* Logout Modal */}
      <Modal show={isLogoutModalOpen} onHide={closeLogoutModal}>
        <Modal.Header closeButton>
          <Modal.Title>Logout Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to logout?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeLogoutModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SideBar;
