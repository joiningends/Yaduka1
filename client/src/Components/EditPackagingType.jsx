import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap"; // Assuming you have Spinner from react-bootstrap
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditPackagingType() {
  const [data, setData] = useState(null);
  const [packagingType, setPackagingType] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://www.keepitcool.app/api/v1/unit/${id}`
        );
        setData(response.data);
        setPackagingType(response.data.unit);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = event => {
    setPackagingType(event.target.value);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.put(`https://www.keepitcool.app/api/v1/unit/update/${id}`, {
        unit: packagingType,
      });
      toast.success("Packaging Type updated successfully!");
      setLoading(false);
      setTimeout(() => {
        navigate("/PackagingType"); // Redirect to "/packagingtype" after 2000 milliseconds (2 seconds)
      }, 2000);
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("Failed to update Packaging Type");
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/PackagingType");
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div
          className="col-md-12 col-lg-12 col-xl-12"
          style={{ width: "200rem" }}
        >
          <div className="card" style={{ borderRadius: "2rem" }}>
            <div className="card-header">
              <h4 className="card-title">Edit Packaging Type</h4>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-12">
                  <label htmlFor="packagingType" className="form-label">
                    Packaging Type <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    id="packagingType"
                    name="packagingType"
                    value={packagingType}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-12 text-center">
                  <button
                    type="button"
                    className="btn btn-danger rounded-pill me-2"
                    onClick={handleCancel}
                    style={{ marginRight: "0.5rem" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary rounded-pill"
                    onClick={handleSave}
                    style={{
                      background: "linear-gradient(263deg, #34b6df, #34d0be)",
                    }}
                  >
                    {loading ? (
                      <Spinner animation="border" variant="light" size="sm" />
                    ) : (
                      "Update"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default EditPackagingType;
