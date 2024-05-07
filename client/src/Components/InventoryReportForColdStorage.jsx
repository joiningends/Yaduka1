import React, { useState, useEffect } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import Select from "react-select";
import axios from "axios";
import Modal from "react-modal";
import ReactPaginate from "react-paginate";

function InventoryReportForColdStorage() {
  // Component state variables
  const [manufactureAdminOptions, setManufactureAdminOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [selectedAdmins, setSelectedAdmins] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentDate] = useState(
    new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  );
  const [isLocationSelectable, setIsLocationSelectable] = useState(true);
  const [isManufactureAdminSelectable, setIsManufactureAdminSelectable] =
    useState(false);
  const [productData, setProductData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loadingModalData, setLoadingModalData] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [modalPageNumber, setModalPageNumber] = useState(0);
  const productsPerPage = 2;
  const modalProductsPerPage = 4;

  // Pagination event handlers
  const handlePageChange = ({ selected }) => {
    setPageNumber(selected);
  };

  const handleModalPageChange = ({ selected }) => {
    setModalPageNumber(selected);
  };

  // Fetch locations on component mount
  useEffect(() => {
    fetchLocations();
  }, []);

  // Fetch locations function
  const fetchLocations = () => {
    axios
      .get(
        `http://localhost:5001/api/v1/location/${localStorage.getItem("id")}`
      )
      .then(response => {
        const locations = response.data.map(location => ({
          value: location.id,
          label: `${location.storagename} | ${location.address}`,
        }));
        setLocationOptions(locations);
      })
      .catch(error => {
        console.error("Error fetching locations:", error);
      });
  };

  // Handle admin change
  const handleAdminChange = selectedOptions => {
    if (selectedOptions && selectedOptions.length > 0) {
      const isAdminAllSelected = selectedOptions.some(
        option => option.value === "all"
      );
      if (isAdminAllSelected) {
        setSelectedAdmins(
          manufactureAdminOptions.filter(option => option.value !== "all")
        );
      } else {
        setSelectedAdmins(selectedOptions);
      }
    } else {
      setSelectedAdmins([]);
    }
  };

  // Handle location change
  const handleLocationChange = selectedOption => {
    setSelectedLocation(selectedOption);
    setIsManufactureAdminSelectable(true);
    fetchManufactureAdmins(selectedOption.value);
  };

  // Fetch manufacture admins
  const fetchManufactureAdmins = locationId => {
    setIsLoading(true);
    axios
      .get(
        `http://localhost:5001/api/v1/contracts/manufacture/id/${localStorage.getItem(
          "id"
        )}/${locationId}`
      )
      .then(response => {
        setIsLoading(false);
        if (Array.isArray(response.data)) {
          const admins = response.data.map(admin => ({
            value: admin.id,
            label: `${admin.name} | ${admin.mobileNumber}`,
          }));
          setManufactureAdminOptions([
            { value: "all", label: "Select All" },
            ...admins,
          ]);
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.error("Error fetching manufacture admins:", error);
      });
  };

  // Handle form submit
  const handleSubmit = (values, { resetForm }) => {
    if (!selectedLocation) {
      alert("Please select a storage location.");
      return;
    }

    if (selectedAdmins.length === 0) {
      alert("Please select at least one manufacture admin.");
      return;
    }

    setIsLoading(true);
    const requestData = {
      partyid: selectedAdmins.map(admin => admin.value),
    };

    axios
      .post(
        `http://localhost:5001/api/v1/contracts/material/${localStorage.getItem(
          "id"
        )}/${selectedLocation.value}`,
        requestData
      )
      .then(response => {
        setIsLoading(false);
        setProductData(response.data);
      })
      .catch(error => {
        setIsLoading(false);
        console.error("Error submitting form:", error);
      });
  };

  // Handle reset button click
  const handleReset = () => {
    setProductData(null);
    setSelectedAdmins([]);
    setSelectedLocation(null);
    setIsLocationSelectable(true);
    setIsManufactureAdminSelectable(false);
  };

  // Open modal and fetch modal data
  const openModal = async (product, partyId) => {
    setSelectedProduct(product);
    setLoadingModalData(true);
    console.log(partyId);
    console.log(product);
    const requestData = {
      partyid: selectedAdmins.map(admin => admin.value),
    };
    try {
      const response = await axios.get(
        `http://localhost:5001/api/v1/contracts/tabledata/inventory/pop/${
          product.Productid
        }/${localStorage.getItem("id")}/${selectedLocation.value}/${partyId}`
      );
      console.log(
        `http://localhost:5001/api/v1/contracts/tabledata/inventory/pop/${
          product.productName
        }/${localStorage.getItem("id")}/${selectedLocation.value}/${partyId}`
      );
      setModalData(response.data);
      console.log(response.data);
      setModalIsOpen(true);
    } catch (error) {
      console.error("Error fetching modal data:", error);
      alert("Error fetching modal data. Please try again later.");
    } finally {
      setLoadingModalData(false);
    }
  };

  // Paginate product data
  const productDataPaginated = productData
    ? productData
        .flat()
        .slice(pageNumber * productsPerPage, (pageNumber + 1) * productsPerPage)
    : [];

  // Paginate modal data
  const modalDataPaginated = modalData
    ? modalData
        .flat()
        .slice(
          modalPageNumber * modalProductsPerPage,
          (modalPageNumber + 1) * modalProductsPerPage
        )
    : [];

  // Calculate page count for product data
  const pageCount =
    productData && Math.ceil(productData.flat().length / productsPerPage);

  // Calculate page count for modal data
  const modalPageCount =
    modalData && Math.ceil(modalData.flat().length / modalProductsPerPage);

  return (
    <div className="container-fluid mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow" style={{ borderRadius: "2rem" }}>
            <div
              className="card-header"
              style={{ borderRadius: "2rem 2rem 0 0" }}
            >
              <h4 className="card-title mb-0">Inventory Report</h4>
            </div>
            <div className="card-body">
              <Formik
                initialValues={{
                  date: currentDate,
                  manufactureAdmin: [],
                  storageLocation: "",
                  otherField1: "",
                  otherField2: "",
                }}
                onSubmit={handleSubmit}
              >
                {({ values, resetForm }) => (
                  <Form>
                    <div className="mb-3">
                      <label htmlFor="storageLocation" className="form-label">
                        Storage Location <span className="text-danger">*</span>
                      </label>
                      <Select
                        options={locationOptions}
                        onChange={handleLocationChange}
                        value={selectedLocation}
                        placeholder={"Select Storage Location"}
                        isDisabled={!isLocationSelectable}
                      />
                      <ErrorMessage
                        name="storageLocation"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="manufactureAdmin" className="form-label">
                        Manufacture Admin <span className="text-danger">*</span>
                      </label>
                      <Select
                        options={manufactureAdminOptions}
                        onChange={handleAdminChange}
                        value={selectedAdmins}
                        placeholder="Select Manufacture Admin(s)"
                        isMulti
                        isDisabled={!isManufactureAdminSelectable}
                      />
                      <ErrorMessage
                        name="manufactureAdmin"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="mb-3">
                      <button
                        type="submit"
                        className="btn btn-primary me-2 mr-2"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        ) : (
                          "Submit"
                        )}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleReset}
                        disabled={isLoading}
                      >
                        Reset
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
              {productData && (
                <div className="mt-3">
                  <h5>Inventory Report</h5>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Manufacture Admin</th>
                        <th>Product Name</th>
                        <th>Total Quantity</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productDataPaginated.map((adminData, index) => (
                        <React.Fragment key={index}>
                          {adminData.products.map((product, idx) => (
                            <tr key={`${index}-${idx}`}>
                              {idx === 0 ? (
                                <td rowSpan={adminData.products.length}>
                                  {`${adminData.partyUser.name} | ${adminData.partyUser.mobileNumber}`}
                                </td>
                              ) : null}
                              <td>
                                {`${product.commodity} || ${product.variant} || ${product.quality} || ${product.size} || ${product.unit}`}
                              </td>
                              <td>{product.qty}</td>
                              <td>
                                <button
                                  className="btn btn-primary"
                                  onClick={() =>
                                    openModal(product, adminData?.partyUser?.id)
                                  }
                                >
                                  Details
                                </button>
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                  <ReactPaginate
                    pageCount={pageCount}
                    onPageChange={handlePageChange}
                    containerClassName={"pagination justify-content-center"}
                    activeClassName={"active"}
                    pageLinkClassName={"page-link"}
                    previousLinkClassName={"page-link"}
                    nextLinkClassName={"page-link"}
                    breakClassName={"page-item"}
                    pageClassName={"page-item"}
                    previousClassName={"page-item"}
                    nextClassName={"page-item"}
                    disabledClassName={"disabled"}
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Product Details"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "70%", // Adjust width as needed
            maxHeight: "70vh", // Limit height to 70% of viewport height
            overflowY: "auto", // Enable vertical scrolling if content exceeds maxHeight
          },
        }}
      >
        <button
          className="btn btn-danger"
          style={{ position: "absolute", top: "10px", right: "10px" }}
          onClick={() => setModalIsOpen(false)}
        >
          Cancel
        </button>
        {loadingModalData ? (
          <div>Loading...</div>
        ) : (
          <>
            <h2>
              {selectedProduct && (
                <>
                  {selectedProduct.commodity} || {selectedProduct.variant} ||{" "}
                  {selectedProduct.quality} || {selectedProduct.size} ||{" "}
                  {selectedProduct.unit}
                </>
              )}
            </h2>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Contract</th>
                  <th>Storage Space</th>
                  <th>Available Quantity</th>
                </tr>
              </thead>
              <tbody>
                {modalDataPaginated.map((item, index) => (
                  <tr key={index}>
                    <td>{item.contract.space.slno}</td>
                    <td>
                      {item.productDetails.map((detail, index) => (
                        <div key={index}>{detail.space}</div>
                      ))}
                    </td>
                    <td>{item.contract.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ReactPaginate
              pageCount={modalPageCount}
              onPageChange={handleModalPageChange}
              containerClassName={"pagination justify-content-center"}
              activeClassName={"active"}
              pageLinkClassName={"page-link"}
              previousLinkClassName={"page-link"}
              nextLinkClassName={"page-link"}
              breakClassName={"page-item"}
              pageClassName={"page-item"}
              previousClassName={"page-item"}
              nextClassName={"page-item"}
              disabledClassName={"disabled"}
              previousLabel={"Previous"}
              nextLabel={"Next"}
            />
          </>
        )}
      </Modal>
    </div>
  );
}

export default InventoryReportForColdStorage;
