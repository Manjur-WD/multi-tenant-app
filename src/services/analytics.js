import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export const getDailyProductCounts = async (tenantId) => {
  if (!tenantId) throw new Error("Tenant ID is required");

  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 29); // 30 days including today

  const q = query(
    collection(db, "products"),
    where("tenantId", "==", tenantId),
    // where("createdAt", ">=", Timestamp.fromDate(thirtyDaysAgo))
  );

  const snapshot = await getDocs(q);
  const productData = snapshot.docs.map((doc) => doc.data());

  // Group by date
  const counts = {};

  for (const product of productData) {
    const createdAt = product.createdAt?.toDate?.() || new Date();
    const dateKey = createdAt.toISOString().split("T")[0]; // e.g., "2024-06-12"
    counts[dateKey] = (counts[dateKey] || 0) + 1;
  }

  // Fill missing dates (ensure all days have data)
  const chartData = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(today.getDate() - 29 + i);
    const key = date.toISOString().split("T")[0];
    chartData.push({
      date: key,
      products: counts[key] || 0,
    });
  }

  return chartData;
};
