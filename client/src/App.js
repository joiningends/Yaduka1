import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Components/Login.jsx";
import Otp from "./Components/Otp.jsx";
import Password from "./Components/Password.jsx";
import SetPassword from "./Components/SetPassword.jsx";

import ColdStorageAdmin from "./Components/UsersRoutes/ColdStorageAdmin.js";
import ManufactureAdmin from "./Components/UsersRoutes/ManufactureAdmin.js";
import ColdStorageEmployee from "./Components/UsersRoutes/ColdStorageEmployee.js";
import ManufactureEmployee from "./Components/UsersRoutes/ManufactureEmployee.js";

const App = () => {
  const userRole = localStorage.getItem("role");
  console.log(userRole);

  return (
    <Router>
      <Routes>
        {/* Common Routes or Login Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/otp/:number" element={<Otp />} />
        <Route path="/password/:number/:otp" element={<Password />} />
        <Route path="/setPassword/:id/:number/:otp" element={<SetPassword />} />

        {/* User Role Specific Routes */}
        {userRole === "coldstorageadmin" && (
          <Route path="/*" element={<ColdStorageAdmin />} />
        )}

        {/* Route for Cold Storage Employee */}
        {userRole === "coldstorageemployee" && (
          <Route path="/*" element={<ColdStorageEmployee />} />
        )}

        {userRole === "manufectureadmin" && (
          <Route path="/*" element={<ManufactureAdmin />} />
        )}

        {/* Route for Manufacture Employee */}
        {userRole === "manufectureemployee" && (
          <Route path="/*" element={<ManufactureEmployee />} />
        )}

        {/* Redirect to login if no matching route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
