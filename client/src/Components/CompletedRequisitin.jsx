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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function CompletedRequisition() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const navigate = useNavigate();
  const userId = localStorage.getItem("id");
  const [selectedItem, setSelectedItem] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [detailsData, setDetailsData] = useState([]);
  const [detailsPage, setDetailsPage] = useState(1);
  const [detailsRowsPerPage] = useState(5);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `http://3.6.248.144/api/v1/ref/completed/${userId}`
        );
        const sortedData = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setData(sortedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [userId]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleViewDetails = item => {
    setSelectedItem(item);
    setOpenDialog(true);

    axios
      .get(`http://3.6.248.144/api/v1/ref/getById/${item.id}`)
      .then(response => {
        setDetailsData(response.data);
      })
      .catch(error => {
        console.error("Error fetching details data:", error);
      });
  };

  const handleEdit = item => {
    if (item) {
      navigate(`/Requisition/CompletedRequisition/${item.id}`);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDetailsPageChange = (event, newPage) => {
    setDetailsPage(newPage);
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
                <b>Cold Storage Company Name</b>
              </TableCell>
              <TableCell>
                <b>Action</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? data.slice(
                  (page - 1) * rowsPerPage,
                  (page - 1) * rowsPerPage + rowsPerPage
                )
              : data
            ).map(item => (
              <TableRow key={item.id}>
                <TableCell>{item.slno}</TableCell>
                <TableCell>{item?.valueofunde?.companyname}</TableCell>

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
                    onClick={() => handleViewDetails(item)}
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

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          style: {
            padding: "1rem",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle style={{ fontWeight: "bold" }}>
          Product Information
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: "20%" }}>
                    <b style={{ verticalAlign: "middle" }}>S No.</b>
                  </TableCell>
                  <TableCell>
                    <b>Product Name</b>
                  </TableCell>
                  <TableCell>
                    <b>Total Requested Quantity</b>
                  </TableCell>
                  <TableCell>
                    <b>Total Delivered Quantity</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(detailsRowsPerPage > 0
                  ? detailsData.slice(
                      (detailsPage - 1) * detailsRowsPerPage,
                      (detailsPage - 1) * detailsRowsPerPage +
                        detailsRowsPerPage
                    )
                  : detailsData
                ).map((item, index) => (
                  <TableRow key={index}>
                    <TableCell
                      style={{
                        verticalAlign: "middle",
                        paddingTop: "8px",
                        paddingBottom: "8px",
                      }}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell>{`${item.commodity} || ${item.variant} || ${item.quality} || ${item.size} || ${item.unit}`}</TableCell>
                    <TableCell>{item.qty}</TableCell>
                    <TableCell>{item.dqty}</TableCell>
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
              count={Math.ceil(detailsData.length / detailsRowsPerPage)}
              page={detailsPage}
              onChange={handleDetailsPageChange}
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
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleEdit(selectedItem)}
            color="primary"
            variant="contained"
            style={{
              borderRadius: "8px",
              background: "#34b6df",
              color: "#fff",
              "&:hover": {
                background: "#34b6df",
              },
            }}
          >
            Edit
          </Button>
          <Button
            onClick={handleCloseDialog}
            color="primary"
            variant="contained"
            style={{
              borderRadius: "8px",
              background: "#ff3d00",
              color: "#fff",
              "&:hover": {
                background: "#ff3d00",
              },
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CompletedRequisition;
