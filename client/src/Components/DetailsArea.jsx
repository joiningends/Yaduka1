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
          `http://localhost:5001/api/v1/contracts/contract-area/${id}`
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
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card">
            <div
              className="card-header text-black"
              style={{ borderRadius: "0.5rem 0.5rem 0 0" }}
            >
              <h4 className="card-title">Details Area</h4>
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
                headerClasses="bg-light text-black"
                bodyClasses="bg-white"
                noDataIndication={() => "No data found"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailsArea;
