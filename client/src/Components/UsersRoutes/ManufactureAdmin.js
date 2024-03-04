import React from "react";
import { Route, Routes } from "react-router-dom";
import Requisition from "../Requisition";
import AddRequisition from "../AddRequisition";
import InvoiceForManufacture from "../InvoiceForManufacture";
import SideBar from "../SideBar";
import Breadcrumb from "../Breadcrumb";
import Employee from "../Employee";
import AddEmployee from "../AddEmployee";
import EditEmployee from "../EditEmployee";
import OngoingContract from "../OngoingContract";
import OngoingByAreaForManufecture from "../OngoingByAreaForManufecture";
import OngoingByProductForManufecture from "../OngoingByProductForManufecture";
import DetailsArea from "../DetailsArea";
import DetailsProduct from "../DetailsProduct";

const ManufactureAdmin = () => {
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
        <Route path="/OngoingContract" element={<OngoingContract />} />
        <Route path="/Invoice" element={<InvoiceForManufacture />} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/employee/AddEmployee" element={<AddEmployee />} />
        <Route path="/employee/EditEmployee/:id" element={<EditEmployee />} />
        <Route
          path="/Ongoing/OngoingByArea/:id"
          element={<OngoingByAreaForManufecture />}
        />
        <Route
          path="/Ongoing/OngoingByProduct/:id"
          element={<OngoingByProductForManufecture />}
        />
        <Route path="/DetailsProduct/:id" element={<DetailsProduct />} />
        <Route path="/DetailsArea/:id" element={<DetailsArea />} />
      </Routes>
    </div>
  );
};

export default ManufactureAdmin;
