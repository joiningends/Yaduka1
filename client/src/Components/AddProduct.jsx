import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import Modal from "react-modal";

function AddProduct() {
  const initialValues = {
    commodity: "",
    variant: "",
    quality: "",
    packagingType: "",
    size: "",
    quantifiedBy: "kg",
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
  const [selectedPackagingType, setSelectedPackagingType] = useState({
    id: "", // Initially empty
    unit: "", // Initially empty
  });
  console.log(qualities);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSize, setNewSize] = useState("");
  const [isModalOpenQality, setIsModalOpenQuality] = useState(false);
  const [newQuality, setNewQuality] = useState("");

  const openModal = () => {
    setIsModalOpen(true);
  };

  const openModalQuality = () => {
    setIsModalOpenQuality(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewSize("");
  };

  const closeModalQuality = () => {
    setIsModalOpenQuality(false);
    setNewQuality("");
  };

  const handleAddQuality = async () => {
    try {
      if (variants.length === 0) {
        toast.error("Please select a variant first.");
        return;
      }

      const response = await axios.post(
        "https://www.keepitcool.app/api/v1/quality/create",
        {
          quality: newQuality,
          varientId: variants.id,
        }
      );
      console.log("Size Added Successfully:", response.data);
      closeModalQuality();

      try {
        const response = await axios.get(
          `https://www.keepitcool.app/api/v1/quality/all`
        );
        setQualities(response.data);
      } catch (error) {
        console.error("Error fetching qualities:", error);
      }
    } catch (error) {
      console.error("Error adding size:", error);
      setQualities([]);
    }
  };

  const handleAddSize = async () => {
    try {
      console.log(variants);
      if (variants.length === 0) {
        toast.error("Please select a variant first.");
        return;
      }

      const response = await axios.post(
        "https://www.keepitcool.app/api/v1/size/create",
        {
          size: newSize,
          varientId: variants.id,
        }
      );
      console.log("Size Added Successfully:", response.data);
      closeModal();

      try {
        const sizeResponse = await axios.get(
          `https://www.keepitcool.app/api/v1/size/all`
        );
        setSizes(sizeResponse.data);
      } catch (error) {
        console.error("Error fetching sizes:", error);
      }
    } catch (error) {
      console.error("Error adding size:", error);
      setSizes([]);
    }
  };

  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  useEffect(() => {
    const fetchCommodities = async () => {
      try {
        const response = await axios.get(
          "https://www.keepitcool.app/api/v1/commodity/all"
        );
        setCommodities(response.data);
      } catch (error) {
        console.error("Error fetching commodities:", error);
      }
    };

    const fetchPackagingTypes = async () => {
      try {
        const response = await axios.get(
          "https://www.keepitcool.app/api/v1/unit/all"
        );
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
          `https://www.keepitcool.app/api/v1/varient/commodity/${commodityId}`
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
          `https://www.keepitcool.app/api/v1/quality/all`
        );
        setQualities(response.data);
      } catch (error) {
        console.error("Error fetching qualities:", error);
      }

      try {
        const sizeResponse = await axios.get(
          `https://www.keepitcool.app/api/v1/size/all`
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
      setLoading(true);
      // Dynamically generate the Unit field based on selected values
      const unitText = `${values.packSize} ${values.quantifiedBy} ${selectedPackagingType.unit}`;

      console.log(values);
      // Prepare the data to be sent in the POST request
      const postData = {
        packSize: values.packSize,
        varientId: values.variant,
        qualityId: values.newQuality,
        sizeId: values.size,
        commodityId: values.commodity,
        quantifiedBy: values.quantifiedBy,
        newUnit: unitText,
        unitId: selectedPackagingType.id,
        packagingType: selectedPackagingType.unit,
        // newUnit: values.unit,
        length: values.length != "" ? values.length : 0, // New field: Length
        width: values.width != "" ? values.width : 0, // New field: Width
        height: values.height != "" ? values.height : 0, // New field: Height
      };

      // packagingType

      // console.log(postData);

      const formData = new FormData();
      formData.append("image", values.image);
      // console.log("Image:", values.image);

      // Append other form data to the formData object
      for (const key in postData) {
        formData.append(key, postData[key]);
      }

      const response = await axios.post(
        "https://www.keepitcool.app/api/v1/product/create",
        formData
      );

      // Handle the response as needed
      toast.success("Product Created Successfully ");

      // Set a timeout to navigate after showing the toast message
      navigate("/Product");
    } catch (error) {
      // Handle any errors that occurred during the request
      toast.error("Error while creating product!");

      console.error("Error:", error.message);
    } finally {
      setLoading(false);
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
                  {/* <div className="mb-3">
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
                  </div> */}
                  <div className="container mt-3">
                    <label htmlFor="size" className="form-label me-3">
                      Quality <span className="text-danger">*</span>
                    </label>
                    <div className="mb-3 d-flex ">
                      <Field
                        as="select"
                        className="form-control rounded-pill me-3"
                        id="newQuality"
                        name="newQuality"
                        required
                      >
                        <option value="" disabled selected>
                          Select Quality
                        </option>
                        {qualities.map(quality => (
                          <option key={quality.id} value={quality.id}>
                            {quality.quality}
                          </option>
                        ))}
                      </Field>

                      <button
                        type="button"
                        className="btn btn-primary rounded-pill"
                        onClick={openModalQuality}
                        style={{ marginLeft: "2rem", width: "10rem" }}
                      >
                        Add Quality
                      </button>
                    </div>
                    <Modal
                      isOpen={isModalOpenQality}
                      onRequestClose={closeModalQuality}
                      contentLabel="Add Size Modal"
                      ariaHideApp={false}
                      style={{
                        overlay: {
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                        },
                        content: {
                          width: "40%",
                          height: "auto",
                          top: "50%",
                          left: "50%",
                          right: "auto",
                          bottom: "auto",
                          marginRight: "-50%",
                          transform: "translate(-50%, -50%)",
                          borderRadius: "10px",
                          boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
                          padding: "20px",
                        },
                      }}
                    >
                      <h2 className="text-center mb-4">Add Quality</h2>
                      <div className="form-group mb-3">
                        <label htmlFor="newQuality" className="form-label">
                          Enter Quality:
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="newQuality"
                          value={newQuality}
                          onChange={e => setNewQuality(e.target.value)}
                          placeholder="Enter quality"
                        />
                      </div>
                      <div className="text-center">
                        <button
                          className="btn btn-danger rounded-pill me-2"
                          onClick={closeModalQuality}
                          style={{ marginRight: "1rem" }}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn btn-primary rounded-pill"
                          onClick={handleAddQuality}
                        >
                          Submit
                        </button>
                      </div>
                    </Modal>
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
                  <div className="container mt-3">
                    <label htmlFor="size" className="form-label me-3">
                      Size <span className="text-danger">*</span>
                    </label>
                    <div className="mb-3 d-flex ">
                      <Field
                        as="select"
                        className="form-control rounded-pill me-3"
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
                      <button
                        type="button"
                        className="btn btn-primary rounded-pill"
                        onClick={openModal}
                        style={{ marginLeft: "2rem", width: "10rem" }}
                      >
                        Add Size
                      </button>
                    </div>
                    <Modal
                      isOpen={isModalOpen}
                      onRequestClose={closeModal}
                      contentLabel="Add Size Modal"
                      ariaHideApp={false}
                      style={{
                        overlay: {
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                        },
                        content: {
                          width: "40%",
                          height: "auto",
                          top: "50%",
                          left: "50%",
                          right: "auto",
                          bottom: "auto",
                          marginRight: "-50%",
                          transform: "translate(-50%, -50%)",
                          borderRadius: "10px",
                          boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
                          padding: "20px",
                        },
                      }}
                    >
                      <h2 className="text-center mb-4">Add Size</h2>
                      <div className="form-group mb-3">
                        <label htmlFor="newSize" className="form-label">
                          Enter Size:
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="newSize"
                          value={newSize}
                          onChange={e => setNewSize(e.target.value)}
                          placeholder="Enter size"
                        />
                      </div>
                      <div className="text-center">
                        <button
                          className="btn btn-danger rounded-pill me-2"
                          onClick={closeModal}
                          style={{ marginRight: "1rem" }}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn btn-primary rounded-pill"
                          onClick={handleAddSize}
                        >
                          Submit
                        </button>
                      </div>
                    </Modal>
                  </div>
                  <div className="mb-3">
                    <label
                      className="form-label"
                      style={{ marginRight: "1rem" }}
                    >
                      Quantified By
                    </label>
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
                      disabled={loading}
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
