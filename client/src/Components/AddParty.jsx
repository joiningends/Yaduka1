import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddParty() {
  const initialValues = {
    name: "",
    phoneNumber: "",
    email: "",
    companyName: "",
    companyAddress: "",
    isTerminate: false,
  };

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

  const handleSubmit = values => {
    console.log("Submitted data:", values);
    toast.success("Form submitted successfully!");
  };

  const handlePhoneNumberChange = (e, setFieldValue) => {
    const inputValue = e.target.value.replace(/\D/g, "");
    setFieldValue("phoneNumber", inputValue);
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
              <h4 className="card-title">Add Employee</h4>
            </div>
            <div className="card-body">
              <Formik initialValues={initialValues} onSubmit={handleSubmit}>
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
                        type="tel"
                        className="form-control rounded-pill"
                        id="phoneNumber"
                        name="phoneNumber"
                        validate={validatePhoneNumber}
                        required
                      />
                      <ErrorMessage
                        name="phoneNumber"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="email" className="form-label">
                        Email <span className="text-danger">*</span>
                      </label>
                      <Field
                        type="email"
                        className="form-control rounded-pill"
                        id="email"
                        name="email"
                        validate={validateEmail}
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-danger"
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
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="companyAddress" className="form-label">
                        Company Address <span className="text-danger">*</span>
                      </label>
                      <Field
                        type="text"
                        className="form-control rounded-pill"
                        id="companyAddress"
                        name="companyAddress"
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
                          value={true}
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
                          value={false}
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
    </div>
  );
}

export default AddParty;
