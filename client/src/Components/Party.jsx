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
  Modal,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Party() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const rowsPerPage = 5;
  const navigate = useNavigate();

  const [isPopupOpen, setPopupOpen] = useState(false);
  const [phoneNumberInput, setPhoneNumberInput] = useState("");
  const [searchResultMessage, setSearchResultMessage] = useState("");

  const rows = [
    {
      id: 1,
      name: "Party A",
      phoneNumber: "91-12345-67890",
      email: "partyA@example.com",
      companyName: "Party Co.",
      companyAddress: "123 Party St",
    },
    {
      id: 2,
      name: "Party B",
      phoneNumber: "91-98765-43210",
      email: "partyB@example.com",
      companyName: "Celebration Corp.",
      companyAddress: "456 Festive Ave",
    },
    // Add more dummy data as needed
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

  const handleAddParty = () => {
    navigate("/party/AddParty");
  };

  const indexOfLastRow = page * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = rows
    .filter(
      row =>
        row.name.toLowerCase().includes(search.toLowerCase()) ||
        row.phoneNumber.toLowerCase().includes(search.toLowerCase()) ||
        row.email.toLowerCase().includes(search.toLowerCase()) ||
        row.companyName.toLowerCase().includes(search.toLowerCase()) ||
        row.companyAddress.toLowerCase().includes(search.toLowerCase())
    )
    .slice(indexOfFirstRow, indexOfLastRow);

  const handleDelete = id => {
    console.log(`Deleting party with ID: ${id}`);
  };

  const handleSearchClick = () => {
    axios
      .get(`http://13.233.231.174/users/party/${phoneNumberInput}`)
      .then(response => {
        console.log(response);
        if (response.data.record !== null && response.data) {
          navigate(`/party/AddParty/${phoneNumberInput}`);
          console.log("hello");
        } else {
          setSearchResultMessage("No phone number found in records.");
        }
      })
      .catch(error => {
        console.error("Error in API request:", error);
        setSearchResultMessage("Error in API request.");
      });
  };

  const handleCancelSearch = () => {
    setPopupOpen(false);
    setPhoneNumberInput("");
    setSearchResultMessage("");
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
            Party
          </Typography>
        </div>
        <div>
          <Button
            variant="contained"
            style={editButtonStyle}
            onClick={handleAddParty}
          >
            Add Party
          </Button>
          <Button
            variant="contained"
            style={editButtonStyle}
            onClick={() => setPopupOpen(true)}
          >
            Search
          </Button>
        </div>
      </div>
      <TextField
        label="Search by Name, Phone, Email, Company Name, or Address"
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
                <b>Sno</b>
              </TableCell>
              <TableCell>
                <b>Name</b>
              </TableCell>
              <TableCell>
                <b>Phone Number</b>
              </TableCell>
              <TableCell>
                <b>Email</b>
              </TableCell>
              <TableCell>
                <b>Company Name</b>
              </TableCell>
              <TableCell>
                <b>Company Address</b>
              </TableCell>
              <TableCell>
                <b>Action</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.phoneNumber}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.companyName}</TableCell>
                <TableCell>{row.companyAddress}</TableCell>
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

      <Modal open={isPopupOpen} onClose={handleCancelSearch}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
          }}
        >
          <TextField
            label="Enter Phone Number"
            variant="outlined"
            fullWidth
            value={phoneNumberInput}
            onChange={e => setPhoneNumberInput(e.target.value)}
          />
          <Button
            variant="contained"
            style={editButtonStyle}
            onClick={handleSearchClick}
          >
            Search
          </Button>
          <Button onClick={handleCancelSearch}>Cancel</Button>
          <Typography color="error">{searchResultMessage}</Typography>
        </Box>
      </Modal>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "1rem",
        }}
      >
        <Pagination
          count={Math.ceil(rows.length / rowsPerPage)}
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

export default Party;
