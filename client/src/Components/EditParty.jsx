import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function EditParty() {
  const { phoneNumber } = useParams();
  const navigate = useNavigate();
  const [partyId, setPartyId] = useState();

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    companyName: "",
    companyAddress: "",
    isTerminate: false,
  });

  const userId = localStorage.getItem("id");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://3.6.248.144/api/v1/users/getbyid/${userId}`
        );
        const userTypeId = response.data.userTypeId;
        setFormData(prevData => ({ ...prevData, userTypeId }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://3.6.248.144/api/v1/users/edit/${phoneNumber}`
        );
        const partyData = response.data[0];
        const updatedFormData = {
          name: partyData.name || "",
          phoneNumber: String(partyData.mobileNumber) || "",
          email: partyData.email || "",
          companyName: partyData.companyname || "",
          companyAddress: partyData.address || "",
          isTerminate: partyData.terminate || false,
        };
        setPartyId(partyData.id);
        setFormData(updatedFormData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [phoneNumber]);

  const handleSubmit = async () => {
    try {
      // Trim whitespace from input values
      const trimmedFormData = {
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        companyName: formData.companyName.trim(),
        companyAddress: formData.companyAddress.trim(),
      };

      // Check if any required field is empty or contains only whitespace
      if (
        !trimmedFormData.name ||
        !trimmedFormData.email ||
        !trimmedFormData.companyName ||
        !trimmedFormData.companyAddress ||
        trimmedFormData.name === "" ||
        trimmedFormData.email === "" ||
        trimmedFormData.companyName === "" ||
        trimmedFormData.companyAddress === ""
      ) {
        toast.error("All fields are required.");
        return;
      }

      const updatedValues = {
        name: trimmedFormData.name,
        mobileNumber: trimmedFormData.phoneNumber,
        email: trimmedFormData.email,
        companyname: trimmedFormData.companyName,
        address: trimmedFormData.companyAddress,
        terminate: trimmedFormData.isTerminate,
      };

      console.log(updatedValues);

      await axios.put(
        `http://3.6.248.144/api/v1/users/${partyId}/update`,
        updatedValues
      );

      toast.success("Party details updated successfully!");
      setTimeout(() => {
        navigate("/Party");
      }, 2000);
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error saving data. Please try again.");
    }
  };

  const handlePhoneNumberChange = e => {
    const inputValue = e.target.value.replace(/\D/g, "");
    setFormData(prevData => ({ ...prevData, phoneNumber: inputValue }));
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
              <h4 className="card-title">Edit Party</h4>
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
                      disabled
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
                        checked={!formData.isTerminate}
                        onChange={() =>
                          setFormData(prevData => ({
                            ...prevData,
                            isTerminate: false,
                          }))
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

export default EditParty;
