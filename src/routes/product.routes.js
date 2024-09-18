import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/product.controller.js";

const router = Router();

router.route("/create").post(verifyJWT, createProduct);
router.route("/getAll").get(getAllProducts);
router.route("/get").get(verifyJWT, getProductById);
router.route("/put").put(verifyJWT, updateProduct);
router.route("/del").delete(verifyJWT, deleteProduct);
export default router;
