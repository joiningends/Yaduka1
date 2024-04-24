import React, { useState, useEffect } from "react";
import axios from "axios";
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
import { ToastContainer, toast } from "react-toastify";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";

import "react-toastify/dist/ReactToastify.css";

const Variant = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [variantData, setVariantData] = useState([]);
  const [loading, setLoading] = useState(false);
  const rowsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://3.6.248.144/api/v1/varient/all")
      .then(response => {
        // Sort the data based on createdAt time, newest to oldest
        const sortedData = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setVariantData(sortedData);
        console.log(sortedData);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleSearch = event => {
    setPage(1);
    setSearch(event.target.value);
  };

  const handleEdit = id => {
    navigate(`/Variant/AddVariant/${id}`);
  };

  const handleDelete = id => {
    setLoading(true);
    axios
      .delete(`http://3.6.248.144/api/v1/varient/delete/${id}`)
      .then(response => {
        console.log(`Variant with ID ${id} deleted successfully`);
        toast.success("Variant deleted successfully!");

        setVariantData(prevData =>
          prevData.filter(variant => variant.id !== id)
        );
      })
      .catch(error => {
        console.error(`Error deleting variant with ID ${id}:`, error);
        toast.error("Error deleting variant. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const indexOfFirstRow = (page - 1) * rowsPerPage;
  const indexOfLastRow = page * rowsPerPage;

  const currentVariants = variantData
    .filter(
      variant =>
        variant.varient &&
        variant.varient.toLowerCase().includes(search.toLowerCase())
    )
    .slice(indexOfFirstRow, indexOfLastRow);

  return (
    <div style={{ margin: "0 1rem" }}>
      <ToastContainer />
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
            Variant
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
            onClick={() => {
              navigate("/Variant/AddVariant");
            }}
          >
            Add Variant
          </Button>
        </div>
      </div>
      <TextField
        label="Search by Variant"
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
                <b>Variant</b>
              </TableCell>
              <TableCell>
                <b>Commodity</b>
              </TableCell>
              <TableCell>
                <b>Crop Duration</b>
              </TableCell>
              <TableCell>
                <b>Action</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} style={{ textAlign: "center" }}>
                  <ClipLoader color="#36D7B7" loading={loading} size={30} />
                </TableCell>
              </TableRow>
            ) : (
              currentVariants.map((variant, index) => (
                <TableRow key={variant.id}>
                  <TableCell>{indexOfFirstRow + index + 1}</TableCell>
                  <TableCell>{variant.varient}</TableCell>
                  <TableCell>{variant.commodity.commodity}</TableCell>
                  <TableCell>{variant.cropDuration}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      style={{
                        background: "linear-gradient(263deg, #34b6df, #34d0be)",
                        color: "#fff",
                        borderRadius: "8px",
                        marginRight: "8px",
                      }}
                      onClick={() => handleEdit(variant.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      style={{
                        background: "#e23428",
                        color: "#fff",
                        borderRadius: "8px",
                      }}
                      onClick={() => handleDelete(variant.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
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
          count={Math.ceil(variantData.length / rowsPerPage)}
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
    </div>
  );
};

export default Variant;
