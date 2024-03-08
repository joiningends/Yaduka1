import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
} from "@mui/material";

function ViewRequisition() {
  const { id } = useParams();
  const [requisitionData, setRequisitionData] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `http://3.6.248.144/api/v1/ref/getById/${id}`
        );
        setRequisitionData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [id]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const indexOfLastRow = page * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = requisitionData.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <div style={{ margin: "0 1rem" }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        fontFamily="Poppins"
        gutterBottom
      >
        View Requisition
      </Typography>

      <TableContainer
        component={Paper}
        sx={{ borderRadius: "12px", margin: "1rem 0" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Product Name</b>
              </TableCell>
              <TableCell>
                <b>Required Quantity</b>
              </TableCell>
              <TableCell>
                <b>Delivery Quantity</b>
              </TableCell>
              <TableCell>
                <b>Available Quantity</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.map(item => (
              <TableRow key={item.id}>
                <TableCell>
                  {`${
                    item.contractproduct.product.commodity?.commodity || ""
                  } - ${
                    item.contractproduct.product.varient?.varient || ""
                  } - ${item.contractproduct.product.unit?.unit || ""}`}
                </TableCell>
                <TableCell>{item.requireqty}</TableCell>
                <TableCell>{item.deliveryQty}</TableCell>
                <TableCell>{item.contractproduct.qty}</TableCell>
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
          count={Math.ceil(requisitionData.length / rowsPerPage)}
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

export default ViewRequisition;
