import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Pagination,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Commodity = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [commodities, setCommodities] = useState([]);
  const rowsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://3.6.248.144/api/v1/commodity/all")
      .then(response => {
        // Sort the data based on createdAt time
        const sortedData = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setCommodities(sortedData);
        console.log(sortedData);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const buttonStyle = {
    background: "linear-gradient(263deg, #34b6df, #34d0be)",
    color: "#fff",
    borderRadius: "8px",
    "&:hover": {
      background: "linear-gradient(263deg, #34b6df, #34d0be)",
    },
  };

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleCommoditySearch = event => {
    setPage(1);
    setSearch(event.target.value);
  };

  const handleDelete = id => {
    axios
      .delete(`http://3.6.248.144/api/v1/commodity/delete/${id}`)
      .then(response => {
        toast.success("Commodity deleted successfully");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch(error => {
        console.error("Error deleting commodity:", error);
        toast.error("Failed to delete commodity");
      });
  };

  const filteredRows = commodities.filter(
    row =>
      row.commodity.toLowerCase().includes(search.toLowerCase()) ||
      (row.commodityType &&
        row.commodityType.commodityType &&
        row.commodityType.commodityType
          .toLowerCase()
          .includes(search.toLowerCase()))
  );

  const indexOfLastRow = page * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredRows.slice(indexOfFirstRow, indexOfLastRow);

  const tableBody = (
    <TableBody>
      {currentRows?.map((commodity, index) => (
        <TableRow key={commodity.id}>
          <TableCell>{index + 1}</TableCell>
          <TableCell>{commodity.commodity}</TableCell>
          <TableCell>
            {commodity.commodityType
              ? commodity.commodityType.commodityType
              : ""}
          </TableCell>
          <TableCell>
            <Button
              variant="contained"
              style={buttonStyle}
              onClick={() =>
                navigate(`/Commodity/EditCommodity/${commodity.id}`)
              }
            >
              Edit
            </Button>

            <Button
              variant="contained"
              style={{
                ...buttonStyle,
                background: "#e23428",
                marginLeft: "8px",
              }}
              onClick={() => handleDelete(commodity.id)}
            >
              Delete
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );

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
        <div>
          <Typography variant="h4" fontWeight="bold" fontFamily="Poppins">
            Commodity
          </Typography>
        </div>
        <div>
          <Button
            variant="contained"
            style={buttonStyle}
            onClick={() => navigate("/Commodity/AddCommodity")}
          >
            Add Commodity
          </Button>
        </div>
      </div>
      <TextField
        label="Search by Commodity"
        variant="outlined"
        fullWidth
        value={search}
        onChange={handleCommoditySearch}
        style={{ marginBottom: "1rem" }}
      />
      <TableContainer
        component={Paper}
        sx={{ borderRadius: "12px", margin: "0 0 1rem 0" }}
      >
        <Table sx={{ borderRadius: "12px" }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Sno</b>
              </TableCell>
              <TableCell>
                <b>Commodity</b>
              </TableCell>
              <TableCell>
                <b>Commodity Type</b>
              </TableCell>
              <TableCell>
                <b>Action</b>
              </TableCell>
            </TableRow>
          </TableHead>
          {tableBody}
        </Table>
      </TableContainer>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "1rem",
        }}
      >
        <Pagination
          count={Math.ceil(filteredRows.length / rowsPerPage)}
          page={page}
          onChange={handleChange}
          shape="rounded"
          color="primary"
          sx={{
            "& .Mui-selected": {
              background: "linear-gradient(263deg, #34b6df, #34d0be)",
              color: "#fff",
            },
          }}
        />
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Commodity;
