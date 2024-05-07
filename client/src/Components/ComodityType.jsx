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
import { Oval } from "react-loader-spinner";

const CommodityType = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const rowsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/v1/commoditytype/all")
      .then(response => {
        // Sort the data based on createdAt time from new to old
        const sortedData = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setRows(sortedData);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const handleSearch = event => {
    setPage(1);
    setSearch(event.target.value);
  };

  const handleAddCommodityType = () => {
    navigate("/CommodityType/AddCommodityType");
  };

  const handleDeleteCommodityType = id => {
    axios
      .delete(`http://localhost:5001/api/v1/commodityType/delete/${id}`)
      .then(response => {
        console.log(`Commodity type with ID ${id} has been deleted.`);
        toast.success("Commodity type deleted successfully!");
        axios
          .get("http://localhost:5001/api/v1/commoditytype/all")
          .then(response => {
            setRows(response.data);
            window.location.reload();
          })
          .catch(error => {
            console.error("Error fetching data:", error);
          });
      })
      .catch(error => {
        console.error(`Error deleting commodity type with ID ${id}:`, error);
        toast.error("Failed to delete commodity type!");
      });
  };

  const handleEditCommodityType = id => {
    navigate(`/CommodityType/EditCommodityType/${id}`);
  };

  const handleChange = (event, value) => {
    setPage(value);
  };

  const indexOfLastRow = page * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = rows
    .filter(row =>
      row?.commodityType.toLowerCase().includes(search.toLowerCase())
    )
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
            Commodity Type
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
            onClick={handleAddCommodityType}
          >
            Add Commodity Type
          </Button>
        </div>
      </div>
      <TextField
        label="Search by Commodity Type"
        variant="outlined"
        fullWidth
        value={search}
        onChange={handleSearch}
        style={{ marginBottom: "1rem" }}
      />
      {loading ? (
        <div
          style={{ display: "flex", justifyContent: "center", margin: "2rem" }}
        >
          <Oval color="#00BFFF" height={50} width={50} />
        </div>
      ) : (
        <>
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
                    <b>Commodity Type</b>
                  </TableCell>
                  <TableCell>
                    <b>Actions</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentRows?.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row?.commodityType}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        style={{
                          background:
                            "linear-gradient(263deg, #34b6df, #34d0be)",
                          color: "#fff",
                          borderRadius: "8px",
                          marginRight: "8px",
                          "&:hover": {
                            background:
                              "linear-gradient(263deg, #34b6df, #34d0be)",
                          },
                        }}
                        onClick={() => handleEditCommodityType(row.id)}
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
                        onClick={() => handleDeleteCommodityType(row.id)}
                      >
                        Delete
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
              count={Math.ceil(
                rows.filter(row =>
                  row?.commodityType
                    .toLowerCase()
                    .includes(search.toLowerCase())
                ).length / rowsPerPage
              )}
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
        </>
      )}
    </div>
  );
};

export default CommodityType;
