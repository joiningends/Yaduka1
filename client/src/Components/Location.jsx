import React, { useState } from "react";
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

const Location = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const rowsPerPage = 5;
  const navigate = useNavigate();

  // Sample data for the table (Locations)
  const locations = [
    {
      id: 1,
      storageName: "Storage A",
      address: "123 Main St",
      rentable: true,
    },
    {
      id: 2,
      storageName: "Storage B",
      address: "456 Broadway",
      rentable: false,
    },
    // Add more location data as needed
  ];

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

  const handleSearch = (event) => {
    setPage(1);
    setSearch(event.target.value);
  };

  const handleAddLocation = () => {
    navigate("/location/AddLocation");
  };

  const indexOfLastLocation = page * rowsPerPage;
  const indexOfFirstLocation = indexOfLastLocation - rowsPerPage;
  const currentLocations = locations
    .filter(
      (location) =>
        location.storageName.toLowerCase().includes(search.toLowerCase()) ||
        location.address.toLowerCase().includes(search.toLowerCase())
    )
    .slice(indexOfFirstLocation, indexOfLastLocation);

  const handleDelete = (id) => {
    console.log(`Deleting location with ID: ${id}`);
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
            </TableRow>
          </TableHead>
          <TableBody>
            {currentLocations.map((location, index) => (
              <TableRow key={location.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{location.storageName}</TableCell>
                <TableCell>{location.address}</TableCell>
                <TableCell>{location.rentable ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <Button variant="contained" style={addButtonStyle}>
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
                    onClick={() => handleDelete(location.id)}
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
    </div>
  );
};

export default Location;
