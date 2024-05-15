import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import axios from "axios";

function EditLocation() {
  const { id } = useParams();
  const userId = localStorage.getItem("id");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [spaceTypes, setSpaceTypes] = useState([]);
  const [underOptions, setUnderOptions] = useState([]);
  const [spaceDetails, setSpaceDetails] = useState([]);
  const [currentSpaceDetail, setCurrentSpaceDetail] = useState({
    space: "",
    spaceType: "",
    under: "",
    length: "",
    breadth: "",
    height: "",
    rentable: "Yes",
  });
  const [storageName, setStorageName] = useState("");
  const [address, setAddress] = useState("");
  const [storageNameCount, setStorageNameCount] = useState("");
  const [addressCount, setAddressCount] = useState("");

  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  useEffect(() => {
    const fetchLocationDetails = async () => {
      try {
        const response = await axios.get(
          `https://www.keepitcool.app/api/v1/location/location/${id}`
        );
        const { storagename, address, spaceDetails } = response.data;
        setStorageName(storagename);
        setAddress(address);
        setSpaceDetails(spaceDetails);
        setStorageNameCount(storageName);
        setAddressCount(address);
      } catch (error) {
        console.error("Error fetching location details:", error);
      }
    };

    const fetchSpaceTypes = async () => {
      try {
        const response = await axios.get(
          "https://www.keepitcool.app/api/v1/spacetype"
        );
        setSpaceTypes(response.data);
      } catch (error) {
        console.error("Error fetching space types:", error);
      }
    };

    const fetchUnderOptions = async () => {
      try {
        const response = await axios.get(
          `https://www.keepitcool.app/api/v1/under/${userId}`
        );
        const { under, under1 } = response.data;
        const combinedOptions = [...under, under1];
        setUnderOptions(combinedOptions);
      } catch (error) {
        console.error("Error fetching under options:", error);
      }
    };

    fetchLocationDetails();
    fetchSpaceTypes();
    fetchUnderOptions();
  }, [id]);

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    console.log(values);
    try {
      let payload = {};

      if (values.storageName !== storageName || values.address !== address) {
        payload = {
          storagename: values.storageName,
          address: values.address,
          spacedetails: [...values.spaceDetails],
        };
      } else {
        payload = {
          spacedetails: [...values.spaceDetails],
        };
      }

      console.log(payload);

      // if(storageNameCount!==storageName || addressCount !== address){

      // }

      const newSpaceDetails = spaceDetails.filter(detail => !detail.id);
      console.log(newSpaceDetails);

      payload.spacedetails.push(...newSpaceDetails);

      payload.spacedetails = payload.spacedetails.map(detail => ({
        ...detail,
        length: Number(detail.length),
        breadth: Number(detail.breadth),
        height: Number(detail.height),
        rentable: detail.rentable === "Yes",
        under: Number(detail.under),
        type: Number(detail.spaceType),
      }));

      // Remove the old 'spaceType' property
      payload.spacedetails.forEach(detail => delete detail.spaceType);

      console.log(storageNameCount);
      console.log(storageName);
      console.log(addressCount);
      console.log(address);

      if (storageNameCount != storageName || addressCount != address) {
        payload.address = address;
        payload.storagename = storageName;
      } else {
        delete payload.storagename;
        delete payload.address;
      }

      console.log(payload);

      await axios.put(
        `https://www.keepitcool.app/api/v1/location/update/${id}`,
        payload
      );

      setLoading(false);
      navigate("/Location");
    } catch (error) {
      console.error("Error processing form:", error);
      setLoading(false);
      toast.error("Failed to update location");
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
        await axios.post(`https://www.keepitcool.app/api/v1/under/${userId}`, {
          name: currentSpaceDetail.space,
        });

        const response = await axios.get(
          `https://www.keepitcool.app/api/v1/under/${userId}`
        );
        const { under, under1 } = response.data;
        const combinedOptions = [...under, under1];
        setUnderOptions(combinedOptions);

        setSpaceDetails(prevSpaceDetails => [
          ...prevSpaceDetails,
          { ...currentSpaceDetail },
        ]);

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

  const handleStorageNameChange = event => {
    const newValue = event.target.value;
    setStorageName(newValue);
  };

  const handleAddressChange = event => {
    const newValue = event.target.value;
    setAddress(newValue);
  };

  const handleCancel = () => {
    navigate("/Location");
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
            <Formik
              initialValues={{
                storageName: storageName,
                address: address,
                spaceDetails: spaceDetails,
              }}
              onSubmit={handleSubmit}
            >
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
                      value={storageName}
                      onChange={handleStorageNameChange}
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
                      value={address}
                      onChange={handleAddressChange}
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
                  >
                    Submit
                  </button>
                </div>
              </Form>
            </Formik>

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
                    <td>{detail.rentable ? "Yes" : "No"}</td>
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

export default EditLocation;
