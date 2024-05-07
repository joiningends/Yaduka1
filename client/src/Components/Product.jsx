import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Pagination, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Product = () => {
  const [page, setPage] = useState(1);
  const [commodities, setCommodities] = useState([]);
  const [addProductClicked, setAddProductClicked] = useState(false);
  const rowsPerPage = 6; // Set rows per page to 6
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/v1/commodity/all1")
      .then(response => {
        console.log(response.data);
        setCommodities(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    if (addProductClicked) {
      navigate("/Product/AddProduct");
    }
  }, [addProductClicked, navigate]);

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleCommodityClick = commodityId => {
    navigate(`/Product/VariantDetails/${commodityId}`);
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4rem", // Increased gap between rows
          maxWidth: "1250px",
          margin: "0 auto", // Center container
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0rem" }}>
          {currentRows.map((commodity, index) => (
            <ProductCard key={commodity.id} commodity={commodity} />
          ))}
        </div>
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

const ProductCard = ({ commodity }) => {
  const navigate = useNavigate();

  const handleCommodityClick = commodityId => {
    navigate(`/Product/VariantDetails/${commodityId}`);
  };

  if (!commodity) {
    // Render an empty div if commodity is null
    return <div style={{ width: "200px" }} />;
  }

  return (
    <div
      style={{
        margin: "0.5rem",
        marginRight: "1.5rem", // Increased right margin
        textAlign: "center",
        width: "300px",
        height: "320px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s",
        "&:hover": {
          transform: "scale(1.05)",
        },
      }}
    >
      <div
        style={{
          width: "100%",
          height: "200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          borderRadius: "8px 8px 0 0", // Rounded corners for the top
        }}
      >
        <img
          src={commodity.image}
          alt={commodity?.commodity}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          onError={e => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/200x200?text=No+Image";
          }}
          onClick={() => handleCommodityClick(commodity?.id)}
        />
      </div>
      <div style={{ padding: "1rem" }}>
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
    </div>
  );
};

export default Product;
