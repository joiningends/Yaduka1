import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function CompletedProductView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contractData, setContractData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://3.6.248.144/api/v1/contracts/closed/Product/${id}`)
      .then(response => {
        setContractData(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading completed product contract data</div>;
  }

  const contract = contractData[0]; // Assuming only one contract is present

  const handleViewStockClick = () => {
    navigate(`/CompletedContract/DetailsProduct/${id}`);
  };

  return (
    <div className="container mt-5">
      <div className="card mb-3">
        <div className="card-body">
          <h4 className="card-title">Contract Details</h4>
          <div className="mb-3">
            <label htmlFor="storageType" className="form-label">
              Storage Type
            </label>
            <input
              type="text"
              className="form-control rounded-pill"
              id="storageType"
              value={contract.space?.storagetype}
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
              value={contract.space?.renewaldays}
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
              value={new Date(
                contract.space?.contractstartdate
              ).toLocaleDateString()}
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
              value={contract.space?.Gstapplicable ? "Yes" : "No"}
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
              value={contract.space?.status}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label htmlFor="invoiceNumber" className="form-label">
              Invoice Number
            </label>
            <input
              type="text"
              className="form-control rounded-pill"
              id="invoiceNumber"
              value={contract.space?.invoiceno}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label htmlFor="contractName" className="form-label">
              Contract Name
            </label>
            <input
              type="text"
              className="form-control rounded-pill"
              id="contractName"
              value={contract.space?.slno}
              readOnly
            />
          </div>
          {/* <button
            type="button"
            className="btn btn-primary rounded-pill"
            onClick={handleViewStockClick}
          >
            View Stock
          </button> */}
        </div>
      </div>
    </div>
  );
}

export default CompletedProductView;
