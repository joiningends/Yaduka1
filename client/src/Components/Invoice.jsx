// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';

// function DetailsProduct() {
//   const { id } = useParams();
//   const [productDetails, setProductDetails] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`http://3.6.248.144/api/v1/contracts/contract-products/${id}`);
//         setProductDetails(response.data);
//       } catch (error) {
//         console.error('Error fetching product details:', error);
//       }
//     };

//     fetchData();
//   }, [id]);

//   if (!productDetails || !productDetails[0]) {
//     return <div>Loading...</div>;
//   }

//   const {
//     qty,
//     rate,
//     amount,
//     createdAt,
//     updatedAt,
//     contractId,
//     storagespace,
//     productid,
//     product,
//   } = productDetails[0];

//   if (!product) {
//     return <div>No product data available</div>;
//   }

//   const {
//     commodity,
//     varient,
//     newUnit,
//   } = product;

//   const initialConcatenatedValue = `${commodity?.commodity} | ${varient?.varient} || ${newUnit}`;
//   const [concatenatedValue, setConcatenatedValue] = useState(initialConcatenatedValue);

//   const handleConcatenatedValueChange = (event) => {
//     setConcatenatedValue(event.target.value);
//   };

//   return (
//     <div className="container mt-5">
//       <div className="col-md-12 col-lg-12 col-xl-12">
//         <div className="card" style={{ borderRadius: "2rem" }}>
//           <div className="card-header">
//             <h4 className="card-title">Product Details</h4>
//           </div>
//           <div className="card-body">
//             <form>
//               <div className="mb-3">
//                 <label htmlFor="concatenatedValue" className="form-label">
//                   Commodity, Varient, New Unit <span className="text-danger">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   className="form-control rounded-pill"
//                   id="concatenatedValue"
//                   name="concatenatedValue"
//                   value={concatenatedValue}
//                   onChange={handleConcatenatedValueChange}
//                 />
//               </div>
//               {/* ... (rest of the fields) */}
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DetailsProduct;
