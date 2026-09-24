import Bike from "../models/Bike.js";

export const getAllBikes = async (req, res) => {
  try {
    const { search, type, sort } = req.query;
    const filter = {};

    if (type) {
      filter.type = type;
    }

    if (search) {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { name: searchRegex },
        { brand: searchRegex },
        { model: searchRegex },
        { location: searchRegex },
      ];
    }

    const sortBy = {
      price_asc: { pricePerDay: 1 },
      price_desc: { pricePerDay: -1 },
      newest: { createdAt: -1 },
    };

    const bikes = await Bike.find(filter).sort(sortBy[sort] || { createdAt: -1 });

    return res.status(200).json({
      success: true,
      bikes,
    });
  } catch (error) {
    console.error("Get bikes error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load bikes",
    });
  }
};

export const getBikeById = async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id);

    if (!bike) {
      return res.status(404).json({
        success: false,
        message: "Bike not found",
      });
    }

    return res.status(200).json({
      success: true,
      bike,
    });
  } catch (error) {
    console.error("Get bike error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load bike",
    });
  }
};

export const createBike = async (req, res) => {
  try {
    const bikeData = {
      ...req.body,
      ...(req.file && {
        image: `${req.protocol}://${req.get("host")}/uploads/bikes/${req.file.filename}`,
      }),
    };
    const bike = await Bike.create(bikeData);

    return res.status(201).json({
      success: true,
      message: "Bike created successfully",
      bike,
    });
  } catch (error) {
    console.error("Create bike error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create bike",
    });
  }
};

export const updateBike = async (req, res) => {
  try {
    const bikeData = {
      ...req.body,
      ...(req.file && {
        image: `${req.protocol}://${req.get("host")}/uploads/bikes/${req.file.filename}`,
      }),
    };

    const bike = await Bike.findByIdAndUpdate(
      req.params.id,
      bikeData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!bike) {
      return res.status(404).json({
        success: false,
        message: "Bike not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Bike updated successfully",
      bike,
    });
  } catch (error) {
    console.error("Update bike error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update bike",
    });
  }
};

export const deleteBike = async (req, res) => {
  try {
    const bike = await Bike.findByIdAndDelete(
      req.params.id
    );

    if (!bike) {
      return res.status(404).json({
        success: false,
        message: "Bike not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Bike deleted successfully",
    });
  } catch (error) {
    console.error("Delete bike error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete bike",
    });
  }
};