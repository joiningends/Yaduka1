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
  Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

function OngoingMaufecture() {
  const [contracts, setContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const rowsPerPage = 5;

  // Retrieve userId from local storage
  const userId = localStorage.getItem("id");

  useEffect(() => {
    setLoading(true);

    // Fetch ongoing contracts for a specific user
    console.log(
      `http://localhost:5001/api/v1/contracts/get/allongoing/${userId}`
    );
    axios
      .get(`http://localhost:5001/api/v1/contracts/get/allongoing/${userId}`)
      .then(response => {
        // Sort the contracts based on createdAt field in descending order
        const sortedContracts = response.data.contracts.sort((a, b) => {
          return (
            new Date(b.contract.createdAt) - new Date(a.contract.createdAt)
          );
        });
        setContracts(sortedContracts);
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
        contract.contract.storagetype
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        contract.contract.partyuser.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        contract.contract.location.storagename
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const indexOfLastContract = page * rowsPerPage;
  const indexOfFirstContract = indexOfLastContract - rowsPerPage;
  const currentContracts = filteredContracts.slice(
    indexOfFirstContract,
    indexOfLastContract
  );

  return (
    <div style={{ margin: "0 1rem" }}>
      <Typography variant="h4" fontWeight="bold" fontFamily="Poppins">
        Ongoing Contracts
      </Typography>

      <TextField
        label="Search by Storage Type, Party Name, or Location"
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
      ) : currentContracts.length > 0 ? (
        <>
          <TableContainer
            component={Paper}
            sx={{ borderRadius: "12px", margin: "1rem 0" }}
          >
            <Table sx={{ borderRadius: "12px" }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>S. No</b>
                  </TableCell>
                  <TableCell>
                    <b>Cold Storage Company Name</b>
                  </TableCell>
                  <TableCell>
                    <b>Contract Name</b>
                  </TableCell>
                  <TableCell>
                    <b>Location</b>
                  </TableCell>
                  <TableCell>
                    <b>Storage Type</b>
                  </TableCell>
                  <TableCell>
                    <b>Next Invoice Date</b>
                  </TableCell>
                  <TableCell>
                    <b>Rental Amount</b>
                  </TableCell>
                  <TableCell>
                    <b>Action</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentContracts.map((contract, index) => (
                  <TableRow key={contract.contract.id}>
                    <TableCell>{indexOfFirstContract + index + 1}</TableCell>
                    <TableCell>
                      {contract.contract.underadmin.companyname}
                    </TableCell>
                    <TableCell>{contract.contract.slno}</TableCell>
                    <TableCell>
                      {contract.contract.location.storagename}
                    </TableCell>
                    <TableCell>{contract.contract.storagetype}</TableCell>
                    <TableCell>
                      {/* Convert ISO date format to "dd-MM-YYYY" */}
                      {new Date(
                        contract.contract.nextinvoicedate
                      ).toLocaleDateString("en-GB")}
                    </TableCell>
                    <TableCell>{contract.nextRentalAmount}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        style={{
                          background:
                            "linear-gradient(263deg, #34b6df, #34d0be)",
                          color: "#fff",
                          borderRadius: "8px",
                        }}
                        onClick={() =>
                          handleViewContract(
                            contract.contract.id,
                            contract.contract.storagetype
                          )
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
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Pagination
              count={Math.ceil(filteredContracts.length / rowsPerPage)}
              page={page}
              onChange={handleChangePage}
              color="primary"
              shape="rounded"
              sx={{
                marginTop: "1rem",
                "& .Mui-selected": {
                  background: "linear-gradient(263deg, #34b6df, #34d0be)",
                  color: "#fff",
                },
              }}
            />
          </div>
        </>
      ) : (
        <p>No ongoing contracts found.</p>
      )}
    </div>
  );
}

export default OngoingMaufecture;
