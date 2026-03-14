import ResourceReport from '../models/ResourceReport.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const reportResource = asyncHandler(async (req, res) => {
  const { type, address, city, quantity, contact, notes, latitude, longitude } = req.body;

  if (!type || !address || !city || !contact) {
    return res.status(400).json({
      message: 'Type, address, city, and contact are required',
    });
  }

  const location = latitude && longitude
    ? {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      }
    : undefined;

  const resourceReport = new ResourceReport({
    userId: req.user.id,
    type,
    address,
    city,
    quantity: quantity || 'N/A',
    contact,
    notes: notes || '',
    location,
    status: 'pending',
  });

  await resourceReport.save();

  res.status(201).json({
    success: true,
    message: 'Resource reported successfully',
    report: {
      id: resourceReport._id,
      type: resourceReport.type,
      address: resourceReport.address,
      status: resourceReport.status,
    },
  });
});

export const getVerifiedResources = asyncHandler(async (req, res) => {
  const { type, city, latitude, longitude, radius = 10 } = req.query;

  const filter = { status: 'verified' };

  if (type) {
    filter.type = type;
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
        $maxDistance: radius * 1000,
      },
    };
  }

  const resources = await ResourceReport.find(filter)
    .populate('userId', 'name phone email')
    .populate('verifiedBy', 'name email')
    .sort({ createdAt: -1 })
    .limit(100);

  const enrichedResources = resources.map((resource) => ({
    id: resource._id,
    type: resource.type,
    address: resource.address,
    city: resource.city,
    quantity: resource.quantity,
    contact: resource.contact,
    notes: resource.notes,
    reporterName: resource.userId?.name,
    reporterPhone: resource.userId?.phone,
    createdAt: resource.createdAt,
  }));

  res.status(200).json({
    success: true,
    resources: enrichedResources,
    count: enrichedResources.length,
  });
});

export const getPendingResources = asyncHandler(async (req, res) => {
  const resources = await ResourceReport.find({ status: 'pending' })
    .populate('userId', 'name email phone')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    resources,
    count: resources.length,
  });
});

export const verifyResource = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const resource = await ResourceReport.findByIdAndUpdate(
    id,
    {
      $set: {
        status: 'verified',
        verified: true,
        verifiedBy: req.user.id,
      },
    },
    { new: true }
  );

  if (!resource) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  res.status(200).json({
    success: true,
    message: 'Resource verified successfully',
    resource,
  });
});

export const rejectResource = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const resource = await ResourceReport.findByIdAndUpdate(
    id,
    {
      $set: {
        status: 'rejected',
      },
    },
    { new: true }
  );

  if (!resource) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  res.status(200).json({
    success: true,
    message: 'Resource rejected',
    resource,
  });
});

export const getMyReports = asyncHandler(async (req, res) => {
  const reports = await ResourceReport.find({ userId: req.user.id })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    reports,
    count: reports.length,
  });
});

export const deleteResource = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const resource = await ResourceReport.findByIdAndDelete(id);

  if (!resource) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  res.status(200).json({
    success: true,
    message: 'Resource deleted successfully',
  });
});
