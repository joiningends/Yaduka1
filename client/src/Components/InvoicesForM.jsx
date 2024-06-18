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
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function InvoicesForM() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [invoicesData, setInvoicesData] = useState([]);

  const userId = localStorage.getItem("id");
  const rowsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoicesData = async () => {
      try {
        const response = await axios.get(
          `https://www.keepitcool.app/api/v1/contracts/inv/${userId}`
        );
        const invoices = response.data.invoices;
        console.log(invoices);
        setInvoicesData(invoices);
      } catch (error) {
        console.error("Error fetching invoice data:", error);
      }
    };

    fetchInvoicesData();
  }, [userId]);

  const handleViewClick = async invoiceName => {
    try {
      const pdfUrl = `https://www.keepitcool.app/api/v1/contracts/view/${invoiceName}.pdf`;

      console.log(invoiceName);
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

  const handleView = invoiceId => {
    navigate(`/invoice/${invoiceId}`);
  };

  const currentInvoices = invoicesData
    .filter(invoice => {
      const searchTerm = search.toLowerCase();
      return (
        invoice.name.toLowerCase().includes(searchTerm) ||
        (invoice.inv && invoice.inv.slno.toLowerCase().includes(searchTerm))
      );
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by createdAt in descending order
    .slice((page - 1) * rowsPerPage, page * rowsPerPage);

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
            Invoices
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
            onClick={() => navigate("/Invoices/Invoice")}
          >
            View With Filter
          </Button>
        </div>
      </div>
      <TextField
        label="Search by Name or Contract Number"
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
                <b>Invoice Name</b>
              </TableCell>
              <TableCell>
                <b>Invoice Date</b>
              </TableCell>
              <TableCell>
                <b>Contract Number</b>
              </TableCell>
              <TableCell>
                <b>Invoice Amount</b>
              </TableCell>
              <TableCell>
                <b>Company Name</b>
              </TableCell>
              <TableCell>
                <b>Action</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentInvoices.map((invoice, index) => (
              <TableRow key={invoice.id}>
                <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                <TableCell>{invoice.name}</TableCell>
                <TableCell>
                  {new Date(invoice.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>{invoice.inv.slno}</TableCell>
                <TableCell>{invoice.amount}</TableCell>
                <TableCell>{invoice?.inv?.underadmin?.companyname}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    style={{
                      background: "linear-gradient(263deg, #34b6df, #34d0be)",
                      color: "#fff",
                      borderRadius: "8px",
                    }}
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
          count={Math.ceil(invoicesData.length / rowsPerPage)}
          page={page}
          onChange={(event, value) => setPage(value)}
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
      <ToastContainer />
    </div>
  );
}

export default InvoicesForM;
