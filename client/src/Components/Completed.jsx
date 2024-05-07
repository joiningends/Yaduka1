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

function Completed() {
  const [contracts, setContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [contractsPerPage] = useState(5);
  const navigate = useNavigate();

  const userId = localStorage.getItem("id");

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5001/api/v1/contracts/clod/closed/${userId}`)
      .then(response => {
        // Sort the data based on createdAt time in descending order
        const sortedContracts = response.data.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        setContracts(sortedContracts);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching completed contracts:", error);
        setLoading(false);
      });
  }, [userId]);

  useEffect(() => {
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
      navigate(`/CompletedContract/Product/${contractId}`);
    } else if (storagetype.toLowerCase() === "area") {
      navigate(`/CompletedContract/Area/${contractId}`);
    }
  };

  const indexOfLastContract = currentPage * contractsPerPage;
  const indexOfFirstContract = indexOfLastContract - contractsPerPage;
  const currentContracts = filteredContracts.slice(
    indexOfFirstContract,
    indexOfLastContract
  );

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div style={{ margin: "0 1rem" }}>
      <Typography variant="h4" fontWeight="bold" fontFamily="Poppins">
        Completed Contracts
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
        <>
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
                {currentContracts.map(contract => (
                  <TableRow key={contract?.id}>
                    <TableCell>{contract?.storagetype}</TableCell>
                    <TableCell>{contract?.partyuser?.name}</TableCell>
                    <TableCell>{contract?.location?.storagename}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        style={{
                          background:
                            "linear-gradient(263deg, #34b6df, #34d0be)",
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

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "1rem",
            }}
          >
            <Pagination
              count={Math.ceil(filteredContracts.length / contractsPerPage)}
              page={currentPage}
              onChange={(event, value) => paginate(value)}
              sx={{
                "& .MuiPaginationItem-root": {
                  background: "linear-gradient(263deg, #34b6df, #34d0be)",
                  color: "#fff",
                  "&:hover": {
                    background: "linear-gradient(263deg, #34b6df, #34d0be)",
                  },
                },
              }}
            />
          </div>
        </>
      ) : (
        <p>No completed contracts found.</p>
      )}
    </div>
  );
}

export default Completed;
