import React, { useState, useEffect } from "react";
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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MaterialMovementColdCompleted() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [invoicesData, setInvoicesData] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedStorageId, setSelectedStorageId] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const userId = localStorage.getItem("id");
  const rowsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoicesData = async () => {
      try {
        const response = await axios.get(
          `http://3.6.248.144/api/v1/ref/mat/complete/${userId}`
        );
        const data = response.data;
        setInvoicesData(data);
        setTotalPages(Math.ceil(data.length / rowsPerPage));
      } catch (error) {
        console.error("Error fetching invoice data:", error);
      }
    };

    fetchInvoicesData();
  }, [userId]);

  const handleViewClick = async item => {
    try {
      const response = await axios.get(
        `http://3.6.248.144/api/v1/ref/getById/${item.id}`
      );
      setModalData(response.data);
      setSelectedItemId(item.id);
      setSelectedStorageId(item.storageId);
      setShowDialog(true);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  const handleEdit = () => {
    navigate(
      `/MaterialMovementCompleted/EditMaterialMovement/${selectedItemId}/${selectedStorageId}`
    );
  };

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const currentInvoices = invoicesData
    .filter(
      invoice =>
        invoice.slno.toLowerCase().includes(search.toLowerCase()) ||
        new Date(invoice.date)
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
          .includes(search.toLowerCase())
    )
    .slice(startIndex, endIndex);

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
            Material Movement Completed
          </Typography>
        </div>
        <div>
          <Button
            variant="contained"
            style={{
              background: "linear-gradient(263deg, #34b6df, #34d0be)",
              color: "#fff",
              borderRadius: "8px",
              textTransform: "none",
            }}
            onClick={() =>
              navigate("/MaterialMovementCompleted/CompletedMaterialMovement")
            }
          >
            View With Filter
          </Button>
        </div>
      </div>
      <TextField
        label="Search by Requisition Number or Date"
        variant="outlined"
        fullWidth
        value={search}
        onChange={event => {
          setPage(1);
          setSearch(event.target.value);
        }}
        style={{ marginBottom: "1rem" }}
      />
      <TableContainer
        component={Paper}
        sx={{ borderRadius: "12px", margin: "0 0 1rem 0" }}
      >
        <Table sx={{ borderRadius: "12px" }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>S No.</b>
              </TableCell>
              <TableCell>
                <b>Requisition Number</b>
              </TableCell>
              <TableCell>
                <b>Date</b>
              </TableCell>
              <TableCell>
                <b>Cold Storage Company Name</b>
              </TableCell>
              <TableCell>
                <b>Action</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentInvoices.map((invoice, index) => (
              <TableRow key={invoice.id}>
                <TableCell>{startIndex + index + 1}</TableCell>
                <TableCell>{invoice.slno}</TableCell>
                <TableCell>
                  {new Date(invoice.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>{invoice.valueofunde.companyname}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    style={{
                      background: "linear-gradient(263deg, #34b6df, #34d0be)",
                      color: "#fff",
                      borderRadius: "8px",
                    }}
                    onClick={() => handleViewClick(invoice)}
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
          count={totalPages}
          page={page}
          onChange={(event, value) => setPage(value)}
          variant="outlined"
          shape="rounded"
          style={{ marginTop: "1rem" }}
          sx={{
            "& .MuiPaginationItem-root": {
              borderRadius: "0px",
              border: "1px solid #ddd",
              margin: "0 2px",
              color: "#34b6df", // Set pagination item color
            },
            "& .Mui-selected": {
              background: "linear-gradient(263deg, #34b6df, #34d0be)",
              color: "#fff", // Set selected pagination item text color
              border: "none",
            },
          }}
        />
      </div>
      <Dialog open={showDialog} onClose={handleCloseDialog}>
        <DialogTitle>Details</DialogTitle>
        <DialogContent>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th style={{ width: "5rem" }}>S No.</th>
                <th>Product Name</th>
                <th>Total Requested Quantity</th>
                <th>Total Delivered Quantity</th>
              </tr>
            </thead>
            <tbody>
              {modalData.map((product, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{`${product.commodity} || ${product.variant} || ${product.quality} || ${product.size} || ${product.unit}`}</td>
                  <td>{product.qty}</td>
                  <td>{product.dqty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleEdit}
            style={{
              background: "#34b6df",
              color: "#fff",
              borderRadius: "8px",
            }}
          >
            Edit
          </Button>
          <Button
            onClick={handleCloseDialog}
            style={{ background: "red", color: "#fff", borderRadius: "8px" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </div>
  );
}

export default MaterialMovementColdCompleted;
