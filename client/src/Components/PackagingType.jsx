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
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PackagingType() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [packagingTypes, setPackagingTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const rowsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/v1/unit/all")
      .then(response => {
        setPackagingTypes(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleSearch = event => {
    setPage(1);
    setSearch(event.target.value);
  };

  const handleEditPackagingType = id => {
    navigate(`/packagingtype/editpackagingtype/${id}`);
  };

  const handleDeletePackagingType = id => {
    setLoading(true);
    axios
      .delete(`http://localhost:5001/api/v1/unit/delete/${id}`)
      .then(response => {
        const updatedPackagingTypes = packagingTypes.filter(
          item => item.id !== id
        );
        setPackagingTypes(updatedPackagingTypes);
        toast.success("Packaging type deleted successfully!");
      })
      .catch(error => {
        console.error("Error deleting packaging type:", error);
        toast.error("Failed to delete packaging type.");
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      });
  };

  const handleAddPackagingType = () => {
    // Add logic here to navigate or handle adding a new packaging type
    // For instance:
    navigate("/packagingtype/AddPackagingType");
  };

  const indexOfLastRow = page * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const filteredRows = packagingTypes
    .filter(row => row.unit.toLowerCase().includes(search.toLowerCase()))
    .slice(indexOfFirstRow, indexOfLastRow);

  return (
    <div style={{ margin: "0 1rem" }}>
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
            Packaging Type
          </Typography>
        </div>
        <div>
          <Button
            variant="contained"
            style={{
              background: "linear-gradient(263deg, #34b6df, #34d0be)",
              color: "#fff",
              borderRadius: "8px",
            }}
            onClick={handleAddPackagingType} // Add functionality for adding packaging types
          >
            Add Packaging Type
          </Button>
        </div>
      </div>
      <TextField
        label="Search by Packaging Type"
        variant="outlined"
        fullWidth
        value={search}
        onChange={handleSearch}
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
                <b>Serial No</b>
              </TableCell>
              <TableCell>
                <b>Packaging Type</b>
              </TableCell>
              <TableCell>
                <b>Action</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.unit}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    style={{
                      background: "linear-gradient(263deg, #34b6df, #34d0be)",
                      color: "#fff",
                      borderRadius: "8px",
                    }}
                    onClick={() => handleEditPackagingType(row.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    style={{
                      background: "#e23428",
                      color: "#fff",
                      borderRadius: "8px",
                      marginLeft: "8px",
                    }}
                    onClick={() => handleDeletePackagingType(row.id)}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : "Delete"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
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
          count={Math.ceil(packagingTypes.length / rowsPerPage)}
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
      <ToastContainer />
    </div>
  );
}

export default PackagingType;
