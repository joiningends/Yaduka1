import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

function DetailsArea() {
  const { id } = useParams();
  const [productDetails, setProductDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://3.6.248.144/api/v1/contracts/contract-area/${id}`
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
      dataField: "StorageSpace",
      text: "Storage Space",
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
    StorageSpace: detail.AreaSpaceDetails.map(space => space.space).join(", "),
    Quantity: detail.contractspac.qty,
    Rate: detail.contractspac.rate,
    Amount: detail.contractspac.amount,
  }));

  const paginationOptions = {
    sizePerPage: itemsPerPage,
    totalSize: productDetails.length,
    onPageChange: handlePageChange,
  };

  return (
    <div className="container mt-5">
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
        headerClasses="bg-dark text-white"
        bodyClasses="bg-white"
      />
    </div>
  );
}

export default DetailsArea;
