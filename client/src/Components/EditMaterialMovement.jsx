import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { Button, TextField, Typography, Pagination } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditMaterialMovement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [materialData, setMaterialData] = useState([]);
  console.log(materialData);
  const [deliveryQuantities, setDeliveryQuantities] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);

  const productsPerPage = 5;
  const pagesVisited = pageNumber * productsPerPage;

  useEffect(() => {
    const fetchMaterialData = async () => {
      try {
        const response = await axios.get(
          `http://13.235.51.98/api/v1/ref/getById/${id}`
        );
        setMaterialData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching material data:", error);
      }
    };

    fetchMaterialData();
  }, [id]);

  const handleDeliveryQtyChange = (productId, event) => {
    const newDeliveryQty = parseInt(event.target.value, 10) || 0; // Parse the input value as an integer, default to 0 if not a valid number
    const requiredQty =
      materialData.find(data => data.id === productId)?.requireqty || 0;

    // Ensure the new delivery quantity is within the required quantity limit
    const validDeliveryQty = Math.min(newDeliveryQty, requiredQty);

    // Update the deliveryQuantities object with the valid value
    setDeliveryQuantities(prevQuantities => ({
      ...prevQuantities,
      [productId]: validDeliveryQty,
    }));
  };

  const handleCheckboxChange = productId => {
    const updatedSelectedProducts = selectedProducts.includes(productId)
      ? selectedProducts.filter(id => id !== productId)
      : [...selectedProducts, productId];

    setSelectedProducts(updatedSelectedProducts);
  };

  const renderMaterialData = () => {
    return materialData
      .slice(pagesVisited, pagesVisited + productsPerPage)
      .map(data => (
        <div key={data.id} className="card mb-3">
          <div className="card-body">
            <div className="form-check">
              <input
                type="checkbox"
                id={`productCheckbox-${data.id}`}
                className="form-check-input"
                checked={selectedProducts.includes(data.id)}
                onChange={() => handleCheckboxChange(data.id)}
              />
              <label
                htmlFor={`productCheckbox-${data.id}`}
                className="form-check-label"
              >
                {`${data.contractproduct?.product?.commodity?.commodity} | ${data.contractproduct?.product?.varient?.varient} | ${data.contractproduct?.product?.quality?.quality} | ${data.contractproduct?.product?.size?.size} | ${data?.contractproduct?.product?.unit?.unit}`}
              </label>
            </div>
            {selectedProducts.includes(data.id) && (
              <>
                <div className="mb-3">
                  <label
                    htmlFor={`availableQty-${data.id}`}
                    className="form-label"
                  >
                    Available Quantity:
                  </label>
                  <p id={`availableQty-${data.id}`} className="form-control">
                    {data.contractproduct.qty}
                  </p>
                </div>
                <div className="mb-3">
                  <label
                    htmlFor={`availableQty-${data.id}`}
                    className="form-label"
                  >
                    Required Quantity:
                  </label>
                  <p id={`requiredQty-${data.id}`} className="form-control">
                    {data.requireqty}
                  </p>
                </div>
                <div className="mb-3">
                  <label
                    htmlFor={`deliveryQty-${data.id}`}
                    className="form-label"
                  >
                    Delivery Quantity:
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id={`deliveryQty-${data.id}`}
                    name={`deliveryQty-${data.id}`}
                    value={deliveryQuantities[data.id] || ""}
                    onChange={event => handleDeliveryQtyChange(data.id, event)}
                    max={data.requireqty}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      ));
  };

  const pageCount = Math.ceil(materialData.length / productsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const handleSubmit = async () => {
    try {
      const deliveryData = selectedProducts.map(productId => ({
        id: productId,
        deliveryQty: deliveryQuantities[productId],
      }));

      const response = await axios.put(
        "http://13.235.51.98/api/v1/ref",
        deliveryData
      );

      console.log("PUT Response:", response.data);

      // Navigate to /MaterialMovement on successful PUT request
      navigate("/MaterialMovement");
    } catch (error) {
      console.error("PUT Error:", error.message);
    }
  };

  const handleCancel = () => {
    // Navigate to /MaterialMovement on cancel
    navigate("/MaterialMovement");
  };

  return (
    <div className="container mt-5">
      <div className="col-md-12 col-lg-12 col-xl-12">
        <div className="card" style={{ borderRadius: "2rem" }}>
          <div className="card-header">
            <Typography variant="h4" fontWeight="bold" fontFamily="Poppins">
              Edit Material Movement
            </Typography>
          </div>
          <div className="card-body">
            <form>
              {renderMaterialData()}
              <div className="text-center">
                <ReactPaginate
                  previousLabel={"Previous"}
                  nextLabel={"Next"}
                  pageCount={pageCount}
                  onPageChange={changePage}
                  containerClassName={"pagination justify-content-center"}
                  previousLinkClassName={"page-link"}
                  nextLinkClassName={"page-link"}
                  disabledClassName={"page-item disabled"}
                  activeClassName={"page-item active"}
                  pageClassName={"page-item"}
                  pageLinkClassName={"page-link"}
                />
                <Button
                  variant="contained"
                  sx={{
                    background: "linear-gradient(263deg, #34b6df, #34d0be)",
                    color: "#fff",
                    borderRadius: "8px",
                    "&:hover": {
                      background: "linear-gradient(263deg, #34b6df, #34d0be)",
                    },
                    marginTop: "1rem",
                    marginRight: "0.5rem",
                  }}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    background: "linear-gradient(263deg, #e23428, #eb5b5b)",
                    color: "#fff",
                    borderRadius: "8px",
                    "&:hover": {
                      background: "linear-gradient(263deg, #e23428, #eb5b5b)",
                    },
                    marginTop: "1rem",
                  }}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default EditMaterialMovement;
