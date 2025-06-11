import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const PRODUCTS_COLLECTION = "products";

// Create a product for a tenant
export const createProduct = async (data, tenantId) => {
    const newProduct = {
        ...data,
        tenantId,
        createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), newProduct);
    return docRef.id;
};


// Get all products for a specific tenant
export const getAllProducts = async (tenantId) => {
    if (!tenantId) throw new Error("Tenant ID is required");

    const colRef = collection(db, PRODUCTS_COLLECTION);

    // Use both `where` and `orderBy` on the same field (`createdAt`)
    const q = query(
        colRef,
        where("tenantId", "==", tenantId),
        where("createdAt", "!=", null), // ensure createdAt exists
        orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
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
        ...snapshot.data()
    };
};

// Update a product by ID
export const updateProduct = async (id, updatedData) => {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await updateDoc(docRef, {
        ...updatedData,
        updatedAt: serverTimestamp()
    });
};

// Delete a product by ID
export const deleteProduct = async (id) => {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(docRef);
};
