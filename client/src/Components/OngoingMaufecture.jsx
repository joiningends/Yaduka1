import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

function OngoingMaufecture() {
  const [contracts, setContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Retrieve userId from local storage
  const userId = localStorage.getItem("id");

  useEffect(() => {
    setLoading(true);

    // Fetch ongoing contracts for a specific user
    axios
      .get(`http://3.6.248.144/api/v1/contracts/get/allongoing/${userId}`)
      .then(response => {
        setContracts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching ongoing contracts:", error);
        setLoading(false);
      });
  }, [userId]);

  useEffect(() => {
    // Filter contracts based on search term
    const filtered = contracts.filter(
      contract =>
        contract.storagetype.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.partyuser.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        contract.location.storagename
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );

    setFilteredContracts(filtered);
  }, [searchTerm, contracts]);

  const handleViewContract = (contractId, storagetype) => {
    const lowercaseStorageType = storagetype.toLowerCase();

    if (lowercaseStorageType === "product") {
      navigate(`/Ongoing/OngoingByProduct/${contractId}`);
    } else if (lowercaseStorageType === "area") {
      navigate(`/Ongoing/OngoingByArea/${contractId}`);
    } else {
      // Add more conditions for other storage types if needed
      console.log(`Unsupported storage type: ${lowercaseStorageType}`);
    }
  };

  return (
    <div style={{ margin: "0 1rem" }}>
      <Typography variant="h4" fontWeight="bold" fontFamily="Poppins">
        Ongoing Contracts
      </Typography>

      <TextField
        label="Search by Storage Type, Party Name, or Storage Name"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ margin: "1rem 0" }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {loading ? (
        <div
          style={{ display: "flex", justifyContent: "center", padding: "2rem" }}
        >
          <CircularProgress />
        </div>
      ) : filteredContracts.length > 0 ? (
        <TableContainer
          component={Paper}
          sx={{ borderRadius: "12px", margin: "1rem 0" }}
        >
          <Table sx={{ borderRadius: "12px" }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Contract Name</b>
                </TableCell>
                <TableCell>
                  <b>Storage Type</b>
                </TableCell>
                <TableCell>
                  <b>Storage Name</b>
                </TableCell>
                <TableCell>
                  <b>Action</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredContracts.map(contract => (
                <TableRow key={contract.id}>
                  <TableCell>{contract.slno}</TableCell>
                  <TableCell>{contract.storagetype}</TableCell>
                  <TableCell>{contract.location.storagename}</TableCell>
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
                      onClick={() =>
                        handleViewContract(contract.id, contract.storagetype)
                      }
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <p>No ongoing contracts found.</p>
      )}
    </div>
  );
}

export default OngoingMaufecture;
