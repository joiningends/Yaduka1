import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function AddParty() {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    companyName: "",
    companyAddress: "",
    isTerminate: false,
  });
  const [userTypeId, setTypeId] = useState(null);
  const userId = localStorage.getItem("id");
  const navigate = useNavigate();
  const { partyId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://www.keepitcool.app/api/v1/users/getbyid/${userId}`
        );
        setTypeId(response.data.userTypeId);

        if (partyId) {
          // Fetch party details if in edit mode
          const partyResponse = await axios.get(
            `https://www.keepitcool.app/api/v1/users/${userTypeId}/${userId}/party/${partyId}`
          );
          setFormData(partyResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userId, userTypeId, partyId]);

  const validatePhoneNumber = value => {
    const phoneNumberPattern = /^\d{10}$/;
    return phoneNumberPattern.test(value)
      ? undefined
      : "Please enter a valid 10-digit phone number.";
  };

  const validateEmail = value => {
    if (value === "") return;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value)
      ? undefined
      : "Please enter a valid email address.";
  };

  const handleSubmit = async () => {
    try {
      // Trim whitespace from input values
      const trimmedFormData = {
        ...formData,
        name: formData.name.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        email: formData.email.trim(),
        companyName: formData.companyName.trim(),
        companyAddress: formData.companyAddress.trim(),
      };

      console.log(trimmedFormData);
      // Check if any required field is empty or contains only whitespace
      if (
        !trimmedFormData.name ||
        !trimmedFormData.phoneNumber ||
        !trimmedFormData.companyName ||
        !trimmedFormData.companyAddress ||
        trimmedFormData.name === "" ||
        trimmedFormData.phoneNumber === "" ||
        trimmedFormData.companyName === "" ||
        trimmedFormData.companyAddress === ""
      ) {
        toast.error("All fields are required.");
        return;
      }

      const postData = {
        name: trimmedFormData.name,
        mobileNumber: trimmedFormData.phoneNumber,
        email: trimmedFormData.email,
        address: trimmedFormData.companyAddress,
        terminate: trimmedFormData.isTerminate,
        companyname: trimmedFormData.companyName,
      };

      if (partyId) {
        // If in edit mode, update party details
        await axios.put(
          `https://www.keepitcool.app/api/v1/users/${userTypeId}/${userId}/party/${partyId}`,
          postData
        );
        toast.success("Party details updated successfully!");
      } else {
        // If in add mode, add new party
        await axios.post(
          `https://www.keepitcool.app/api/v1/users/${userTypeId}/${userId}/party`,
          postData
        );
        toast.success("Party added successfully!");
      }

      setTimeout(() => {
        navigate("/Party");
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error.response.data.error);
      toast.error(error.response.data.error);
    }
  };

  const handlePhoneNumberChange = e => {
    const inputValue = e.target.value.replace(/\D/g, "");
    setFormData({ ...formData, phoneNumber: inputValue });
  };

  const handleCancel = e => {
    e.preventDefault();
    navigate("/Party");
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
              <h4 className="card-title">Add Party</h4>
            </div>
            <div className="card-body">
              <form>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="name" className="form-label">
                      Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-pill"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={e =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="phoneNumber" className="form-label">
                      Phone Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      className="form-control rounded-pill"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handlePhoneNumberChange}
                      required
                    />
                    <div className="text-danger">
                      {validatePhoneNumber(formData.phoneNumber)}
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control rounded-pill"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={e =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                    <div className="text-danger">
                      {validateEmail(formData.email)}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="companyName" className="form-label">
                      Company Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-pill"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          companyName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="companyAddress" className="form-label">
                      Company Address <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-pill"
                      id="companyAddress"
                      name="companyAddress"
                      value={formData.companyAddress}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          companyAddress: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      Is Terminate <span className="text-danger">*</span>
                    </label>
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        id="terminateYes"
                        name="isTerminate"
                        value={true}
                        checked={formData.isTerminate}
                        onChange={() =>
                          setFormData({ ...formData, isTerminate: true })
                        }
                        required
                      />
                      <label
                        className="form-check-label"
                        htmlFor="terminateYes"
                      >
                        Yes
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        id="terminateNo"
                        name="isTerminate"
                        value={false}
                        checked={!formData.isTerminate}
                        onChange={() =>
                          setFormData({ ...formData, isTerminate: false })
                        }
                        required
                      />
                      <label className="form-check-label" htmlFor="terminateNo">
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
                      type="button"
                      className="btn btn-primary rounded-pill"
                      style={{
                        background: "linear-gradient(263deg, #34b6df, #34d0be)",
                        marginLeft: "10px",
                      }}
                      onClick={handleSubmit}
                    >
                      {partyId ? "Update" : "Add"}
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

export default AddParty;
