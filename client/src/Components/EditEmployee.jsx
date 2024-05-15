import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RingLoader } from "react-spinners";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditEmployee = () => {
  const [loading, setLoading] = useState(false);
  const [employeeData, setEmployeeData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    companyName: "",
    companyAddress: "",
    isTerminate: false,
  });

  const navigate = useNavigate();
  const { id } = useParams();

  const handleSave = async values => {
    setLoading(true);

    // Trim whitespace from input values
    const trimmedValues = {
      ...values,
      name: values.name.trim(),
      email: values.email.trim(),
      companyName: values.companyName.trim(),
      companyAddress: values.companyAddress.trim(),
    };

    // Check if any required field is empty or contains only whitespace
    if (
      !trimmedValues.name ||
      !trimmedValues.email ||
      !trimmedValues.companyName ||
      !trimmedValues.companyAddress ||
      trimmedValues.name === "" ||
      trimmedValues.email === "" ||
      trimmedValues.companyName === "" ||
      trimmedValues.companyAddress === ""
    ) {
      toast.error("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put(
        `https://www.keepitcool.app/api/v1/users/${id}/update`,
        {
          name: trimmedValues.name,
          mobileNumber: trimmedValues.phoneNumber,
          email: trimmedValues.email,
          companyname: trimmedValues.companyName,
          address: trimmedValues.companyAddress,
          terminate: trimmedValues.isTerminate,
        }
      );

      if (response.status === 200) {
        toast.success("Employee details updated successfully!", {
          onClose: () => {
            setLoading(false);
          },
        });
        setTimeout(() => {
          navigate("/Employee");
        }, 2000);
      } else {
        toast.error("Failed to save employee details.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error updating employee details:", error);
      toast.error("Failed to save employee details.");
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://www.keepitcool.app/api/v1/users/employee/${id}`
        );

        const mappedData = {
          name: response.data.name,
          phoneNumber: response.data.mobileNumber,
          email: response.data.email,
          companyName: response.data.companyname,
          companyAddress: response.data.address,
          isTerminate: response.data.terminate,
        };
        console.log(mappedData);
        setEmployeeData(mappedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employee details:", error);
        setLoading(false);
        // Handle error: Display toast or redirect to an error page
      }
    };

    fetchEmployeeDetails();
  }, [id]);

  const handleCancel = () => {
    navigate("/Employee");
  };

  return (
    <div className="container mt-5">
      {loading ? (
        <div className="d-flex justify-content-center align-items-center">
          <RingLoader color="#36D7B7" loading={loading} size={150} />
        </div>
      ) : (
        <div className="row justify-content-center">
          <div
            className="col-md-12 col-lg-12 col-xl-12"
            style={{ width: "200rem" }}
          >
            <div className="card" style={{ borderRadius: "2rem" }}>
              <div className="card-header">
                <h4 className="card-title">Edit Employee</h4>
              </div>
              <div className="card-body">
                <Formik
                  initialValues={employeeData}
                  enableReinitialize
                  onSubmit={handleSave}
                >
                  {formikProps => (
                    <Form>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label htmlFor="name" className="form-label">
                            Name <span className="text-danger">*</span>
                          </label>
                          <Field
                            type="text"
                            className="form-control rounded-pill"
                            id="name"
                            name="name"
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="phoneNumber" className="form-label">
                            Phone Number <span className="text-danger">*</span>
                          </label>
                          <Field
                            type="text"
                            className="form-control rounded-pill"
                            id="phoneNumber"
                            name="phoneNumber"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label htmlFor="email" className="form-label">
                            Email <span className="text-danger">*</span>
                          </label>
                          <Field
                            type="text"
                            className="form-control rounded-pill"
                            id="email"
                            name="email"
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="companyName" className="form-label">
                            Company Name <span className="text-danger">*</span>
                          </label>
                          <Field
                            type="text"
                            className="form-control rounded-pill"
                            id="companyName"
                            name="companyName"
                            required
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label
                            htmlFor="companyAddress"
                            className="form-label"
                          >
                            Company Address{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <Field
                            type="text"
                            className="form-control rounded-pill"
                            id="companyAddress"
                            name="companyAddress"
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            Is Terminate <span className="text-danger">*</span>
                          </label>
                          <div className="form-check">
                            <Field
                              type="radio"
                              className="form-check-input"
                              id="terminateYes"
                              name="isTerminate"
                              value="true"
                              checked={formikProps.values.isTerminate === true}
                              onChange={() =>
                                formikProps.setFieldValue("isTerminate", true)
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
                            <Field
                              type="radio"
                              className="form-check-input"
                              id="terminateNo"
                              name="isTerminate"
                              value="false"
                              checked={formikProps.values.isTerminate === false}
                              onChange={() =>
                                formikProps.setFieldValue("isTerminate", false)
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor="terminateNo"
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
                            Update
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
      )}
      <ToastContainer />
    </div>
  );
};

export default EditEmployee;
