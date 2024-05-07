import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { RingLoader } from "react-spinners";

function AddCommodityTypeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    commodityType: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const response = await axios.get(
            `http://localhost:5001/api/v1/commodityType/${id}`
          );

          setInitialValues(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async values => {
    try {
      await axios.put(
        `http://localhost:5001/api/v1/commodityType/update/${id}`,
        values
      );

      toast.success("Commodity Type edited successfully!");
      setTimeout(() => {
        navigate("/CommodityType");
      }, 2000);
    } catch (error) {
      console.error("Error editing data:", error);
      toast.error("Error editing commodity type");
    }
  };

  const handleCancel = () => {
    navigate("/CommodityType");
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <RingLoader color="#36D7B7" size={100} loading={loading} />
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div
          className="col-md-20 col-lg-12 col-xl-40"
          style={{ maxWidth: "800px" }}
        >
          <div className="card" style={{ borderRadius: "2rem" }}>
            <div className="card-header">
              <h4 className="card-title">Edit Commodity Type</h4>
            </div>
            <div className="card-body">
              <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                <Form>
                  <div className="mb-3">
                    <label htmlFor="commodityType" className="form-label">
                      Commodity Type <span className="text-danger">*</span>
                    </label>
                    <div className="d-flex">
                      <Field
                        type="text"
                        className="form-control rounded-start"
                        id="commodityType"
                        name="commodityType"
                        required
                        style={{ width: "100%" }}
                      />
                      <ErrorMessage
                        name="commodityType"
                        component="div"
                        className="text-danger ms-2"
                      />
                    </div>
                  </div>
                  <div className="mb-3 text-center">
                    <button
                      type="button"
                      className="btn btn-danger rounded-pill me-2"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary rounded-pill"
                      style={{
                        background: "linear-gradient(263deg, #34b6df, #34d0be)",
                        marginLeft: "10px",
                      }}
                    >
                      Update
                    </button>
                  </div>
                </Form>
              </Formik>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AddCommodityTypeEdit;
