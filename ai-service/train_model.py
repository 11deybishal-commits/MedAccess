import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib
import random
import os

MODEL_PATH = "model.pkl"
SYMPTOMS_PATH = "symptoms.pkl"

# Comprehensive medical matrix (Disease -> Core Symptoms)
medical_matrix = {
    "Influenza (Flu)": ["high_fever", "chills", "muscle_ache", "dry_cough", "fatigue", "headache", "sore_throat", "runny_nose"],
    "Common Cold": ["mild_fever", "runny_nose", "sneezing", "sore_throat", "mild_cough", "congestion"],
    "COVID-19": ["high_fever", "dry_cough", "fatigue", "loss_of_taste_or_smell", "shortness_of_breath", "body_aches", "sore_throat"],
    "Bronchitis": ["chest_pain", "wet_cough", "fatigue", "shortness_of_breath", "mild_fever", "chills"],
    "Pneumonia": ["high_fever", "chills", "shortness_of_breath", "chest_pain", "rapid_breathing", "wet_cough"],
    "Gastroesophageal Reflux Disease (GERD)": ["heartburn", "chest_pain", "acid_regurgitation", "nausea", "difficulty_swallowing", "chronic_cough"],
    "Asthma": ["shortness_of_breath", "wheezing", "chest_tightness", "chronic_cough", "fast_heart_rate"],
    "Tuberculosis": ["continuous_cough", "blood_in_sputum", "weight_loss", "loss_of_appetite", "night_sweats", "mild_fever", "fatigue"],
    "Typhoid": ["high_fever", "abdominal_pain", "headache", "weakness", "diarrhea", "constipation", "rose_spots"],
    "Dengue": ["high_fever", "severe_headache", "pain_behind_eyes", "joint_pain", "muscle_ache", "fatigue", "nausea", "vomiting", "skin_rash"],
    "Malaria": ["high_fever", "chills", "sweating", "headache", "nausea", "vomiting", "muscle_ache"],
    "Migraine": ["severe_headache", "nausea", "vomiting", "sensitivity_to_light", "sensitivity_to_sound", "visual_disturbances"],
    "Diabetes Type 2": ["frequent_urination", "increased_thirst", "extreme_hunger", "weight_loss", "fatigue", "blurred_vision", "slow_healing_sores"],
    "Hypertension": ["headache", "shortness_of_breath", "nosebleeds", "dizziness", "chest_pain", "visual_changes"],
    "Hyperthyroidism": ["weight_loss", "rapid_heartbeat", "increased_appetite", "nervousness", "anxiety", "tremor", "sweating", "fatigue"],
    "Hypothyroidism": ["fatigue", "weight_gain", "sensitivity_to_cold", "dry_skin", "constipation", "muscle_weakness", "depression"],
    "Anemia": ["fatigue", "weakness", "pale_skin", "chest_pain", "fast_heart_rate", "shortness_of_breath", "headache", "dizziness", "cold_hands_and_feet"],
    "Peptic Ulcer": ["abdominal_pain", "heartburn", "nausea", "vomiting", "bloating", "feeling_full_easily", "intolerance_to_fatty_foods"],
    "Urinary Tract Infection (UTI)": ["frequent_urination", "burning_urination", "cloudy_urine", "strong_smelling_urine", "pelvic_pain", "blood_in_urine"],
    "Kidney Stones": ["severe_back_pain", "pain_radiating_to_groin", "blood_in_urine", "nausea", "vomiting", "frequent_urination"],
    "Appendicitis": ["abdominal_pain_right_lower", "nausea", "vomiting", "loss_of_appetite", "mild_fever", "constipation", "abdominal_swelling"],
    "Osteoarthritis": ["joint_pain", "joint_stiffness", "loss_of_flexibility", "grating_sensation", "bone_spurs", "joint_swelling"],
    "Rheumatoid Arthritis": ["warm_swollen_joints", "joint_stiffness", "fatigue", "mild_fever", "loss_of_appetite"],
    "Alzheimer's Disease": ["memory_loss", "confusion", "difficulty_reasoning", "disorientation", "mood_changes", "difficulty_speaking"],
    "Parkinson's Disease": ["tremor", "slowed_movement", "rigid_muscles", "impaired_posture", "loss_of_automatic_movements", "speech_changes"],
    "Depression": ["persistent_sadness", "loss_of_interest", "fatigue", "changes_in_appetite", "sleep_disturbances", "feelings_of_worthlessness"],
    "Anxiety Disorder": ["restlessness", "fatigue", "difficulty_concentrating", "irritability", "muscle_tension", "sleep_disturbances", "excessive_worry"],
    "Chickenpox": ["fever", "fatigue", "loss_of_appetite", "headache", "itchy_rash", "fluid_filled_blisters"],
    "Measles": ["high_fever", "dry_cough", "runny_nose", "sore_throat", "inflamed_eyes", "koplik_spots", "skin_rash"],
    "Cholera": ["severe_diarrhea", "nausea", "vomiting", "muscle_cramps", "rapid_heart_rate", "loss_of_skin_elasticity"],
    "Hepatitis A": ["fatigue", "sudden_nausea", "vomiting", "abdominal_pain", "dark_urine", "joint_pain", "yellowing_of_skin_and_eyes"],
    "Hepatitis B": ["abdominal_pain", "dark_urine", "fever", "joint_pain", "loss_of_appetite", "nausea", "vomiting", "weakness"],
    "Cirrhosis": ["fatigue", "easily_bleeding", "loss_of_appetite", "nausea", "swelling_in_legs", "weight_loss", "itchy_skin", "yellowing_of_skin_and_eyes"],
    "Allergic Rhinitis": ["sneezing", "runny_nose", "stuffy_nose", "itchy_eyes", "watery_eyes", "itchy_throat", "postnasal_drip"],
    "Chronic Obstructive Pulmonary Disease (COPD)": ["shortness_of_breath", "wheezing", "chest_tightness", "chronic_cough", "frequent_respiratory_infections"],
    "Gastroenteritis (Stomach Flu)": ["watery_diarrhea", "abdominal_cramps", "nausea", "vomiting", "muscle_aches", "headache", "low_grade_fever"],
    "Food Poisoning": ["nausea", "vomiting", "watery_diarrhea", "abdominal_pain", "mild_fever", "weakness"],
    "Celiac Disease": ["diarrhea", "fatigue", "weight_loss", "bloating", "abdominal_pain", "nausea", "vomiting", "constipation"],
    "Meningitis": ["sudden_high_fever", "stiff_neck", "severe_headache", "nausea", "vomiting", "confusion", "seizures", "sensitivity_to_light", "skin_rash"],
    "Stroke": ["sudden_numbness", "sudden_confusion", "trouble_speaking", "trouble_seeing", "trouble_walking", "dizziness", "severe_headache"],
}

