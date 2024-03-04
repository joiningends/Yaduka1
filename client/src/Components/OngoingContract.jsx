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
  TablePagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

function OngoingContract() {
  const [contracts, setContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();

  const userId = localStorage.getItem("id");

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://13.235.51.98/api/v1/contracts/get/allongoing/${userId}`)
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
    const filtered = contracts.filter(
      contract =>
        contract.storagetype.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.slno.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.location.storagename
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );

    setFilteredContracts(filtered);
    setPage(0); // Reset page when search term changes
  }, [searchTerm, contracts]);

  const handleViewContract = (contractId, storagetype) => {
    if (storagetype.toLowerCase() === "product") {
      navigate(`/Ongoing/OngoingByProduct/${contractId}`);
    } else if (storagetype.toLowerCase() === "area") {
      navigate(`/Ongoing/OngoingByArea/${contractId}`);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div style={{ margin: "0 1rem" }}>
      <Typography variant="h4" fontWeight="bold" fontFamily="Poppins">
        Ongoing Contracts
      </Typography>

      <TextField
        label="Search by Storage Type, Contract Number, or Storage Name"
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
                  <b>Contract Number</b>
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
              {filteredContracts
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(contract => (
                  <TableRow key={contract?.id}>
                    <TableCell>{contract?.storagetype}</TableCell>
                    <TableCell>{contract?.slno}</TableCell>
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
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredContracts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      ) : (
        <p>No ongoing contracts found.</p>
      )}
    </div>
  );
}

export default OngoingContract;
