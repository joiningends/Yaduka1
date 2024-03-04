import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Pagination } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Product = () => {
  const [page, setPage] = useState(1);
  const [commodities, setCommodities] = useState([]);
  const rowsPerPage = 3;
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://13.233.231.174/commodity/all1")
      .then(response => {
        setCommodities(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleCommodityClick = commodityId => {
    navigate(`/product/productVariant/${commodityId}`);
  };

  const indexOfLastRow = page * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = commodities.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <div style={{ margin: "0 1rem" }}>
      <Typography variant="h4" fontWeight="bold" fontFamily="Poppins">
        Product
      </Typography>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {currentRows.map(commodity => (
          <div
            key={commodity.id}
            style={{ margin: "0.5rem", textAlign: "center" }}
          >
            <img
              src={`http://localhost:5001/images/${commodity.image}.jpg`}
              alt={commodity.commodity}
              style={{
                maxWidth: "200px",
                maxHeight: "150px",
                width: "100%",
                height: "auto",
                marginBottom: "0.5rem",
              }}
              onClick={() => handleCommodityClick(commodity.id)}
            />
            <Typography
              variant="body1"
              style={{ cursor: "pointer", fontWeight: "bold" }}
              onClick={() => handleCommodityClick(commodity.id)}
            >
              {commodity.commodity}
            </Typography>
            <Typography variant="body2">
              {commodity.commodityType.commodityType}
            </Typography>
          </div>
        ))}
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}
      >
        <Pagination
          count={Math.ceil(commodities.length / rowsPerPage)}
          page={page}
          onChange={handleChange}
          color="primary"
          sx={{
            "& .MuiPaginationItem-root": {
              background: "linear-gradient(263deg, #34b6df, #34d0be)",
              color: "#fff",
            },
            "& .Mui-selected": {
              background: "linear-gradient(263deg, #34b6df, #34d0be)",
              color: "#fff",
            },
          }}
        />
      </div>
    </div>
  );
};

export default Product;
