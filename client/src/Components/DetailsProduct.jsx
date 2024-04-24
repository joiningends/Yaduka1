import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

function DetailsProduct() {
  const { id } = useParams();
  const [productDetails, setProductDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://3.6.248.144/api/v1/contracts/contract-products/${id}`
        );
        setProductDetails(response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchData();
  }, [id]);

  if (!productDetails || productDetails.length === 0) {
    return <div>Loading...</div>;
  }

  // Pagination
  const itemsPerPage = 8;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = productDetails.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const handlePageChange = pageNumber => setCurrentPage(pageNumber);

  // Data transformation
  const columns = [
    {
      dataField: "Name",
      text: "Name",
    },
    {
      dataField: "Quantity",
      text: "Quantity",
    },
    {
      dataField: "Rate",
      text: "Rate",
    },
    {
      dataField: "Amount",
      text: "Amount",
    },
  ];

  const data = currentItems.map((detail, index) => ({
    id: index + 1,
    Name: `${detail.product.commodity?.commodity} | ${detail.product.varient?.varient} || ${detail.product.unit?.unit}`,
    Quantity: detail.qty,
    Rate: detail.rate,
    Amount: detail.amount,
  }));

  const paginationOptions = {
    sizePerPage: itemsPerPage,
    totalSize: productDetails.length,
    onPageChange: handlePageChange,
  };

  return (
    <div className="container mt-5">
      <div className="col-md-12 col-lg-12 col-xl-12">
        <div className="card" style={{ borderRadius: "2rem" }}>
          <div
            className="card-header text-black"
            style={{ borderRadius: "2rem 2rem 0 0" }}
          >
            <h4 className="card-title">Product Details</h4>
          </div>
          <div className="card-body">
            <BootstrapTable
              bootstrap4
              keyField="id"
              data={data}
              columns={columns}
              pagination={paginationFactory(paginationOptions)}
              bordered
              striped
              hover
              wrapperClasses="table-responsive"
              headerClasses=" text-black"
              bodyClasses="bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailsProduct;
