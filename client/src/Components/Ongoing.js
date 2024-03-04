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

function Ongoing() {
  const [contracts, setContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const userId = localStorage.getItem("id");

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://13.235.51.98/api/v1/contracts/${userId}/ongoinf`)
      .then(response => {
        setContracts(response.data);
        console.log(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching ongoing contracts:", error);
        setLoading(false);
      });
  }, []);

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
    if (storagetype.toLowerCase() === "product") {
      navigate(`/Ongoing/OngoingByProduct/${contractId}`);
    } else if (storagetype.toLowerCase() === "area") {
      navigate(`/Ongoing/OngoingByArea/${contractId}`);
    }
    // Add more conditions for other storagetypes if needed
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
                  <b>Storage Type</b>
                </TableCell>
                <TableCell>
                  <b>Party Name</b>
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
              {filteredContracts?.map(contract => (
                <TableRow key={contract?.id}>
                  <TableCell>{contract?.storagetype}</TableCell>
                  <TableCell>{contract?.partyuser?.name}</TableCell>
                  <TableCell>{contract?.location?.storagename}</TableCell>
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

export default Ongoing;
