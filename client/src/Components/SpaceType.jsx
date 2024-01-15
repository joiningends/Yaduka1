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

function SpaceType() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const rowsPerPage = 5;
  const navigate = useNavigate();

  // Your SpaceType data
  const SpaceTypes = [
    {
      id: 1,
      type: "Type A",
      description: "Description A",
    },
    {
      id: 2,
      type: "Type B",
      description: "Description B",
    },
    // Add more storage types as needed
  ];

  const editButtonStyle = {
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

  const handleAddSpaceType = () => {
    // Add functionality to navigate to Add SpaceType page
    navigate("/SpaceType/AddSpaceType");
  };

  const indexOfLastRow = page * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentSpaceTypes = SpaceTypes.filter(SpaceType =>
    SpaceType.type.toLowerCase().includes(search.toLowerCase())
  ).slice(indexOfFirstRow, indexOfLastRow);

  const handleDelete = id => {
    // Logic to handle delete functionality
    console.log(`Deleting storage type with ID: ${id}`);
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
            SpaceType
          </Typography>
        </div>
        <div>
          <Button
            variant="contained"
            style={editButtonStyle}
            onClick={handleAddSpaceType}
          >
            Add SpaceType
          </Button>
        </div>
      </div>
      <TextField
        label="Search by Type"
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
                <b>Type</b>
              </TableCell>
              <TableCell>
                <b>Action</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentSpaceTypes.map((SpaceType, index) => (
              <TableRow key={SpaceType.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{SpaceType.type}</TableCell>
                <TableCell>
                  <Button variant="contained" style={editButtonStyle}>
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
                    onClick={() => handleDelete(SpaceType.id)}
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
          count={Math.ceil(SpaceTypes.length / rowsPerPage)}
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

export default SpaceType;
