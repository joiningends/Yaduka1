import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

function CompletedAreaView() {
  const [completedContractData, setCompletedContractData] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://3.6.248.144/api/v1/contracts/closed/Area/${id}`
        );
        setCompletedContractData(response.data);
      } catch (error) {
        console.error("Error fetching completed contract data:", error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="container mt-5">
      {completedContractData ? (
        <div className="col-md-12 col-lg-12 col-xl-12">
          <div className="card" style={{ borderRadius: "2rem" }}>
            <div className="card-header">
              <h4 className="card-title">Completed Area Contract Details</h4>
            </div>
            <div className="card-body">
              <div>
                <label htmlFor="storagetype" className="form-label">
                  Storage Type:
                </label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  id="storagetype"
                  value={completedContractData[0]?.Contract?.storagetype}
                  readOnly
                />
              </div>
              <div>
                <label htmlFor="renewaldays" className="form-label">
                  Renewal Days:
                </label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  id="renewaldays"
                  value={completedContractData[0]?.Contract?.renewaldays}
                  readOnly
                />
              </div>
              <div>
                <label htmlFor="contractstartdate" className="form-label">
                  Contract Start Date:
                </label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  id="contractstartdate"
                  value={completedContractData[0]?.Contract?.contractstartdate}
                  readOnly
                />
              </div>
              <div>
                <label htmlFor="Gstapplicable" className="form-label">
                  GST Applicable:
                </label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  id="Gstapplicable"
                  value={
                    completedContractData[0]?.Contract?.Gstapplicable
                      ? "Yes"
                      : "No"
                  }
                  readOnly
                />
              </div>
              <div>
                <label htmlFor="status" className="form-label">
                  Status:
                </label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  id="status"
                  value={completedContractData[0]?.Contract?.status}
                  readOnly
                />
              </div>
              <div>
                <label htmlFor="invoiceno" className="form-label">
                  Invoice Number:
                </label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  id="invoiceno"
                  value={completedContractData[0]?.Contract?.invoiceno}
                  readOnly
                />
              </div>
              <div>
                <label htmlFor="slno" className="form-label">
                  Contract Name:
                </label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  id="slno"
                  value={completedContractData[0]?.Contract?.slno}
                  readOnly
                />
              </div>
              <div>
                <label htmlFor="under" className="form-label">
                  Under:
                </label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  id="under"
                  value={completedContractData[0]?.Contract?.under}
                  readOnly
                />
              </div>
              <div className="text-center mt-4">
                <Link to={`/CompletedContract/DetailsArea/${id}`}>
                  <button
                    type="button"
                    className="btn btn-primary rounded-pill"
                    style={{
                      background: "linear-gradient(263deg, #34b6df, #34d0be)",
                    }}
                  >
                    View Stock Balance
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default CompletedAreaView;
