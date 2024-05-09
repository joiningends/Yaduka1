import React, { useState, useEffect } from "react";
import { Formik, Form, Field, useFormik } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function AddVariant() {
  const initialValues = {
    variant: "",
    commodityId: "",
    cropDuration: "",
    uploadImage: "",
    isImported: "false",
    isFarmable: "false",
  };
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [commodities, setCommodities] = useState([]);

  useEffect(() => {
    fetchCommodities();
  }, []);

  const fetchCommodities = async () => {
    try {
      const response = await fetch(
        "https://www.keepitcool.app/api/v1/commodity/all"
      );
      if (response.ok) {
        const data = await response.json();
        setCommodities(data);
      } else {
        toast.error("Failed to fetch commodities");
      }
    } catch (error) {
      console.error("Error fetching commodities:", error);
      toast.error("An error occurred while fetching commodities");
    }
  };

  const handleSubmit = async values => {
    try {
      setIsLoading(true);

      const { variant, commodityId, cropDuration, isImported, isFarmable } =
        values;

      const fileInput = document.getElementById("uploadImage");
      const file = fileInput.files[0];

      const convertedIsImported = isImported === "true";
      const convertedIsFarmable = isFarmable === "true";

      const formData = new FormData();
      formData.append("image", file);
      formData.append("varient", variant);
      formData.append("commodityId", commodityId);
      formData.append("cropDuration", cropDuration);
      formData.append("isImported", convertedIsImported);
      formData.append("farmable", convertedIsFarmable);
      console.log(formData);

      const response = await fetch(
        "https://www.keepitcool.app/api/v1/varient/create",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        toast.success("Variant submitted successfully!");
        setTimeout(() => {
          navigate("/Variant");
        }, 2000);
      } else {
        const errorData = await response.json();
        console.error("Failed to submit variant information:", errorData);
        toast.error("Failed to submit variant information.");
      }
    } catch (error) {
      console.error("Error submitting variant information:", error);
      toast.error("An error occurred while submitting variant information.");
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues,
    onSubmit: handleSubmit,
  });

  const handleCancel = () => {
    navigate("/Variant");
  };

  const handleImportedChange = e => {
    formik.setFieldValue("isImported", e.target.value);
  };

  const handleFarmableChange = e => {
    formik.setFieldValue("isFarmable", e.target.value);
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
              <h4 className="card-title">Add Variant</h4>
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
                        type="text"
                        className="form-control rounded-pill"
                        id="variant"
                        name="variant"
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
                        {commodities.map(commodity => (
                          <option key={commodity.id} value={commodity.id}>
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
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="uploadImage" className="form-label">
                        Upload Image <span className="text-danger">*</span>
                      </label>
                      <Field
                        type="file"
                        className="form-control rounded-pill"
                        id="uploadImage"
                        name="uploadImage"
                        accept="image/*"
                        required
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
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
                          value="true"
                          checked={formik.values.isImported === "true"}
                          onChange={handleImportedChange}
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
                          value="false"
                          checked={formik.values.isImported === "false"}
                          onChange={handleImportedChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="importedNo"
                        >
                          No
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">
                        Is Farmable <span className="text-danger">*</span>
                      </label>
                      <div className="form-check">
                        <input
                          type="radio"
                          className="form-check-input"
                          id="farmableYes"
                          name="isFarmable"
                          value="true"
                          checked={formik.values.isFarmable === "true"}
                          onChange={handleFarmableChange}
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
                          name="isFarmable"
                          value="false"
                          checked={formik.values.isFarmable === "false"}
                          onChange={handleFarmableChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="farmableNo"
                        >
                          No
                        </label>
                      </div>
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
                        Submit
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
      {isLoading && (
        <div className="text-center mt-3">
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
}

export default AddVariant;
