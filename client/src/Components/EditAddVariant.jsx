import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function EditAddVariant() {
  const { id } = useParams();

  const [variantData, setVariantData] = useState({
    variant: "",
    isImported: false,
    image: "",
    cropDuration: "",
    farmable: false,
    commodityId: "",
  });

  const [commodities, setCommodities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5001/api/v1/varient/${id}`)
      .then((response) => {
        const receivedData = response.data;
        setVariantData(receivedData);
        fetchCommodities(receivedData.commodityId);
      })
      .catch((error) => {
        console.error("Error fetching variant:", error);
        toast.error("Failed to fetch variant information");
      });
  }, [id]);

  const fetchCommodities = async (selectedCommodityId) => {
    try {
      const response = await fetch(
        "http://localhost:5001/api/v1/commodity/all"
      );
      if (response.ok) {
        const data = await response.json();
        setCommodities(data);
        const selectedCommodity = data.find(
          (commodity) => commodity.id === selectedCommodityId
        );
        if (selectedCommodity) {
          setVariantData((prevData) => ({
            ...prevData,
            commodityId: selectedCommodity.id,
          }));
        }
      } else {
        toast.error("Failed to fetch commodities");
      }
    } catch (error) {
      console.error("Error fetching commodities:", error);
      toast.error("An error occurred while fetching commodities");
    }
  };

  const handleCancel = () => {
    navigate("/variant");
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-12 col-lg-12 col-xl-12">
          <div className="card" style={{ borderRadius: "2rem" }}>
            <div className="card-header">
              <h4 className="card-title">Edit Variant</h4>
            </div>
            <div className="card-body">
              <Formik initialValues={variantData} enableReinitialize>
                {(formik) => (
                  <Form>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label htmlFor="variant" className="form-label">
                          Variant <span className="text-danger">*</span>
                        </label>
                        <Field
                          type="text"
                          className="form-control rounded-pill"
                          id="variant"
                          name="variant"
                          value={variantData.variant}
                          readOnly
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="commodity" className="form-label">
                          Commodity <span className="text-danger">*</span>
                        </label>
                        <Field
                          as="select"
                          className="form-control rounded-pill"
                          id="commodity"
                          name="commodityId"
                          required
                        >
                          <option value="">Select Commodity</option>
                          {commodities.map((commodity) => (
                            <option
                              key={commodity.id}
                              value={commodity.id}
                              selected={commodity.id === variantData.commodityId}
                            >
                              {commodity.commodity}
                            </option>
                          ))}
                        </Field>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label htmlFor="cropDuration" className="form-label">
                          Crop Duration <span className="text-danger">*</span>
                        </label>
                        <Field
                          type="text"
                          className="form-control rounded-pill"
                          id="cropDuration"
                          name="cropDuration"
                          value={variantData.cropDuration}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">
                          Is Imported <span className="text-danger">*</span>
                        </label>
                        <div className="form-check">
                          <input
                            type="radio"
                            className="form-check-input"
                            id="importedYes"
                            name="isImported"
                            value={true}
                            checked={variantData.isImported === true}
                            onChange={() => null}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="importedYes"
                          >
                            Yes
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            type="radio"
                            className="form-check-input"
                            id="importedNo"
                            name="isImported"
                            value={false}
                            checked={variantData.isImported === false}
                            onChange={() => null}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="importedNo"
                          >
                            No
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">
                          Is Farmable <span className="text-danger">*</span>
                        </label>
                        <div className="form-check">
                          <input
                            type="radio"
                            className="form-check-input"
                            id="farmableYes"
                            name="farmable"
                            value={true}
                            checked={variantData.farmable === true}
                            onChange={() => null}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="farmableYes"
                          >
                            Yes
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            type="radio"
                            className="form-check-input"
                            id="farmableNo"
                            name="farmable"
                            value={false}
                            checked={variantData.farmable === false}
                            onChange={() => null}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="farmableNo"
                          >
                            No
                          </label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="image" className="form-label">
                          Upload Image
                        </label>
                        <Field
                          type="file"
                          className="form-control rounded-pill"
                          id="image"
                          name="image"
                          accept="image/*"
                          value={variantData.image}
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
                          type="button"
                          className="btn btn-primary rounded-pill"
                          style={{
                            background:
                              "linear-gradient(263deg, #34b6df, #34d0be)",
                            marginLeft: "10px",
                          }}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default EditAddVariant;
