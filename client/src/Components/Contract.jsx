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
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function Contract() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userId = localStorage.getItem("id");

  console.log(userId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://3.6.248.144/api/v1/contracts/${userId}/draft`
        );
        setContracts(response.data);
        console.log(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching contracts:", error);
        setLoading(false);
        // Handle error or show a toast message
      }
    };

    fetchData();
  }, []);

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
              "&:hover": {
                background: "linear-gradient(263deg, #34b6df, #34d0be)",
              },
            }}
            onClick={handleAddContract}
          >
            Add Contract
          </Button>
        </div>
      </div>
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
                  <b>Sno</b>
                </TableCell>
                <TableCell>
                  <b>Storage Type</b>
                </TableCell>
                <TableCell>
                  <b>Renewal Days</b>
                </TableCell>
                <TableCell>
                  <b>Status</b>
                </TableCell>
                <TableCell>
                  <b>Action</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contracts.map((contract, index) => (
                <TableRow key={contract.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{contract.storagetype}</TableCell>
                  <TableCell>{contract.renewaldays}</TableCell>
                  <TableCell>{contract.status}</TableCell>
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
        )}
      </TableContainer>
    </div>
  );
}

export default Contract;
