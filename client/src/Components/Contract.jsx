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
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";

function Contract() {
  const [contracts, setContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const navigate = useNavigate();

  const userId = localStorage.getItem("id");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://www.keepitcool.app/api/v1/contracts/${userId}/draft`
        );

        // Sort the data based on createdAt time in descending order
        const sortedContracts = response.data.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        setContracts(sortedContracts);
        console.log(sortedContracts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching contracts:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    const filtered = contracts.filter(contract => {
      const { partyuser, slno, location, storagetype, renewaldays } = contract;
      const partyName = partyuser?.name || "";
      const locationName = location?.storagename || "";

      return (
        partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        slno.toLowerCase().includes(searchTerm.toLowerCase()) ||
        locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        storagetype.toLowerCase().includes(searchTerm.toLowerCase()) ||
        renewaldays.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    setFilteredContracts(filtered);
  }, [searchTerm, contracts]);

  const handleViewContract = (id, storagetype) => {
    if (storagetype === "Area") {
      navigate(`/Contract/DraftContractAreaType/${id}`);
    } else if (storagetype === "Product") {
      navigate(`/Contract/DraftContractProductType/${id}`);
    }
  };

  const handleAddContract = () => {
    navigate("/Contract/AddContract");
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
            Contract
          </Typography>
        </div>
        <div>
          <Button
            variant="contained"
            style={{
              background: "linear-gradient(263deg, #34b6df, #34d0be)",
              color: "#fff",
              borderRadius: "8px",
            }}
            onClick={handleAddContract}
          >
            Add Contract
          </Button>
        </div>
      </div>
      <TextField
        label="Search by Party Name, Contract Name, Location, Storage Type, or Renewal Days"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ marginBottom: "1rem" }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <TableContainer
        component={Paper}
        sx={{ borderRadius: "12px", margin: "0 0 1rem 0" }}
      >
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "2rem",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
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
                  <b>Renewal Days</b>
                </TableCell>
                <TableCell>
                  <b>Action</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentContracts.map((contract, index) => (
                <TableRow key={contract.id}>
                  <TableCell>{indexOfFirstRow + index + 1}</TableCell>
                  <TableCell>{contract?.partyuser?.name}</TableCell>
                  <TableCell>{contract?.slno}</TableCell>
                  <TableCell>{contract?.location?.storagename}</TableCell>
                  <TableCell>{contract?.storagetype}</TableCell>
                  <TableCell>{contract.renewaldays}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      style={{
                        background: "linear-gradient(263deg, #34b6df, #34d0be)",
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
        )}
      </TableContainer>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "1rem",
        }}
      >
        <Pagination
          count={Math.ceil(filteredContracts.length / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
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

export default Contract;
