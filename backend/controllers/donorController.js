import BloodDonor from '../models/BloodDonor.js';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const registerDonor = asyncHandler(async (req, res) => {
  const { bloodGroup, city, phone, lastDonationDate, availability, latitude, longitude } = req.body;

  if (!bloodGroup || !city || !phone) {
    return res.status(400).json({ message: 'Blood group, city, and phone are required' });
  }

  // Check if donor already exists
  let donor = await BloodDonor.findOne({ userId: req.user.id });
  if (donor) {
    return res.status(400).json({ message: 'You are already registered as a donor' });
  }

  const location = latitude && longitude
    ? {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      }
    : undefined;

  donor = new BloodDonor({
    userId: req.user.id,
    bloodGroup,
    city,
    phone,
    lastDonationDate: lastDonationDate || null,
    availability: availability !== undefined ? availability : true,
    location,
    address: req.body.address || '',
  });

  await donor.save();

  // Update user to mark as donor
  await User.findByIdAndUpdate(req.user.id, {
    $set: { isDonor: true, bloodGroup },
  });

  res.status(201).json({
    success: true,
    message: 'Successfully registered as blood donor',
    donor: {
      id: donor._id,
      bloodGroup: donor.bloodGroup,
      city: donor.city,
      phone: donor.phone,
      availability: donor.availability,
    },
  });
});

export const searchDonors = asyncHandler(async (req, res) => {
  const { bloodGroup, city, latitude, longitude, radius = 10 } = req.query;

  const filter = { availability: true };

  if (bloodGroup) {
    filter.bloodGroup = bloodGroup;
  }

  if (city) {
    filter.city = { $regex: city, $options: 'i' };
  }

  // Geospatial search
  if (latitude && longitude) {
    filter.location = {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        $maxDistance: radius * 1000, // Convert to meters
      },
    };
  }

  const donors = await BloodDonor.find(filter)
    .populate('userId', 'name phone email')
    .limit(20);

  const enrichedDonors = donors.map((donor) => ({
    id: donor._id,
    name: donor.userId?.name,
    bloodGroup: donor.bloodGroup,
    city: donor.city,
    phone: donor.phone,
    email: donor.userId?.email,
    lastDonationDate: donor.lastDonationDate,
    availability: donor.availability,
    donationCount: donor.donationCount,
  }));

  res.status(200).json({
    success: true,
    donors: enrichedDonors,
    count: enrichedDonors.length,
  });
});

export const getMyDonorProfile = asyncHandler(async (req, res) => {
  const donor = await BloodDonor.findOne({ userId: req.user.id }).populate(
    'userId',
    'name email phone'
  );

  if (!donor) {
    return res.status(404).json({ message: 'Donor profile not found' });
  }

  res.status(200).json({
    success: true,
    donor: {
      id: donor._id,
      name: donor.userId?.name,
      bloodGroup: donor.bloodGroup,
      city: donor.city,
      phone: donor.phone,
      email: donor.userId?.email,
      lastDonationDate: donor.lastDonationDate,
      availability: donor.availability,
      donationCount: donor.donationCount,
    },
  });
});

export const updateDonorProfile = asyncHandler(async (req, res) => {
  const { bloodGroup, city, phone, lastDonationDate, availability } = req.body;

  const donor = await BloodDonor.findOneAndUpdate(
    { userId: req.user.id },
    {
      $set: {
        ...(bloodGroup && { bloodGroup }),
        ...(city && { city }),
        ...(phone && { phone }),
        ...(lastDonationDate && { lastDonationDate }),
        ...(availability !== undefined && { availability }),
      },
    },
    { new: true }
  );

  if (!donor) {
    return res.status(404).json({ message: 'Donor profile not found' });
  }

  res.status(200).json({
    success: true,
    message: 'Donor profile updated successfully',
    donor: {
      id: donor._id,
      bloodGroup: donor.bloodGroup,
      city: donor.city,
      phone: donor.phone,
      availability: donor.availability,
    },
  });
});

export const getAllDonors = asyncHandler(async (req, res) => {
  const donors = await BloodDonor.find()
    .populate('userId', 'name email phone')
    .limit(100);

  const enrichedDonors = donors.map((donor) => ({
    id: donor._id,
    name: donor.userId?.name,
    bloodGroup: donor.bloodGroup,
    city: donor.city,
    phone: donor.phone,
    email: donor.userId?.email,
    availability: donor.availability,
    donationCount: donor.donationCount,
    createdAt: donor.createdAt,
  }));

  res.status(200).json({
    success: true,
    donors: enrichedDonors,
    count: enrichedDonors.length,
  });
});
