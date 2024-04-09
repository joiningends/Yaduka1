import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

function DraftContractForProductType() {
  const [contractData, setContractData] = useState(null);
  const [productOptions, setProductOptions] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [lotName, setLotName] = useState("");
  const [storageSpaces, setStorageSpaces] = useState([]);
  const [spaceOptions, setSpaceOptions] = useState([]);
  const [selectedSpaceIds, setSelectedSpaceIds] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [rate, setRate] = useState("");
  const [amount, setAmount] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  const userId = localStorage.getItem("id");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://3.6.248.144/api/v1/contracts/${userId}/draft/${id}`
        );
        setContractData(response.data);
        setLocation(response.data.location.id);
        const productResponse = await axios.get(
          "http://3.6.248.144/api/v1/product/all"
        );
        setProductOptions(productResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const spaceResponse = await axios.get(
          `http://3.6.248.144/api/v1/location/space/${location}`
        );
        setSpaceOptions(spaceResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [location]);

  const handleProductChange = e => {
    setSelectedProductId(e.target.value);
  };

  const handleLotNameChange = e => {
    setLotName(e.target.value);
  };

  const handleAddStorageSpace = () => {
    if (
      selectedProductId &&
      lotName &&
      selectedSpaceIds.length > 0 &&
      quantity &&
      rate
    ) {
      const calculatedAmount = Number(quantity) * Number(rate);
      const newStorageSpace = {
        productid: selectedProductId,
        storagespace: selectedSpaceIds,
        lotno: lotName,
        qty: quantity,
        rate: rate,
        amount: calculatedAmount,
      };

      setStorageSpaces([...storageSpaces, newStorageSpace]);
      console.log(storageSpaces);
      setSelectedProductId("");
      setLotName("");
      setSelectedSpaceIds([]);
      setQuantity("");
      setRate("");
      setAmount("");
    } else {
      toast.error("Please fill all required fields.");
    }
  };

  const handleSpaceChange = event => {
    setSelectedSpaceIds(event.target.value);
  };

  const handleQuantityChange = e => {
    setQuantity(e.target.value);
    const calculatedAmount = Number(e.target.value) * Number(rate);
    setAmount(calculatedAmount);
  };

  const handleRateChange = e => {
    setRate(e.target.value);
    const calculatedAmount = Number(quantity) * Number(e.target.value);
    setAmount(calculatedAmount);
  };

  const handleSubmit = async () => {
    const transformedData = {
      storagespaces: storageSpaces.map(space => ({
        productid: space.productid,
        storagespace: space.storagespace,
        lotno: space.lotno,
        qty: parseInt(space.qty, 10),
        rate: parseInt(space.rate, 10),
        amount: space.amount,
      })),
    };

    try {
      console.log(transformedData);
      const response = await axios.put(
        `http://3.6.248.144/api/v1/contracts/draft/${id}/${userId}/product`,
        transformedData
      );

      toast.success("Contract submitted successfully!");

      setTimeout(() => {
        navigate("/Contract");
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);

      toast.error("Error submitting contract. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="col-md-12 col-lg-12 col-xl-12">
        <div className="card" style={{ borderRadius: "2rem" }}>
          <div className="card-header">
            <h4 className="card-title">Draft Contract Details</h4>
          </div>
          <div className="card-body">
            {contractData ? (
              <form>
                <div className="mb-3">
                  <label htmlFor="storageName" className="form-label">
                    Storage Name:
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    id="storageName"
                    value={contractData.location?.storagename || ""}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="party" className="form-label">
                    Party:
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    id="party"
                    value={contractData.partyuser?.name}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="storageType" className="form-label">
                    Storage Type:
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    id="storageType"
                    value={contractData.storagetype || ""}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="renewalDays" className="form-label">
                    Renewal Days:
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    id="renewalDays"
                    value={contractData.renewaldays || ""}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="contractStartDate" className="form-label">
                    Contract Start Date:
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    id="contractStartDate"
                    value={contractData.contractstartdate || ""}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="gstApplicable" className="form-label">
                    GST Applicable:
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    id="gstApplicable"
                    value={contractData.Gstapplicable ? "Yes" : "No"}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="gstRate" className="form-label">
                    GST Rate:
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    id="gstRate"
                    value={contractData.gstRate?.percentage}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="gstType" className="form-label">
                    GST Type:
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    id="gstType"
                    value={contractData.gstType?.name || ""}
                    readOnly
                  />
                </div>
                <div className="mt-5">
                  <h4>Add Contract Here by Product</h4>
                  <div className="mb-3">
                    <label htmlFor="product" className="form-label">
                      Product:
                    </label>
                    <select
                      className="form-control rounded-pill"
                      id="product"
                      value={selectedProductId}
                      onChange={handleProductChange}
                    >
                      <option value="" disabled>
                        Select Product
                      </option>
                      {productOptions.map(product => (
                        <option key={product.id} value={product.id}>
                          {`${product.commodity?.commodity}-${product.varient?.varient}| |${product.quality?.quality}| |${product.packSize}-${product.unit?.unit}`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="lotName" className="form-label">
                      Lot Name:
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-pill"
                      id="lotName"
                      value={lotName}
                      onChange={handleLotNameChange}
                    />
                  </div>
                  <div className="mb-3">
                    <FormControl fullWidth>
                      <InputLabel
                        id="space-label"
                        sx={{ marginBottom: "10px" }}
                      >
                        Storage Space
                      </InputLabel>
                      <Select
                        labelId="space-label"
                        id="space"
                        multiple
                        value={selectedSpaceIds}
                        onChange={handleSpaceChange}
                        renderValue={selected =>
                          selected
                            .map(
                              id =>
                                spaceOptions.find(space => space.id === id)
                                  .space
                            )
                            .join(", ")
                        }
                        sx={{ marginBottom: "10px" }}
                      >
                        {spaceOptions.map(space => (
                          <MenuItem key={space.id} value={space.id}>
                            {space.space}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="quantity" className="form-label">
                      Qty:
                    </label>
                    <input
                      type="number"
                      className="form-control rounded-pill"
                      id="quantity"
                      value={quantity}
                      onChange={handleQuantityChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="rate" className="form-label">
                      Rate:
                    </label>
                    <input
                      type="number"
                      className="form-control rounded-pill"
                      id="rate"
                      value={rate}
                      onChange={handleRateChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="amount" className="form-label">
                      Amount:
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-pill"
                      id="amount"
                      value={amount}
                      readOnly
                    />
                  </div>
                  <div className="text-center">
                    <button
                      type="button"
                      className="btn btn-primary rounded-pill"
                      onClick={handleAddStorageSpace}
                    >
                      Add
                    </button>
                  </div>
                </div>
                {storageSpaces.length > 0 && (
                  <div className="mt-5">
                    <h4>Storage Spaces</h4>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Lot Name</th>
                          <th>Storage Space</th>
                          <th>Qty</th>
                          <th>Rate</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {storageSpaces.map((space, index) => (
                          <tr key={index}>
                            <td>
                              {
                                productOptions.find(
                                  p => p.id === space.productid
                                )?.commodity?.commodity
                              }
                              -
                              {
                                productOptions.find(
                                  p => p.id === space.productid
                                )?.varient?.varient
                              }
                              | |
                              {
                                productOptions.find(
                                  p => p.id === space.productid
                                )?.quality?.quality
                              }
                              | |
                              {
                                productOptions.find(
                                  p => p.id === space.productid
                                )?.packSize
                              }
                              -
                              {
                                productOptions.find(
                                  p => p.id === space.productid
                                )?.unit?.unit
                              }
                            </td>
                            <td>{space.lotno}</td>
                            <td>
                              {space.storagespace.map((spaceId, index) => (
                                <span key={index}>
                                  {
                                    spaceOptions.find(s => s.id === spaceId)
                                      ?.space
                                  }
                                  {index !== space.storagespace.length - 1 &&
                                    ", "}
                                </span>
                              ))}
                            </td>
                            <td>{space.qty}</td>
                            <td>{space.rate}</td>
                            <td>{space.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="mt-3 text-center">
                  <button
                    type="button"
                    className="btn btn-primary rounded-pill"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
              </form>
            ) : (
              <p>Loading contract data...</p>
            )}
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default DraftContractForProductType;
