import express from "express";
import { searchPlanetImages } from "../services/planetService.js";

const router = express.Router();

/* ==============================
   POST /api/satellite/search
============================== */
router.post("/search", async (req, res) => {
  try {
    const { aoi, from, to } = req.body;

    if (!aoi || aoi.length < 3) {
      return res.status(400).json({ error: "Invalid AOI polygon" });
    }

    const images = await searchPlanetImages(
      aoi,
      from || "2025-01-01T00:00:00Z",
      to || new Date().toISOString()
    );

    res.json({
      success: true,
      count: images.length,
      images
    });

  } catch (err) {
    console.error("PLANET SEARCH ERROR:", err.message);
    res.status(500).json({ error: "Planet search failed" });
  }
});

export default router;
