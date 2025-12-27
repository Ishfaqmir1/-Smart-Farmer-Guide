import express from "express";
import Orchard from "../models/Orchard.js";
import protect from "../middleware/authMiddleware.js";
import { getNDVI } from "../services/sentinelService.js";

const router = express.Router();

/* CREATE ORCHARD */
router.post("/", protect, async (req, res) => {
  try {
    const { name, aoi } = req.body;
    if (!name || !aoi)
      return res.status(400).json({ message: "Name & AOI required" });

    const ndvi = await getNDVI(aoi);

    const orchard = await Orchard.create({
      user: req.user._id,
      name,
      aoi,
      ndvi: Number(ndvi?.toFixed(2)),
    });

    res.status(201).json(orchard);
  } catch (err) {
    console.error("NDVI ERROR:", err.message);
    res.status(500).json({ message: "NDVI calculation failed" });
  }
});

/* GET ORCHARDS */
router.get("/", protect, async (req, res) => {
  const orchards = await Orchard.find({ user: req.user._id });
  res.json(orchards);
});

/* DELETE */
router.delete("/:id", protect, async (req, res) => {
  await Orchard.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });
  res.json({ success: true });
});

export default router;
