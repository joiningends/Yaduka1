import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function MaterialMovement() {
  const [jsonData, setJsonData] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("id");

  console.log(userId);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `http://13.235.51.98/api/v1/ref/${userId}`
        );
        const data = await response.json();
        setJsonData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const handleView = id => {
    navigate(`/MaterialMovement/EditMaterialMovement/${id}`);
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
            Material Movement
          </Typography>
        </div>
      </div>

      <TableContainer
        component={Paper}
        sx={{ borderRadius: "12px", margin: "1rem 0" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Storage Name</b>
              </TableCell>
              <TableCell>
                <b>Contract</b>
              </TableCell>
              <TableCell>
                <b>Date</b>
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
            {jsonData.map(item => (
              <TableRow key={item.id}>
                <TableCell>{item.conf.location.storagename}</TableCell>
                <TableCell>{item.conf.id}</TableCell>
                <TableCell>
                  {new Date(item.date).toLocaleDateString("en-GB")}
                </TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    style={{
                      background: "#34b6df",
                      color: "#fff",
                      borderRadius: "8px",
                      "&:hover": {
                        background: "#34b6df",
                      },
                    }}
                    onClick={() => handleView(item.id)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default MaterialMovement;
