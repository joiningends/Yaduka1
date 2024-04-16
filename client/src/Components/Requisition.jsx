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
  TextField,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";

function Requisition() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [detailsData, setDetailsData] = useState([]);
  const [detailsPage, setDetailsPage] = useState(1);
  const [detailsRowsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const partyId = localStorage.getItem("id");
    if (!partyId) {
      console.error("partyId not found in localStorage");
      return;
    }

    axios
      .get(`http://3.6.248.144/api/v1/ref/getByPartyId/${partyId}`)
      .then(response => {
        setData(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleDetailsPageChange = (event, newPage) => {
    setDetailsPage(newPage);
  };

  const handleView = item => {
    setSelectedItem(item);
    setOpenDialog(true);
    console.log(`http://3.6.248.144/api/v1/ref/getById/${item.id}`);

    axios
      .get(`http://3.6.248.144/api/v1/ref/getById/${item.id}`)
      .then(response => {
        setDetailsData(response.data);
      })
      .catch(error => {
        console.error("Error fetching details data:", error);
      });
  };

  const handleEdit = () => {
    if (selectedItem) {
      navigate(`/EditRequisition/${selectedItem.id}/${selectedItem.storageId}`);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  const filteredData = data.filter(
    item =>
      item.slno && item.slno.toLowerCase().includes(searchTerm.toLowerCase())
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
            Requisition
          </Typography>
        </div>

        <div>
          <Link
            to="/Requisition/AddRequisition"
            style={{ textDecoration: "none" }}
          >
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
            >
              Add
            </Button>
          </Link>
        </div>
      </div>

      <TextField
        label="Search by Serial Number"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: "1rem" }}
      />

      <TableContainer
        component={Paper}
        style={{
          borderRadius: "12px",
          margin: "1rem 0",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>S No.</b>
              </TableCell>
              <TableCell>
                <b>Requisition Number</b>
              </TableCell>
              <TableCell>
                <b>Action</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice((page - 1) * rowsPerPage, page * rowsPerPage)
              .map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
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
                      onClick={() => handleView(item)}
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
          count={Math.ceil(filteredData.length / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
          shape="rounded"
          color="primary"
          style={{
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
                </TableRow>
              </TableHead>
              <TableBody>
                {detailsData
                  .slice(
                    (detailsPage - 1) * detailsRowsPerPage,
                    detailsPage * detailsRowsPerPage
                  )
                  .map((item, index) => (
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
              style={{
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
            onClick={handleEdit}
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

export default Requisition;
