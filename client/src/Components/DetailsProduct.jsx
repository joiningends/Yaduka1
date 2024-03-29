import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function DetailsProduct() {
  const { id } = useParams();
  const [productDetails, setProductDetails] = useState(null);
  const [concatenatedValue, setConcatenatedValue] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://3.6.248.144/api/v1/contracts/contract-products/${id}`
        );
        setProductDetails(response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (productDetails && productDetails[0]) {
      console.log(productDetails[0]);
      const { product } = productDetails[0];
      console.log(product);
      if (product !== null) {
        const { commodity, varient, unit } = product;
        console.log();
        setConcatenatedValue(
          `${commodity?.commodity} | ${varient?.varient} || ${unit?.unit}`
        );
      }
    }
  }, [productDetails]);

  if (!productDetails || !productDetails[0]) {
    return <div>Loading...</div>;
  }

  const columns = ["Name", "Quantity", "Rate", "Amount"];
  const data = productDetails?.map(detail => ({
    Name: concatenatedValue,
    Quantity: detail.qty,
    Rate: detail.rate,
    Amount: detail.amount,
  }));

  return (
    <div className="container mt-5">
      <div className="col-md-12 col-lg-12 col-xl-12">
        <div className="card" style={{ borderRadius: "2rem" }}>
          <div className="card-header">
            <h4 className="card-title">Product Details</h4>
          </div>
          <div className="card-body">
            <table className="table">
              <thead>
                <tr>
                  {columns?.map((column, index) => (
                    <th key={index}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {columns?.map((column, colIndex) => (
                      <td key={colIndex}>{row[column]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailsProduct;
