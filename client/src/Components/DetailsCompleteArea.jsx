import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function DetailsCompleteArea() {
  const { id } = useParams();
  const [completeAreaDetails, setCompleteAreaDetails] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log(`http://3.6.248.144/api/v1/contracts/closed/Area/${id}`);
      try {
        const response = await axios.get(
          `http://3.6.248.144/api/v1/contracts/closed/Area/${id}`
        );
        setCompleteAreaDetails(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching complete area details:", error);
      }
    };

    fetchData();
  }, [id]); // Fetch data when the id parameter changes

  if (!completeAreaDetails || completeAreaDetails.length === 0) {
    return <div>Loading...</div>;
  }

  const columns = ["StorageSpace", "Quantity", "Rate", "Amount"];
  const data = completeAreaDetails.map(detail => ({
    StorageSpace: detail.storagespaces?.space,
    Quantity: detail.qty,
    Rate: detail.rate,
    Amount: detail.amount,
  }));

  return (
    <div className="container mt-5">
      <div className="col-md-12 col-lg-12 col-xl-12">
        <div className="card" style={{ borderRadius: "2rem" }}>
          <div className="card-header">
            <h4 className="card-title">Complete Area Details</h4>
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
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {columns.map((column, colIndex) => (
                      <td key={colIndex}>{row[column]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailsCompleteArea;
