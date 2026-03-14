import BloodRequest from '../models/BloodRequest.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const createBloodRequest = asyncHandler(async (req, res) => {
  const { bloodGroup, hospital, city, urgency, contact, unitsNeeded, notes, latitude, longitude } =
    req.body;

  if (!bloodGroup || !hospital || !city || !contact) {
    return res.status(400).json({
      message: 'Blood group, hospital, city, and contact are required',
    });
  }

  const location = latitude && longitude
    ? {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      }
    : undefined;

  const bloodRequest = new BloodRequest({
    userId: req.user.id,
    bloodGroup,
    hospital,
    city,
    urgency: urgency || 'medium',
    contact,
    unitsNeeded: unitsNeeded || 1,
    notes: notes || '',
    location,
    status: 'pending',
  });

  await bloodRequest.save();

  res.status(201).json({
    success: true,
    message: 'Blood request created successfully',
    request: {
      id: bloodRequest._id,
      bloodGroup: bloodRequest.bloodGroup,
      hospital: bloodRequest.hospital,
      urgency: bloodRequest.urgency,
      status: bloodRequest.status,
    },
  });
});

export const getBloodRequests = asyncHandler(async (req, res) => {
  const { bloodGroup, city, urgency, latitude, longitude, radius = 10 } = req.query;

  const filter = { status: 'pending' };

  if (bloodGroup) {
    filter.bloodGroup = bloodGroup;
  }

  if (city) {
    filter.city = { $regex: city, $options: 'i' };
  }

  if (urgency) {
    filter.urgency = urgency;
  }

  // Geospatial search
  if (latitude && longitude) {
    filter.location = {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        $maxDistance: radius * 1000,
      },
    };
  }

  const requests = await BloodRequest.find(filter)
    .populate('userId', 'name email phone')
    .sort({ createdAt: -1 })
    .limit(50);

  const enrichedRequests = requests.map((req) => ({
    id: req._id,
    bloodGroup: req.bloodGroup,
    hospital: req.hospital,
    city: req.city,
    urgency: req.urgency,
    contact: req.contact,
    unitsNeeded: req.unitsNeeded,
    status: req.status,
    createdAt: req.createdAt,
    requesterName: req.userId?.name,
    requesterEmail: req.userId?.email,
  }));

  res.status(200).json({
    success: true,
    requests: enrichedRequests,
    count: enrichedRequests.length,
  });
});

export const getMyBloodRequests = asyncHandler(async (req, res) => {
  const requests = await BloodRequest.find({ userId: req.user.id })
    .sort({ createdAt: -1 });

  const enrichedRequests = requests.map((req) => ({
    id: req._id,
    bloodGroup: req.bloodGroup,
    hospital: req.hospital,
    city: req.city,
    urgency: req.urgency,
    contact: req.contact,
    unitsNeeded: req.unitsNeeded,
    status: req.status,
    notes: req.notes,
    createdAt: req.createdAt,
  }));

  res.status(200).json({
    success: true,
    requests: enrichedRequests,
    count: enrichedRequests.length,
  });
});

export const updateBloodRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const bloodRequest = await BloodRequest.findByIdAndUpdate(
    id,
    {
      $set: {
        ...(status && { status }),
        ...(notes && { notes }),
      },
    },
    { new: true }
  );

  if (!bloodRequest) {
    return res.status(404).json({ message: 'Blood request not found' });
  }

  res.status(200).json({
    success: true,
    message: 'Blood request updated successfully',
    request: bloodRequest,
  });
});

export const deleteBloodRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const bloodRequest = await BloodRequest.findByIdAndDelete(id);

  if (!bloodRequest) {
    return res.status(404).json({ message: 'Blood request not found' });
  }

  res.status(200).json({
    success: true,
    message: 'Blood request deleted successfully',
  });
});