# Collect all unique symptoms from the matrix
all_symptoms = set()
for symptoms in medical_matrix.values():
    all_symptoms.update(symptoms)
all_symptoms = list(sorted(list(all_symptoms)))

def generate_synthetic_data(num_samples_per_disease=50):
    """Generates synthetic patient records with realistic variations (noise/missing symptoms)."""
    print(f"Synthesizing {len(medical_matrix) * num_samples_per_disease} patient records...")
    
    data = []
    labels = []
    
    for disease, core_symptoms in medical_matrix.items():
        for _ in range(num_samples_per_disease):
            # Patient might not exhibit all symptoms (60-100% of core symptoms)
            num_exhibited = max(1, int(len(core_symptoms) * random.uniform(0.6, 1.0)))
            patient_symptoms = random.sample(core_symptoms, num_exhibited)
            
            # Add some random noise (1-2 unrelated symptoms sometimes due to minor ailments)
            if random.random() > 0.5:
                noise_symptoms = random.sample([s for s in all_symptoms if s not in core_symptoms], random.randint(1, 2))
                patient_symptoms.extend(noise_symptoms)
            
            # Create feature vector
            vector = [1 if s in patient_symptoms else 0 for s in all_symptoms]
            data.append(vector)
            labels.append(disease)
            
    return np.array(data), np.array(labels)

def train():
    np.random.seed(42)
    random.seed(42)
    
    # 1. Generate massive, robust dataset (target: 2000 items)
    X, y = generate_synthetic_data(num_samples_per_disease=50)  # 40 diseases * 50 = 2000 rows
    print(f"Generated DataFrame shape: {X.shape}")
    
    # 2. Extract and Save Symptoms List
    joblib.dump(all_symptoms, SYMPTOMS_PATH)
    print(f"Saved {len(all_symptoms)} unique fine-grained symptoms to {SYMPTOMS_PATH}")
    
    # 3. Split Data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # 4. Train Model
    print("Training Next-Gen Diagnostics AI...")
    model = RandomForestClassifier(n_estimators=150, max_depth=15, random_state=42, class_weight="balanced")
    model.fit(X_train, y_train)

    # 5. Evaluate
    preds = model.predict(X_test)
    acc = accuracy_score(y_test, preds)
    print(f"Model Validation Accuracy: {acc * 100:.2f}%")

    # 6. Save Model
    joblib.dump(model, MODEL_PATH)
    print(f"Model serialized to {MODEL_PATH}")

if __name__ == "__main__":
    train()
