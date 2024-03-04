import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RingLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

function AddCommodityType() {
  const initialValues = {
    commodityType: "",
  };

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async values => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://13.233.231.174/commodityType/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (response.ok) {
        toast.success("Commodity Type added successfully!");
        navigate("/commoditytype");
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
        toast.error("Failed to add Commodity Type. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/commoditytype");
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div
          className="col-md-20 col-lg-12 col-xl-40"
          style={{ maxWidth: "800px" }}
        >
          <div className="card" style={{ borderRadius: "2rem" }}>
            <div className="card-header">
              <h4 className="card-title">Add Commodity Type</h4>
            </div>
            <div className="card-body">
              {loading && (
                <div className="text-center mb-3">
                  <RingLoader color={"#36D7B7"} loading={loading} />
                </div>
              )}

              <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                <Form>
                  <div className="mb-3">
                    <label htmlFor="commodityType" className="form-label">
                      Commodity Type <span className="text-danger">*</span>
                    </label>
                    <div className="d-flex">
                      <Field
                        type="text"
                        className="form-control rounded-start"
                        id="commodityType"
                        name="commodityType"
                        required
                        style={{ width: "100%" }}
                      />
                      <ErrorMessage
                        name="commodityType"
                        component="div"
                        className="text-danger ms-2"
                      />
                    </div>
                  </div>
                  <div className="mb-3 text-center">
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
                      disabled={loading}
                    >
                      Submit
                    </button>
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

export default AddCommodityType;
