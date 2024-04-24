import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import axios from "axios";

function AddCommodity() {
  const initialValues = {
    commodity: "",
    commodityType: "",
    image: null,
  };

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [commodityTypes, setCommodityTypes] = useState([]);

  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  useEffect(() => {
    const fetchCommodityTypes = async () => {
      try {
        const response = await axios.get(
          "http://3.6.248.144/api/v1/commoditytype/all"
        );
        setCommodityTypes(response.data);
      } catch (error) {
        console.error("Error fetching commodity types:", error);
      }
    };

    fetchCommodityTypes();
  }, []);

  const handleSubmit = async values => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("commodity", values.commodity);
      formData.append("commodityTypeId", values.commodityType);
      formData.append("image", values.image);

      console.log(values);

      const response = await axios.post(
        "http://3.6.248.144/api/v1/commodity/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        toast.success("Commodity added successfully!");
        setLoading(false);
        navigate("/Commodity");
      } else {
        throw new Error("Failed to add commodity");
      }
    } catch (error) {
      console.error("Error adding commodity:", error);
      setLoading(false);
      toast.error("Failed to add commodity");
    }
  };

  const handleCancel = () => {
    navigate("/Commodity");
  };

  return (
    <div className="container mt-5">
      <ClipLoader loading={loading} css={override} size={150} />
      <div
        className={`col-md-12 col-lg-12 col-xl-12 ${loading ? "hidden" : ""}`}
      >
        <div className="card" style={{ borderRadius: "2rem" }}>
          <div className="card-header">
            <h4 className="card-title">Add Commodity</h4>
          </div>
          <div className="card-body">
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
              {(
                { setFieldValue } // Pass setFieldValue here
              ) => (
                <Form>
                  <div className="mb-3 row">
                    <div className="col-md-6">
                      <label htmlFor="commodity" className="form-label">
                        Commodity <span className="text-danger">*</span>
                      </label>
                      <Field
                        type="text"
                        className="form-control rounded-pill"
                        id="commodity"
                        name="commodity"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="commodityType" className="form-label">
                        Commodity Type <span className="text-danger">*</span>
                      </label>
                      <Field
                        as="select"
                        className="form-control rounded-pill"
                        id="commodityType"
                        name="commodityType"
                        required
                      >
                        <option value="" disabled>
                          Select Commodity Type
                        </option>
                        {commodityTypes.map(type => (
                          <option key={type.id} value={type.id}>
                            {type.commodityType}
                          </option>
                        ))}
                      </Field>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="image" className="form-label">
                      Upload Image <span className="text-danger">*</span>
                    </label>
                    <small className="text-muted">
                      Image size should not exceed 5 MB
                    </small>
                    <input
                      type="file"
                      className="form-control"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={event => {
                        const file = event.target.files[0];
                        if (file.size > 5 * 1024 * 1024) {
                          toast.error("Image size should not exceed 5 MB");
                        } else {
                          setFieldValue("image", file);
                        }
                      }}
                      required
                      style={{ width: "48%" }}
                    />
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
              )}
            </Formik>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AddCommodity;
