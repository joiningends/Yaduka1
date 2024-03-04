import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function OngoingByArea() {
  const { id } = useParams();
  const [contractData, setContractData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem("id");

  useEffect(() => {
    axios
      .get(`http://13.233.231.174/contracts/onging/${userId}/${id}`)
      .then(response => {
        setContractData(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [id]);

  const cancelContract = async () => {
    try {
      await axios.put(`http://13.233.231.174/contracts/${id}/status`, {
        status: "Closed",
      });
      navigate("/ongoing");
    } catch (error) {
      console.error("Error cancelling contract:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading contract data</div>;
  }

  const formatDateString = dateString => {
    const options = { day: "numeric", month: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleVariantClick = () => {
    navigate(`/DetailsArea/${id}`);
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
                    value={contractData.contract.storagetype}
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
                  value={contractData.contract.renewaldays}
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
                  value={contractData.contract.contractstartdate}
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
                  value={contractData.contract.Gstapplicable ? "Yes" : "No"}
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
                  value={contractData.contract.status}
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
                      contractData.latestInvoice.createdAt
                    )}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label>Number of Invoices</label>
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    value={contractData.invoiceCount}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label>Next Invoice Date</label>
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    value={formatDateString(contractData.nextInvoiceDate)}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label>Next Rental Amount</label>
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    value={contractData.nextRentalAmount}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label>Action</label>
                  <button
                    type="button"
                    className="btn btn-danger rounded-pill ms-2"
                    onClick={cancelContract}
                  >
                    Cancel Contract
                  </button>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OngoingByArea;
