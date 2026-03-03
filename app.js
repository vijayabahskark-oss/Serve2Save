const express = require('express');
const path = require('path');
const pool = require('./config/db');
const { findBestMatch } = require('./services/matchingService');

const app = express();
app.use(express.json());

// ---------------- SERVE FRONTEND ----------------
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// ---------------- CREATE LISTING ----------------
app.post('/listings', async (req, res) => {
    try {
        const { hotelId, latitude, longitude, expiryMinutes } = req.body;

        const expiryTime = Date.now() + expiryMinutes * 60 * 1000;

        const result = await pool.query(
            `INSERT INTO listings 
             (hotel_id, latitude, longitude, expiry_time, status)
             VALUES ($1, $2, $3, $4, 'active')
             RETURNING *`,
            [hotelId, latitude, longitude, expiryTime]
        );

        res.json({ success: true, listing: result.rows[0] });

    } catch (err) {
        console.error("Create listing error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// ---------------- RUN MATCHING ----------------
app.get('/match/:listingId', async (req, res) => {
    try {
        const listingId = req.params.listingId;

        console.log("Matching request for listing:", listingId);

        const listingResult = await pool.query(
            `SELECT * FROM listings 
             WHERE id = $1 AND status = 'active'`,
            [listingId]
        );

        if (listingResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Listing not found or already matched"
            });
        }

        const listing = listingResult.rows[0];

        const ngosResult = await pool.query(
            `SELECT * FROM users WHERE role = 'ngo'`
        );

        const ngos = ngosResult.rows;

        const formattedListing = {
            lat: listing.latitude,
            lon: listing.longitude,
            expiryTime: Number(listing.expiry_time)
        };

        const formattedNgos = ngos.map(ngo => ({
            id: ngo.id,
            name: ngo.name,
            lat: ngo.latitude,
            lon: ngo.longitude,
            reliability: ngo.reliability_score || 0.8,
            capacityRatio: ngo.capacity_ratio || 0.8,
            matchesToday: 0,
            lastMatchTime: null
        }));

        const results = findBestMatch(formattedListing, formattedNgos);

        if (results.length === 0) {
            return res.json({
                success: false,
                message: "No NGOs available within radius"
            });
        }

        const best = results[0];

        await pool.query(
            `INSERT INTO matches (listing_id, ngo_id, score, distance)
             VALUES ($1, $2, $3, $4)`,
            [listingId, best.id, best.score, best.distance]
        );

        await pool.query(
            `UPDATE listings SET status = 'matched' WHERE id = $1`,
            [listingId]
        );

        res.json({ success: true, data: results });

    } catch (err) {
        console.error("Match error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// ---------------- MATCH DISTRIBUTION ----------------
app.get('/distribution', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT ngo_id, COUNT(*) 
             FROM matches 
             GROUP BY ngo_id 
             ORDER BY ngo_id`
        );

        res.json(result.rows);

    } catch (err) {
        console.error("Distribution error:", err);
        res.status(500).json({ message: err.message });
    }
});

// ---------------- SYSTEM STATS ----------------
app.get('/stats', async (req, res) => {
    try {
        const totalListings = await pool.query(
            `SELECT COUNT(*) FROM listings`
        );

        const activeListings = await pool.query(
            `SELECT COUNT(*) FROM listings WHERE status = 'active'`
        );

        const totalMatches = await pool.query(
            `SELECT COUNT(*) FROM matches`
        );

        res.json({
            totalListings: totalListings.rows[0].count,
            activeListings: activeListings.rows[0].count,
            totalMatches: totalMatches.rows[0].count
        });

    } catch (err) {
        console.error("Stats error:", err);
        res.status(500).json({ message: err.message });
    }
});

// ---------------- START SERVER ----------------
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
