import express from "express";
import Orchard from "../models/Orchard.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/* CREATE ORCHARD */
router.post("/", protect, async (req, res) => {
  try {
    const { name, aoi } = req.body;
    if (!name || !aoi)
      return res.status(400).json({ message: "Name & AOI required" });

    const ndvi = Number((Math.random() * 0.5 + 0.3).toFixed(2));

    const orchard = await Orchard.create({
      user: req.user._id,
      name,
      aoi,
      ndvi,
    });

    res.status(201).json(orchard);
  } catch (err) {
    res.status(500).json({ message: "Create orchard failed" });
  }
});

/* GET USER ORCHARDS */
router.get("/", protect, async (req, res) => {
  const orchards = await Orchard.find({ user: req.user._id });
  res.json(orchards);
});

/* DELETE ORCHARD */
router.delete("/:id", protect, async (req, res) => {
  await Orchard.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });
  res.json({ success: true });
});

export default router;
