import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Pagination,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function CompletedRequisition() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const navigate = useNavigate();
  const userId = localStorage.getItem("id");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `http://3.6.248.144/api/v1/ref/completed/${userId}`
        );
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [page, rowsPerPage, userId]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleViewDetails = id => {
    console.log(`Viewing details of item with ID: ${id}`);
    navigate(`/Requisition/CompletedRequisition/${id}`);
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
            Completed Requisition
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
                <b>Serial Number</b>
              </TableCell>
              <TableCell>
                <b>Action</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(item => (
              <TableRow key={item.id}>
                <TableCell>{item.slno}</TableCell>
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
                    onClick={() => handleViewDetails(item.id)}
                  >
                    Details
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
          marginBottom: "1rem",
        }}
      >
        <Pagination
          count={Math.ceil(data.length / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
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

export default CompletedRequisition;
