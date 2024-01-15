import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Components/SideBar.jsx";
import Employee from "./Components/Employee";
import NotFound from "./Components/NotFound";
import Breadcrumb from "./Components/Breadcrumb.jsx"; // Import Breadcrumb component
import AddEmployee from "./Components/AddEmployee.jsx";
import Party from "./Components/Party.jsx";
import AddParty from "./Components/AddParty.jsx";
import ComodityType from "./Components/ComodityType.jsx";
import AddCommodityType from "./Components/AddCommodityType.jsx";
import Commodity from "./Components/Commodity.jsx";
import AddCommodity from "./Components/AddCommodity.jsx";
import PackagingType from "./Components/PackagingType.jsx";
import AddPackagingType from "./Components/AddPackagingType.jsx";
import Size from "./Components/Size.jsx";
import AddSize from "./Components/AddSize.jsx";
import Variant from "./Components/Varient.jsx";
import AddVariant from "./Components/AddVarient.jsx";
import AddProduct from "./Components/AddProduct.jsx";
import AddLocation from "./Components/AddLocation.jsx";
import Location from "./Components/Location.jsx";
import AddSpaceType from "./Components/AddSpaceType.jsx";
import SpaceType from "./Components/SpaceType.jsx";
import AddConctract from "./Components/AddConctract.jsx";
import EditEmployee from "./Components/EditEmployee.jsx";
import AddCommodityTypeEdit from "./Components/AddComodityTypeEdit.jsx";
import EditAddVariant from "./Components/EditAddVariant.jsx";
import EditPackagingType from "./Components/EditPackagingType.jsx";
import Quality from "./Components/Quality.jsx";
import AddQuality from "./Components/AddQuality.jsx";
import EditAddSize from "./Components/EditAddSize.jsx";
import Product from "./Components/Product.jsx";
import ProductVariant from "./Components/ProductVariant.jsx";
import AddLocationn from "./Components/AddLocationn.jsx";

function App() {
  return (
    <Router>
      <Sidebar />
      <div>
        <Breadcrumb />
        <Routes>
          <Route path="/employee" element={<Employee />} />
          <Route path="/employee/AddEmployee" element={<AddEmployee />} />
          <Route path="/employee/EditEmployee/:id" element={<EditEmployee />} />
          <Route path="/Party" element={<Party />} />
          <Route path="/Party/AddParty" element={<AddParty />} />
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
          <Route path="/Location/AddLocation" element={<AddLocation />} />
          <Route path="/Location/AddLocationn" element={<AddLocationn />} />
          <Route path="/SpaceType" element={<SpaceType />} />
          <Route path="/SpaceType/AddSpaceType" element={<AddSpaceType />} />
          <Route path="/Contract" element={<SpaceType />} />
          <Route path="/Contract/AddContract" element={<AddConctract />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
