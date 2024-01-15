import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";

function AddSize() {
  const navigate = useNavigate();
  const initialValues = {
    variant: "",
    size: "",
  };
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async values => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5001/api/v1/size/create",
        {
          size: values.size,
          varientId: values.variant,
        }
      );
      setLoading(false);
      if (response.status === 201) {
        toast.success("Size created successfully!");
        navigate("/Size");
      } else {
        toast.error("Failed to create size");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error creating size:", error);
      toast.error("Error creating size");
    }
  };

  const handleCancel = () => {
    navigate("/Size");
  };

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/v1/varient/all")
      .then(response => {
        setVariants(response.data);
      })
      .catch(error => {
        console.error("Error fetching variants:", error);
      });
  }, []);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-12 col-lg-12 col-xl-12">
          <div className="card" style={{ borderRadius: "2rem" }}>
            <div className="card-header">
              <h4 className="card-title">Add Size</h4>
            </div>
            <div className="card-body">
              <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                <Form>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="variant" className="form-label">
                        Variant <span className="text-danger">*</span>
                      </label>
                      <Field
                        as="select"
                        className="form-control rounded-pill"
                        id="variant"
                        name="variant"
                        required
                      >
                        <option value="">Select Variant</option>
                        {variants.map(variant => (
                          <option key={variant.id} value={variant.id}>
                            {variant.varient}
                          </option>
                        ))}
                      </Field>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="size" className="form-label">
                        Size <span className="text-danger">*</span>
                      </label>
                      <Field
                        type="text"
                        className="form-control rounded-pill"
                        id="size"
                        name="size"
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
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary rounded-pill"
                        disabled={loading}
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

export default AddSize;
