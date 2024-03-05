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

function Requisition() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const navigate = useNavigate();
  const userId = localStorage.getItem("id");
  console.log(userId);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `http://3.6.248.144/api/v1/ref/getByPartyId/${userId}`
        );
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleAddRequisition = () => {
    // Navigate to the '/Requisition/addRequisition' route when the 'Add' button is clicked
    navigate("/Requisition/addRequisition");
  };

  const handleView = id => {
    // Handle the view action, you can navigate to a detailed view or perform other actions
    console.log(`Viewing item with ID: ${id}`);
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
            Requisition
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
            onClick={handleAddRequisition}
          >
            Add
          </Button>
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
            {data.map(item => (
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

export default Requisition;
