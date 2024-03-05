import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

function AddRequisition() {
  const [currentDate, setCurrentDate] = useState("");
  const [storageOptions, setStorageOptions] = useState([]);
  const [selectedStorageId, setSelectedStorageId] = useState("");
  const [contractOptions, setContractOptions] = useState([]);
  const [selectedContractId, setSelectedContractId] = useState("");
  const [productOptions, setProductOptions] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productQuantities, setProductQuantities] = useState({});
  const [underValue, setUnderValue] = useState("");
  const [partyId, setPartyId] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("id");
  console.log(selectedContractId);

  console.log(userId);
  useEffect(() => {
    const formattedDate = format(new Date(), "dd-MM-yyyy");
    setCurrentDate(formattedDate);

    axios
      .get(
        `http://3.6.248.144/api/v1/contracts/invoices/manufacture/location/${userId}`
      )

      .then(response => {
        console.log(response.data.storageDetails);
        setStorageOptions(response.data.storageDetails);
      })
      .catch(error => {
        console.error("Error fetching storage options:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedStorageId) {
      axios
        .get(
          `http://3.6.248.144/api/v1/contracts/storags/${userId}/${selectedStorageId}`
        )
        .then(response => {
          console.log(response.data);
          setContractOptions(response.data.contractData);
          if (response.data.contractData.length > 0) {
            setUnderValue(response.data.contractData[0].under);
            setPartyId(response.data.contractData[0].partyId);
          }
        })
        .catch(error => {
          console.error("Error fetching contract options:", error);
        });
    }
  }, [selectedStorageId]);

  useEffect(() => {
    if (selectedContractId) {
      axios
        .get(
          `http://3.6.248.144/api/v1/contracts/products/${selectedContractId}`
        )
        .then(response => {
          console.log(response.data);
          setProductOptions(response.data);
        })
        .catch(error => {
          console.error("Error fetching product options:", error);
        });
    }
  }, [selectedContractId]);

  const handleStorageChange = e => {
    setSelectedStorageId(e.target.value);
    setSelectedContractId("");
    setProductOptions([]);
    setSelectedProducts([]);
    setProductQuantities({});
  };

  const handleContractChange = e => {
    setSelectedContractId(e.target.value);
  };

  const handleProductChange = (productId, selected) => {
    setSelectedProducts(prevSelectedProducts => {
      if (selected) {
        return [...prevSelectedProducts, productId];
      } else {
        return prevSelectedProducts.filter(id => id !== productId);
      }
    });

    setProductQuantities(prevQuantities => {
      return { ...prevQuantities, [productId]: 0 };
    });
  };

  const handleRequiredQtyChange = (productId, value) => {
    setProductQuantities(prevQuantities => {
      return { ...prevQuantities, [productId]: value };
    });
  };

  const handleSubmit = e => {
    e.preventDefault();

    const formattedDate = format(new Date(), "yyyy-MM-dd");

    const requestData = {
      date: formattedDate,
      contractId: parseInt(selectedContractId, 10),
      storageId: parseInt(selectedStorageId, 10),
      underValues: underValue,
      partyid: partyId,
      productdetails: selectedProducts.map(productId => ({
        requireqty: parseInt(productQuantities[productId] || 0, 10),
        contractproductid: productId,
      })),
    };
    console.log(requestData);

    axios
      .post(`http://3.6.248.144/api/v1/ref/create/${userId}`, requestData)
      .then(response => {
        console.log("Post request successful:", response.data);
        console.log(response);
        navigate("/Requisition");
      })
      .catch(error => {
        console.error("Error making post request:", error);
        // Handle error, show toast, or perform any other necessary action
      });
  };

  return (
    <div className="container mt-5">
      <div className="col-md-12 col-lg-12 col-xl-12">
        <div className="card" style={{ borderRadius: "2rem" }}>
          <div className="card-header">
            <h4 className="card-title">Add Requisition</h4>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="date" className="form-label">
                  Date
                </label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  id="date"
                  name="date"
                  value={currentDate}
                  disabled
                />
              </div>
              <div className="mb-3">
                <label htmlFor="storage" className="form-label">
                  Storage
                </label>
                <select
                  className="form-control rounded-pill"
                  id="storage"
                  name="storage"
                  onChange={handleStorageChange}
                  value={selectedStorageId}
                >
                  <option value="" disabled>
                    Select Storage
                  </option>
                  {storageOptions.map(storage => (
                    <option key={storage.storageId} value={storage.storageId}>
                      {storage.storageName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="contract" className="form-label">
                  Contract
                </label>
                <select
                  className="form-control rounded-pill"
                  id="contract"
                  name="contract"
                  onChange={handleContractChange}
                  value={selectedContractId}
                >
                  <option value="" disabled>
                    Select Contract
                  </option>
                  {contractOptions.map(contract => (
                    <option
                      key={contract.contractId}
                      value={contract.contractId}
                    >
                      {`${contract.contractname}`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="product" className="form-label">
                  Select Products
                </label>
                <div>
                  {productOptions.map(product => (
                    <div key={product.id} className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`product-${product.id}`}
                        checked={selectedProducts.includes(product.id)}
                        onChange={e =>
                          handleProductChange(product.id, e.target.checked)
                        }
                        key={`checkbox-${product.id}`}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`product-${product.id}`}
                      >
                        {`${product.id} || ${product.product.packSize} ${product.product.quantifiedBy} ${product.product.newUnit}`}
                      </label>
                      {selectedProducts.includes(product.id) && (
                        <div className="ml-3">
                          <div>
                            <strong>Quantity:</strong> {product.qty}
                          </div>
                          <div className="mb-3">
                            <label
                              htmlFor={`required-qty-${product.id}`}
                              className="form-label"
                            >
                              Required Qty
                            </label>
                            <input
                              type="number"
                              className="form-control rounded-pill"
                              id={`required-qty-${product.id}`}
                              value={productQuantities[product.id] || ""}
                              onChange={e =>
                                handleRequiredQtyChange(
                                  product.id,
                                  e.target.value
                                )
                              }
                              max={product.qty}
                              key={`input-${product.id}`}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center">
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
                    background: "linear-gradient(263deg, #34b6df, #34d0be)",
                    marginLeft: "10px",
                  }}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddRequisition;
