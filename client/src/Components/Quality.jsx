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
  Typography,
  Pagination,
  TextField,
  Button,
} from "@mui/material";
import { RingLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function Quality() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const rowsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("http://13.233.231.174/quality/all");
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleSearch = event => {
    setPage(1);
    setSearch(event.target.value);
  };

  const handleAddQuality = () => {
    // Navigate to the '/Quality/AddQuality' route when the 'Add Quality' button is clicked
    navigate("/Quality/AddQuality");
  };

  const handleEdit = id => {
    // Navigate to the '/Quality/EditAddQuality' route when the 'Edit' button is clicked
    navigate(`/Quality/EditAddQuality/${id}`);
  };

  const handleDelete = async id => {
    try {
      await axios.delete(`http://13.233.231.174/quality/delete/${id}`);
      toast.success("Item deleted successfully", {
        onClose: () => window.location.reload(), // Reload the page when the toast is closed
      });
      // You may perform other actions here after successful deletion
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("Failed to delete item");
    }
  };

  const currentRows = data
    .map((row, index) => ({
      ...row,
      serialNo: index + 1 + (page - 1) * rowsPerPage,
    }))
    .filter(
      row =>
        row.serialNo.toString().includes(search.toLowerCase()) ||
        row.varient.varient.toLowerCase().includes(search.toLowerCase()) ||
        row.quality.toLowerCase().includes(search.toLowerCase())
    )
    .slice((page - 1) * rowsPerPage, page * rowsPerPage);

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
            Quality
          </Typography>
        </div>
        <div>
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
            onClick={handleAddQuality}
          >
            Add Quality
          </Button>
        </div>
      </div>
      <TextField
        label="Search by Serial No, Variant, or Quality"
        variant="outlined"
        fullWidth
        value={search}
        onChange={handleSearch}
        style={{ marginBottom: "1rem" }}
      />
      {loading ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <RingLoader color={"#36D7B7"} loading={loading} size={50} />
        </div>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ borderRadius: "12px", margin: "0 0 1rem 0" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Serial No</b>
                </TableCell>
                <TableCell>
                  <b>Variant Name</b>
                </TableCell>
                <TableCell>
                  <b>Quality</b>
                </TableCell>
                <TableCell>
                  <b>Action</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentRows.map(row => (
                <TableRow key={row.id}>
                  <TableCell>{row.serialNo}</TableCell>
                  <TableCell>{row.varient.varient}</TableCell>
                  <TableCell>{row.quality}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      style={{
                        background: "#34b6df",
                        color: "#fff",
                        borderRadius: "8px",
                        "&:hover": {
                          background: "#34b6df",
                        },
                        marginRight: "8px",
                      }}
                      onClick={() => handleEdit(row.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      style={{
                        background: "#e23428",
                        color: "#fff",
                        borderRadius: "8px",
                        "&:hover": {
                          background: "#e23428",
                        },
                      }}
                      onClick={() => handleDelete(row.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {!loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "1rem",
          }}
        >
          <Pagination
            count={Math.ceil(data.length / rowsPerPage)}
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
      )}
      <ToastContainer />
    </div>
  );
}

export default Quality;
