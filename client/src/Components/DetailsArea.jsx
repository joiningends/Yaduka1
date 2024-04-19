import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function DetailsArea() {
  const { id } = useParams();
  const [productDetails, setProductDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://3.6.248.144/api/v1/contracts/contract-area/${id}`
        );
        setProductDetails(response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchData();
  }, [id]);

  if (!productDetails || productDetails.length === 0) {
    return <div>Loading...</div>;
  }

  const selectedAreaDetails = productDetails[0].AreaSpaceDetails; // Assuming we are selecting the first area for storage space

  // Calculate totals for each column
  const totals = selectedAreaDetails.reduce(
    (acc, detail) => {
      acc.qty += detail.qty;
      acc.rate += detail.rate;
      acc.amount += detail.amount;
      return acc;
    },
    { qty: 0, rate: 0, amount: 0 }
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = selectedAreaDetails.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const columns = ["Storage Space", "Quantity", "Rate", "Amount"];

  return (
    <div className="container mt-5">
      <div className="col-md-12 col-lg-12 col-xl-12">
        <div className="card" style={{ borderRadius: "2rem" }}>
          <div className="card-header">
            <h4 className="card-title">Area Details</h4>
          </div>
          <div className="card-body">
            <table className="table">
              <thead>
                <tr>
                  {columns.map((column, index) => (
                    <th key={index}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((detail, rowIndex) => (
                  <tr key={rowIndex}>
                    <td>{detail.space}</td>
                    <td>{detail.qty}</td>
                    <td>{detail.rate}</td>
                    <td>{detail.amount}</td>
                  </tr>
                ))}
                <tr>
                  <td>
                    <strong>Total</strong>
                  </td>
                  <td>
                    <strong>{totals.qty}</strong>
                  </td>
                  <td>
                    <strong>{totals.rate}</strong>
                  </td>
                  <td>
                    <strong>{totals.amount}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
            {/* Pagination */}
            <ul className="pagination">
              {Array(Math.ceil(selectedAreaDetails.length / itemsPerPage))
                .fill()
                .map((_, index) => (
                  <li
                    key={index}
                    className={`page-item ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailsArea;
