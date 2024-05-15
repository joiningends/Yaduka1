import React, { useState, useEffect } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DraftContractForAreaType() {
  const [draftContract, setDraftContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [storageId, setStorageId] = useState(null);
  const [storageSpaces, setStorageSpaces] = useState([]);
  const [selectedSpaceId, setSelectedSpaceId] = useState(null); // Changed to single selection
  const [inQty, setInQty] = useState(1);
  const [rate, setRate] = useState(0);
  const [selectedStorageSpaces, setSelectedStorageSpaces] = useState([]);

  const userId = localStorage.getItem("id");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://www.keepitcool.app/api/v1/contracts/${userId}/draft/${id}`
        );
        setDraftContract(response.data);
        setStorageId(response.data.storageId);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching draft contract:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchStorageSpaces = async () => {
      try {
        const response = await axios.get(
          `https://www.keepitcool.app/api/v1/location/space/${storageId}`
        );
        setStorageSpaces(response.data);
      } catch (error) {
        console.error("Error fetching storage spaces:", error);
      }
    };

    if (storageId) {
      fetchStorageSpaces();
    }
  }, [storageId]);

  const handleAddSpace = () => {
    if (selectedSpaceId && rate >= 0) {
      // Check if selectedSpaceId is not null
      setSelectedStorageSpaces([
        ...selectedStorageSpaces,
        {
          storagespace: selectedSpaceId,
          qty: inQty,
          rate: rate,
          amount: inQty * rate,
        },
      ]);
      setSelectedSpaceId(null); // Reset selectedSpaceId
      setInQty(1);
      setRate(0);
    }
  };

  const handleRemoveSpace = index => {
    const updatedSpaces = [...selectedStorageSpaces];
    updatedSpaces.splice(index, 1);
    setSelectedStorageSpaces(updatedSpaces);
  };

  const handleClearData = () => {
    setSelectedSpaceId(null);
    setRate(0);
  };

  const handleSubmitByArea = async () => {
    try {
      const dataToSend = {
        storagespaces: selectedStorageSpaces,
      };

      console.log(dataToSend);

      const response = await axios.put(
        `https://www.keepitcool.app/api/v1/contracts/draft/${id}/${userId}`,
        dataToSend
      );

      toast.success("Data submitted successfully!");
      setTimeout(() => {
        navigate("/Contract");
      }, 2000);
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Failed to submit data. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="col-md-12 col-lg-12 col-xl-12">
        <div className="card" style={{ borderRadius: "2rem" }}>
          <div className="card-header">
            <h4 className="card-title">Draft Contract Details</h4>
          </div>
          <div className="card-body">
            {loading ? (
              <ClipLoader loading={loading} size={150} />
            ) : (
              <>
                {/* Render storage location field */}
                <div className="mb-3">
                  <label htmlFor="storageName" className="form-label">
                    Storage Name:
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    id="storageName"
                    value={draftContract?.location?.storagename}
                    readOnly
                  />
                </div>
                {/* End of storage location field */}

                <div className="mb-3">
                  <label htmlFor="party" className="form-label">
                    Party:
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    id="party"
                    value={draftContract?.partyuser?.name}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="storageType" className="form-label">
                    Storage Type:
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    id="storageType"
                    value={draftContract?.storagetype}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="renewalDays" className="form-label">
                    Renewal Days:
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    id="renewalDays"
                    value={draftContract?.renewaldays}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="contractStartDate" className="form-label">
                    Contract Start Date:
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    id="contractStartDate"
                    value={draftContract?.contractstartdate}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="gstApplicable" className="form-label">
                    GST Applicable:
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    id="gstApplicable"
                    value={draftContract?.Gstapplicable ? "Yes" : "No"}
                    readOnly
                  />
                </div>
                {draftContract?.Gstapplicable && (
                  <div className="mb-3">
                    <label htmlFor="gstRate" className="form-label">
                      GST Rate:
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-pill"
                      id="gstRate"
                      value={`${draftContract?.gstRate?.percentage}%`}
                      readOnly
                    />
                  </div>
                )}
                {draftContract?.Gstapplicable && (
                  <div className="mb-3">
                    <label htmlFor="gstType" className="form-label">
                      GST Type:
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-pill"
                      id="gstType"
                      value={draftContract?.gstType.name}
                      readOnly
                    />
                  </div>
                )}

                {/* Render storage space selection */}
                <div className="mb-3">
                  <label htmlFor="selectedSpace" className="form-label">
                    Storage Space <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-control rounded-pill"
                    id="selectedSpace"
                    value={selectedSpaceId}
                    onChange={e => setSelectedSpaceId(e.target.value)}
                  >
                    <option value="">Select a storage space</option>
                    {storageSpaces.map(space => (
                      <option key={space.id} value={space.id}>
                        {space.space}
                      </option>
                    ))}
                  </select>
                </div>
                {/* End of storage space selection */}

                <div className="mb-3">
                  <label htmlFor="inQty" className="form-label">
                    In Qty <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    id="inQty"
                    name="inQty"
                    value={inQty}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="rate" className="form-label">
                    Rate <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control rounded-pill"
                    id="rate"
                    name="rate"
                    value={rate}
                    min="0"
                    onChange={e => setRate(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="amount" className="form-label">
                    Amount
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    id="amount"
                    name="amount"
                    value={inQty * rate}
                    readOnly
                  />
                </div>
                <div className="text-center">
                  <button
                    type="button"
                    className="btn btn-primary rounded-pill"
                    onClick={handleAddSpace}
                    style={{
                      background: "linear-gradient(263deg, #34b6df, #34d0be)",
                      marginRight: "1rem",
                    }}
                  >
                    Add+
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger rounded-pill ms-2"
                    onClick={handleClearData}
                  >
                    Clear Data
                  </button>
                </div>
                {selectedStorageSpaces.length > 0 && (
                  <div className="mt-4">
                    <h5>Entered Details</h5>
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Storage Space</th>
                          <th>In Qty</th>
                          <th>Rate</th>
                          <th>Amount</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedStorageSpaces.map((space, index) => (
                          <tr key={index}>
                            <td>
                              {
                                storageSpaces.find(
                                  s => s.id == space.storagespace
                                )?.space
                              }
                            </td>
                            <td>{space.qty}</td>
                            <td>{space.rate}</td>
                            <td>{space.amount}</td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => handleRemoveSpace(index)}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {selectedStorageSpaces.length > 0 && (
                  <div className="mt-4">
                    <h5>Submit Contract by Area</h5>
                    <div className="text-center">
                      <button
                        type="button"
                        className="btn btn-success rounded-pill"
                        onClick={handleSubmitByArea}
                        style={{
                          background:
                            "linear-gradient(90deg, #34b6df, #34d0be)",
                        }}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default DraftContractForAreaType;
