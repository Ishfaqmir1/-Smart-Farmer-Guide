import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getNDVI } from "../services/sentinelService.js";

const router = express.Router();

/* ==============================
   POST /api/satellite/ndvi
   Calculates NDVI for AOI
============================== */
router.post("/ndvi", protect, async (req, res) => {
  try {
    const { aoi } = req.body;

    if (!aoi || aoi.type !== "Polygon") {
      return res.status(400).json({ error: "Invalid AOI geometry" });
    }

    const ndvi = await getNDVI(aoi);

    res.json({
      success: true,
      ndvi: Number(ndvi.toFixed(2)),
      status:
        ndvi > 0.6
          ? "Healthy"
          : ndvi > 0.4
          ? "Moderate"
          : "Poor"
    });
  } catch (err) {
    console.error("SENTINEL NDVI ERROR:", err.message);
    res.status(500).json({ error: "NDVI processing failed" });
  }
});

export default router;
