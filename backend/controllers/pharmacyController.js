import axios from 'axios';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../middleware/errorHandler.js';
import Pharmacy from '../models/Pharmacy.js';
import Medicine from '../models/Medicine.js';

// ──── Pharmacy Auth Routes ────
export const registerPharmacy = asyncHandler(async (req, res) => {
  const { pharmacyName, email, password, phone, address, city, walletAddress } = req.body;

  if (!pharmacyName || !email || !password || !phone) {
    return res.status(400).json({ message: 'Please fill all required fields' });
  }

  const existingPharmacy = await Pharmacy.findOne({ email: email.toLowerCase() });
  if (existingPharmacy) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const pharmacy = new Pharmacy({
    pharmacyName,
    email: email.toLowerCase(),
    password: hashedPassword,
    phone,
    address,
    city,
    walletAddress,
  });

  await pharmacy.save();

  res.status(201).json({
    success: true,
    message: 'Pharmacy registered successfully',
    pharmacyId: pharmacy._id,
  });
});

export const loginPharmacy = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const pharmacy = await Pharmacy.findOne({ email: email.toLowerCase() });
  if (!pharmacy) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isPasswordValid = await bcrypt.compare(password, pharmacy.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { pharmacyId: pharmacy._id, email: pharmacy.email },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '30d' }
  );

  res.json({
    success: true,
    token,
    pharmacyId: pharmacy._id,
    pharmacyName: pharmacy.pharmacyName,
    message: 'Login successful',
  });
});

// ──── Medicine Management Routes ────
export const addMedicine = asyncHandler(async (req, res) => {
  const { pharmacyId, name, dosage, quantity, price, description, manufacturer, expiryDate, batchNumber } = req.body;

  if (!pharmacyId || !name || !price) {
    return res.status(400).json({ message: 'Please fill required fields' });
  }

  const medicine = new Medicine({
    pharmacyId,
    name,
    dosage,
    quantity: quantity || 0,
    price,
    description,
    manufacturer,
    expiryDate,
    batchNumber,
  });

  await medicine.save();

  res.status(201).json({
    success: true,
    message: 'Medicine added successfully',
    medicine,
  });
});

export const getMedicines = asyncHandler(async (req, res) => {
  const { pharmacyId } = req.params;

  const medicines = await Medicine.find({ pharmacyId });

  res.json({
    success: true,
    medicines,
  });
});

export const updateMedicine = asyncHandler(async (req, res) => {
  const { medicineId } = req.params;
  const { quantity, price, ...rest } = req.body;

  const medicine = await Medicine.findByIdAndUpdate(
    medicineId,
    { quantity, price, ...rest },
    { new: true }
  );

  if (!medicine) {
    return res.status(404).json({ message: 'Medicine not found' });
  }

  res.json({
    success: true,
    message: 'Medicine updated successfully',
    medicine,
  });
});

export const deleteMedicine = asyncHandler(async (req, res) => {
  const { medicineId } = req.params;

  const medicine = await Medicine.findByIdAndDelete(medicineId);

  if (!medicine) {
    return res.status(404).json({ message: 'Medicine not found' });
  }

  res.json({
    success: true,
    message: 'Medicine deleted successfully',
  });
});

