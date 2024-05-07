import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import axios from "axios";

function AddProduct() {
  const initialValues = {
    commodity: "",
    variant: "",
    quality: "",
    packagingType: "",
    size: "",
    quantifiedBy: "",
    packSize: "",
    unit: "",
    length: "", // New field: Length
    width: "", // New field: Width
    height: "", // New field: Height
    image: null, // New field: Image
  };

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [commodities, setCommodities] = useState([]);
  const [variants, setVariants] = useState([]);
  const [qualities, setQualities] = useState([]);
  const [packagingTypes, setPackagingTypes] = useState([]);
  const [sizes, setSizes] = useState([]);
  console.log(sizes);
  const [selectedPackagingType, setSelectedPackagingType] = useState({
    id: "", // Initially empty
    unit: "", // Initially empty
  });

  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  useEffect(() => {
    const fetchCommodities = async () => {
      try {
        const response = await axios.get(
          "http://3.6.248.144/api/v1/commodity/all"
        );
        setCommodities(response.data);
      } catch (error) {
        console.error("Error fetching commodities:", error);
      }
    };

    const fetchPackagingTypes = async () => {
      try {
        const response = await axios.get("http://3.6.248.144/api/v1/unit/all");
        setPackagingTypes(response.data);
      } catch (error) {
        console.error("Error fetching packaging types:", error);
      }
    };

    fetchCommodities();
    fetchPackagingTypes();
  }, []);

  const handleCommodityChange = async commodityId => {
    if (commodityId) {
      try {
        const response = await axios.get(
          `http://3.6.248.144/api/v1/varient/commodity/${commodityId}`
        );
        setVariants(response.data);
      } catch (error) {
        console.error("Error fetching variants:", error);
      }
    } else {
      // If no commodity selected, clear variants
      setVariants([]);
    }
  };

  const handleVariantChange = async variantId => {
    if (variantId) {
      try {
        const response = await axios.get(
          `http://3.6.248.144/api/v1/quality/all`
        );
        setQualities(response.data);
      } catch (error) {
        console.error("Error fetching qualities:", error);
      }

      try {
        const sizeResponse = await axios.get(
          `http://3.6.248.144/api/v1/size/all`
        );
        setSizes(sizeResponse.data);
      } catch (error) {
        console.error("Error fetching sizes:", error);
      }
    } else {
      // If no variant selected, clear qualities and sizes
      setQualities([]);
      setSizes([]);
    }
  };

  const handleQuantifiedByChange = (quantifiedBy, setFieldValue) => {
    // Set the value of Quantified By
    setFieldValue("quantifiedBy", quantifiedBy);
  };

  useEffect(() => {
    console.log("Selected Packaging Type:", selectedPackagingType);
  }, [selectedPackagingType]);

  const handleSubmit = async values => {
    try {
      // Dynamically generate the Unit field based on selected values
      const unitText = `${values.packSize} ${values.quantifiedBy} ${selectedPackagingType.unit}`;
      values.unit = unitText;

      // Prepare the data to be sent in the POST request
      const postData = {
        packSize: values.packSize,
        varientId: values.variant,
        qualityId: values.quality,
        sizeId: values.size,
        unitId: selectedPackagingType.id, // Assuming unitId is the correct field name
        commodityId: values.commodity,
        quantifiedBy: values.quantifiedBy,
        newUnit: values.unit,
        length: values.length != "" ? values.length : 0, // New field: Length
        width: values.width != "" ? values.width : 0, // New field: Width
        height: values.height != "" ? values.height : 0, // New field: Height
      };

      // Making the Axios POST request
      const formData = new FormData();
      formData.append("image", values.image);
      console.log("Image:", values.image);

      // Append other form data to the formData object
      for (const key in postData) {
        formData.append(key, postData[key]);
      }

      const response = await axios.post(
        "http://3.6.248.144/api/v1/product/create",
        formData
      );

      // Handle the response as needed
      toast.success("Product Created Successfully ");

      // Set a timeout to navigate after showing the toast message
      setTimeout(() => {
        navigate("/Product");
      }, 2000); // 2000 milliseconds (2 seconds)
      console.log("Response:", response.data);
    } catch (error) {
      // Handle any errors that occurred during the request
      toast.error("Error while creating product!");

      console.error("Error:", error.message);
    }
  };


  const handleCancel = () => {
    navigate("/Product"); // Update the route as needed
  };

  useEffect(() => {
    console.log(initialValues);
  }, []);

  return (
    <div className="container mt-5">
      <ClipLoader loading={loading} css={override} size={150} />
      <div
        className={`col-md-12 col-lg-12 col-xl-12 ${loading ? "hidden" : ""}`}
      >
        <div className="card" style={{ borderRadius: "2rem" }}>
          <div className="card-header">
            <h4 className="card-title">Add Product</h4>
          </div>
          <div className="card-body">
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
              {({ values, setFieldValue }) => (
                <Form>
                  <div className="mb-3 row">
                    <div className="col-md-6">
                      <label htmlFor="commodity" className="form-label">
                        Commodity <span className="text-danger">*</span>
                      </label>
                      <Field
                        as="select"
                        className="form-control rounded-pill"
                        id="commodity"
                        name="commodity"
                        onChange={e => {
                          setFieldValue("commodity", e.target.value);
                          handleCommodityChange(e.target.value);
                        }}
                        required
                      >
                        <option value="" disabled>
                          Select Commodity
                        </option>
                        {commodities.map(commodity => (
                          <option key={commodity.id} value={commodity.id}>
                            {commodity.commodity}
                          </option>
                        ))}
                      </Field>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="variant" className="form-label">
                        Variant <span className="text-danger">*</span>
                      </label>
                      <Field
                        as="select"
                        className="form-control rounded-pill"
                        id="variant"
                        name="variant"
                        onChange={e => {
                          setFieldValue("variant", e.target.value);
                          handleVariantChange(e.target.value);
                        }}
                        required
                      >
                        <option value="" disabled>
                          Select Variant
                        </option>
                        {variants.map(variant => (
                          <option key={variant.id} value={variant.id}>
                            {variant.varient}
                          </option>
                        ))}
                      </Field>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="quality" className="form-label">
                      Quality <span className="text-danger">*</span>
                    </label>
                    <Field
                      as="select"
                      className="form-control rounded-pill"
                      id="quality"
                      name="quality"
                      required
                    >
                      <option value="" disabled>
                        Select Quality
                      </option>
                      {qualities.map(quality => (
                        <option key={quality.id} value={quality.id}>
                          {quality.quality}
                        </option>
                      ))}
                    </Field>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="packagingType" className="form-label">
                      Packaging Type <span className="text-danger">*</span>
                    </label>
                    <Field
                      as="select"
                      className="form-control rounded-pill"
                      id="packagingType"
                      name="packagingType"
                      onChange={e => {
                        const selectedOption = packagingTypes.find(
                          option => option.id === e.target.value
                        );
                        const selectedOptions =
                          e.target.options[e.target.selectedIndex];

                        // Update the value of packagingType in the form values
                        setFieldValue("packagingType", e.target.value);
                        console.log(selectedOptions.textContent);

                        // Update the selected packaging type for display
                        setSelectedPackagingType({
                          id: e.target.value,
                          unit: selectedOptions
                            ? selectedOptions.textContent
                            : "Select Packaging Type",
                        });
                      }}
                      required
                    >
                      <option value="" disabled>
                        Select Packaging Type
                      </option>
                      {packagingTypes.map(packagingType => (
                        <option key={packagingType.id} value={packagingType.id}>
                          {packagingType.unit}
                        </option>
                      ))}
                    </Field>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="size" className="form-label">
                      Size <span className="text-danger">*</span>
                    </label>
                    <Field
                      as="select"
                      className="form-control rounded-pill"
                      id="size"
                      name="size"
                      required
                    >
                      <option value="" disabled>
                        Select Size
                      </option>
                      {sizes.map(size => (
                        <option key={size.id} value={size.id}>
                          {size.size}
                        </option>
                      ))}
                    </Field>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Quantified By</label>
                    <div className="form-check form-check-inline">
                      <Field
                        type="radio"
                        id="quantifiedByKg"
                        name="quantifiedBy"
                        value="kg"
                        className="form-check-input"
                        onChange={() =>
                          handleQuantifiedByChange("kg", setFieldValue)
                        }
                      />
                      <label
                        htmlFor="quantifiedByKg"
                        className="form-check-label"
                      >
                        kg
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <Field
                        type="radio"
                        id="quantifiedByPc"
                        name="quantifiedBy"
                        value="pc"
                        className="form-check-input"
                        onChange={() =>
                          handleQuantifiedByChange("pc", setFieldValue)
                        }
                      />
                      <label
                        htmlFor="quantifiedByPc"
                        className="form-check-label"
                      >
                        pc
                      </label>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="packSize" className="form-label">
                      Pack Size <span className="text-danger">*</span>
                    </label>
                    <Field
                      type="number"
                      className="form-control rounded-pill"
                      id="packSize"
                      name="packSize"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="unit" className="form-label">
                      Unit <span className="text-danger">*</span>
                    </label>
                    <Field
                      type="text"
                      className="form-control rounded-pill"
                      id="unit"
                      name="unit"
                      value={`${values.packSize} ${values.quantifiedBy} ${selectedPackagingType.unit}`}
                      readOnly
                    />
                    {console.log(
                      "Selected Packaging Type:",
                      selectedPackagingType
                    )}
                  </div>

                  {/* New Fields */}
                  <div className="mb-3 row">
                    <div className="col-md-4">
                      <label htmlFor="length" className="form-label">
                        Length
                      </label>
                      <Field
                        type="number"
                        className="form-control rounded-pill"
                        id="length"
                        name="length"
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="width" className="form-label">
                        Width
                      </label>
                      <Field
                        type="number"
                        className="form-control rounded-pill"
                        id="width"
                        name="width"
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="height" className="form-label">
                        Height
                      </label>
                      <Field
                        type="number"
                        className="form-control rounded-pill"
                        id="height"
                        name="height"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="image" className="form-label">
                      Image <span className="text-danger">*</span>
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id="image"
                      name="image"
                      onChange={e => {
                        setFieldValue("image", e.target.files[0]);
                      }}
                      required
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

export default AddProduct;
