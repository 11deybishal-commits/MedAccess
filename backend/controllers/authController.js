import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../middleware/errorHandler.js';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, city, phone } = req.body;

  console.log('[AUTH] Register attempt for:', email);

  // Validation
  if (!name || !email || !password) {
    console.log('[AUTH] Missing required fields for registration');
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  // Check if user exists
  let user = await User.findOne({ email });
  if (user) {
    console.log('[AUTH] User already exists:', email);
    return res.status(400).json({ message: 'User already exists' });
  }

  // Create user
  user = new User({
    name,
    email,
    password,
    city: city || '',
    phone: phone || '',
  });

  console.log('[AUTH] Saving new user:', email);

  await user.save();

  console.log('[AUTH] User saved, generating token');

  const token = generateToken(user._id, user.role);

  console.log('[AUTH] Registration successful for:', email);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log('[AUTH] Login attempt for:', email);

  // Validation
  if (!email || !password) {
    console.log('[AUTH] Missing email or password');
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    console.log('[AUTH] User not found:', email);
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  console.log('[AUTH] User found, checking password');

  // Check password
  const isPasswordValid = await user.matchPassword(password);
  if (!isPasswordValid) {
    console.log('[AUTH] Invalid password for user:', email);
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  console.log('[AUTH] Password valid, generating token for:', email);

  const token = generateToken(user._id, user.role);

  console.log('[AUTH] Login successful for:', email);

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
    },
  });
});

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
    },
  });
});

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
