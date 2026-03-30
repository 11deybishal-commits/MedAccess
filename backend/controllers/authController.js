import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../middleware/errorHandler.js';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Regular User Registration
// ─────────────────────────────────────────────────────────────────────────────
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, city, phone } = req.body;

  console.log('[AUTH] Register attempt for:', email);

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: 'User already exists' });
  }

  user = new User({ name, email, password, city: city || '', phone: phone || '' });
  await user.save();

  const token = generateToken(user._id, user.role);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Hospital Admin Registration
// ─────────────────────────────────────────────────────────────────────────────
export const registerHospital = asyncHandler(async (req, res) => {
  const {
    name, email, password, phone,
    hospitalName, hospitalAddress, hospitalPhone, hospitalDescription,
    hospitalSpecialties, registrationNumber, totalBeds, availableBeds,
    hospitalLat, hospitalLng,
  } = req.body;

  console.log('[AUTH] Hospital registration attempt for:', email);

  if (!name || !email || !password || !hospitalName || !hospitalAddress) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, password, hospital name and address are required',
    });
  }

  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }

  user = new User({
    name,
    email,
    password,
    phone: phone || '',
    role: 'hospital_admin',
    hospitalName,
    hospitalAddress,
    hospitalPhone: hospitalPhone || phone || '',
    hospitalDescription: hospitalDescription || '',
    hospitalSpecialties: hospitalSpecialties || [],
    registrationNumber: registrationNumber || '',
    totalBeds: totalBeds || 0,
    availableBeds: availableBeds || 0,
    hospitalLat: hospitalLat || null,
    hospitalLng: hospitalLng || null,
    isVerified: false,
    isActiveHospital: true,
  });

  await user.save();
  console.log('[AUTH] Hospital registered:', hospitalName);

  const token = generateToken(user._id, user.role);

  res.status(201).json({
    success: true,
    message: 'Hospital registered successfully',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      hospitalName: user.hospitalName,
      hospitalAddress: user.hospitalAddress,
      isVerified: user.isVerified,
    },
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Login (works for all roles)
// ─────────────────────────────────────────────────────────────────────────────
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log('[AUTH] Login attempt for:', email);

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const isPasswordValid = await user.matchPassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = generateToken(user._id, user.role);

  console.log('[AUTH] Login successful for:', email, '| Role:', user.role);

  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      city: user.city,
      // Hospital specific
      hospitalName: user.hospitalName,
      hospitalAddress: user.hospitalAddress,
      hospitalPhone: user.hospitalPhone,
      hospitalSpecialties: user.hospitalSpecialties,
      hospitalLat: user.hospitalLat,
      hospitalLng: user.hospitalLng,
      totalBeds: user.totalBeds,
      availableBeds: user.availableBeds,
      isVerified: user.isVerified,
    },
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Get Profile
// ─────────────────────────────────────────────────────────────────────────────
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      city: user.city,
      bloodGroup: user.bloodGroup,
      isDonor: user.isDonor,
      hospitalName: user.hospitalName,
      hospitalAddress: user.hospitalAddress,
      hospitalPhone: user.hospitalPhone,
      hospitalSpecialties: user.hospitalSpecialties,
      totalBeds: user.totalBeds,
      availableBeds: user.availableBeds,
      rating: user.rating,
      isVerified: user.isVerified,
    },
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Update Profile
// ─────────────────────────────────────────────────────────────────────────────
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, city, bloodGroup } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $set: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(city && { city }),
        ...(bloodGroup && { bloodGroup }),
      },
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      city: user.city,
      bloodGroup: user.bloodGroup,
    },
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/auth/hospitals  — Public: list all registered hospitals from DB
// ─────────────────────────────────────────────────────────────────────────────
export const getRegisteredHospitals = asyncHandler(async (req, res) => {
  const hospitals = await User.find({ role: 'hospital_admin', isActiveHospital: true })
    .select('hospitalName hospitalAddress hospitalPhone hospitalSpecialties hospitalLat hospitalLng totalBeds availableBeds rating isVerified hospitalDescription createdAt');

  res.status(200).json({ success: true, hospitals });
});
