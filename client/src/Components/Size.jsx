import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Size() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://3.6.248.144/api/v1/size/all")
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data");
      });
  }, []);

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleSearch = event => {
    setSearch(event.target.value);
  };

  const handleAddSize = () => {
    navigate("/Size/AddSize");
  };

  const navigateToEditPage = id => {
    navigate(`EditSize/${id}`);
  };

  const handleDelete = id => {
    axios
      .delete(`http://3.6.248.144/api/v1/size/delete/${id}`)
      .then(() => {
        setData(data.filter(item => item.id !== id));
        toast.success("Item deleted successfully");
      })
      .catch(error => {
        console.error("Error deleting item:", error);
        toast.error(`Error deleting item with ID ${id}`);
      });
  };

  const indexOfLastRow = page * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const filteredData = data.filter(
    row =>
      row.varient.varient.toLowerCase().includes(search.toLowerCase()) ||
      row.size.toString().includes(search.toLowerCase())
  );
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

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
            Size
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
            onClick={handleAddSize}
          >
            Add Size
          </Button>
        </div>
      </div>
      <TextField
        label="Search by Variant Name or Size"
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
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "2rem",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <Table sx={{ borderRadius: "12px" }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Sno</b>
                </TableCell>
                <TableCell>
                  <b>Variant Name</b>
                </TableCell>
                <TableCell>
                  <b>Size</b>
                </TableCell>
                <TableCell>
                  <b>Action</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentRows.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.varient.varient}</TableCell>
                  <TableCell>{row.size}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      style={{
                        background: "linear-gradient(263deg, #34b6df, #34d0be)",
                        color: "#fff",
                        borderRadius: "8px",
                        "&:hover": {
                          background:
                            "linear-gradient(263deg, #34b6df, #34d0be)",
                        },
                      }}
                      onClick={() => navigateToEditPage(row.id)}
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
        )}
      </TableContainer>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "1rem",
        }}
      >
        <Pagination
          count={Math.ceil(filteredData.length / rowsPerPage)}
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
}

export default Size;
