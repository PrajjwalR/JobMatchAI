import dotenv from "dotenv";

// Load environment variables first, before any other imports
dotenv.config();

import mongoose from "mongoose";
import app from "./app";

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || "";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });
