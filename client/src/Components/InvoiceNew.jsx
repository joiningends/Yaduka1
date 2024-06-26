import React, { useState, useEffect } from "react";
import { Formik, Form, useFormik } from "formik";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

function InvoiceNew() {
  const userId = localStorage.getItem("id");

  const initialValues = {
    party: null,
    storageLocation: null,
    contract: null,
  };

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [partyOptions, setPartyOptions] = useState([]);
  const [storageLocationOptions, setStorageLocationOptions] = useState([]);
  const [contractOptions, setContractOptions] = useState([]);
  const [invoiceDetails, setInvoiceDetails] = useState([]);

  useEffect(() => {
    fetchPartyOptions();
  }, []);

  const fetchPartyOptions = async () => {
    try {
      const response = await fetch(
        `https://www.keepitcool.app/api/v1/users/invoice/${userId}`
      );
      if (response.ok) {
        const data = await response.json();
        const options = data.map(party => ({
          value: party["partyuser.id"],
          label: `${party["partyuser.partyuser_mobileNumber"]} - ${party["partyuser.partyuser_name"]} - ${party["partyuser.partyuser_companyname"]}`,
        }));
        setPartyOptions(options);
      } else {
      }
    } catch (error) {
      console.error("Error fetching party options:", error);
    }
  };

  const fetchStorageLocationOptions = async partyId => {
    try {
      const response = await fetch(
        `https://www.keepitcool.app/api/v1/contracts/invoice/${partyId}/${userId}`
      );
      if (response.ok) {
        const data = await response.json();
        const options = data.storageDetails.map(storageLocation => ({
          value: storageLocation.storageId,
          label: storageLocation.storageName,
        }));
        setStorageLocationOptions(options);
      } else {
      }
    } catch (error) {
      console.error("Error fetching storage locations:", error);
    }
  };

  const fetchContractOptions = async (partyId, storageId) => {
    try {
      const response = await fetch(
        `https://www.keepitcool.app/api/v1/contracts/invoice/storags/${partyId}/${storageId}`
      );

      if (response.ok) {
        const responseData = await response.json();
        const contractData = responseData.contractData;

        if (Array.isArray(contractData)) {
          const options = contractData.map(contract => ({
            value: contract.contractId,
            label: contract.contractname,
          }));
          setContractOptions(options);
        } else {
        }
      } else {
      }
    } catch (error) {
      console.error("Error fetching contract options:", error);
    }
  };

  const fetchInvoiceDetails = async contractId => {
    try {
      const response = await fetch(
        `https://www.keepitcool.app/api/v1/contracts/invoices/all/${contractId}`
      );

      if (response.ok) {
        const data = await response.json();
        setInvoiceDetails(data.invoiceDetails);
      } else {
      }
    } catch (error) {
      console.error("Error fetching invoice details:", error);
    }
  };

  const handleSubmit = async values => {
    try {
      setIsLoading(true);
      // ... (unchanged)
    } catch (error) {
      console.error("Error submitting invoice:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePartyChange = selectedOption => {
    formik.setFieldValue("party", selectedOption);
    fetchStorageLocationOptions(selectedOption.value);
  };

  const handleStorageLocationChange = selectedOption => {
    formik.setFieldValue("storageLocation", selectedOption);
    fetchContractOptions(formik.values.party.value, selectedOption.value);
  };

  const handleContractChange = selectedOption => {
    formik.setFieldValue("contract", selectedOption);
    fetchInvoiceDetails(selectedOption.value);
  };

  const handleCancel = () => {
    navigate("/Invoices");
  };

  const formik = useFormik({
    initialValues,
    onSubmit: handleSubmit,
  });

  const handleViewClick = async invoiceName => {
    try {
      const pdfUrl = `https://www.keepitcool.app/api/v1/contracts/view/${invoiceName}.pdf`;
      const inUrl = `https://www.keepitcool.app/api/v1/contracts/in/${invoiceName}.pdf`;

      const openInNewTab = url => {
        if (typeof window !== "undefined") {
          const newWindow = window.open();
          newWindow.location.href = url;
        } else {
          console.error("Window object is not defined.");
        }
      };

      const pdfResponse = await fetch(pdfUrl);
      if (pdfResponse.ok) {
        openInNewTab(pdfUrl);
      } else {
        console.error("Error fetching PDF:", pdfResponse.statusText);
      }

      const inResponse = await fetch(inUrl);
      if (inResponse.ok) {
        openInNewTab(inUrl);
      } else {
        console.error("Error fetching inUrl:", inResponse.statusText);
      }
    } catch (error) {
      console.error("Error viewing invoice:", error);
    }
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
              <h4 className="card-title">Invoice</h4>
            </div>
            <div className="card-body">
              <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                <Form>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="party" className="form-label">
                        Party <span className="text-danger">*</span>
                      </label>
                      <Select
                        id="party"
                        name="party"
                        options={partyOptions}
                        value={formik.values.party}
                        onChange={handlePartyChange}
                        isSearchable
                        placeholder="Select Party"
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="storageLocation" className="form-label">
                        Storage Location <span className="text-danger">*</span>
                      </label>
                      <Select
                        id="storageLocation"
                        name="storageLocation"
                        options={storageLocationOptions}
                        value={formik.values.storageLocation}
                        onChange={handleStorageLocationChange}
                        isSearchable
                        placeholder="Select Storage Location"
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="contract" className="form-label">
                        Contract <span className="text-danger">*</span>
                      </label>
                      <Select
                        id="contract"
                        name="contract"
                        options={contractOptions}
                        value={formik.values.contract}
                        onChange={handleContractChange}
                        isSearchable
                        placeholder="Select Contract"
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-12">
                      <div className="table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Amount</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {invoiceDetails.map(invoice => (
                              <tr key={invoice.id}>
                                <td>{invoice.name}</td>
                                <td>{invoice.amount}</td>
                                <td>
                                  <button
                                    className="btn btn-primary"
                                    onClick={() =>
                                      handleViewClick(invoice.name)
                                    }
                                  >
                                    View
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* ... (rest of the code remains unchanged) */}
                </Form>
              </Formik>
            </div>
          </div>
        </div>
      </div>
      {isLoading && (
        <div className="text-center mt-3">
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
}

export default InvoiceNew;
