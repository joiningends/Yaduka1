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

function Ongoing() {
  const [contracts, setContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const navigate = useNavigate();

  const userId = localStorage.getItem("id");

  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://www.keepitcool.app/api/v1/contracts/${userId}/ongoinf`)
      .then(response => {
        // Sort the data based on createdAt time
        const sortedContracts = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        // Set the sorted contracts
        setContracts(sortedContracts);
        console.log(sortedContracts);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching ongoing contracts:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = contracts.filter(contract => {
      const { storagetype, partyuser, contractName, location } = contract;
      const partyName = partyuser?.name || "";
      const locationName = location?.storagename || "";

      return (
        (storagetype &&
          storagetype.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (partyName &&
          partyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (contractName &&
          contractName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (locationName &&
          locationName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });

    setFilteredContracts(filtered);
  }, [searchTerm, contracts]);

  const handleViewContract = (contractId, storagetype) => {
    if (storagetype.toLowerCase() === "product") {
      navigate(`/Ongoing/OngoingByProduct/${contractId}`);
    } else if (storagetype.toLowerCase() === "area") {
      navigate(`/Ongoing/OngoingByArea/${contractId}`);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const indexOfLastRow = page * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentContracts = filteredContracts.slice(
    indexOfFirstRow,
    indexOfLastRow
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
                    <b>Party Name</b>
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
                    <b>Action</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentContracts.map((contract, index) => (
                  <TableRow key={contract?.id}>
                    <TableCell>{indexOfFirstRow + index + 1}</TableCell>
                    <TableCell>{contract?.partyuser?.name}</TableCell>
                    <TableCell>{contract?.slno}</TableCell>
                    <TableCell>{contract?.location?.storagename}</TableCell>
                    <TableCell>{contract?.storagetype}</TableCell>
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
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Pagination
              count={Math.ceil(filteredContracts.length / rowsPerPage)}
              page={page}
              onChange={handlePageChange}
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

export default Ongoing;
