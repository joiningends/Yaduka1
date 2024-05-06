import React from "react";
import { Route, Routes } from "react-router-dom";
import SideBar from "../SideBar";
import Breadcrumb from "../Breadcrumb";
import Employee from "../Employee";
import AddEmployee from "../AddEmployee";
import EditEmployee from "../EditEmployee";
import Party from "../Party";
import AddParty from "../AddParty";
import AddPartyBySearch from "../AddPartyBySearch";
import ComodityType from "../ComodityType";
import AddCommodity from "../AddCommodity";
import AddCommodityType from "../AddCommodityType";
import AddCommodityTypeEdit from "../AddComodityTypeEdit";
import Commodity from "../Commodity";
import PackagingType from "../PackagingType";
import AddPackagingType from "../AddPackagingType";
import EditPackagingType from "../EditPackagingType";
import Size from "../Size";
import Quality from "../Quality";
import AddQuality from "../AddQuality";
import AddSize from "../AddSize";
import EditAddSize from "../EditAddSize";
import Variant from "../Varient";
import AddVariant from "../AddVarient";
import EditAddVariant from "../EditAddVariant";
import AddProduct from "../AddProduct";
import Product from "../Product";
import ProductVariant from "../ProductVariant";
import Location from "../Location";
import AddLocationn from "../AddLocationn";
import Ongoing from "../Ongoing";
import OngoingByProduct from "../OngoingByProduct";
import OngoingByArea from "../OngoingByArea";
import Contract from "../Contract";
import DetailsArea from "../DetailsArea";
import DetailsProduct from "../DetailsProduct";
import AddConctract from "../AddConctract";
import MaterialMovement from "../MaterialMovement";
import EditMaterialMovement from "../EditMaterialMovement";
import CompletedEditMaterialMovement from "../CompletedEditMaterialMovement";
import DraftContractForAreaType from "../DraftContractForAreaType";
import DraftContractForPrpductType from "../DraftContractForPrpductType";
import InvoiceNew from "../InvoiceNew";
import EditParty from "../EditParty";
import EditQuality from "../EditQuality";
import Completed from "../Completed";
import CompletedAreaView from "../CompletedAreaView";
import CompletedProductView from "../CompletedProductView";
import DetailsCompleteArea from "../DetailsCompleteArea";
import DetailsCompeteProduct from "../DetailsCompeteProduct";
import ViewCompletedMaterialMovement from "../ViewCompletedMaterialMovement";
import InventoryReport from "../InventoryReport";
import InventoryReportForColdStorage from "../InventoryReportForColdStorage";
import EditMaterialMovmentColdStorage from "../EditMaterialMovmentColdStorage";
import CompletedMaterialMovementColdStorage from "../CompletedMaterialMovementColdStorage";
import EditMaterialMovementColdStorageCompleted from "../EditMaterialMovementColdStorageCompleted";
import EditCommodity from "../EditCommodity";
import ProductVariants from "../ProductVariants";
import InvoicesForColdStorage from "../InvoicesForColdStorage";
import MaterialMovementColdPending from "../MaterialMovementColdPending";
import MaterialMovementColdCompleted from "../MaterialMovementColdCompleted";
import InvoiceDetails from "../InvoiceDetails";


