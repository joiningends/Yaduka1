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
import ManufectureEmployee from "../ManufectureEmployee";
import OngoingMaufecture from "../OngoingMaufecture";
import ViewRequisition from "../ViewRequisition";
import CompletedRequisitin from "../CompletedRequisitin";
import ViewCompletedRequisition from "../ViewCompletedRequisition";
import CompletedContractManufecture from "../CompletedContractManufecture";
import CompletedAreaView from "../CompletedAreaView";
import CompletedProductView from "../CompletedProductView";
import DetailsCompeteProduct from "../DetailsCompeteProduct";
import DetailsCompleteArea from "../DetailsCompleteArea";
import InventoryReport from "../InventoryReport";
import EditProductDetails from "../EditProductDetails";
import EditRequisitionDetails from "../EditRequisitionDetails";
import CompletedRequisitionDetails from "../CompletedRequisitionDetails";

const ManufactureAdmin = () => {
  return (
    <div>
      <SideBar />
      <Breadcrumb />
      <Routes>
        <Route path="/Requisition" element={<Requisition />} />
        <Route
          path="/Requisition/ViewRequisition/:id"
          element={<ViewRequisition />}
        />
        <Route
          path="/Requisition/AddRequisition"
          element={<AddRequisition />}
        />
        <Route path="/CompletedRequisition" element={<CompletedRequisitin />} />
        <Route
          path="/Requisition/ViewCompletedRequisition/:id"
          element={<ViewCompletedRequisition />}
        />

        <Route
          path="/CompletedContract"
          element={<CompletedContractManufecture />}
        />
        <Route
          path="CompletedContract/Area/:id"
          element={<CompletedAreaView />}
        />
        <Route
          path="CompletedContract/Product/:id"
          element={<CompletedProductView />}
        />
        <Route
          path="CompletedContract/DetailsArea/:id"
          element={<DetailsCompleteArea />}
        />
        <Route
          path="CompletedContract/DetailsProduct/:id"
          element={<DetailsCompeteProduct />}
        />
        <Route path="/OngoingContract" element={<OngoingContract />} />
        <Route path="/Invoice" element={<InvoiceForManufacture />} />
        <Route path="/employee" element={<ManufectureEmployee />} />
        <Route path="/employee/AddEmployee" element={<AddEmployee />} />
        <Route path="/employee/EditEmployee/:id" element={<EditEmployee />} />
        <Route path="/Ongoing" element={<OngoingMaufecture />} />
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
        <Route path="/InventoryReport" element={<InventoryReport />} />
        <Route
          path="requisition/addRequisition/editProductDetails/:selectedAdminId/:selectedLocationId"
          element={<EditProductDetails />}
        />
        <Route
          path="/Requisition/editRequisition/:id/:storageId"
          element={<EditRequisitionDetails />}
        />
        <Route
          path="/Requisition/completedRequisition/:id"
          element={<CompletedRequisitionDetails />}
        />
      </Routes>
    </div>
  );
};

export default ManufactureAdmin;