// ──── Price Comparison with Gemini AI ────
export const getPriceComparison = asyncHandler(async (req, res) => {
  const { medicineName, pharmacyName } = req.body;

  if (!medicineName) {
    return res.status(400).json({ message: 'Medicine name is required' });
  }

  try {
    // Fetch all medicines with the same name from all pharmacies
    const allMedicines = await Medicine.find({ name: new RegExp(medicineName, 'i') }).populate('pharmacyId');

    // Get current pharmacy's medicine price
    const currentMedicine = allMedicines.find(m => m.pharmacyId.pharmacyName === pharmacyName);
    const currentPrice = currentMedicine?.price || 0;

    // Create shop data for comparison
    const shops = allMedicines.map(med => ({
      shopName: med.pharmacyId.pharmacyName,
      location: med.pharmacyId.city || 'Unknown',
      price: med.price,
      stock: med.quantity,
    }));

    // Prepare Gemini API prompt
    const prompt = `
As a pharmaceutical price analysis AI, analyze the following medicine prices:

Medicine: ${medicineName}
Current pharmacy: ${pharmacyName}
Prices from different pharmacies:
${shops.map(s => `- ${s.shopName}: $${s.price} (Stock: ${s.stock || 'Available'})`).join('\n')}

Provide a brief analysis (2-3 sentences) on:
1. Whether the current pharmacy's price is competitive
2. Market average price range
3. Recommendation for the pharmacy

Format your response as a brief, actionable insight.
    `.trim();

    // Call Gemini API
    const geminiResponse = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      {
        contents: [{
          parts: [{
            text: prompt,
          }],
        }],
      },
      {
        params: {
          key: process.env.GEMINI_API_KEY || 'AIzaSyAEboEMlgxSpJ_tdM7ToOmHJRtglusipEA',
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    let analysis =
      geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      `Market analysis shows ${shops.length} pharmacies selling this medicine. Average price: $${(
        shops.reduce((sum, s) => sum + s.price, 0) / shops.length
      ).toFixed(2)}. Your price is ${currentPrice > 0 ? (currentPrice > (shops.reduce((sum, s) => sum + s.price, 0) / shops.length) ? 'above' : 'below') : 'not set'} market average.`;

    res.json({
      success: true,
      medicineName,
      comparison: {
        medicineName,
        shops: shops.sort((a, b) => a.price - b.price), // Sort by price
        analysis,
        marketAverage: (shops.reduce((sum, s) => sum + s.price, 0) / shops.length).toFixed(2),
        currentPrice: currentPrice.toFixed(2),
      },
    });
  } catch (error) {
    console.error('Gemini API Error:', error.response?.data || error.message);

    // Fallback analysis if Gemini fails
    const medicines = await Medicine.find({ name: new RegExp(medicineName, 'i') }).populate('pharmacyId');
    const shops = medicines.map(med => ({
      shopName: med.pharmacyId.pharmacyName,
      location: med.pharmacyId.city || 'Unknown',
      price: med.price,
      stock: med.quantity,
    }));

    const average = shops.length > 0 ? (shops.reduce((sum, s) => sum + s.price, 0) / shops.length).toFixed(2) : 0;

    res.json({
      success: true,
      medicineName,
      comparison: {
        medicineName,
        shops: shops.sort((a, b) => a.price - b.price),
        analysis: `Market analysis shows ${shops.length} pharmacies selling ${medicineName}. Average market price: $${average}. Check your pricing strategy for competitiveness.`,
        marketAverage: average,
      },
    });
  }
});

// ──── Existing Routes (Keep these) ────
export const getNearbyPharmacies = asyncHandler(async (req, res) => {
  const { latitude, longitude, radius = 5000 } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Latitude and longitude are required' });
  }

  const mockPharmacies = [
    {
      id: 'mock-pharm-1',
      name: 'MediCare Heights Pharmacy',
      address: '42 Health St, Medical District',
      lat: parseFloat(latitude) + 0.005,
      lng: parseFloat(longitude) + 0.008,
      rating: 4.9,
      openNow: true,
      types: ['pharmacy', 'health', 'store']
    },
    {
      id: 'mock-pharm-2',
      name: '24/7 LifeSavers Drug Store',
      address: '101 Wellness Blvd, Downtown',
      lat: parseFloat(latitude) - 0.012,
      lng: parseFloat(longitude) + 0.003,
      rating: 4.7,
      openNow: true,
      types: ['pharmacy', 'health', 'store']
    },
    {
      id: 'mock-pharm-3',
      name: 'Community Care Apothecary',
      address: '778 Care Lane, Suburbs',
      lat: parseFloat(latitude) + 0.002,
      lng: parseFloat(longitude) - 0.015,
      rating: 4.5,
      openNow: false,
      types: ['pharmacy', 'health', 'store']
    }
  ];

  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
      {
        params: {
          location: `${latitude},${longitude}`,
          radius,
          type: 'pharmacy',
          key: process.env.GOOGLE_PLACES_API_KEY,
        },
      }
    );

    if (response.data.status === 'REQUEST_DENIED' || response.data.status === 'ZERO_RESULTS' || !response.data.results.length) {
      console.warn(`Google API returned ${response.data.status} for pharmacies. Resorting to mock data.`);
      return res.status(200).json({
        success: true,
        pharmacies: mockPharmacies,
        count: mockPharmacies.length,
        isMock: true
      });
    }

    const pharmacies = response.data.results.map((place) => ({
      id: place.place_id,
      name: place.name,
      address: place.vicinity,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      rating: place.rating || 'N/A',
      openNow: place.opening_hours?.open_now,
      types: place.types,
    }));

    res.status(200).json({
      success: true,
      pharmacies,
      count: pharmacies.length,
    });
  } catch (error) {
    console.warn('Error fetching pharmacies via API, resorting to mock data:', error.message);
    res.status(200).json({
      success: true,
      pharmacies: mockPharmacies,
      count: mockPharmacies.length,
      isMock: true
    });
  }
});

export const getNearbyEmergencyServices = asyncHandler(async (req, res) => {
  const { latitude, longitude, radius = 5000, type = 'police' } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Latitude and longitude are required' });
  }

  const mockServices = [
    {
      id: 'mock-em-1',
      name: `Central ${type.charAt(0).toUpperCase() + type.slice(1)} Department`,
      address: '1 Emergency Way, District Center',
      lat: parseFloat(latitude) + 0.007,
      lng: parseFloat(longitude) + 0.002,
      rating: 4.6,
      openNow: true,
    },
    {
      id: 'mock-em-2',
      name: `Northside ${type.charAt(0).toUpperCase() + type.slice(1)} Station`,
      address: '55 Response Rd, North District',
      lat: parseFloat(latitude) - 0.009,
      lng: parseFloat(longitude) - 0.008,
      rating: 4.8,
      openNow: true,
    }
  ];

  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
      {
        params: {
          location: `${latitude},${longitude}`,
          radius,
          type: type,
          key: process.env.GOOGLE_PLACES_API_KEY,
        },
      }
    );

    if (response.data.status === 'REQUEST_DENIED' || response.data.status === 'ZERO_RESULTS' || !response.data.results.length) {
      console.warn(`Google API returned ${response.data.status} for emergency. Resorting to mock data.`);
      return res.status(200).json({
        success: true,
        services: mockServices,
        count: mockServices.length,
        isMock: true
      });
    }

    const services = response.data.results.map((place) => ({
      id: place.place_id,
      name: place.name,
      address: place.vicinity,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      rating: place.rating || 'N/A',
      openNow: place.opening_hours?.open_now,
    }));

    res.status(200).json({
      success: true,
      services,
      count: services.length,
    });
  } catch (error) {
    console.warn('Error fetching emergency services via API, resorting to mock data:', error.message);
    res.status(200).json({
      success: true,
      services: mockServices,
      count: mockServices.length,
      isMock: true
    });
  }
});
