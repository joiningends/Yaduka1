import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Spinner } from "react-bootstrap"; // Assuming you have a Spinner component from react-bootstrap
import { useNavigate } from "react-router-dom";

function AddPackagingType() {
  const initialValues = {
    packagingType: "",
  };

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!navigate) {
      console.error("useNavigate is not available");
    }
  }, [navigate]);

  const handleSubmit = async values => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://www.keepitcool.app/api/v1/unit/create",
        {
          unit: values.packagingType,
        }
      );

      console.log("API Response:", response.data);
      toast.success("Packaging Type added successfully!");
      setLoading(false);
      setTimeout(() => {
        navigate("/PackagingType");
      }, 3000); // Redirect to '/packagingtype' after 3 seconds (adjust as needed)
    } catch (error) {
      console.error("Error adding packaging type:", error);
      toast.error("Failed to add Packaging Type");
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
              <h4 className="card-title">Add Packaging Type</h4>
            </div>
            <div className="card-body">
              <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                <Form>
                  <div className="row mb-3">
                    <div className="col-md-12">
                      <label htmlFor="packagingType" className="form-label">
                        Packaging Type <span className="text-danger">*</span>
                      </label>
                      <Field
                        type="text"
                        className="form-control rounded-pill"
                        id="packagingType"
                        name="packagingType"
                        required
                      />
                      <ErrorMessage
                        name="packagingType"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-12 text-center">
                      <button
                        type="button"
                        className="btn btn-danger rounded-pill me-2"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary rounded-pill"
                        style={{
                          background:
                            "linear-gradient(263deg, #34b6df, #34d0be)",
                          marginLeft: "10px",
                        }}
                      >
                        {loading ? (
                          <Spinner
                            animation="border"
                            variant="light"
                            size="sm"
                          />
                        ) : (
                          "Submit"
                        )}
                      </button>
                    </div>
                  </div>
                </Form>
              </Formik>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AddPackagingType;
