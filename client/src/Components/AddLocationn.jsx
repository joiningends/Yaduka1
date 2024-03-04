import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import axios from "axios";

function AddLocationn() {
  const initialValues = {
    storageName: "",
    address: "",
    spaceDetails: [],
  };

  const [spaceDetails, setSpaceDetails] = useState([]);
  const [currentSpaceDetail, setCurrentSpaceDetail] = useState({
    space: "",
    spaceType: "",
    under: "",
    length: "",
    breadth: "",
    height: "",
    rentable: "",
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [spaceTypes, setSpaceTypes] = useState([]);
  const [underOptions, setUnderOptions] = useState([]);

  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  const userId = localStorage.getItem("id");

  useEffect(() => {
    const fetchSpaceTypes = async () => {
      try {
        const response = await axios.get(
          "http://13.235.51.98/api/v1/spacetype"
        );
        setSpaceTypes(response.data);
      } catch (error) {
        console.error("Error fetching space types:", error);
      }
    };

    const fetchUnderOptions = async () => {
      try {
        const response = await axios.get(
          `http://13.235.51.98/api/v1/under/${userId}`
        );
        const { under, under1 } = response.data;

        const combinedOptions = [...under, under1];
        setUnderOptions(combinedOptions);
      } catch (error) {
        console.error("Error fetching under options:", error);
      }
    };

    fetchSpaceTypes();
    fetchUnderOptions();
  }, []);

  const handleSubmit = async values => {
    setLoading(true);
    try {
      const formattedSpaceDetails = spaceDetails.map(detail => ({
        space: detail.space,
        type: Number(detail.spaceType),
        under: Number(detail.under),
        length: Number(detail.length),
        breadth: Number(detail.breadth),
        height: Number(detail.height),
        rentable: detail.rentable === "Yes",
      }));

      console.log({
        storagename: values.storageName,
        address: values.address,
        spacedetails: formattedSpaceDetails,
      });

      // Send POST request to the specified API endpoint
      await axios.post(`http://13.235.51.98/api/v1/location/${userId}`, {
        storagename: values.storageName,
        address: values.address,
        spacedetails: formattedSpaceDetails,
      });

      setLoading(false);
      navigate("/locations");
    } catch (error) {
      console.error("Error processing form:", error);
      setLoading(false);
      toast.error("Failed to submit form");
    }
  };

  const handleAddSpaceDetails = async () => {
    if (
      currentSpaceDetail.space &&
      currentSpaceDetail.spaceType &&
      currentSpaceDetail.under &&
      currentSpaceDetail.length &&
      currentSpaceDetail.breadth &&
      currentSpaceDetail.height &&
      currentSpaceDetail.rentable
    ) {
      try {
        // POST request to add a new space to the "under" endpoint
        await axios.post(`http://13.235.51.98/api/v1/under/${userId}`, {
          name: currentSpaceDetail.space,
        });

        // GET request to fetch updated options for the "under" dropdown
        const response = await axios.get(
          `http://13.235.51.98/api/v1/under/${userId}`
        );
        const { under, under1 } = response.data;
        const combinedOptions = [...under, under1];
        setUnderOptions(combinedOptions);

        // Add the current space detail to the spaceDetails array
        setSpaceDetails(prevSpaceDetails => [
          ...prevSpaceDetails,
          { ...currentSpaceDetail },
        ]);
        console.log("Current Space Details:", [
          ...spaceDetails,
          currentSpaceDetail,
        ]);

        // Clear the current space detail values
        setCurrentSpaceDetail({
          space: "",
          spaceType: "",
          under: "",
          length: "",
          breadth: "",
          height: "",
          rentable: "",
        });
      } catch (error) {
        console.error("Error adding space details:", error);
        toast.error("Failed to add space details");
      }
    } else {
      console.error("Incomplete Space Detail. Please fill in all fields.");
    }
  };

  const handleCancel = () => {
    navigate("/locations");
  };

  return (
    <div className="container mt-5">
      <ClipLoader loading={loading} css={override} size={150} />
      <div
        className={`col-md-12 col-lg-12 col-xl-12 ${loading ? "hidden" : ""}`}
      >
        <div className="card" style={{ borderRadius: "2rem" }}>
          <div className="card-header">
            <h4 className="card-title">Add Location</h4>
          </div>
          <div className="card-body">
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
              <Form>
                <div className="mb-3 row">
                  <div className="col-md-6">
                    <label htmlFor="storageName" className="form-label">
                      Storage Name <span className="text-danger">*</span>
                    </label>
                    <Field
                      type="text"
                      className="form-control rounded-pill"
                      id="storageName"
                      name="storageName"
                      required
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
                      required
                    />
                  </div>
                </div>
                <div className="mb-3 row">
                  <div className="col-md-6">
                    <h5>Add Space Details</h5>
                    <div className="mb-3">
                      <label htmlFor="space" className="form-label">
                        Space <span className="text-danger">*</span>
                      </label>
                      <Field
                        type="text"
                        className="form-control rounded-pill"
                        id="space"
                        name="space"
                        required={!spaceDetails.length}
                        value={currentSpaceDetail.space}
                        onChange={e =>
                          setCurrentSpaceDetail({
                            ...currentSpaceDetail,
                            space: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="spaceType" className="form-label">
                        Type <span className="text-danger">*</span>
                      </label>
                      <Field
                        as="select"
                        className="form-control rounded-pill"
                        id="spaceType"
                        name="spaceType"
                        required={!spaceDetails.length}
                        value={currentSpaceDetail.spaceType}
                        onChange={e =>
                          setCurrentSpaceDetail({
                            ...currentSpaceDetail,
                            spaceType: e.target.value,
                          })
                        }
                      >
                        <option value="" disabled>
                          Select Space Type
                        </option>
                        {spaceTypes.map(type => (
                          <option key={type.id} value={type.id}>
                            {type.type}
                          </option>
                        ))}
                      </Field>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="under" className="form-label">
                        Under <span className="text-danger">*</span>
                      </label>
                      <Field
                        as="select"
                        className="form-control rounded-pill"
                        id="under"
                        name="under"
                        required={!spaceDetails.length}
                        value={currentSpaceDetail.under}
                        onChange={e =>
                          setCurrentSpaceDetail({
                            ...currentSpaceDetail,
                            under: e.target.value,
                          })
                        }
                      >
                        <option value="" disabled>
                          Select Under
                        </option>
                        {underOptions.map(option => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </Field>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h5>Space Details</h5>
                    <div className="mb-3">
                      <label htmlFor="length" className="form-label">
                        Length <span className="text-danger">*</span>
                      </label>
                      <Field
                        type="number"
                        className="form-control rounded-pill"
                        id="length"
                        name="length"
                        required={!spaceDetails.length}
                        value={currentSpaceDetail.length}
                        onChange={e =>
                          setCurrentSpaceDetail({
                            ...currentSpaceDetail,
                            length: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="breadth" className="form-label">
                        Breadth <span className="text-danger">*</span>
                      </label>
                      <Field
                        type="number"
                        className="form-control rounded-pill"
                        id="breadth"
                        name="breadth"
                        required={!spaceDetails.length}
                        value={currentSpaceDetail.breadth}
                        onChange={e =>
                          setCurrentSpaceDetail({
                            ...currentSpaceDetail,
                            breadth: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="height" className="form-label">
                        Height <span className="text-danger">*</span>
                      </label>
                      <Field
                        type="number"
                        className="form-control rounded-pill"
                        id="height"
                        name="height"
                        required={!spaceDetails.length}
                        value={currentSpaceDetail.height}
                        onChange={e =>
                          setCurrentSpaceDetail({
                            ...currentSpaceDetail,
                            height: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">
                        Rentable <span className="text-danger">*</span>
                      </label>
                      <div className="form-check form-check-inline">
                        <label className="form-check-label">
                          <Field
                            type="radio"
                            className="form-check-input"
                            name="rentable"
                            value="Yes"
                            checked={currentSpaceDetail.rentable === "Yes"}
                            onChange={() =>
                              setCurrentSpaceDetail({
                                ...currentSpaceDetail,
                                rentable: "Yes",
                              })
                            }
                          />
                          Yes
                        </label>
                        <label className="form-check-label">
                          <Field
                            type="radio"
                            className="form-check-input"
                            name="rentable"
                            value="No"
                            checked={currentSpaceDetail.rentable === "No"}
                            onChange={() =>
                              setCurrentSpaceDetail({
                                ...currentSpaceDetail,
                                rentable: "No",
                              })
                            }
                          />
                          No
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <button
                    type="button"
                    className="btn btn-success rounded-pill me-2"
                    onClick={handleAddSpaceDetails}
                  >
                    Add Space Details
                  </button>
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
                    disabled={
                      spaceDetails.length === 0 &&
                      initialValues.spaceDetails.length === 0
                    }
                  >
                    Submit
                  </button>
                </div>
              </Form>
            </Formik>

            {/* Display Table for Space Details */}
            <h5 className="mt-4">Space Details Table</h5>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Space</th>
                  <th>Length</th>
                  <th>Breadth</th>
                  <th>Height</th>
                  <th>Rentable</th>
                </tr>
              </thead>
              <tbody>
                {spaceDetails.map((detail, index) => (
                  <tr key={index}>
                    <td>{detail.space}</td>
                    <td>{detail.length}</td>
                    <td>{detail.breadth}</td>
                    <td>{detail.height}</td>
                    <td>{detail.rentable}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AddLocationn;
