import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { RingLoader } from "react-spinners";

function EditQuality() {
  const navigate = useNavigate();
  const { id } = useParams();

  const initialValues = {
    variantId: "",
    quality: "",
  };

  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get("http://3.6.248.144/api/v1/varient/all")
      .then(response => {
        setVariants(response.data);
      })
      .catch(error => {
        console.error("Error fetching variants:", error);
      });

    if (id) {
      axios
        .get(`http://3.6.248.144/api/v1/quality/${id}`)
        .then(response => {
          const qualityData = response.data;
          setInitialValues(qualityData);
        })
        .catch(error => {
          console.error("Error fetching quality:", error);
        });
    }
  }, []);

  const setInitialValues = qualityData => {
    initialValues.variantId = qualityData.varientId;
    initialValues.quality = qualityData.quality;
  };

  const handleSubmit = async values => {
    setLoading(true);
    try {
      const response = await axios.put(
        `http://3.6.248.144/api/v1/quality/update/${id}`,
        {
          quality: values.quality,
          varientId: values.variantId,
        }
      );
      setLoading(false);
      if (response.status === 200) {
        toast.success("Quality updated successfully!");
        setTimeout(() => {
          navigate("/Quality");
        }, 2000);
      } else {
        toast.error("Failed to update quality");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error updating quality:", error);
      toast.error("Error updating quality");
    }
  };

  const handleCancel = () => {
    navigate("/Quality");
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div
          className="col-md-12 col-lg-12 col-xl-12"
          style={{ maxWidth: "800px" }}
        >
          <div className="card" style={{ borderRadius: "2rem" }}>
            <div className="card-header">
              <h4 className="card-title">Edit Quality</h4>
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
                      className="form-control rounded-pill"
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
                        className="form-control rounded-pill"
                        id="quality"
                        name="quality"
                        required
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
                      disabled={loading}
                      style={{
                        background: "linear-gradient(263deg, #34b6df, #34d0be)",
                        marginLeft: "10px",
                      }}
                    >
                      {loading ? "Saving..." : "Update"}
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

export default EditQuality;
