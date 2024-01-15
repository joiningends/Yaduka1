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

const Employee = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [userData, setUserData] = useState([]);
  const [isDeleted, setIsDeleted] = useState(false);
  const rowsPerPage = 5;
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/v1/users/94");
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const navigateToEditPage = id => {
    navigate(`EditEmployee/${id}`);
  };

  useEffect(() => {
    if (isDeleted) {
      toast.success("User deleted successfully!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000, // Toast message duration
      });

      // Reset deletion state after showing the success message
      setIsDeleted(false);

      // Reload the page after a short delay (adjust timing as needed)
      setTimeout(() => {
        window.location.reload();
      }, 2500); // Reload after 2.5 seconds (adjust as needed)
    }
  }, [isDeleted]);

  const handleDelete = async id => {
    try {
      await axios.delete(`http://localhost:5001/api/v1/users/${id}`);
      setIsDeleted(true); // Trigger reload and show success message
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  const currentRows = userData
    .filter(
      row =>
        row.name.toLowerCase().includes(search.toLowerCase()) ||
        row.email.toLowerCase().includes(search.toLowerCase())
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
            Employee
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
            onClick={() => navigate("/employee/AddEmployee")}
          >
            Add Employee
          </Button>
        </div>
      </div>
      <TextField
        label="Search by Name or Email"
        variant="outlined"
        fullWidth
        value={search}
        onChange={event => {
          setPage(1);
          setSearch(event.target.value);
        }}
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
                <b>Name</b>
              </TableCell>
              <TableCell>
                <b>Mobile Number</b>
              </TableCell>
              <TableCell>
                <b>Email</b>
              </TableCell>
              <TableCell>
                <b>Company Name</b>
              </TableCell>
              <TableCell>
                <b>Address</b>
              </TableCell>
              <TableCell>
                <b>Action</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows?.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.mobileNumber}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.companyname}</TableCell>
                <TableCell>{row.address}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    style={{
                      background: "linear-gradient(263deg, #34b6df, #34d0be)",
                      color: "#fff",
                      borderRadius: "8px",
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "1rem",
        }}
      >
        <Pagination
          count={Math.ceil(userData.length / rowsPerPage)}
          page={page}
          onChange={(event, value) => setPage(value)}
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
};

export default Employee;
