import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RingLoader } from "react-spinners";
import Modal from "react-modal";
import Pagination from "react-js-pagination";
import axios from "axios";

function InventoryReport() {
  const [coldStorageAdminOptions, setColdStorageAdminOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [selectedAdminId, setSelectedAdminId] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [loadingAdminOptions, setLoadingAdminOptions] = useState(false);
  const [loadingLocationOptions, setLoadingLocationOptions] = useState(false);
  const [loadingTableData, setLoadingTableData] = useState(false);
  const [loadingModalData, setLoadingModalData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalPage, setModalPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [modalItemsPerPage] = useState(2); // Adjust as needed

  useEffect(() => {
    async function fetchAdminOptions() {
      setLoadingAdminOptions(true);
      try {
        const response = await axios.get(
          "http://3.6.248.144/api/v1/users/adminall/coldstorage"
        );
        setColdStorageAdminOptions(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data. Please try again later.");
      } finally {
        setLoadingAdminOptions(false);
      }
    }
    fetchAdminOptions();
  }, []);

  const handleAdminChange = async selectedAdminId => {
    setSelectedAdminId(selectedAdminId);
    setShowTable(false);
    setLocationOptions([]);
    setLoadingLocationOptions(true);
    try {
      const response = await axios.get(
        `http://3.6.248.144/api/v1/location/${selectedAdminId}`
      );
      setLocationOptions(response.data);
    } catch (error) {
      console.error("Error fetching location data:", error);
      toast.error("Error fetching location data. Please try again later.");
    } finally {
      setLoadingLocationOptions(false);
    }
  };

  const handleLocationChange = async selectedLocationId => {
    setSelectedLocationId(selectedLocationId);
    setShowTable(false);
    setLoadingTableData(true);
    try {
      const response = await axios.get(
        `http://3.6.248.144/api/v1/contracts/tabledata/${selectedAdminId}/${selectedLocationId}`
      );
      setTableData(response.data);
      setShowTable(true);
    } catch (error) {
      console.error("Error fetching table data:", error);
      toast.error("Error fetching table data. Please try again later.");
    } finally {
      setLoadingTableData(false);
    }
  };

  const handleSubmit = async values => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowTable(true);
      toast.success("Inventory Report submitted successfully!");
    }, 1500);
  };

  const openModal = async product => {
    setSelectedProduct(product);
    setLoadingModalData(true);
    try {
      const response = await axios.get(
        `http://3.6.248.144/api/v1/contracts/tabledata/inventory/pop/${product.productName}/${selectedAdminId}/${selectedLocationId}`
      );
      setModalData(response.data);
      setModalPage(1); // Reset modal page to 1 when opening
      setModalIsOpen(true);
    } catch (error) {
      console.error("Error fetching modal data:", error);
      toast.error("Error fetching modal data. Please try again later.");
    } finally {
      setLoadingModalData(false);
    }
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setModalData(null);
    setModalIsOpen(false);
  };

  const customProductName = product => {
    const { commodity, variant, quality, size, unit } = product;
    return `${commodity || ""} || ${variant || ""} || ${quality || ""} || ${
      size || ""
    } || ${unit || ""}`;
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);

  const indexOfLastModalItem = modalPage * modalItemsPerPage;
  const indexOfFirstModalItem = indexOfLastModalItem - modalItemsPerPage;
  const currentModalItems = modalData
    ? modalData.slice(indexOfFirstModalItem, indexOfLastModalItem)
    : [];

  const handlePageChange = pageNumber => setCurrentPage(pageNumber);
  const handleModalPageChange = pageNumber => setModalPage(pageNumber);

  return (
    <div className="container mt-5">
      {loading ||
      loadingAdminOptions ||
      loadingLocationOptions ||
      loadingTableData ||
      loadingModalData ? (
        <div className="d-flex justify-content-center align-items-center">
          <RingLoader color="#36D7B7" loading={true} size={150} />
        </div>
      ) : (
        <div className="row justify-content-center">
          <div className="col-md-8">
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
                    coldStorageAdmin: "",
                    storageLocation: "",
                    otherField1: "",
                    otherField2: "",
                  }}
                  onSubmit={handleSubmit}
                >
                  <Form>
                    <div className="mb-3">
                      <label htmlFor="coldStorageAdmin" className="form-label">
                        Cold Storage Admin{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <Field
                        as="select"
                        className="form-control rounded-pill"
                        id="coldStorageAdmin"
                        name="coldStorageAdmin"
                        onChange={e => handleAdminChange(e.target.value)}
                        value={selectedAdminId}
                      >
                        <option value="">Select Cold Storage Admin</option>
                        {coldStorageAdminOptions.map(option => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </Field>
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
                      <Field
                        as="select"
                        className="form-control rounded-pill"
                        id="storageLocation"
                        name="storageLocation"
                        onChange={e => handleLocationChange(e.target.value)}
                        value={selectedLocationId}
                        disabled={!selectedAdminId}
                      >
                        <option value="">Select Storage Location</option>
                        {Array.isArray(locationOptions) &&
                          locationOptions.map(option => (
                            <option key={option.id} value={option.id}>
                              {`${option.storagename} - ${option.address}`}
                            </option>
                          ))}
                      </Field>

                      <ErrorMessage
                        name="storageLocation"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    {showTable && (
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
                              {Array.isArray(currentItems) &&
                                currentItems.map((item, index) => (
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
                </Formik>
              </div>
            </div>
          </div>
        </div>
      )}
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
            overflow: "auto", // Enable scrolling if content exceeds modal height
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

export default InventoryReport;
