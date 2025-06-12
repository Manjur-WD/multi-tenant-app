import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  limit,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const PRODUCTS_COLLECTION = "products";

// Create a product for a tenant
export const createProduct = async (data, tenantId) => {
  const newProduct = {
    ...data,
    tenantId,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), newProduct);
  return docRef.id;
};

// Get all products for a specific tenant
export const getAllProducts = async (tenantId) => {
  if (!tenantId) throw new Error("Tenant ID is required");

  const productsRef = collection(db, PRODUCTS_COLLECTION);
  const q = query(productsRef, where("tenantId", "==", tenantId));
  const querySnapshot = await getDocs(q);

  const products = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  //   console.log(products);
  return products;
};

// get recent 5 products

export const getLastFiveProducts = async (tenantId) => {
  if (!tenantId) throw new Error("Tenant ID is required");

  const productsRef = collection(db, PRODUCTS_COLLECTION);
  const q = query(
    productsRef,
    where("tenantId", "==", tenantId),
    limit(5)
  );

  const querySnapshot = await getDocs(q);

  const products = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return products;
};

// Get a single product by ID
export const getProductById = async (id) => {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    throw new Error("Product not found");
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
};

// Update a product by ID

export const updateProduct = async (id, updatedData) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await updateDoc(docRef, {
      ...updatedData,
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      message: `Product updated successfully.`,
    };
  } catch (error) {
    console.error("Error updating product:", error);
    return {
      success: false,
      message: error.message || "Failed to update product.",
    };
  }
};

// Delete a product by ID
// export const deleteProduct = async (id) => {
//   const docRef = doc(db, PRODUCTS_COLLECTION, id);
//   await deleteDoc(docRef);
// };

export async function deleteProductById(productId) {
  try {
    const productRef = doc(db, "products", productId);
    await deleteDoc(productRef);
    return {
      success: true,
      message: `Product has been deleted.`,
    };
  } catch (error) {
    console.error("Error deleting product:", error);
    return {
      success: false,
      message: "Failed to delete product.",
      error: error.message || error,
    };
  }
}
