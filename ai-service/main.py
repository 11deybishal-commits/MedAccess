import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import numpy as np
from pydantic import BaseModel
from typing import List
from report_analyzer import analyze_medical_report

app = FastAPI(title="MediAccess AI Service")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Model and Symptoms
MODEL_PATH = "model.pkl"
SYMPTOMS_PATH = "symptoms.pkl"

model = None
symptoms_list = None

def load_resources():
    global model, symptoms_list
    if os.path.exists(MODEL_PATH) and os.path.exists(SYMPTOMS_PATH):
        model = joblib.load(MODEL_PATH)
        symptoms_list = joblib.load(SYMPTOMS_PATH)
        print("Model and symptoms list loaded successfully.")
    else:
        print("Model files not found. Please run train_model.py first.")

@app.on_event("startup")
async def startup_event():
    load_resources()

class SymptomRequest(BaseModel):
    symptoms: List[str]

@app.get("/")
def read_root():
    return {"status": "AI Service Running", "model_loaded": model is not None}

@app.post("/predict")
async def predict_disease(request: SymptomRequest):
    if model is None or symptoms_list is None:
        raise HTTPException(status_code=500, detail="Model not loaded. Try again later.")
    
    # NLP Preprocessing: Synonyms and Fuzzy Matching
    import difflib
    synonyms = {
        "fever": ["high_fever", "mild_fever", "low_grade_fever"],
        "cough": ["continuous_cough", "dry_cough", "wet_cough", "mild_cough"],
        "tummy ache": ["abdominal_pain", "abdominal_cramps"],
        "stomach ache": ["abdominal_pain", "abdominal_cramps"],
        "puking": ["vomiting"],
        "throw up": ["vomiting"],
        "head ache": ["headache", "severe_headache"],
        "tired": ["fatigue", "weakness"],
        "exhausted": ["fatigue"],
        "runny nose": ["runny_nose", "congestion", "sneezing"],
        "breathing problem": ["shortness_of_breath", "rapid_breathing"],
        "dizzy": ["dizziness"]
    }
    
    # Create input vector initialized with 0
    input_vector = np.zeros(len(symptoms_list))
    
    matched_any = False
    for symptom in request.symptoms:
        # Normalize symptom name
        norm_symptom = symptom.strip().lower()
        
        # 1. Expand synonyms
        possible_matches = synonyms.get(norm_symptom, [norm_symptom.replace(" ", "_")])
        
        # 2. Fuzzy match against dataset symptoms
        for pm in possible_matches:
            matches = difflib.get_close_matches(pm, symptoms_list, n=2, cutoff=0.7)
            if matches:
                for m in matches:
                    idx = symptoms_list.index(m)
                    input_vector[idx] = 1
                    matched_any = True
    
    if not matched_any:
        return {
            "prediction": "Unknown",
            "confidence": 0,
            "message": "No recognized symptoms found in input.",
            "available_symptoms": symptoms_list[:10]  # Return some examples
        }

    # Predict
    # Predict probabilities instead of just class
    probs = model.predict_proba([input_vector])[0]
    classes = model.classes_
    
    # Sort by probability
    sorted_indices = np.argsort(probs)[::-1]
    
    results = []
    for i in range(min(3, len(sorted_indices))):
        idx = sorted_indices[i]
        results.append({
            "disease": classes[idx],
            "probability": round(float(probs[idx]) * 100, 2)
        })

    return {
        "predictions": results,
        "primary_prediction": results[0]["disease"],
        "disclaimer": "This is not a medical diagnosis. Consult a licensed doctor before taking any medication."
    }

@app.post("/analyze-report")
async def analyze_report(file: UploadFile = File(...)):
    # Save file temporarily
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        buffer.write(await file.read())
    
    try:
        # Perform OCR and Gemini analysis
        result = await analyze_medical_report(temp_path)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Cleanup
        if os.path.exists(temp_path):
            os.remove(temp_path)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
