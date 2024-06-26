import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditAddVariant() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [commodities, setCommodities] = useState([]);
  const [variantData, setVariantData] = useState({
    varient: "",
    commodityId: "",
    cropDuration: "",
    uploadImage: null,
    isImported: undefined,
    isFarmable: undefined,
  });

  useEffect(() => {
    fetchCommodities();
    fetchVariantData();
  }, [id]);

  const fetchCommodities = async () => {
    try {
      const response = await fetch(
        "https://www.keepitcool.app/api/v1/commodity/all"
      );
      if (response.ok) {
        const data = await response.json();
        setCommodities(data);
      } else {
        console.error("Failed to fetch commodities");
      }
    } catch (error) {
      console.error("Error fetching commodities:", error);
    }
  };

  const fetchVariantData = async () => {
    try {
      const response = await fetch(
        `https://www.keepitcool.app/api/v1/varient/${id}`
      );
      if (response.ok) {
        const data = await response.json();
        setVariantData({
          varient: data.varient,
          commodityId: data.commodityId.toString(),
          cropDuration: data.cropDuration,
          uploadImage: data.image,
          isImported: data.isImported.toString(),
          isFarmable: data.farmable.toString(),
        });
        console.log({
          varient: data.varient,
          commodityId: data.commodityId.toString(),
          cropDuration: data.cropDuration,
          uploadImage: data.image,
          isImported: data.isImported.toString(),
          isFarmable: data.farmable.toString(),
        });
      } else {
        console.error("Failed to fetch variant data");
      }
    } catch (error) {
      console.error("Error fetching variant data:", error);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    console.log(name, value);
    setVariantData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = e => {
    const file = e.target.files[0];

    if (file) {
      setVariantData(prevData => ({
        ...prevData,
        uploadImage: file,
      }));
    }
  };

  const handleUpdate = async e => {
    e.preventDefault();

    try {
      console.log(JSON.stringify(variantData));
      const response = await fetch(
        `https://www.keepitcool.app/api/v1/varient/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(variantData),
        }
      );

      if (response.ok) {
        toast.success("Variant updated successfully!");
        setTimeout(() => {
          navigate("/Variant");
        }, 2000);
      } else {
        console.error("Failed to update");
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };
  const handleViewImage = () => {
    window.open(variantData.uploadImage, "_blank");
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
              <h4 className="card-title">
                Edit Variant: {variantData.varient}
              </h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleUpdate}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="variant" className="form-label">
                      Variant <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-pill"
                      id="variant"
                      name="varient"
                      value={variantData.varient}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="commodity" className="form-label">
                      Commodity <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control rounded-pill"
                      id="commodity"
                      name="commodityId"
                      value={variantData.commodityId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Commodity</option>
                      {commodities.map(commodity => (
                        <option key={commodity.id} value={String(commodity.id)}>
                          {commodity.commodity}
                        </option>
                      ))}
                    </select>
                    <p className="mt-2">
                      Selected Commodity:{" "}
                      {commodities.find(
                        c => String(c.id) === variantData.commodityId
                      )?.commodity || ""}
                    </p>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="cropDuration" className="form-label">
                      Crop Duration <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-pill"
                      id="cropDuration"
                      name="cropDuration"
                      value={variantData.cropDuration}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="uploadImage" className="form-label">
                      Upload Image <span className="text-danger">*</span>
                    </label>
                    <input
                      type="file"
                      className="form-control rounded-pill"
                      id="uploadImage"
                      name="uploadImage"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {variantData.uploadImage && (
                      <button
                        type="button"
                        className="btn btn-primary ms-2"
                        onClick={handleViewImage}
                        style={{ margin: "1rem" }}
                      >
                        View Image
                      </button>
                    )}
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
                        onChange={handleChange}
                        checked={variantData.isImported == "true"}
                      />
                      <label className="form-check-label" htmlFor="importedYes">
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
                        onChange={handleChange}
                        checked={variantData.isImported == "false"}
                      />
                      <label className="form-check-label" htmlFor="importedNo">
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
                        onChange={handleChange}
                        checked={variantData.isFarmable == "true"}
                      />
                      <label className="form-check-label" htmlFor="farmableYes">
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
                        onChange={handleChange}
                        checked={variantData.isFarmable == "false"}
                      />
                      <label className="form-check-label" htmlFor="farmableNo">
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
                      onClick={() => {
                        navigate("/Variant");
                      }}
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
                      Update
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default EditAddVariant;
