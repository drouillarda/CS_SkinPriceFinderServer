require("dotenv").config();
const cors = require("cors");

const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.static("./public"));
app.use('/images', express.static(path.join(__dirname, 'public')))

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
});