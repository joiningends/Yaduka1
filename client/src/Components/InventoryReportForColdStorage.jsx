import React, { useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import Modal from "react-modal";
import Pagination from "react-js-pagination";
import Select from "react-select";

function InventoryReportForColdStorage() {
  const [coldStorageAdminOptions] = useState([
    { value: 1, label: "Admin 1" },
    { value: 2, label: "Admin 2" },
    { value: 3, label: "Admin 3" },
  ]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [currentPage] = useState(1);
  const [modalPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [modalItemsPerPage] = useState(2);
  const [currentDate] = useState(
    new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  );
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLocationSelectable, setIsLocationSelectable] = useState(false);

  const handleAdminChange = selectedOption => {
    setSelectedAdmin(selectedOption);
    setSelectedLocations([]);
    setLocationOptions([]);
    setIsLocationSelectable(true); // Enable location selection when admin is selected
  };

  const handleLocationChange = selectedOptions => {
    if (selectedOptions && selectedOptions.length > 0) {
      const isSelectAllSelected = selectedOptions.some(
        option => option.value === "all"
      );

      if (isSelectAllSelected) {
        // If "Select All" is selected, select all location options except "Select All"
        setSelectedLocations(
          dummyLocationOptions.filter(option => option.value !== "all")
        );
      } else {
        setSelectedLocations(
          selectedOptions.filter(option => option.value !== "all")
        );
      }
    } else {
      setSelectedLocations([]);
    }
  };

  const handleSubmit = (values, { resetForm }) => {
    if (!selectedLocations.length) {
      alert("Please select storage location.");
      return;
    }

    const dummyTableData = [
      { commodity: "Commodity 1", variant: "Variant 1", qty: 10 },
      { commodity: "Commodity 2", variant: "Variant 2", qty: 20 },
      { commodity: "Commodity 3", variant: "Variant 3", qty: 30 },
    ];
    setTableData(dummyTableData);
    resetForm();
    setFormSubmitted(true);
  };

  const openModal = product => {
    setSelectedProduct(product);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const customProductName = product => {
    const { commodity, variant } = product;
    return `${commodity || ""} || ${variant || ""}`;
  };

  const handlePageChange = pageNumber => {};
  const handleModalPageChange = pageNumber => {};

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);

  const indexOfLastModalItem = modalPage * modalItemsPerPage;
  const indexOfFirstModalItem = indexOfLastModalItem - modalItemsPerPage;
  const currentModalItems = modalData
    ? modalData.slice(indexOfFirstModalItem, indexOfLastModalItem)
    : [];

  const dummyLocationOptions = [
    { value: "all", label: "Select All" },
    { value: 1, label: "Storage 1 - Address 1" },
    { value: 2, label: "Storage 2 - Address 2" },
    { value: 3, label: "Storage 3 - Address 3" },
  ];

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
                  coldStorageAdmin: "",
                  storageLocation: "",
                  otherField1: "",
                  otherField2: "",
                }}
                onSubmit={handleSubmit}
              >
                {({ values, resetForm }) => (
                  <Form>
                    <div className="mb-3">
                      <label htmlFor="coldStorageAdmin" className="form-label">
                        Cold Storage Admin{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <Select
                        options={coldStorageAdminOptions}
                        onChange={handleAdminChange}
                        value={selectedAdmin}
                        placeholder="Select Cold Storage Admin"
                      />
                      <ErrorMessage
                        name="coldStorageAdmin"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="storageLocation" className="form-label">
                        Storage Location <span className="text-danger">*</span>
                      </label>
                      <Select
                        options={dummyLocationOptions}
                        onChange={handleLocationChange}
                        value={selectedLocations}
                        isMulti
                        placeholder={
                          isLocationSelectable
                            ? "Select Storage Locations"
                            : "Select Cold Storage Admin first"
                        }
                        isDisabled={!isLocationSelectable}
                      />
                      <ErrorMessage
                        name="storageLocation"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="mb-3">
                      <button type="submit" className="btn btn-primary me-2 mr-2">
                        Submit
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          resetForm();
                          setSelectedAdmin(null);
                          setSelectedLocations([]);
                          setFormSubmitted(false);
                          setIsLocationSelectable(false); // Disable location selection on reset
                          setTableData([]);
                        }}
                      >
                        Reset
                      </button>
                    </div>
                    {formSubmitted &&
                      selectedAdmin &&
                      selectedLocations.length > 0 &&
                      currentItems.length > 0 && (
                        <div>
                          <div className="table-responsive">
                            <table className="table table-bordered">
                              <thead>
                                <tr>
                                  <th>Product Name</th>
                                  <th>Total Quantity</th>
                                  <th>Details</th>
                                </tr>
                              </thead>
                              <tbody>
                                {currentItems.map((item, index) => (
                                  <tr key={index}>
                                    <td>{customProductName(item)}</td>
                                    <td>{item.qty}</td>
                                    <td>
                                      <button
                                        className="btn btn-primary"
                                        onClick={() => openModal(item)}
                                      >
                                        See Details
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <Pagination
                            activePage={currentPage}
                            itemsCountPerPage={itemsPerPage}
                            totalItemsCount={tableData.length}
                            pageRangeDisplayed={5}
                            onChange={handlePageChange}
                            itemClass="page-item"
                            linkClass="page-link"
                          />
                        </div>
                      )}
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            width: "80%",
            maxHeight: "80%",
            margin: "auto",
            borderRadius: "10px",
            padding: "20px",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            overflow: "auto",
          },
        }}
      >
        {modalData && (
          <>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
              {selectedProduct && customProductName(selectedProduct)}
            </h2>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                border: "1px solid #ccc",
                marginBottom: "20px",
              }}
            >
              <thead>
                <tr>
                  <th style={{ border: "1px solid #ccc", padding: "10px" }}>
                    Contract
                  </th>
                  <th style={{ border: "1px solid #ccc", padding: "10px" }}>
                    Storage Space
                  </th>
                  <th style={{ border: "1px solid #ccc", padding: "10px" }}>
                    Available Quantity
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentModalItems.map((item, index) => (
                  <tr key={index}>
                    <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                      {item.contract.space.slno}
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                      {item.productDetails.map((detail, idx) => (
                        <span key={idx}>
                          {detail.space}
                          {idx !== item.productDetails.length - 1 && ", "}
                        </span>
                      ))}
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                      {item.contract.qty}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Pagination
                activePage={modalPage}
                itemsCountPerPage={modalItemsPerPage}
                totalItemsCount={modalData.length}
                pageRangeDisplayed={5}
                onChange={handleModalPageChange}
                itemClass="page-item"
                linkClass="page-link"
                style={{ marginBottom: "20px" }}
              />
            </div>
            <button
              style={{ position: "absolute", bottom: "20px", right: "20px" }}
              className="btn btn-danger"
              onClick={closeModal}
            >
              Cancel
            </button>
          </>
        )}
      </Modal>
    </div>
  );
}

export default InventoryReportForColdStorage;
