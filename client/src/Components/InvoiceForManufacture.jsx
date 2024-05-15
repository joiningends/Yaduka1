import React, { useState, useEffect } from "react";
import { Formik, Form, useFormik } from "formik";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function InvoiceForManufacture() {
  const userId = localStorage.getItem("id");
  console.log(userId);

  const initialValues = {
    storageLocation: null,
    contract: null,
  };

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [storageLocationOptions, setStorageLocationOptions] = useState([]);
  const [contractOptions, setContractOptions] = useState([]);
  const [invoiceDetails, setInvoiceDetails] = useState([]);

  useEffect(() => {
    fetchStorageLocationOptions(); // Fetch storage locations on component mount
  }, []);

  const fetchStorageLocationOptions = async () => {
    try {
      const response = await fetch(
        `https://www.keepitcool.app/api/v1/contracts/invoices/manufacture/location/${userId}`
      );
      if (response.ok) {
        const data = await response.json();
        const options = data.storageDetails.map(storageLocation => ({
          value: storageLocation.storageId,
          label: storageLocation.storageName,
        }));
        setStorageLocationOptions(options);
      } else {
        toast.error("Failed to fetch storage locations");
      }
    } catch (error) {
      console.error("Error fetching storage locations:", error);
      toast.error("An error occurred while fetching storage locations");
    }
  };

  const fetchContractOptions = async storageId => {
    try {
      const response = await fetch(
        `https://www.keepitcool.app/api/v1/contracts/invoice/storags/${userId}/${storageId}`
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
          toast.error("Invalid contract data received");
        }
      } else {
        toast.error("There is no data for this storage location.");
      }
    } catch (error) {
      console.error("Error fetching contract options:", error);
      toast.error("An error occurred while fetching contract options");
    }
  };

  const fetchInvoiceDetails = async contractId => {
    try {
      console.log(
        `https://www.keepitcool.app/api/v1/contracts/invoices/all/${contractId}`
      );
      const response = await fetch(
        `https://www.keepitcool.app/api/v1/contracts/invoices/all/${contractId}`
      );

      if (response.ok) {
        const data = await response.json();
        setInvoiceDetails(data.invoiceDetails);
        console.log(data.invoiceDetails);
      } else {
        toast.error("Failed to fetch invoice details");
      }
    } catch (error) {
      console.error("Error fetching invoice details:", error);
      toast.error("An error occurred while fetching invoice details");
    }
  };

  const handleSubmit = async values => {
    try {
      setIsLoading(true);
      // ... (unchanged)
    } catch (error) {
      console.error("Error submitting invoice:", error);
      toast.error("Failed to submit invoice.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStorageLocationChange = selectedOption => {
    formik.setFieldValue("storageLocation", selectedOption);
    fetchContractOptions(selectedOption.value);
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

      console.log(invoiceName);
      const openInNewTab = url => {
        if (typeof window !== "undefined") {
          const newWindow = window.open();
          newWindow.location.href = url;
        } else {
          console.error("Window object is not defined.");
          toast.error("Failed to open in a new tab.");
        }
      };

      const pdfResponse = await fetch(pdfUrl);
      if (pdfResponse.ok) {
        openInNewTab(pdfUrl);
      } else {
        console.error("Error fetching PDF:", pdfResponse.statusText);
        toast.error("Failed to view PDF.");
      }
    } catch (error) {
      console.error("Error viewing invoice:", error);
      toast.error("Failed to view invoice.");
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
              <h4 className="card-title">New Invoice</h4>
            </div>
            <div className="card-body">
              <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                <Form>
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
      <ToastContainer />
      {isLoading && (
        <div className="text-center mt-3">
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
}

export default InvoiceForManufacture;
