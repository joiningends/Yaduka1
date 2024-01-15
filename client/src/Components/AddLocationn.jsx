import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";

function AddLocationn() {
  const initialValues = {
    storageName: "",
    address: "",
    space: "", // New field for space details
  };

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  const handleSubmit = async values => {
    setLoading(true);
    try {
      // Add logic to handle form submission (similar to the previous code)
      // For now, let's just show a success message
      toast.success("Location added successfully!");
      setLoading(false);
      navigate("/locations"); // Assuming you have a route '/locations'
    } catch (error) {
      console.error("Error adding location:", error);
      setLoading(false);
      toast.error("Failed to add location");
    }
  };

  const handleCancel = () => {
    navigate("/locations"); // Assuming you have a route '/locations'
  };

  return (
    <div className="container mt-5">
      <ClipLoader loading={loading} css={override} size={150} />
      <div
        className={`col-md-12 col-lg-12 col-xl-12 ${loading ? "hidden" : ""}`}
      >
        <div className="card" style={{ borderRadius: "2rem" }}>
          <div className="card-header">
            <h4 className="card-title">Add Location</h4>
          </div>
          <div className="card-body">
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
              <Form>
                <div className="mb-3 row">
                  <div className="col-md-6">
                    <label htmlFor="storageName" className="form-label">
                      Storage Name <span className="text-danger">*</span>
                    </label>
                    <Field
                      type="text"
                      className="form-control rounded-pill"
                      id="storageName"
                      name="storageName"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="address" className="form-label">
                      Address <span className="text-danger">*</span>
                    </label>
                    <Field
                      type="text"
                      className="form-control rounded-pill"
                      id="address"
                      name="address"
                      required
                    />
                  </div>
                </div>
                {/* Add Space Details Section */}
                <div className="mb-3 row">
                  <div className="col-md-6">
                    <label htmlFor="space" className="form-label">
                      Space <span className="text-danger">*</span>
                    </label>
                    <Field
                      type="text"
                      className="form-control rounded-pill"
                      id="space"
                      name="space"
                      required
                    />
                  </div>
                  {/* Add more fields for Space Details as needed */}
                </div>
                <div className="text-center">
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
                      background: "linear-gradient(263deg, #34b6df, #34d0be)",
                      marginLeft: "10px",
                    }}
                  >
                    Submit
                  </button>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AddLocationn;
