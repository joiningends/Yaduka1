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
  Modal,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function Party() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const rowsPerPage = 5;
  const navigate = useNavigate();

  const [isPopupOpen, setPopupOpen] = useState(false);
  const [phoneNumberInput, setPhoneNumberInput] = useState("");
  const [searchResultMessage, setSearchResultMessage] = useState("");
  const [partyData, setPartyData] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("id");
    axios
      .get(`http://localhost:5001/api/v1/users/getparty/${userId}`)
      .then(response => {
        // Sort the data based on createdAt time, newest to oldest
        const sortedData = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPartyData(sortedData);
        console.log(sortedData);
      })
      .catch(error => {
        console.error("Error in API request:", error);
      });
  }, []);

  const editButtonStyle = {
    background: "linear-gradient(263deg, #34b6df, #34d0be)",
    color: "#fff",
    marginRight: "0.5rem",
    borderRadius: "8px",
    "&:hover": {
      background: "linear-gradient(263deg, #34b6df, #34d0be)",
    },
  };

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleEdit = number => {
    navigate(`/Party/EditParty/${number}`);
  };

  const handleSearch = event => {
    setPage(1);
    setSearch(event.target.value);
  };

  const handleAddParty = () => {
    navigate("/Party/AddParty");
  };

  const indexOfLastRow = page * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = partyData
    .filter(
      row =>
        row.party.name.toLowerCase().includes(search.toLowerCase()) ||
        row.party.mobileNumber.toString().includes(search.toLowerCase()) ||
        (row.party.email &&
          row.party.email.toLowerCase().includes(search.toLowerCase())) ||
        (row.party.companyname &&
          row.party.companyname.toLowerCase().includes(search.toLowerCase())) ||
        (row.party.address &&
          row.party.address.toLowerCase().includes(search.toLowerCase()))
    )
    .slice(indexOfFirstRow, indexOfLastRow);

  console.log(currentRows);
  const handleDelete = id => {
    console.log(`Deleting party with ID: ${id}`);

    axios
      .delete(`http://localhost:5001/api/v1/users/${id}`)
      .then(response => {
        console.log("Party deleted successfully:", response.data);

        // Display success toast
        toast.success("Party deleted successfully!");

        // Update the partyData state to reflect the deletion
        const updatedPartyData = partyData.filter(
          party => party.partyid !== id
        );
        setPartyData(updatedPartyData);
      })
      .catch(error => {
        console.error("Error deleting party:", error);

        // Display error toast
        toast.error("Error deleting party. Please try again.");
      });
  };

  const handleSearchClick = () => {
    axios
      .get(`http://localhost:5001/api/v1/users/party/${phoneNumberInput}`)
      .then(response => {
        console.log(response);
        if (response.data.record !== null && response.data) {
          navigate(`/Party/AddParty/${phoneNumberInput}`);
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
            {currentRows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row?.party?.name}</TableCell>
                <TableCell>{row?.party?.mobileNumber}</TableCell>
                <TableCell>{row?.party?.email}</TableCell>
                <TableCell>{row?.party?.companyname}</TableCell>
                <TableCell>{row?.party?.address}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    style={editButtonStyle}
                    onClick={() => handleEdit(row.partyid)}
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
                    onClick={() => handleDelete(row.partyid)}
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
            style={{ marginBottom: "1rem" }}
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
          count={Math.ceil(partyData.length / rowsPerPage)}
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

export default Party;
