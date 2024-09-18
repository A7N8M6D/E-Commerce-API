import { Product } from "../models/product.model.js";

/*
 
 
-----------------        Create Product        -----------------


*/
const createProduct = async (req, res) => {
  const { Category, Brand, Name, Description, Price, Quantity, SKU } = req.body;
  const user = req.user?._id;
  try {
    // Check if all required fields are provided
    if (!Name || !Price || !Category || !Brand) {
      return res
        .status(400)
        .json({ error: "All required fields must be filled" });
    }

    // Check if product with the same SKU already exists
    const existingProduct = await Product.findOne({ SKU });
    if (existingProduct) {
      return res
        .status(409)
        .json({ error: "Product with this SKU already exists" });
    }

    // Create a new product
    const product = await Product.create({
      Category,
      Brand,
      Name,
      Description,
      Price,
      Quantity,
      user,
    });

    return res
      .status(201)
      .json({ message: "Product created successfully", product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
/*
 
 
-----------------        Get All Product        -----------------


*/

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/*
 
 
-----------------        Get All Product By ID      -----------------


*/
const getProductById = async (req, res) => {
  const userId = req.user?._id; // Get the logged-in user's ID

  try {
    // Find products associated with the user's ID
    const products = await Product.find({ user: userId }); // Assuming 'createdBy' is the field that links the product to a user

    if (!products || products.length === 0) {
      return res.status(404).json({ error: "No products found for this user" });
    }

    return res.status(200).json(products); // Return the list of products
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/*
 
 
-----------------        Update Product By ID      -----------------


*/
const updateProduct = async (req, res) => {
  const { id } = req.query;
  const _id=id
  const { Category, Brand, Name, Description, Price, Quantity, SKU } = req.body;

  try {
    // Find the product by ID and update it
    const updatedProduct = await Product.findByIdAndUpdate(
      _id,
      {
        Category,
        Brand,
        Name,
        Description,
        Price,
        Quantity,
        SKU,
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
/*
 
 
-----------------        Delete Product By ID      -----------------


*/
const deleteProduct = async (req, res) => {
  const { id } = req.query;

  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
