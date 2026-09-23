import mongoose from "mongoose";

const bikeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      required: true,
    },

    model: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      enum: [
        "Scooter",
        "Cruiser",
        "Sports",
        "Adventure",
        "Commuter",
        "Electric",
      ],
      required: true,
    },

    pricePerDay: {
      type: Number,
      required: true,
      min: 0,
    },

    location: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    fuelType: {
      type: String,
      enum: [
        "Petrol",
        "Electric",
      ],
      default: "Petrol",
    },

    transmission: {
      type: String,
      enum: [
        "Manual",
        "Automatic",
      ],
      default: "Manual",
    },

    engineCC: {
      type: Number,
      default: 0,
    },

    seats: {
      type: Number,
      default: 2,
    },

    available: {
      type: Boolean,
      default: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Bike = mongoose.model("Bike", bikeSchema);

export default Bike;