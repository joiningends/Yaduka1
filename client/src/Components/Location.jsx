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
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Location = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [locations, setLocations] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const [openToast, setOpenToast] = useState(false);
  const rowsPerPage = 5;
  const navigate = useNavigate();

  const userId = localStorage.getItem("id");

  useEffect(() => {
    axios
      .get(`https://www.keepitcool.app/api/v1/location/${userId}`)
      .then(response => {
        // Sort the locations array based on createdAt time
        const sortedLocations = response.data.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setLocations(sortedLocations);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, [userId]);

  const addButtonStyle = {
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

  const handleSearch = event => {
    setPage(1);
    setSearch(event.target.value);
  };

  const handleAddLocation = () => {
    navigate("/Location/AddLocation");
  };

  const indexOfLastLocation = page * rowsPerPage;
  const indexOfFirstLocation = indexOfLastLocation - rowsPerPage;
  const currentLocations = locations
    .filter(
      location =>
        location.storagename.toLowerCase().includes(search.toLowerCase()) ||
        location.address.toLowerCase().includes(search.toLowerCase())
    )
    .slice(indexOfFirstLocation, indexOfLastLocation);

  const handleDelete = id => {
    axios
      .delete(`https://www.keepitcool.app/api/v1/location/${id}`)
      .then(() => {
        setLocations(prevLocations =>
          prevLocations.filter(location => location.id !== id)
        );
        setToastMessage("Location deleted successfully!");
        setOpenToast(true);
      })
      .catch(error => {
        setToastMessage("Error deleting location. Please try again.");
        setOpenToast(true);
        console.error("Error deleting location:", error);
      });
  };

  const handleToastClose = () => {
    setOpenToast(false);
  };

  const handleEdit = id => {
    navigate(`/Location/EditLocation/${id}`);
  };

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
            Location
          </Typography>
        </div>
        <div>
          <Button
            variant="contained"
            style={addButtonStyle}
            onClick={handleAddLocation}
          >
            Add Location
          </Button>
        </div>
      </div>
      <TextField
        label="Search by Storage Name or Address"
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
                <b>Storage Name</b>
              </TableCell>
              <TableCell>
                <b>Address</b>
              </TableCell>
              <TableCell>
                <b>Rentable</b>
              </TableCell>
              <TableCell>
                <b>Action</b>
              </TableCell>
              {/* <TableCell> */}
              {/* <b>Action</b>
              </TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {currentLocations.map((location, index) => (
              <TableRow key={location.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{location.storagename}</TableCell>
                <TableCell>{location.address}</TableCell>
                <TableCell>{location.rantable ? "Yes" : "No"}</TableCell>
                {/* <TableCell>
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
                    onClick={() => handleDelete(location.id)}
                  >
                    Delete
                  </Button>
                </TableCell> */}
                <TableCell>
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
                    onClick={() => handleEdit(location.id)}
                  >
                    Edit
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
          count={Math.ceil(locations.length / rowsPerPage)}
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
      <Snackbar
        open={openToast}
        autoHideDuration={6000}
        onClose={handleToastClose}
        message={toastMessage}
      />
    </div>
  );
};

export default Location;
