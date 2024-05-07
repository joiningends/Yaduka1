import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function OngoingByProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contractData, setContractData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("id");

  console.log(userId);

  useEffect(() => {
    console.log(
      `http://localhost:5001/api/v1/contracts/onging/${userId}/${id}`
    );
    axios
      .get(`http://localhost:5001/api/v1/contracts/onging/${userId}/${id}`)
      .then(response => {
        setContractData(response.data);
        console.log(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [id]);

  const handleVariantClick = () => {
    navigate(`/Ongoing/DetailsProduct/${id}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading contract data</div>;
  }

  const handleInvoiceDetailsClick = () => {
    navigate(`/Ongoing/InvoiceDetails/${id}`);
  };

  const formatDateString = dateString => {
    const options = { day: "numeric", month: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mt-5">
      <div className="col-md-12 col-lg-12 col-xl-12">
        <div className="card" style={{ borderRadius: "2rem" }}>
          <div className="card-header">
            <h4 className="card-title">Contract Details</h4>
          </div>
          <div className="card-body">
            <form>
              <div className="mb-3 row">
                <div className="col-md-6">
                  <label htmlFor="storage" className="form-label">
                    Storage Name
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    id="storage"
                    value={contractData.contract.location.storagename}
                    readOnly
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="storageType" className="form-label">
                    Storage Type
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    id="storageType"
                    value={contractData?.contract?.storagetype}
                    readOnly
                  />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="party" className="form-label">
                  Party Name
                </label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  id="party"
                  value={contractData?.contract?.partyuser?.name}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label htmlFor="renewalDays" className="form-label">
                  Renewal Days
                </label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  id="renewalDays"
                  value={contractData?.contract?.renewaldays}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label htmlFor="contractStartDate" className="form-label">
                  Contract Start Date
                </label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  id="contractStartDate"
                  value={contractData?.contract?.contractstartdate}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label htmlFor="gstApplicable" className="form-label">
                  GST Applicable
                </label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  id="gstApplicable"
                  value={contractData?.contract?.Gstapplicable ? "Yes" : "No"}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label htmlFor="status" className="form-label">
                  Status
                </label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  id="status"
                  value={contractData?.contract?.status}
                  readOnly
                />
              </div>
            </form>

            <div className="mt-4">
              <h4>Product Type Contract Items</h4>
              <form>
                <div className="mb-3">
                  <label>Last Invoice Data (Created At)</label>
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    value={formatDateString(
                      contractData?.latestInvoice?.createdAt
                    )}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label>Number of Invoices</label>
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    value={contractData?.invoiceCount}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label>Next Invoice Date</label>
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    value={formatDateString(
                      contractData?.contract?.nextinvoicedate
                    )}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label>Next Rental Amount</label>
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    value={contractData?.nextRentalAmount}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label>Stock Balance</label>
                  <button
                    type="button"
                    className="btn btn-primary rounded-pill ms-2"
                    style={{
                      background: "linear-gradient(263deg, #34b6df, #34d0be)",
                      color: "#fff",
                      marginLeft: "1rem",
                    }}
                    onClick={() => handleVariantClick()}
                  >
                    View
                  </button>
                </div>
              </form>
              <div className="card-footer">
                <button
                  type="button"
                  className="btn btn-primary rounded-pill ms-2"
                  style={{
                    background: "linear-gradient(263deg, #34b6df, #34d0be)",
                    color: "#fff",
                    marginLeft: "1rem",
                  }}
                  onClick={handleInvoiceDetailsClick}
                >
                  Invoice Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OngoingByProduct;
