import mongoose from "mongoose";

const orchardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    aoi: {
      type: Object, // GeoJSON geometry (Polygon)
      required: true,
    },

    ndvi: {
      type: Number, // Real NDVI value from Sentinel Hub
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Orchard", orchardSchema);
