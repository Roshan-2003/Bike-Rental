import Bike from "../models/Bike.js";

// CREATE BIKE
export const createBike = async (req, res) => {
  try {
    const bike = await Bike.create(req.body);

    res.status(201).json({
      success: true,
      message: "Bike created successfully",
      bike,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL BIKES
export const getAllBikes = async (req, res) => {
  try {
    const {
      search,
      brand,
      type,
      location,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
      sort = "newest",
    } = req.query;

    const filter = {};

    // Search
    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          brand: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Brand
    if (brand) {
      filter.brand = brand;
    }

    // Type
    if (type) {
      filter.type = type;
    }

    // Location
    if (location) {
      filter.location = location;
    }

    // Price
    if (minPrice || maxPrice) {
      filter.pricePerDay = {};

      if (minPrice) {
        filter.pricePerDay.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.pricePerDay.$lte = Number(maxPrice);
      }
    }

    // Sorting
    let sortOption = {
      createdAt: -1,
    };

    if (sort === "priceLow") {
      sortOption = {
        pricePerDay: 1,
      };
    }

    if (sort === "priceHigh") {
      sortOption = {
        pricePerDay: -1,
      };
    }

    const skip =
      (Number(page) - 1) *
      Number(limit);

    const bikes = await Bike.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await Bike.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(
        total / Number(limit)
      ),
      bikes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE BIKE
export const getBikeById = async (req, res) => {
  try {
    const bike = await Bike.findById(
      req.params.id
    );

    if (!bike) {
      return res.status(404).json({
        success: false,
        message: "Bike not found",
      });
    }

    res.status(200).json({
      success: true,
      bike,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE BIKE
export const updateBike = async (req, res) => {
  try {
    const bike =
      await Bike.findByIdAndUpdate(
        req.params.id,
        req.body,
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

    res.status(200).json({
      success: true,
      message: "Bike updated successfully",
      bike,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE BIKE
export const deleteBike = async (req, res) => {
  try {
    const bike =
      await Bike.findByIdAndDelete(
        req.params.id
      );

    if (!bike) {
      return res.status(404).json({
        success: false,
        message: "Bike not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bike deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};