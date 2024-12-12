const School = require('../models/School');

// Add School
exports.addSchool = async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    // Validation
    if (!name || !address || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const school = new School({ name, address, latitude, longitude });
    await school.save();

    res.status(201).json({ message: "School added successfully.", school });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
};

// List Schools
exports.listSchools = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: "Latitude and longitude are required." });
    }

    const schools = await School.find();
    const userLocation = { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const toRad = (value) => (value * Math.PI) / 180;
      const R = 6371; // Radius of the Earth in km
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
          Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // Distance in km
    };

    const sortedSchools = schools
      .map((school) => ({
        ...school._doc,
        distance: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          school.latitude,
          school.longitude
        ),
      }))
      .sort((a, b) => a.distance - b.distance);

    res.status(200).json(sortedSchools);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
};