const ColdStorageAdmin = () => {
  return (
    <div>
      <SideBar />
      <Breadcrumb />
      <Routes>
        <Route path="/Employee" element={<Employee />} />
        <Route path="/Employee/AddEmployee" element={<AddEmployee />} />
        <Route path="/Employee/EditEmployee/:id" element={<EditEmployee />} />
        <Route path="/Party" element={<Party />} />
        <Route path="/Party/AddParty" element={<AddParty />} />
        <Route path="/Party/EditParty/:phoneNumber" element={<EditParty />} />
        <Route
          path="/Product/ProductVariant/:id"
          element={<ProductVariants />}
        />

        <Route
          path="/Party/AddParty/:phoneNumber"
          element={<AddPartyBySearch />}
        />

        <Route path="/CommodityType" element={<ComodityType />} />

        <Route
          path="/CommodityType/AddCommodityType"
          element={<AddCommodityType />}
        />
        <Route
          path="/CommodityType/EditCommodityType/:id"
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
         <Route
          path="/Ongoing/InvoiceDetails/:id"
          element={<InvoiceDetails />}
        />
        <Route path="/Size" element={<Size />} />
        <Route path="/Size/AddSize" element={<AddSize />} />
        <Route path="/Size/EditSize/:id" element={<EditAddSize />} />
        <Route path="/Quality" element={<Quality />} />
        <Route path="/Quality/AddQuality" element={<AddQuality />} />
        <Route path="/Quality/EditAddQuality/:id" element={<EditQuality />} />

        <Route path="/Variant" element={<Variant />} />
        <Route path="/Variant/AddVariant" element={<AddVariant />} />
        <Route path="/Variant/EditVariant/:id" element={<EditAddVariant />} />
        <Route path="/Product" element={<Product />} />
        <Route path="Product/VariantDetails/:id" element={<ProductVariant />} />
        <Route path="/Product/AddProduct" element={<AddProduct />} />
        <Route path="/Location" element={<Location />} />
        <Route path="/Location/AddLocation" element={<AddLocationn />} />
        <Route path="/Ongoing" element={<Ongoing />} />
        <Route
          path="/Ongoing/OngoingByProduct/:id"
          element={<OngoingByProduct />}
        />
        <Route path="/Ongoing/OngoingByArea/:id" element={<OngoingByArea />} />
        <Route
          path="/Ongoing/DetailsProduct/:id"
          element={<DetailsProduct />}
        />
        <Route path="/Ongoing/DetailsArea/:id" element={<DetailsArea />} />
        <Route path="/Contract" element={<Contract />} />
        <Route path="/Contract/AddContract" element={<AddConctract />} />
        <Route
          path="MaterialMovementPending/MaterialMovement"
          element={<MaterialMovement />}
        />
        <Route
          path="/MaterialMovement/EditMaterialMovement/:id"
          element={<EditMaterialMovement />}
        />
        <Route
          path="/MaterialMovementCompleted/CompletedMaterialMovement"
          element={<CompletedMaterialMovementColdStorage />}
        />
        <Route
          path="/MaterialMovement/ViewMaterialMovement/:id"
          element={<ViewCompletedMaterialMovement />}
        />
        <Route
          path="Contract/DraftContractProductType/:id"
          element={<DraftContractForPrpductType />}
        />
        <Route
          path="Contract/DraftContractAreaType/:id"
          element={<DraftContractForAreaType />}
        />
        <Route path="/CompletedContract" element={<Completed />} />
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
        <Route path="/Invoices/Invoice" element={<InvoiceNew />} />
        <Route path="/Invoices" element={<InvoicesForColdStorage />} />
        <Route
          path="/InventoryReport"
          element={<InventoryReportForColdStorage />}
        />
        <Route
          path="/MaterialMovementPending/EditMaterialMovement/:id/:storageId"
          element={<EditMaterialMovmentColdStorage />}
        />
        <Route
          path="/MaterialMovementCompleted/CompletedEditMaterialMovement/:id/:storageId"
          element={<EditMaterialMovementColdStorageCompleted />}
        />
        <Route
          path="/MaterialMovementCompleted/EditMaterialMovement/:id/:storageId"
          element={<EditMaterialMovementColdStorageCompleted />}
        />
        
        <Route
          path="/MaterialMovementPending"
          element={<MaterialMovementColdPending />}
        />
        <Route
          path="/MaterialMovementCompleted"
          element={<MaterialMovementColdCompleted />}
        />
      </Routes>
    </div>
  );
};

export default ColdStorageAdmin;
