import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";

function EditAddSize() {
  const navigate = useNavigate();
  const { id } = useParams();

  const initialValues = {
    variant: "",
    size: "",
  };

  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get("https://www.keepitcool.app/api/v1/varient/all")
      .then(response => {
        setVariants(response.data);
      })
      .catch(error => {
        console.error("Error fetching variants:", error);
      });

    axios
      .get(`https://www.keepitcool.app/api/v1/size/${id}`)
      .then(response => {
        const sizeData = response.data;
        setInitialValues(sizeData);
      })
      .catch(error => {
        console.error("Error fetching size:", error);
      });
  }, [id]);

  const setInitialValues = sizeData => {
    initialValues.variant = sizeData.varientId;
    initialValues.size = sizeData.size;
  };

  const handleSubmit = async values => {
    setLoading(true);
    try {
      const response = await axios.put(
        `https://www.keepitcool.app/api/v1/size/update/${id}`,
        {
          size: values.size,
          varientId: values.variant,
        }
      );
      setLoading(false);
      if (response.status === 200) {
        toast.success("Size updated successfully!");
        setTimeout(() => {
          navigate("/Size");
        }, 2000);
      } else {
        toast.error("Failed to update size");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error updating size:", error);
      toast.error("Error updating size");
    }
  };

  const handleCancel = () => {
    navigate("/Size");
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-12 col-lg-12 col-xl-12">
          <div className="card" style={{ borderRadius: "2rem" }}>
            <div className="card-header">
              <h4 className="card-title">Edit Size</h4>
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
                        style={{
                          background:
                            "linear-gradient(263deg, #34b6df, #34d0be)",
                          color: "#fff",
                          marginLeft: "0.3rem",
                        }}
                      >
                        {loading ? (
                          <Spinner
                            animation="border"
                            variant="light"
                            size="sm"
                          />
                        ) : (
                          "Update"
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

export default EditAddSize;
