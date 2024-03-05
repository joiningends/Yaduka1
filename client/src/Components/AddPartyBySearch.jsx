import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useParams } from "react-router-dom";

function AddParty() {
  const { phoneNumber } = useParams();

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://3.6.248.144/api/v1/users/getbyid/${userId}`
        );
        setTypeId(response.data.userTypeId);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Call the fetchData function when the component mounts
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://3.6.248.144/api/v1/users/party/${phoneNumber}`
        );
        const { record } = response.data;
        const updatedFormData = {
          name: record.contactPerson || "",
          phoneNumber: String(record.mobileNumber) || "",
          email: record.email || "",
          companyName: record.businessName || "",
          companyAddress: record.address || "",
          isTerminate: record.isBlacklist || false,
        };

        setFormData(updatedFormData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [phoneNumber]);

  const validatePhoneNumber = value => {
    const phoneNumberPattern = /^\d{10}$/;
    return phoneNumberPattern.test(value)
      ? undefined
      : "Please enter a valid 10-digit phone number.";
  };

  const validateEmail = value => {
    const emailPattern = /^[a-zA-Z0-9._-]+@gmail\.com$/;
    return emailPattern.test(value)
      ? undefined
      : "Please enter a valid Gmail address.";
  };

  const handleSubmit = async () => {
    try {
      const postData = {
        name: formData.name,
        mobileNumber: formData.phoneNumber,
        email: formData.email,
        address: formData.companyAddress,
        terminate: formData.isTerminate,
        companyname: formData.companyName,
      };

      console.log(postData);

      await axios.post(
        `http://3.6.248.144/api/v1/users/${userTypeId}/${userId}/party`,
        postData
      );

      toast.success("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error submitting form. Please try again.");
    }
  };

  const handlePhoneNumberChange = e => {
    const inputValue = e.target.value.replace(/\D/g, "");
    setFormData(prevData => ({ ...prevData, phoneNumber: inputValue }));
  };

  const handleCancel = e => {
    e.preventDefault();
    // Handle cancel behavior if needed
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
                        setFormData(prevData => ({
                          ...prevData,
                          name: e.target.value,
                        }))
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
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control rounded-pill"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={e =>
                        setFormData(prevData => ({
                          ...prevData,
                          email: e.target.value,
                        }))
                      }
                      required
                    />
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
                        setFormData(prevData => ({
                          ...prevData,
                          companyName: e.target.value,
                        }))
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
                        setFormData(prevData => ({
                          ...prevData,
                          companyAddress: e.target.value,
                        }))
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
                        checked={formData.isTerminate}
                        onChange={() =>
                          setFormData(prevData => ({
                            ...prevData,
                            isTerminate: true,
                          }))
                        }
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
                        checked={!formData.isTerminate}
                        onChange={() =>
                          setFormData(prevData => ({
                            ...prevData,
                            isTerminate: false,
                          }))
                        }
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
                      Submit
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
