import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Pagination from "react-js-pagination";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CompletedEditCompletedMaterialMovement() {
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTablePage, setCurrentTablePage] = useState(1);
  const [data, setData] = useState([]);
  const itemsPerPage = 5;
  const tablesPerPage = 2;

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
                      {contract.deliveryQty}
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

export default CompletedEditCompletedMaterialMovement;
