import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Pagination from "react-js-pagination";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function EditMaterialMovmentColdStorage() {
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTablePage, setCurrentTablePage] = useState(1);
  const [data, setData] = useState([]);
  const [deliveredQuantities, setDeliveredQuantities] = useState({});
  const itemsPerPage = 5;
  const tablesPerPage = 2;
  const partyId = localStorage.getItem("id");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://www.keepitcool.app/api/v1/ref/tabledata/${id}`
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handlePageChange = pageNumber => setCurrentPage(pageNumber);
  const handleTablePageChange = pageNumber => setCurrentTablePage(pageNumber);
  const handleDeliveredQuantityChange = (
    e,
    contractId,
    availableQty,
    requireQty
  ) => {
    const value = parseInt(e.target.value) || 0; // Default to 0 if value is falsy
    if (value <= availableQty && value <= requireQty) {
      setDeliveredQuantities(prevState => ({
        ...prevState,
        [contractId]: value,
      }));
    } else {
      if (value > availableQty) {
        toast.error("Delivered quantity cannot exceed available quantity.");
      } else {
        toast.error("Delivered quantity cannot exceed required quantity.");
      }
    }
  };

  const handleSave = async () => {
    try {
      const deliveryData = Object.keys(deliveredQuantities)
        .map(productId => {
          const product = data.find(item =>
            item.contracts.some(
              contract => contract.contractproductid === parseInt(productId)
            )
          );
          const contract = product.contracts.find(
            contract => contract.contractproductid === parseInt(productId)
          );
          const deliveryQty = deliveredQuantities[productId];
          return {
            id: contract.requstionid,
            deliveryQty: deliveryQty,
          };
        })
        .filter(item => item !== null);

      // Replace empty delivered quantities with 0
      for (const contract of data.flatMap(item => item.contracts)) {
        if (!(contract.contractproductid in deliveredQuantities)) {
          deliveryData.push({
            id: contract.requstionid,
            deliveryQty: 0,
          });
        }
      }

      console.log(deliveryData);

      // Uncomment the following lines to send the PUT request
      const response = await axios.put(
        "https://www.keepitcool.app/api/v1/ref",
        deliveryData
      );

      console.log("PUT Response:", response.data);

      // Navigate to /MaterialMovement on successful PUT request
      window.location.href = "/MaterialMovementPending";
    } catch (error) {
      console.error("PUT Error:", error.message);
    }
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
            {`${item.commodity || ""} || ${item.variant || ""} || ${
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
                <th style={{ padding: "10px", textAlign: "left" }}>
                  Delivered Quantity
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
                      {contract.requireQty}
                    </td>
                    <td style={{ padding: "10px", textAlign: "left" }}>
                      <input
                        type="number"
                        min="0"
                        max={Math.min(contract.qty, contract.requireQty)} // Set max attribute to the minimum of available and required quantity
                        value={
                          deliveredQuantities[contract.contractproductid] || ""
                        }
                        onChange={e => {
                          const availableQty = contract.qty;
                          const requireQty = contract.requireQty;
                          handleDeliveredQuantityChange(
                            e,
                            contract.contractproductid,
                            availableQty,
                            requireQty
                          );
                        }}
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
            onClick={() => {
              setDeliveredQuantities({});
              navigate("/MaterialMovementCompleted");
            }}
            style={{ marginRight: "1rem" }}
          >
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
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

export default EditMaterialMovmentColdStorage;
