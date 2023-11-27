require("dotenv").config();
const cors = require("cors");
const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.static("./public"));

const bitskinsRoutes = require('./routes/bitskins-route');
app.use ("/api/Bitskins", bitskinsRoutes);

const dmarketRoutes = require('./routes/dmarket-route');
app.use("/api/Dmarket", dmarketRoutes);

const skinportRoutes = require('./routes/skinport-route');
app.use("/api/Skinport", skinportRoutes);

const steamRoutes = require('./routes/steam-route');
app.use("/api/Steam", steamRoutes);

const skinbaronRoutes = require('./routes/skinbaron-route');
app.use("/api/Skinbaron", skinbaronRoutes);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
});