import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import Report from '../models/Report.js';
import Diagnosis from '../models/Diagnosis.js';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// @desc    Diagnose possible diseases based on symptoms
// @route   POST /api/ai/diagnose
// @access  Private
export const diagnoseSymptoms = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || !Array.isArray(symptoms)) {
      return res.status(400).json({ success: false, message: 'Symptoms must be an array of strings.' });
    }

    const response = await axios.post(`${AI_SERVICE_URL}/predict`, { symptoms });
    
    // Save to Database
    const newDiagnosis = new Diagnosis({
        user: req.user.id,
        symptoms,
        predictions: response.data.predictions,
        primaryPrediction: response.data.primary_prediction,
        disclaimer: response.data.disclaimer
    });
    await newDiagnosis.save();

    res.status(200).json({
      success: true,
      data: response.data,
      diagnosisId: newDiagnosis._id,
      disclaimer: "This is not a medical diagnosis. Consult a licensed doctor before taking any medication."
    });
  } catch (error) {
    if (error.response) {
      console.error(`AI Service Error (${error.response.status}):`, error.response.data);
      return res.status(error.response.status).json({ 
        success: false,
        message: error.response.data.detail || 'The AI service returned an error.',
        error: error.message 
      });
    } else {
      console.error('AI Service Connection Error:', error.message);
      return res.status(503).json({ 
        success: false,
        message: 'The AI service is currently unavailable. Please ensure it is running on port 8000.',
        error: error.message 
      });
    }
  }
};

// @desc    Analyze a medical report file using OCR and Gemini
// @route   POST /api/ai/analyze-report
// @access  Private
export const analyzeReportFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const formData = new FormData();
    formData.append('file', fs.createReadStream(req.file.path), {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await axios.post(`${AI_SERVICE_URL}/analyze-report`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    // Clean up local temp file
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(200).json({
      success: true,
      data: response.data,
      disclaimer: "This is not a medical diagnosis. Consult a licensed doctor before taking any medication."
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    console.error('AI Service Error (Report):', error.message);
    res.status(error.response?.status || 500).json({ 
      success: false,
      message: 'Failed to process report. Ensure the Python service is running and Gemini key is set.',
      error: error.message 
    });
  }
};

// @desc    Analyze an existing report by ID (Integration with existing dashboard)
// @route   POST /api/reports/:id/analyze
// @access  Private
export const analyzeReport = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ success: false, message: 'Report not found' });
        }

        // For existing reports, we might need to fetch the file from its URL
        // Simplified for this implementation: assuming it's a local file or accessible URL
        // In a real system, you'd download the fileUrl to a temp path then process.
        
        res.status(200).json({
            success: true,
            message: "Feature coming soon: analyzing previously uploaded reports.",
            data: report
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Chat with AI medical assistant
// @route   POST /api/ai/chat
// @access  Public or Private
export const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ success: false, message: 'Message is required' });
        }
        
        const response = await axios.post(`${AI_SERVICE_URL}/chat`, { message });
        
        res.status(200).json({
            success: true,
            response: response.data.response
        });
    } catch (error) {
        console.error('AI Chat Error:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to communicate with AI chat service.',
            error: error.message 
        });
    }
};
