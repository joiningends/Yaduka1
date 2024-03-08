import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Pagination, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Product = () => {
  const [page, setPage] = useState(1);
  const [commodities, setCommodities] = useState([]);
  const [addProductClicked, setAddProductClicked] = useState(false);
  const rowsPerPage = 3;
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://3.6.248.144/api/v1/commodity/all1")
      .then(response => {
        setCommodities(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    if (addProductClicked) {
      navigate("/product/AddProduct");
    }
  }, [addProductClicked, navigate]);

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleCommodityClick = commodityId => {
    navigate(`/product/productVariant/${commodityId}`);
  };

  const handleAddProductClick = () => {
    setAddProductClicked(true);
  };

  const handleProductSearch = event => {
    setPage(1);
    setSearch(event.target.value);
  };

  const indexOfLastRow = page * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const filteredRows = commodities.filter(commodity =>
    commodity.commodity.toLowerCase().includes(search.toLowerCase())
  );
  const currentRows = filteredRows.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <div
      style={{
        margin: "0 1rem",
        backgroundColor: "#f4f4f4",
        minHeight: "100vh",
        padding: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "1rem 0",
        }}
      >
        <Typography variant="h4" fontWeight="bold" fontFamily="Poppins">
          Product
        </Typography>
        <Button
          variant="contained"
          style={{
            background: "linear-gradient(263deg, #34b6df, #34d0be)",
            color: "#fff",
            borderRadius: "8px",
            "&:hover": {
              background: "linear-gradient(263deg, #34b6df, #34d0be)",
            },
          }}
          onClick={handleAddProductClick}
        >
          Add Product
        </Button>
      </div>
      <TextField
        label="Search by Product"
        variant="outlined"
        fullWidth
        value={search}
        onChange={handleProductSearch}
        style={{ marginBottom: "1rem" }}
      />
      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "1rem" }}>
        {currentRows?.map(commodity => (
          <div
            key={commodity.id}
            style={{ margin: "0.5rem", textAlign: "center" }}
          >
            <img
              src={`http://localhost:5001/images/${commodity.image}.jpg`}
              alt={commodity?.commodity}
              style={{
                maxWidth: "200px",
                maxHeight: "150px",
                width: "100%",
                height: "auto",
                marginBottom: "0.5rem",
              }}
              onClick={() => handleCommodityClick(commodity?.id)}
            />
            <Typography
              variant="body1"
              style={{ cursor: "pointer", fontWeight: "bold" }}
              onClick={() => handleCommodityClick(commodity.id)}
            >
              {commodity?.commodity}
            </Typography>
            <Typography variant="body2">
              {commodity?.commodityType?.commodityType}
            </Typography>
          </div>
        ))}
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}
      >
        <Pagination
          count={Math.ceil(filteredRows.length / rowsPerPage)}
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
