import React from "react";
import { Route, Routes } from "react-router-dom";
import Requisition from "../Requisition";
import AddRequisition from "../AddRequisition";
import SideBar from "../SideBar";
import Breadcrumb from "../Breadcrumb";

const ManufactureEmployee = () => {
  return (
    <div>
      <SideBar />
      <Breadcrumb />
      <Routes>
        <Route path="/Requisition" element={<Requisition />} />
        <Route
          path="/Requisition/AddRequisition"
          element={<AddRequisition />}
        />
      </Routes>
    </div>
  );
};

export default ManufactureEmployee;
