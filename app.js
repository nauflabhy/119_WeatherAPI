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

    try {
        const response = await axios.get(url);
        const feature = response.data.features?.[0];

        if (!feature) {
            return res.status(404).json({ message: `Lokasi "${lokasi}" tidak ditemukan.` });
        }

        const context = feature.context || [];
        const findContext = (types) => context.find((item) =>
            types.some((type) => item.id?.startsWith(`${type}.`))
        )?.text || null;
        const coordinates = feature.center || feature.geometry?.coordinates || [];

        res.json({
            lokasi: feature.matching_text || feature.text || feature.place_name || lokasi,
            negara: findContext(["country"]),
            provinsi: findContext(["region", "province", "state"]),
            kecamatan: findContext(["district", "county", "municipality"]),
            longitude: coordinates[0] ?? null,
            latitude: coordinates[1] ?? null
        });
    } catch (error) {
        console.error("MapTiler error:", error.message);
        res.status(500).json({
            message: "Gagal mengambil data dari MapTiler. Periksa koneksi atau API key."
        });
    }
});