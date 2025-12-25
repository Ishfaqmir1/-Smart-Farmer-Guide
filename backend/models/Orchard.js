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
      type: Object, // GeoJSON geometry
      required: true,
    },

    ndvi: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Orchard", orchardSchema);
