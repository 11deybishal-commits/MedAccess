import pytesseract
from PIL import Image
import os
import google.generativeai as genai
from pdf2image import convert_from_path
from dotenv import load_dotenv

# Load API Key from environment
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Tesseract Configuration for Windows
# The user confirmed they want Tesseract OCR.
# Default install path: C:\Program Files\Tesseract-OCR\tesseract.exe
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Configure Gemini
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    print("WARNING: GEMINI_API_KEY not found in .env file.")

async def analyze_medical_report(file_path: str):
    """
    Extracts text from a medical report (Image or PDF) and uses Gemini to analyze it.
    """
    extracted_text = ""
    
    file_ext = os.path.splitext(file_path)[1].lower()
    
    # 1. OCR Logic
    try:
        if file_ext in ['.png', '.jpg', '.jpeg']:
            # For images
            image = Image.open(file_path)
            extracted_text = pytesseract.image_to_string(image)
        elif file_ext == '.pdf':
            # For PDFs (convert pages to images then OCR)
            pages = convert_from_path(file_path)
            for page in pages:
                text = pytesseract.image_to_string(page)
                extracted_text += text + "\n"
        else:
            return {"error": "Unsupported file format. Please upload an image or PDF."}
    except Exception as e:
        print(f"OCR Error: {e}")
        # If tesseract fails (e.g., not installed), fallback to basic error message
        return {
            "error": "OCR system failed. Ensure Tesseract OCR is installed at C:\\Program Files\\Tesseract-OCR\\tesseract.exe",
            "details": str(e)
        }

    if not extracted_text.strip():
        return {"error": "Could not extract any text from the provided file."}

    # 2. AI Explanation Logic
    if not GEMINI_API_KEY:
        return {
            "error": "Gemini API key missing. Please configure it in .env file.",
            "raw_text": extracted_text[:500] + "..."
        }

    prompt = f"""
    You are a medical report analyzer. Below is the text extracted from a medical report.
    Analyze the text and provide a structured JSON response with:
    1. 'summary': A brief 2-sentence summary of the report.
    2. 'findings': A list of key values (e.g., Hemoglobin, Glucose levels) and if they are abnormal.
    3. 'advice': Simple language explanation of what this means.
    4. 'precautions': List of things to do or avoid.
    5. 'medicines': List of common OTC medicines (with warnings) if relevant, otherwise state none.
    6. 'urgency': How urgently should the user see a doctor (Low, Medium, High).

    MANDATORY: Include a disclaimer at the end saying "This is not a medical diagnosis. Consult a licensed doctor before taking any medication."

    --- REPORT TEXT ---
    {extracted_text}
    """

    try:
        response = model.generate_content(prompt)
        # Assuming the response is JSON-ish or just plain text to be parsed
        # For production-ready, we should use Gemini's structured output mode if available
        # But here we'll just return the text response clearly.
        
        return {
            "analysis": response.text,
            "disclaimer": "This is not a medical diagnosis. Consult a licensed doctor before taking any medication.",
            "raw_text_extracted": extracted_text[:200] + "..."
        }
    except Exception as e:
        return {"error": f"Gemini error: {e}", "raw_text": extracted_text[:500]}
