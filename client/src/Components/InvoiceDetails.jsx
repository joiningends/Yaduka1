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
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InvoiceDetails = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [invoiceData, setInvoiceData] = useState([]);
  const [isDeleted, setIsDeleted] = useState(false);

  const { id } = useParams(); // Get the id from URL params

  const rowsPerPage = 5;

  const fetchInvoiceData = async () => {
    try {
      const response = await axios.get(
        `https://www.keepitcool.app/api/v1/contracts/invoices/all/${id}`
      );
      console.log(response.data.invoiceDetails);
      setInvoiceData(response.data.invoiceDetails);
    } catch (error) {
      console.error("Error fetching invoice data:", error);
    }
  };

  useEffect(() => {
    fetchInvoiceData();
  }, [id]); // Fetch data whenever id changes

  useEffect(() => {
    if (isDeleted) {
      toast.success("Invoice deleted successfully!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000, // Toast message duration
      });

      // Reset deletion state after showing the success message
      setIsDeleted(false);

      // Reload the page after a short delay (adjust timing as needed)
      setTimeout(() => {
        window.location.reload();
      }, 2500); // Reload after 2.5 seconds (adjust as needed)
    }
  }, [isDeleted]);

  const handleViewClick = async invoiceName => {
    try {
      const pdfUrl = `https://www.keepitcool.app/api/v1/contracts/view/${invoiceName}.pdf`;

      const openInNewTab = url => {
        if (typeof window !== "undefined") {
          const newWindow = window.open();
          newWindow.location.href = url;
        } else {
          console.error("Window object is not defined.");
          toast.error("Failed to open in a new tab.");
        }
      };

      const pdfResponse = await fetch(pdfUrl);
      if (pdfResponse.ok) {
        openInNewTab(pdfUrl);
      } else {
        console.error("Error fetching PDF:", pdfResponse.statusText);
        toast.error("Failed to view PDF.");
      }
    } catch (error) {
      console.error("Error viewing invoice:", error);
      toast.error("Failed to view invoice.");
    }
  };

  const filteredData = invoiceData.filter(invoice =>
    invoice.name.toLowerCase().includes(search.toLowerCase())
  );

  const currentRows = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
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
            Invoice Details
          </Typography>
        </div>
      </div>
      <TextField
        label="Search by Invoice Name"
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
        style={{ borderRadius: "12px", marginBottom: "1rem" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Serial No</b>
              </TableCell>
              <TableCell>
                <b>Invoice Name</b>
              </TableCell>
              <TableCell>
                <b>Invoice Date</b>
              </TableCell>
              <TableCell>
                <b>Invoice Amount</b>
              </TableCell>
              <TableCell>
                <b>Action</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.map((invoice, index) => (
              <TableRow key={invoice.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{invoice.name}</TableCell>
                <TableCell>
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{invoice.amount}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleViewClick(invoice.name)}
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
          count={Math.ceil(filteredData.length / rowsPerPage)}
          page={page}
          onChange={(event, value) => setPage(value)}
          shape="rounded"
          color="primary"
        />
      </div>
      <ToastContainer />
    </div>
  );
};

export default InvoiceDetails;
