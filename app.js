const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/lokasi", async (req, res) => {

    const lokasi = req.query.lokasi;

    const apiKey = "TmW3n2IbOKaZxkghOoYB";

    if (!lokasi) {
        return res.status(400).json({
            message: "Lokasi belum diisi"
        });
    }

    const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(lokasi)}.json?key=${apiKey}`;

    try {

        const response = await axios.get(url);
        const data = response.data;

        if (!data.features || data.features.length === 0) {
            return res.status(404).json({
                message: "Lokasi tidak ditemukan"
            });
        }

        const tempat = data.features[0];

        const koordinat = tempat.geometry.coordinates;

        let negara = "-";
        let provinsi = "-";
        let kecamatan = "-";

        if (tempat.context) {

            tempat.context.forEach(item => {

                if (item.id.startsWith("country")) {
                    negara = item.text;
                }

                if (item.id.startsWith("region")) {
                    provinsi = item.text;
                }

                if (
                    item.id.startsWith("county") ||
                    item.id.startsWith("municipal_district") ||
                    item.id.startsWith("municipality")
                ) {
                    kecamatan = item.text;
                }

            });

        }

        res.json({
            lokasi: tempat.place_name,
            negara: negara,
            provinsi: provinsi,
            kecamatan: kecamatan,
            longitude: koordinat[0],
            latitude: koordinat[1]
        });

    } catch (error) {

        console.error(error.message);

        res.status(500).json({
            message: "Gagal mengambil data dari MapTiler"
        });

    }

});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});