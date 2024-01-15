const router = require("express").Router();
const productController = require("../Controllers/productController");

// all product data
router.get("/all", productController.allProduct);
router.get("/all1/:commodityId", productController.allProduct1);

// create product data
router.post("/create", productController.createProduct);

// single product data
router.get("/:id", productController.singleProduct);

//update product data
router.put("/update/:id", productController.updateProduuct);

//delete product
router.delete("/delete/:id", productController.deleteProduct);

module.exports = router;
