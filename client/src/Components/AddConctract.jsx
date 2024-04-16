import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import Select from "react-select";

function AddContract() {
  const initialValues = {
    storage: "",
    party: "",
    storageType: "",
    renewalDays: "",
    contractStartDate: "",
    gstApplicable: "",
    gstRate: "",
    gstType: "",
  };

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [storageOptions, setStorageOptions] = useState([]);
  const [partyOptions, setPartyOptions] = useState([]);
  const [gstRates, setGstRates] = useState([]);
  const [gstTypes, setGstTypes] = useState([]);
  const userId = localStorage.getItem("id");

  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  useEffect(() => {
    const fetchStorageOptions = async () => {
      try {
        const response = await axios.get(
          `http://3.6.248.144/api/v1/location/${userId}`
        );
        setStorageOptions(response.data);
      } catch (error) {
        console.error("Error fetching storage options:", error);
      }
    };

    const fetchPartyOptions = async () => {
      try {
        const response = await axios.get(
          "http://3.6.248.144/api/v1/users/all/party/all"
        );
        setPartyOptions(response.data);
      } catch (error) {
        console.error("Error fetching party options:", error);
      }
    };

    const fetchGstRates = async () => {
      try {
        const response = await axios.get("http://3.6.248.144/api/v1/gstrates");
        setGstRates(response.data);
      } catch (error) {
        console.error("Error fetching GST rates:", error);
      }
    };

    const fetchGstTypes = async () => {
      try {
        const response = await axios.get("http://3.6.248.144/api/v1/gsttypes");
        setGstTypes(response.data);
      } catch (error) {
        console.error("Error fetching GST types:", error);
      }
    };

    fetchStorageOptions();
    fetchPartyOptions();
    fetchGstRates();
    fetchGstTypes();
  }, []);

  const handleSubmit = async values => {
    setLoading(true);

    try {
      let dataToSend = {
        storageId: values.storage,
        storagetype: values.storageType,
        renewaldays: values.renewalDays,
        contractstartdate: values.contractStartDate,
        Gstapplicable: values.gstApplicable === "Yes",
      };

      if (values.gstApplicable === "Yes") {
        dataToSend = {
          ...dataToSend,
          gstrate: values.gstRate,
          gsttype: values.gstType,
        };
      }

      const selectedPartyId = values.party;

      const selectedParty = partyOptions.find(
        party => party.id == selectedPartyId
      );

      if (selectedParty && selectedParty.userTypeId) {
        dataToSend.partyId = selectedPartyId;
        dataToSend.partyidinpartytable = null;
      } else {
        dataToSend.partyId = null;
        dataToSend.partyidinpartytable = selectedPartyId;
      }

      console.log(dataToSend);

      const response = await axios.post(
        `http://3.6.248.144/api/v1/contracts/${userId}`,
        dataToSend
      );

      if (response.status === 201) {
        toast.success("Contract added successfully!");
        setLoading(false);
        navigate("/contract");
      } else {
        throw new Error("Failed to add contract");
      }
    } catch (error) {
      console.error("Error adding contract:", error);
      setLoading(false);
      toast.error("Failed to add contract");
    }
  };

  const handleCancel = () => {
    navigate("/contracts");
  };

  return (
    <div className="container mt-5">
      <ClipLoader loading={loading} css={override} size={150} />
      <div
        className={`col-md-12 col-lg-12 col-xl-12 ${loading ? "hidden" : ""}`}
      >
        <div className="card" style={{ borderRadius: "2rem" }}>
          <div className="card-header">
            <h4 className="card-title">Add Contract</h4>
          </div>
          <div className="card-body">
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
              {({ setFieldValue, values }) => (
                <Form>
                  <div className="mb-3 row">
                    <div className="col-md-6">
                      <label htmlFor="storage" className="form-label">
                        Storage <span className="text-danger">*</span>
                      </label>
                      <Field
                        as="select"
                        className="form-control rounded-pill"
                        id="storage"
                        name="storage"
                        required
                        onChange={e => setFieldValue("storage", e.target.value)}
                      >
                        <option value="" disabled>
                          Select Storage
                        </option>
                        {storageOptions.map(storage => (
                          <option key={storage.id} value={storage.id}>
                            {storage.storagename}
                          </option>
                        ))}
                      </Field>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="party" className="form-label">
                        Party <span className="text-danger">*</span>
                      </label>
                      <Select
                        className="react-select-container"
                        classNamePrefix="react-select"
                        options={partyOptions.map(party => ({
                          value: party.id,
                          label: `${party.mobileNumber} - ${party.name}`,
                        }))}
                        onChange={option =>
                          setFieldValue("party", option.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="storageType" className="form-label">
                      Storage Type <span className="text-danger">*</span>
                    </label>
                    <Field
                      as="select"
                      className="form-control rounded-pill"
                      id="storageType"
                      name="storageType"
                      required
                      onChange={e =>
                        setFieldValue("storageType", e.target.value)
                      }
                    >
                      <option value="" disabled>
                        Select Storage Type
                      </option>
                      <option value="Area">Area</option>
                      <option value="Product">Product</option>
                    </Field>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="renewalDays" className="form-label">
                      Renewal Days <span className="text-danger">*</span>
                    </label>
                    <Field
                      type="text"
                      className="form-control rounded-pill"
                      id="renewalDays"
                      name="renewalDays"
                      required
                      onChange={e =>
                        setFieldValue("renewalDays", e.target.value)
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="contractStartDate" className="form-label">
                      Contract Start Date <span className="text-danger">*</span>
                    </label>
                    <Field
                      type="date"
                      className="form-control rounded-pill"
                      id="contractStartDate"
                      name="contractStartDate"
                      required
                      onChange={e =>
                        setFieldValue("contractStartDate", e.target.value)
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="gstApplicable" className="form-label">
                      GST Applicable
                    </label>
                    <div className="form-check form-check-inline">
                      <Field
                        type="radio"
                        id="gstApplicableYes"
                        name="gstApplicable"
                        value="Yes"
                        className="form-check-input"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="gstApplicableYes"
                      >
                        Yes
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <Field
                        type="radio"
                        id="gstApplicableNo"
                        name="gstApplicable"
                        value="No"
                        className="form-check-input"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="gstApplicableNo"
                      >
                        No
                      </label>
                    </div>
                  </div>
                  {values.gstApplicable === "Yes" && (
                    <div className="mb-3">
                      <label htmlFor="gstRate" className="form-label">
                        GST Rate <span className="text-danger">*</span>
                      </label>
                      <Field
                        as="select"
                        className="form-control rounded-pill"
                        id="gstRate"
                        name="gstRate"
                        required
                        onChange={e => setFieldValue("gstRate", e.target.value)}
                      >
                        <option value="" disabled>
                          Select GST Rate
                        </option>
                        {gstRates.map(rate => (
                          <option key={rate.id} value={rate.id}>
                            {rate.percentage}%
                          </option>
                        ))}
                      </Field>
                    </div>
                  )}
                  {values.gstApplicable === "Yes" && (
                    <div className="mb-3">
                      <label htmlFor="gstType" className="form-label">
                        GST Type <span className="text-danger">*</span>
                      </label>
                      <Field
                        as="select"
                        className="form-control rounded-pill"
                        id="gstType"
                        name="gstType"
                        required
                        onChange={e => setFieldValue("gstType", e.target.value)}
                      >
                        <option value="" disabled>
                          Select GST Type
                        </option>
                        {gstTypes.map(type => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </Field>
                    </div>
                  )}
                  <div className="text-center">
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
              )}
            </Formik>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AddContract;
