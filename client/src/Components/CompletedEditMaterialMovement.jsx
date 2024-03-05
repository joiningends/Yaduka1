import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Pagination,
} from "@mui/material";

function formatDateString(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
}

function CompletedEditMaterialMovement() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const userId = localStorage.getItem("id");

  console.log(userId);

  useEffect(() => {
    const apiUrl = `http://3.6.248.144/api/v1/ref/complete/${userId}`;

    axios
      .get(apiUrl)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []); // Empty dependency array ensures useEffect runs once after the initial render

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const indexOfLastRow = page * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = data.slice(indexOfFirstRow, indexOfLastRow);

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
            Completed Edit Material Movement
          </Typography>
        </div>
      </div>
      <TableContainer
        component={Paper}
        sx={{ borderRadius: "12px", margin: "0 0 1rem 0" }}
      >
        <Table sx={{ borderRadius: "12px" }}>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData.map(item => (
              <TableRow key={item.id}>
                <TableCell>{item.conf.location.storagename}</TableCell>
                <TableCell>{item.conf.id}</TableCell>
                <TableCell>{formatDateString(item.date)}</TableCell>
                <TableCell>{item.status}</TableCell>
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

export default CompletedEditMaterialMovement;
