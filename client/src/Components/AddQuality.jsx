import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RingLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddQuality() {
  const initialValues = {
    variantId: "",
    quality: "",
  };

  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVariants();
  }, []);

  const fetchVariants = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://13.233.231.174/varient/all");
      setVariants(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch variants. Please try again.");
      setLoading(false);
    }
  };

  const handleSubmit = async values => {
    try {
      setLoading(true);

      const response = await axios.post(
        "http://13.233.231.174/quality/create",
        {
          quality: values.quality,
          varientId: values.variantId,
        }
      );

      if (response.status === 201) {
        toast.success("Quality added successfully!", {
          onClose: () => {
            navigate("/Quality");
          },
        });
      } else {
        toast.error("Failed to add Quality. Please try again.");
      }
      setLoading(false);
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again later.");
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/Quality");
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
              <h4 className="card-title">Add Quality</h4>
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
                    <label htmlFor="variantId" className="form-label">
                      Variant <span className="text-danger">*</span>
                    </label>
                    <Field
                      as="select"
                      className="form-control"
                      id="variantId"
                      name="variantId"
                      required
                    >
                      <option value="">Select Variant</option>
                      {variants.map(variant => (
                        <option key={variant.id} value={variant.id}>
                          {variant.varient}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="variantId"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="quality" className="form-label">
                      Quality <span className="text-danger">*</span>
                    </label>
                    <div className="d-flex">
                      <Field
                        type="text"
                        className="form-control rounded-start"
                        id="quality"
                        name="quality"
                        required
                        style={{ width: "100%" }}
                      />
                      <ErrorMessage
                        name="quality"
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
                      Save
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

export default AddQuality;
