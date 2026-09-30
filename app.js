const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/lokasi", async (req, res) => {
    const lokasi = String(req.query.lokasi || "").trim();

    if (!lokasi) {
        return res.status(400).json({ message: "Masukkan nama lokasi terlebih dahulu." });
    }

    const apikey = "TmW3n2IbOKaZxkghOoYB";

    const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(lokasi)}.json?key=${apikey}&limit=1&language=id`;