const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const emailRoutes = require("./routes/emailRoutes.js");

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin: ["http://localhost:5173"],
};
app.use(cors(corsOptions));
app.use("/api", emailRoutes);

  
  app.listen(8080, () => {
    console.log("Server is running on port 8080");
  });