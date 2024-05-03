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
import AddQuality from "../AddQuality";
import EditQuality from "../EditQuality";
import Variant from "../Varient";
import EditPackagingType from "../EditPackagingType";
import AddSize from "../AddSize";
import AddPackagingType from "../AddPackagingType";
import Party from "../Party";
import AddParty from "../AddParty";
import AddPartyBySearch from "../AddPartyBySearch";
import ComodityType from "../ComodityType";
import AddCommodity from "../AddCommodity";
import AddCommodityType from "../AddCommodityType";
import AddCommodityTypeEdit from "../AddComodityTypeEdit";
import Commodity from "../Commodity";
import PackagingType from "../PackagingType";

import Size from "../Size";
import Quality from "../Quality";
import EditAddSize from "../EditAddSize";
import AddVariant from "../AddVarient";
import EditAddVariant from "../EditAddVariant";
import AddProduct from "../AddProduct";
import Product from "../Product";
import ProductVariant from "../ProductVariant";
import EditCommodity from "../EditCommodity";
import InvoiceDetails from "../InvoiceDetails";
import InvoicesForM from "../InvoicesForM";
import ProductVariants from "../ProductVariants";

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
        <Route path="/Invoices/Invoice" element={<InvoiceForManufacture />} />
        <Route path="/Invoices" element={<InvoicesForM />} />
        <Route path="/Employee" element={<ManufectureEmployee />} />
        <Route path="/Employee/AddEmployee" element={<AddEmployee />} />
        <Route path="/Employee/EditEmployee/:id" element={<EditEmployee />} />
        <Route path="/Ongoing" element={<OngoingMaufecture />} />
        <Route
          path="/Ongoing/OngoingByArea/:id"
          element={<OngoingByAreaForManufecture />}
        />
        <Route
          path="/Ongoing/OngoingByProduct/:id"
          element={<OngoingByProductForManufecture />}
        />
        <Route
          path="/Ongoing/InvoiceDetails/:id"
          element={<InvoiceDetails />}
        />
        <Route path="/DetailsProduct/:id" element={<DetailsProduct />} />
        <Route path="/DetailsArea/:id" element={<DetailsArea />} />
        <Route path="/InventoryReport" element={<InventoryReport />} />
        <Route
          path="Requisition/AddRequisition/EditProductDetails/:selectedAdminId/:selectedLocationId"
          element={<EditProductDetails />}
        />
        <Route
          path="/Requisition/EditRequisition/:id/:storageId"
          element={<EditRequisitionDetails />}
        />
        <Route
          path="/Requisition/CompletedRequisition/:id"
          element={<CompletedRequisitionDetails />}
        />
        <Route path="/CommodityType" element={<ComodityType />} />

        <Route
          path="/CommodityType/AddCommodityType"
          element={<AddCommodityType />}
        />
        <Route
          path="/CommodityType/AddCommodityType/:id"
          element={<AddCommodityTypeEdit />}
        />
        <Route path="/Commodity" element={<Commodity />} />
        <Route path="/Commodity/AddCommodity" element={<AddCommodity />} />
        <Route
          path="/Commodity/EditCommodity/:id"
          element={<EditCommodity />}
        />
        <Route path="/PackagingType" element={<PackagingType />} />
        <Route
          path="/PackagingType/AddPackagingType"
          element={<AddPackagingType />}
        />
        <Route
          path="/PackagingType/EditPackagingType/:id"
          element={<EditPackagingType />}
        />
        <Route path="/Size" element={<Size />} />
        <Route path="/Size/AddSize" element={<AddSize />} />
        <Route path="/Size/EditSize/:id" element={<EditAddSize />} />
        <Route path="/Quality" element={<Quality />} />
        <Route path="/Quality/AddQuality" element={<AddQuality />} />
        <Route path="/Quality/EditAddQuality/:id" element={<EditQuality />} />

        <Route path="/Variant" element={<Variant />} />
        <Route path="/Variant/AddVariant" element={<AddVariant />} />
        <Route path="/Variant/AddVariant/:id" element={<EditAddVariant />} />
        <Route path="/Product" element={<Product />} />
        <Route path="Product/VariantDetails/:id" element={<ProductVariant />} />
        <Route path="/Product/AddProduct" element={<AddProduct />} />
        <Route
          path="/Product/ProductVariant/:id"
          element={<ProductVariants />}
        />
      </Routes>
    </div>
  );
};

export default ManufactureAdmin;
