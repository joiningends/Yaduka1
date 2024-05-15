import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddLocation() {
  const initialValues = {
    storageName: "",
    address: "",
    spaceDetails: [
      {
        space: "",
        type: "Dummy Type",
        under: "Dummy Under",
        length: "",
        breadth: "",
        height: "",
        rentable: false,
      },
    ],
  };

  const validateStorageName = value => {
    return value.trim() !== "" ? undefined : "Storage Name is required.";
  };

  const validateAddress = value => {
    return value.trim() !== "" ? undefined : "Address is required.";
  };

  const validateSpaceLength = value => {
    return value > 0 ? undefined : "Length should be greater than 0.";
  };

  const validateSpaceBreadth = value => {
    return value > 0 ? undefined : "Breadth should be greater than 0.";
  };

  const validateSpaceHeight = value => {
    return value > 0 ? undefined : "Height should be greater than 0.";
  };

  const handleSubmit = values => {
    console.log("Submitted data:", values);
    // You can perform additional actions with the submitted data
    toast.success("Location added successfully!");
  };

  const handleAddSpaceDetail = (arrayHelpers) => {
    arrayHelpers.replace([...arrayHelpers.values, {
      space: "",
      type: "Dummy Type",
      under: "Dummy Under",
      length: "",
      breadth: "",
      height: "",
      rentable: false,
    }]);
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
              <h4 className="card-title">Add Location Type</h4>
            </div>
            <div className="card-body">
              <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                {({ values, arrayHelpers }) => (
                  <Form>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label htmlFor="storageName" className="form-label">
                          Storage Name <span className="text-danger">*</span>
                        </label>
                        <Field
                          type="text"
                          className="form-control rounded-pill"
                          id="storageName"
                          name="storageName"
                          validate={validateStorageName}
                          required
                        />
                        <ErrorMessage
                          name="storageName"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="address" className="form-label">
                          Address <span className="text-danger">*</span>
                        </label>
                        <Field
                          type="text"
                          className="form-control rounded-pill"
                          id="address"
                          name="address"
                          validate={validateAddress}
                          required
                        />
                        <ErrorMessage
                          name="address"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>

                    {values.spaceDetails.map((spaceDetail, index) => (
                      <div key={index}>
                        <div className="row mb-3">
                          <div className="col-md-12">
                            <button
                              type="button"
                              className="btn btn-primary rounded-pill"
                              onClick={() => handleAddSpaceDetail(arrayHelpers)}
                            >
                              ADD Space Details +
                            </button>
                          </div>
                        </div>

                        {values.spaceDetails.length > 1 && (
                          <div className="row mb-3">
                            <div className="col-md-12">
                              <button
                                type="button"
                                className="btn btn-danger rounded-pill"
                                onClick={() => arrayHelpers.remove(index)}
                              >
                                Remove Space Details
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label
                              htmlFor={`spaceDetails[${index}].space`}
                              className="form-label"
                            >
                              Space <span className="text-danger">*</span>
                            </label>
                            <Field
                              type="text"
                              className="form-control rounded-pill"
                              id={`spaceDetails[${index}].space`}
                              name={`spaceDetails[${index}].space`}
                              required
                            />
                          </div>
                          <div className="col-md-6">
                            <label
                              htmlFor={`spaceDetails[${index}].type`}
                              className="form-label"
                            >
                              Type <span className="text-danger">*</span>
                            </label>
                            <Field
                              as="select"
                              className="form-control rounded-pill"
                              id={`spaceDetails[${index}].type`}
                              name={`spaceDetails[${index}].type`}
                            >
                              <option value="Dummy Type">Dummy Type</option>
                              {/* Add other type options as needed */}
                            </Field>
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label
                              htmlFor={`spaceDetails[${index}].under`}
                              className="form-label"
                            >
                              Under <span className="text-danger">*</span>
                            </label>
                            <Field
                              as="select"
                              className="form-control rounded-pill"
                              id={`spaceDetails[${index}].under`}
                              name={`spaceDetails[${index}].under`}
                            >
                              <option value="Dummy Under">Dummy Under</option>
                              {/* Add other under options as needed */}
                            </Field>
                          </div>
                          <div className="col-md-2">
                            <label
                              htmlFor={`spaceDetails[${index}].length`}
                              className="form-label"
                            >
                              Length <span className="text-danger">*</span>
                            </label>
                            <Field
                              type="number"
                              className="form-control rounded-pill"
                              id={`spaceDetails[${index}].length`}
                              name={`spaceDetails[${index}].length`}
                              validate={validateSpaceLength}
                              required
                            />
                          </div>
                          <div className="col-md-2">
                            <label
                              htmlFor={`spaceDetails[${index}].breadth`}
                              className="form-label"
                            >
                              Breadth <span className="text-danger">*</span>
                            </label>
                            <Field
                              type="number"
                              className="form-control rounded-pill"
                              id={`spaceDetails[${index}].breadth`}
                              name={`spaceDetails[${index}].breadth`}
                              validate={validateSpaceBreadth}
                              required
                            />
                          </div>
                          <div className="col-md-2">
                            <label
                              htmlFor={`spaceDetails[${index}].height`}
                              className="form-label"
                            >
                              Height <span className="text-danger">*</span>
                            </label>
                            <Field
                              type="number"
                              className="form-control rounded-pill"
                              id={`spaceDetails[${index}].height`}
                              name={`spaceDetails[${index}].height`}
                              validate={validateSpaceHeight}
                              required
                            />
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">
                              Rentable <span className="text-danger">*</span>
                            </label>
                            <div className="form-check">
                              <Field
                                type="radio"
                                className="form-check-input"
                                id={`spaceDetails[${index}].rentableYes`}
                                name={`spaceDetails[${index}].rentable`}
                                value={true}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`spaceDetails[${index}].rentableYes`}
                              >
                                Yes
                              </label>
                            </div>
                            <div className="form-check">
                              <Field
                                type="radio"
                                className="form-check-input"
                                id={`spaceDetails[${index}].rentableNo`}
                                name={`spaceDetails[${index}].rentable`}
                                value={false}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`spaceDetails[${index}].rentableNo`}
                              >
                                No
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

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
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AddLocation;
