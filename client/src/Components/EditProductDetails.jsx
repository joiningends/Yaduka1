import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Pagination from "react-js-pagination";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function EditProductDetails() {
  const [loading, setLoading] = useState(false);
  const { selectedAdminId, selectedLocationId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTablePage, setCurrentTablePage] = useState(1);
  const [data, setData] = useState([]);
  const [requiredQuantities, setRequiredQuantities] = useState({});
  const itemsPerPage = 5;
  const tablesPerPage = 2;
  const partyId = localStorage.getItem("id");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(
          `https://www.keepitcool.app/api/v1/contracts/details/button/${selectedAdminId}/${selectedLocationId}/${localStorage.getItem(
            "id"
          )}`
        );
        const response = await axios.get(
          `https://www.keepitcool.app/api/v1/contracts/details/button/${selectedAdminId}/${selectedLocationId}/${localStorage.getItem(
            "id"
          )}`
        );

        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedAdminId, selectedLocationId]);

  const handlePageChange = pageNumber => setCurrentPage(pageNumber);
  const handleTablePageChange = pageNumber => setCurrentTablePage(pageNumber);
  const handleRequiredQuantityChange = (e, contractId) => {
    const value = parseInt(e.target.value);
    const availableQty = data
      .flatMap(item => item.contracts)
      .find(contract => contract.contractproductid === contractId).qty;

    // Check if the entered value exceeds the available quantity
    if (value > availableQty) {
      // Display an error message or handle it accordingly
      console.error("Error: Quantity cannot exceed available quantity.");
      // Optionally, you can display a toast message to notify the user
      toast.error("Quantity cannot exceed available quantity.");
      return;
    }

    // Update the required quantities state
    setRequiredQuantities(prevState => ({
      ...prevState,
      [contractId]: value,
    }));
  };

  const handleSave = async () => {
    const currentDate = new Date().toISOString().split("T")[0];
    const underValues = selectedAdminId;

    setLoading(true);

    // Read expected delivery date from local storage
    const expectedDelivery = localStorage.getItem("expectedDateOfDelivery");

    // Remove the date from local storage
    localStorage.removeItem("expectedDateOfDelivery");

    // Filter out contracts with required quantity greater than 0 or changed by the user
    const filteredData = data
      .map(contractArray => {
        const productdetails = contractArray.contracts.map(contract => ({
          requireqty: requiredQuantities[contract.contractproductid] || 0,
          deliveryQty: 0,
          contractId: contract.contractid,
          storageId: selectedLocationId,
          contractproductid: contract.contractproductid,
        }));
        return {
          productdetails: productdetails,
        };
      })
      .filter(item => item.productdetails.length > 0);

    // Construct request data including expected delivery
    const requestData = {
      date: currentDate,
      expecteddelivery: expectedDelivery, // Include expected delivery date
      underValues: underValues,
      storageId: selectedLocationId,
      requisitionDetails: filteredData,
    };

    try {
      // Send request to save data
      await axios.post(
        `https://www.keepitcool.app/api/v1/ref/create/${partyId}`,
        requestData
      );
      // Remove the date from local storage after successful response
      localStorage.removeItem("expectedDateOfDelivery");
      toast.success("Product Details updated successfully!");
      setTimeout(() => {
        window.location.href = "/Requisition";
      }, 1000);
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error saving data. Please try again.");
    }
  };

  const handleCancel = () => {
    // Navigate to "/addRequisition"
    navigate("/Requisition/AddRequisition");
  };

  const indexOfLastTable = currentPage * tablesPerPage;
  const indexOfFirstTable = indexOfLastTable - tablesPerPage;
  const currentTables = data.slice(indexOfFirstTable, indexOfLastTable);

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "800px",
        margin: "20px auto",
        borderRadius: "10px",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        padding: "20px",
        backgroundColor: "#fff",
      }}
    >
      <ToastContainer />
      {currentTables.map((item, index) => (
        <div
          key={index}
          style={{
            marginBottom: "30px",
            borderRadius: "10px",
            boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.1)",
            padding: "20px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h3
            style={{
              borderBottom: "1px solid #ccc",
              paddingBottom: "10px",
              marginBottom: "20px",
            }}
          >
            {`${item.commodity || ""} || ${item.varient || ""} || ${
              item.quality || ""
            } || ${item.size || ""} || ${item.unit || ""}`}
          </h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #ccc",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th style={{ padding: "10px", textAlign: "left" }}>
                  Contract ID
                </th>
                <th style={{ padding: "10px", textAlign: "left" }}>
                  Storage Space
                </th>
                <th style={{ padding: "10px", textAlign: "left" }}>
                  Available Quantity
                </th>
                <th style={{ padding: "10px", textAlign: "left" }}>
                  Required Quantity
                </th>
              </tr>
            </thead>
            <tbody>
              {item.contracts
                .slice(
                  (currentTablePage - 1) * itemsPerPage,
                  currentTablePage * itemsPerPage
                )
                .map((contract, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: "10px", textAlign: "left" }}>
                      {contract.slno}
                    </td>
                    <td style={{ padding: "10px", textAlign: "left" }}>
                      {contract.spacedetails.map((detail, idx) => (
                        <span key={idx}>
                          {detail.space}
                          {idx !== contract.spacedetails.length - 1 && ", "}
                        </span>
                      ))}
                    </td>
                    <td style={{ padding: "10px", textAlign: "left" }}>
                      {contract.qty}
                    </td>
                    <td style={{ padding: "10px", textAlign: "left" }}>
                      <input
                        type="number"
                        min="0"
                        max={contract.qty} // Set the max attribute to the available quantity
                        value={
                          requiredQuantities[contract.contractproductid] || ""
                        }
                        onChange={e =>
                          handleRequiredQuantityChange(
                            e,
                            contract.contractproductid
                          )
                        }
                        style={{ width: "70px", padding: "5px" }}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <Pagination
            activePage={currentTablePage}
            itemsCountPerPage={itemsPerPage}
            totalItemsCount={item.contracts.length}
            pageRangeDisplayed={5}
            onChange={handleTablePageChange}
            itemClass="page-item"
            linkClass="page-link"
            innerClass="pagination justify-content-center"
            itemClassPrev="page-item"
            itemClassNext="page-item"
            linkClassPrev="page-link"
            linkClassNext="page-link"
            activeClass="active"
          />
        </div>
      ))}
      {currentPage === Math.ceil(data.length / tablesPerPage) && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button
            className="btn btn-danger"
            onClick={() => handleCancel()}
            style={{ marginRight: "1rem" }}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={loading}
          >
            Update
          </button>
        </div>
      )}
      <div
        style={{
          marginTop: "20px",
          textAlign: "center",
          borderRadius: "10px",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          padding: "20px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <Pagination
          activePage={currentPage}
          itemsCountPerPage={tablesPerPage}
          totalItemsCount={data.length}
          pageRangeDisplayed={5}
          onChange={handlePageChange}
          itemClass="page-item"
          linkClass="page-link"
          innerClass="pagination justify-content-center"
          itemClassPrev="page-item"
          itemClassNext="page-item"
          linkClassPrev="page-link"
          linkClassNext="page-link"
          activeClass="active"
        />
      </div>
    </div>
  );
}

export default EditProductDetails;
