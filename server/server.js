const express = require("express");
require('dotenv').config();
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const emailRoutes = require("./routes/emailRoutes.js");
const gradeRoutes = require("./routes/gradeRoutes.js");
const tutorRoutes = require("./routes/tutorRoutes.js");
const teacherRoutes = require("./routes/teacherRoutes.js");
const subjectRoutes = require("./routes/subjectRoutes.js");
const communicationRoutes = require("./routes/communicationRoutes.js");
const categoryRoutes = require("./routes/categoryRoutes.js");
const secretaryRoutes = require("./routes/secretaryRoutes.js");
const studentRoutes = require("./routes/studentRoutes.js");
const teacherCommunicationRoutes = require("./routes/teacherCommunicationRoutes.js");
const authRoutes = require("./routes/authRoutes.js");

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin: ["http://localhost:5173"],
};
app.use(cors(corsOptions));
app.use("/api", emailRoutes);
app.use("/api", gradeRoutes);
app.use("/api", tutorRoutes);
app.use("/api", teacherRoutes);
app.use("/api", subjectRoutes);
app.use("/api", communicationRoutes);
app.use("/api", categoryRoutes);
app.use("/api", secretaryRoutes);
app.use("/api", studentRoutes);
app.use("/api", teacherCommunicationRoutes);
app.use("/api/auth", authRoutes);


app.listen(8080, () => {
    console.log("Server is running on port 8080");
  });