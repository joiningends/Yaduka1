import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddContract() {
  const initialValues = {
    storage: "",
    party: "",
    storageType: "",
    renewalDays: "",
    contractStartDate: "",
    gstApplicable: false,
    gstRate: "",
    gstType: "",
  };

  const storageOptions = ["Storage 1", "Storage 2", "Storage 3"];
  const partyOptions = ["Party 1", "Party 2", "Party 3"];
  const storageTypeOptions = ["Area", "Product"];
  const gstRateOptions = ["0", "5", "12", "18", "28"];
  const gstTypeOptions = ["IGST", "CGST", "SGST"];

  const handleSubmit = values => {
    console.log("Submitted data:", values);
    toast.success("Contract submitted successfully!");
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
              <h4 className="card-title">Add Contract</h4>
            </div>
            <div className="card-body">
              <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                <Form>
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label htmlFor="storage" className="form-label">
                        Storage <span className="text-danger">*</span>
                      </label>
                      <Field
                        as="select"
                        className="form-select rounded-pill"
                        id="storage"
                        name="storage"
                        required
                      >
                        <option value="" disabled>
                          Select Storage
                        </option>
                        {storageOptions.map(option => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Field>
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="party" className="form-label">
                        Party <span className="text-danger">*</span>
                      </label>
                      <Field
                        as="select"
                        className="form-select rounded-pill"
                        id="party"
                        name="party"
                        required
                      >
                        <option value="" disabled>
                          Select Party
                        </option>
                        {partyOptions.map(option => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Field>
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="storageType" className="form-label">
                        Storage Type <span className="text-danger">*</span>
                      </label>
                      <Field
                        as="select"
                        className="form-select rounded-pill"
                        id="storageType"
                        name="storageType"
                        required
                      >
                        <option value="" disabled>
                          Select Storage Type
                        </option>
                        {storageTypeOptions.map(option => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Field>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="renewalDays" className="form-label">
                        Renewal Days <span className="text-danger">*</span>
                      </label>
                      <Field
                        type="text"
                        className="form-control rounded-pill"
                        id="renewalDays"
                        name="renewalDays"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="contractStartDate" className="form-label">
                        Contract Start Date{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <Field
                        type="date"
                        className="form-control rounded-pill"
                        id="contractStartDate"
                        name="contractStartDate"
                        required
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">
                        GST Applicable <span className="text-danger">*</span>
                      </label>
                      <div className="form-check">
                        <Field
                          type="radio"
                          className="form-check-input"
                          id="gstApplicableYes"
                          name="gstApplicable"
                          value={true}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="gstApplicableYes"
                        >
                          Yes
                        </label>
                      </div>
                      <div className="form-check">
                        <Field
                          type="radio"
                          className="form-check-input"
                          id="gstApplicableNo"
                          name="gstApplicable"
                          value={false}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="gstApplicableNo"
                        >
                          No
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="gstRate" className="form-label">
                        GST Rate <span className="text-danger">*</span>
                      </label>
                      <Field
                        as="select"
                        className="form-select rounded-pill"
                        id="gstRate"
                        name="gstRate"
                        required
                      >
                        <option value="" disabled>
                          Select GST Rate
                        </option>
                        {gstRateOptions.map(option => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Field>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="gstType" className="form-label">
                        GST Type <span className="text-danger">*</span>
                      </label>
                      <Field
                        as="select"
                        className="form-select rounded-pill"
                        id="gstType"
                        name="gstType"
                        required
                      >
                        <option value="" disabled>
                          Select GST Type
                        </option>
                        {gstTypeOptions.map(option => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Field>
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

export default AddContract;
