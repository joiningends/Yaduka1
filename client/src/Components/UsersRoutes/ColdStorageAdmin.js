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


const ColdStorageAdmin = () => {
  return (
    <div>
      <SideBar />
      <Breadcrumb />
      <Routes>
        <Route path="/employee" element={<Employee />} />
        <Route path="/employee/AddEmployee" element={<AddEmployee />} />
        <Route path="/employee/EditEmployee/:id" element={<EditEmployee />} />
        <Route path="/Party" element={<Party />} />
        <Route path="/Party/AddParty" element={<AddParty />} />
        <Route
          path="/Party/AddParty/:phoneNumber"
          element={<AddPartyBySearch />}
        />

        <Route path="/CommodityType" element={<ComodityType />} />

        <Route
          path="/commoditytype/AddCommodityType"
          element={<AddCommodityType />}
        />
        <Route
          path="/commoditytype/AddCommodityType/:id"
          element={<AddCommodityTypeEdit />}
        />
        <Route path="/Commodity" element={<Commodity />} />
        <Route path="/Commodity/AddCommodity" element={<AddCommodity />} />
        <Route path="/PackagingType" element={<PackagingType />} />
        <Route
          path="/PackagingType/AddPackagingType"
          element={<AddPackagingType />}
        />
        <Route
          path="/packagingtype/editpackagingtype/:id"
          element={<EditPackagingType />}
        />
        <Route path="/Size" element={<Size />} />
        <Route path="/Size/AddSize" element={<AddSize />} />
        <Route path="/Size/EditSize/:id" element={<EditAddSize />} />
        <Route path="/Quality" element={<Quality />} />
        <Route path="/Quality/AddQuality" element={<AddQuality />} />
        <Route path="/Variant" element={<Variant />} />
        <Route path="/variant/AddVariant" element={<AddVariant />} />
        <Route path="/variant/AddVariant/:id" element={<EditAddVariant />} />
        <Route path="/product" element={<Product />} />
        <Route
          path="/product/productVariant/:id"
          element={<ProductVariant />}
        />
        <Route path="/product/AddProduct" element={<AddProduct />} />
        <Route path="/Location" element={<Location />} />
        <Route path="/Location/AddLocation" element={<AddLocationn />} />
        <Route path="/Ongoing" element={<Ongoing />} />
        <Route
          path="/Ongoing/OngoingByProduct/:id"
          element={<OngoingByProduct />}
        />
        <Route path="/Ongoing/OngoingByArea/:id" element={<OngoingByArea />} />
        <Route path="/DetailsProduct/:id" element={<DetailsProduct />} />
        <Route path="/DetailsArea/:id" element={<DetailsArea />} />
        <Route path="/Contract" element={<Contract />} />
        <Route path="/Contract/AddContract" element={<AddConctract />} />
        <Route path="/MaterialMovement" element={<MaterialMovement />} />
        <Route
          path="/MaterialMovement/EditMaterialMovement/:id"
          element={<EditMaterialMovement />}
        />
        <Route
          path="/MaterialMovementCompleted"
          element={<CompletedEditMaterialMovement />}
        />
        <Route
          path="DraftContract/DraftContractProductType/:id"
          element={<DraftContractForPrpductType />}
        />
        <Route
          path="/Invoice"
          element={<InvoiceNew />}
        />
      </Routes>
    </div>
  );
};

export default ColdStorageAdmin;
