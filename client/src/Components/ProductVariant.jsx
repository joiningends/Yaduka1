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
import { useNavigate, useParams } from "react-router-dom";
import { RingLoader } from "react-spinners";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProductVariant() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [productVariants, setProductVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const rowsPerPage = 5;
  const navigate = useNavigate();
  const { id } = useParams();
  const editButtonStyle = {
    background: "linear-gradient(263deg, #34b6df, #34d0be)",
    color: "#fff",
    borderRadius: "8px",
    "&:hover": {
      background: "linear-gradient(263deg, #34b6df, #34d0be)",
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://3.6.248.144/api/v1/product/all1/${id}`
        );
        setProductVariants(response.data);
      } catch (error) {
        console.error("Error fetching product variants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleSearch = event => {
    setPage(1);
    setSearch(event.target.value);
  };

  const handleAddProductVariant = () => {
    navigate("/product");
  };

  const indexOfLastRow = page * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = productVariants
    .filter(
      variant =>
        variant.varient.varient.toLowerCase().includes(search.toLowerCase()) ||
        variant.quality.quality.toLowerCase().includes(search.toLowerCase()) ||
        variant.size.size.toLowerCase().includes(search.toLowerCase()) ||
        variant.unit.unit.toLowerCase().includes(search.toLowerCase())
    )
    .slice(indexOfFirstRow, indexOfLastRow);

  return (
    <div style={{ margin: "0 1rem" }}>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center">
          <RingLoader color="#36D7B7" loading={loading} size={150} />
        </div>
      ) : (
        <div>
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
                Product Variant
              </Typography>
            </div>
            <div>
              <Button
                variant="contained"
                style={editButtonStyle}
                onClick={handleAddProductVariant}
              >
                Back
              </Button>
            </div>
          </div>
          <TextField
            label="Search by Variant, Quality, Size, or Unit"
            variant="outlined"
            fullWidth
            value={search}
            onChange={handleSearch}
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
                    <b>Sno</b>
                  </TableCell>
                  <TableCell>
                    <b>Image Of Variant</b>
                  </TableCell>
                  <TableCell>
                    <b>Variant</b>
                  </TableCell>
                  <TableCell>
                    <b>Quality</b>
                  </TableCell>
                  <TableCell>
                    <b>Size</b>
                  </TableCell>
                  <TableCell>
                    <b>Unit</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentRows.map((variant, index) => (
                  <TableRow key={variant.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {variant.varient.image ? (
                        <img
                          src={variant.varient.image}
                          alt={`Image of ${variant.varient.varient}`}
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                          }}
                        />
                      ) : (
                        "No Image"
                      )}
                    </TableCell>
                    <TableCell>{variant.varient.varient}</TableCell>
                    <TableCell>{variant.quality.quality}</TableCell>
                    <TableCell>{variant.size.size}</TableCell>
                    <TableCell>{variant.unit.unit}</TableCell>
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
              count={Math.ceil(productVariants.length / rowsPerPage)}
              page={page}
              onChange={handleChange}
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
      )}
      <ToastContainer />
    </div>
  );
}

export default ProductVariant;
