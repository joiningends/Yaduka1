import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import ReactPaginate from "react-paginate";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function CompletedMaterialMovementColdStorage() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [manufactureAdminOptions, setManufactureAdminOptions] = useState([]);
  const [selectedAdmins, setSelectedAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [emptyAdminsMessage, setEmptyAdminsMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [requestData, setRequestData] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const modalItemsPerPage = 3;
  const itemsPerPage = 5;

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = () => {
    setIsLoading(true);
    const id = localStorage.getItem("id");
    axios
      .get(`http://3.6.248.144/api/v1/ref/material/completed/${id}`)
      .then(response => {
        const options = response.data.map(location => ({
          value: location.id,
          label: location.storagename,
        }));
        setLocations(options);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching locations:", error);
        setIsLoading(false);
      });
  };

  const handleLocationChange = selectedOption => {
    setSelectedLocation(selectedOption);
    setIsLoading(true);
    axios
      .get(
        `http://3.6.248.144/api/v1/ref/manufactureid/complete/${localStorage.getItem(
          "id"
        )}/${selectedOption.value}`
      )
      .then(response => {
        const admins = response.data;
        if (admins.length === 0) {
          setEmptyAdminsMessage(
            "No manufacture admins available for this location."
          );
        } else {
          setEmptyAdminsMessage("");
        }
        const adminOptions = admins.map(admin => ({
          value: admin.id,
          label: `${admin.name} | ${admin.mobileNumber}`,
        }));
        setManufactureAdminOptions([
          { value: "all", label: "Select All" },
          ...adminOptions,
        ]);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching manufacture admins:", error);
        setIsLoading(false);
      });
  };

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

  const handleSubmit = () => {
    setSubmitting(true);
    axios
      .post(
        `http://3.6.248.144/api/v1/ref/requstion/complete/${localStorage.getItem(
          "id"
        )}/${selectedLocation.value}`,
        {
          partyid: selectedAdmins.map(admin => admin.value),
        }
      )
      .then(response => {
        setRequestData(response.data);
        setSubmitting(false);
      })
      .catch(error => {
        console.error("Error submitting request:", error);
        setSubmitting(false);
      });
  };

  const handleReset = () => {
    setSelectedLocation(null);
    setManufactureAdminOptions([]);
    setSelectedAdmins([]);
    setEmptyAdminsMessage("");
    setRequestData([]);
  };

  const handlePageChange = ({ selected }) => {
    setPageNumber(selected);
  };

  const handleDetailsClick = item => {
    axios
      .get(`http://3.6.248.144/api/v1/ref/getById/${item.id}`)
      .then(response => {
        setModalData(response.data);
        setSelectedItemId(item.id);
        setShowModal(true);
      })
      .catch(error => {
        console.error("Error fetching details:", error);
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalData([]);
  };

  const handleEdit = () => {
    navigate(
      `/MaterialMovementCompleted/CompletedEditMaterialMovement/${selectedItemId}/${selectedLocation.value}`
    );
  };

  const renderRequestData = requestData
    .flat() // Flatten the array of arrays into a single array
    .slice(pageNumber * itemsPerPage, (pageNumber + 1) * itemsPerPage)
    .map((item, index) => (
      <tr key={index}>
        <td>{pageNumber * itemsPerPage + index + 1}</td>
        <td>{item.slno}</td>
        <td>
          <button
            className="btn btn-primary"
            onClick={() => handleDetailsClick(item)}
          >
            Details
          </button>
        </td>
      </tr>
    ));

  const pageCount = Math.ceil(requestData.length / itemsPerPage);

  return (
    <div className="container-fluid mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow" style={{ borderRadius: "2rem" }}>
            <div
              className="card-header"
              style={{ borderRadius: "2rem 2rem 0 0" }}
            >
              <h4 className="card-title mb-0">Completed Material Movement</h4>
            </div>
            <div className="card-body">
              {isLoading && <p className="text-center">Loading...</p>}
              {!isLoading && (
                <>
                  <div className="mb-3">
                    <label htmlFor="location" className="form-label">
                      Location
                    </label>
                    <Select
                      options={locations}
                      onChange={handleLocationChange}
                      value={selectedLocation}
                      placeholder="Select Location"
                    />
                  </div>
                  {emptyAdminsMessage && (
                    <p className="text-danger">{emptyAdminsMessage}</p>
                  )}
                  <div className="mb-3">
                    <label htmlFor="manufactureAdmin" className="form-label">
                      Manufacture Admin
                    </label>
                    <Select
                      options={manufactureAdminOptions}
                      onChange={handleAdminChange}
                      value={selectedAdmins}
                      placeholder="Select Manufacture Admin(s)"
                      isMulti
                    />
                  </div>
                  <div className="mb-3">
                    <button
                      type="button"
                      className="btn btn-primary me-2 mr-2"
                      onClick={handleSubmit}
                      disabled={
                        !selectedLocation ||
                        selectedAdmins.length === 0 ||
                        submitting
                      }
                    >
                      {submitting ? "Submitting..." : "Submit"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleReset}
                    >
                      Reset
                    </button>
                  </div>
                </>
              )}
              {requestData.length > 0 && (
                <>
                  <h5>Requisition Details</h5>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Sno</th>
                        <th>Requisition Number</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>{renderRequestData}</tbody>
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th style={{ width: "5rem" }}>S No.</th>
                <th>Product Name</th>
                <th>Total Requested Quantity</th>
                <th>Total Delivered Quantity</th>
              </tr>
            </thead>
            <tbody>
              {modalData.map((product, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{`${product.commodity} || ${product.variant} || ${product.quality} || ${product.size} || ${product.unit}`}</td>
                  <td>{product.qty}</td>
                  <td>{product.dqty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-primary" onClick={handleEdit}>
            Edit
          </button>
          <button className="btn btn-secondary" onClick={handleCloseModal}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CompletedMaterialMovementColdStorage;
