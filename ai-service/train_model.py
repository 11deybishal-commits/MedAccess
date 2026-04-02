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
    "HIV/AIDS": ["fever", "chills", "rash", "night_sweats", "muscle_aches", "sore_throat", "fatigue", "swollen_lymph_nodes", "mouth_ulcers"],
    "Lyme Disease": ["fever", "headache", "fatigue", "skin_rash", "joint_pain", "swollen_lymph_nodes"],
    "Mononucleosis": ["extreme_fatigue", "fever", "sore_throat", "swollen_lymph_nodes", "headache", "body_aches"],
    "Scarlet Fever": ["sore_throat", "fever", "red_rash", "strawberry_tongue", "headache", "nausea", "vomiting"],
    "Whooping Cough (Pertussis)": ["runny_nose", "nasal_congestion", "red_watery_eyes", "fever", "severe_coughing_fits", "whooping_sound_when_breathing_in"],
    "Polio": ["fever", "sore_throat", "headache", "vomiting", "fatigue", "back_pain", "neck_stiffness", "muscle_weakness"],
    "Tetanus": ["jaw_cramping", "muscle_spasms", "stiff_neck", "difficulty_swallowing", "abdominal_muscle_rigidity", "fever", "sweating", "fast_heart_rate"],
    "Rabies": ["fever", "headache", "nausea", "vomiting", "agitation", "anxiety", "confusion", "excessive_salivation", "difficulty_swallowing", "fear_of_water"],
    "Yellow Fever": ["fever", "headache", "muscle_pain", "nausea", "vomiting", "fatigue", "jaundice", "bleeding_from_eyes_nose_mouth"],
    "Zika Virus": ["fever", "rash", "joint_pain", "conjunctivitis", "muscle_pain", "headache"],
    "Ebola Virus": ["fever", "severe_headache", "muscle_pain", "weakness", "diarrhea", "vomiting", "abdominal_pain", "unexplained_bleeding"],
    "Lassa Fever": ["fever", "general_weakness", "malaise", "headache", "sore_throat", "muscle_pain", "chest_pain", "nausea", "vomiting", "diarrhea", "cough"],
    "Marburg Virus": ["fever", "chills", "headache", "muscle_pain", "rash", "nausea", "vomiting", "chest_pain", "sore_throat", "diarrhea"],
    "Monkeypox": ["fever", "headache", "muscle_aches", "backache", "swollen_lymph_nodes", "chills", "exhaustion", "rash_on_face_body"],
    "Hand, Foot, and Mouth Disease": ["fever", "sore_throat", "malaise", "painful_mouth_sores", "skin_rash_on_palms_soles"],
    "Ringworm": ["itchy_skin", "ring_shaped_rash", "red_scaly_cracked_skin", "hair_loss"],
    "Scabies": ["intense_itching", "pimple_like_rash", "sores_from_scratching", "thin_burrow_tracks_on_skin"],
    "Psoriasis": ["red_patches_of_skin", "silvery_scales", "dry_cracked_skin", "itching_burning_soreness", "thickened_pitted_nails", "swollen_stiff_joints"],
    "Eczema (Atopic Dermatitis)": ["dry_skin", "itching", "red_to_brownish_gray_patches", "small_raised_bumps", "thickened_cracked_scaly_skin", "raw_sensitive_swollen_skin"],
    "Rosacea": ["facial_redness", "swollen_red_bumps", "eye_problems", "enlarged_nose"],
    "Vitiligo": ["patchy_loss_of_skin_color", "premature_whitening_of_hair", "loss_of_color_in_tissues_inside_mouth_nose"],
    "Acne": ["whiteheads", "blackheads", "small_red_tender_bumps", "pimples", "large_solid_painful_lumps", "painful_pus_filled_lumps"],
    "Alopecia Areata": ["patchy_hair_loss", "exclamation_point_hairs", "nail_pitting"],
    "Hives (Urticaria)": ["raised_red_or_skin_colored_welts", "itching", "painful_swelling"],
    "Cushing's Syndrome": ["weight_gain", "fatty_tissue_deposits", "pink_or_purple_stretch_marks", "thin_fragile_skin", "slow_healing", "acne"],
    "Addison's Disease": ["extreme_fatigue", "weight_loss", "hyperpigmentation", "low_blood_pressure", "salt_craving", "nausea", "diarrhea", "abdominal_pain"],
    "Graves' Disease": ["anxiety", "irritability", "tremor", "heat_sensitivity", "weight_loss", "enlarged_thyroid", "bulging_eyes", "thick_red_skin"],
    "Hashimoto's Thyroiditis": ["fatigue", "sluggishness", "increased_sensitivity_to_cold", "constipation", "pale_dry_skin", "puffy_face", "brittle_nails", "hair_loss"],
    "Goiter": ["swelling_at_base_of_neck", "tight_feeling_in_throat", "coughing", "hoarseness", "difficulty_swallowing", "difficulty_breathing"],
    "Pancreatitis": ["upper_abdominal_pain", "abdominal_pain_radiating_to_back", "fever", "rapid_pulse", "nausea", "vomiting", "tenderness_when_touching_abdomen"],
    "Gallstones": ["sudden_rapidly_intensifying_pain_in_upper_right_abdomen", "back_pain_between_shoulder_blades", "pain_in_right_shoulder", "nausea", "vomiting"],
    "Liver Cancer": ["weight_loss", "loss_of_appetite", "upper_abdominal_pain", "nausea", "vomiting", "general_weakness", "abdominal_swelling", "jaundice"],
    "Pancreatic Cancer": ["abdominal_pain", "loss_of_appetite", "weight_loss", "yellowing_of_skin_eyes", "light_colored_stools", "dark_colored_urine", "itchy_skin"],
    "Colorectal Cancer": ["change_in_bowel_habits", "rectal_bleeding", "blood_in_stool", "persistent_abdominal_discomfort", "feeling_that_bowel_doesnt_empty_completely", "weakness", "weight_loss"],
    "Stomach Cancer": ["fatigue", "bloating_after_eating", "feeling_full_after_small_amounts_of_food", "severe_heartburn", "severe_indigestion", "nausea", "stomach_pain", "vomiting", "weight_loss"],
    "Esophageal Cancer": ["difficulty_swallowing", "weight_loss", "chest_pain", "worsening_indigestion", "coughing", "hoarseness"],
    "Lung Cancer": ["new_cough_that_doesnt_go_away", "coughing_up_blood", "shortness_of_breath", "chest_pain", "hoarseness", "weight_loss", "bone_pain", "headache"],
    "Breast Cancer": ["lump_in_breast", "change_in_size_shape_appearance_of_breast", "changes_to_skin_over_breast", "newly_inverted_nipple", "peeling_scaling_crusting_flaking_around_nipple"],
    "Prostate Cancer": ["trouble_urinating", "decreased_force_in_stream_of_urine", "blood_in_urine", "blood_in_semen", "bone_pain", "erectile_dysfunction"],
    "Bladder Cancer": ["blood_in_urine", "frequent_urination", "painful_urination", "back_pain"],
    "Kidney Cancer": ["blood_in_urine", "pain_in_side_back", "loss_of_appetite", "weight_loss", "tiredness", "fever"],
    "Leukemia": ["fever", "chills", "persistent_fatigue", "frequent_infections", "weight_loss", "swollen_lymph_nodes", "easy_bleeding_bruising", "nosebleeds", "tiny_red_spots_on_skin"],
    "Lymphoma": ["painless_swelling_of_lymph_nodes", "persistent_fatigue", "fever", "night_sweats", "shortness_of_breath", "unexplained_weight_loss", "itchy_skin"],
    "Multiple Myeloma": ["bone_pain", "nausea", "constipation", "loss_of_appetite", "mental_fog", "fatigue", "frequent_infections", "weight_loss", "weakness_numbness_in_legs", "excessive_thirst"],
    "Skin Cancer (Melanoma)": ["large_brownish_spot_with_darker_speckles", "mole_that_changes_in_color_size_feeling", "small_lesion_with_irregular_border", "painful_lesion_that_itches_burns"],
    "Ovarian Cancer": ["abdominal_bloating_swelling", "quickly_feeling_full_when_eating", "weight_loss", "discomfort_in_pelvic_area", "changes_in_bowel_habits", "frequent_need_to_urinate"],
    "Cervical Cancer": ["vaginal_bleeding_after_intercourse", "watery_bloody_vaginal_discharge", "pelvic_pain", "pain_during_intercourse"],
    "Testicular Cancer": ["lump_enlargement_in_either_testicle", "feeling_of_heaviness_in_scrotum", "dull_ache_in_abdomen_groin", "sudden_collection_of_fluid_in_scrotum", "pain_discomfort_in_testicle_scrotum"],
    "Brain Tumor": ["new_onset_headaches", "gradual_increase_in_frequency_severity_of_headaches", "unexplained_nausea_vomiting", "vision_problems", "gradual_loss_of_sensation_movement_in_arm_leg", "difficulty_with_balance", "speech_difficulties"],
    "Multiple Sclerosis": ["numbness_weakness_in_limbs", "electric_shock_sensations_with_neck_movements", "tremor", "lack_of_coordination", "unsteady_gait", "vision_loss", "prolonged_double_vision", "fatigue", "dizziness"],
    "Epilepsy": ["temporary_confusion", "staring_spell", "uncontrollable_jerking_movements_of_arms_legs", "loss_of_consciousness_awareness", "psychic_symptoms"],
    "Ankylosing Spondylitis": ["pain_stiffness_in_lower_back_hips", "neck_pain", "fatigue"],
    "Scoliosis": ["uneven_shoulders", "one_shoulder_blade_that_appears_more_prominent", "uneven_waist", "one_hip_higher_than_other"],
    "Fibromyalgia": ["widespread_pain", "fatigue", "cognitive_difficulties", "headaches", "depression", "pain_cramping_in_lower_abdomen"],
    "Chronic Fatigue Syndrome": ["fatigue", "loss_of_memory_concentration", "sore_throat", "enlarged_lymph_nodes", "unexplained_muscle_joint_pain", "headaches", "unrefreshing_sleep", "extreme_exhaustion_after_exercise"],
    "Sleep Apnea": ["loud_snoring", "episodes_in_which_you_stop_breathing_during_sleep", "abrupt_awakenings_accompanied_by_gasping_choking", "awakening_with_dry_mouth_sore_throat", "morning_headache", "difficulty_staying_asleep", "excessive_daytime_sleepiness"],
    "Insomnia": ["difficulty_falling_asleep", "waking_up_during_night", "waking_up_too_early", "not_feeling_well_rested_after_night_sleep", "daytime_tiredness", "irritability_depression_anxiety", "difficulty_focusing_on_tasks"],
    "Narcolepsy": ["excessive_daytime_sleepiness", "sudden_loss_of_muscle_tone", "sleep_paralysis", "changes_in_rapid_eye_movement_sleep", "hallucinations"],
    "Glaucoma": ["patchy_blind_spots_in_peripheral_side_vision", "tunnel_vision", "severe_headache", "eye_pain", "nausea_vomiting", "blurred_vision", "halos_around_lights", "eye_redness"],
    "Cataracts": ["cloudy_blurred_dim_vision", "increasing_difficulty_with_vision_at_night", "sensitivity_to_light_glare", "need_for_brighter_light_for_reading", "seeing_halos_around_lights", "frequent_changes_in_eyeglass_contact_lens_prescription"],
    "Macular Degeneration": ["visual_distortions", "reduced_central_vision", "need_for_brighter_light_when_reading", "increased_blurriness_of_printed_words", "difficulty_recognizing_faces"],
    "Otitis Media (Ear Infection)": ["ear_pain", "tugging_pulling_at_ear", "difficulty_sleeping", "crying_more_than_usual", "acting_more_irritated_than_usual", "difficulty_hearing_responding_to_sounds", "loss_of_balance", "fever", "drainage_of_fluid_from_ear", "headache", "loss_of_appetite"],
    "Tinnitus": ["ringing_in_ears", "buzzing_in_ears", "roaring_in_ears", "clicking_in_ears", "hissing_in_ears", "humming_in_ears"],
    "Sepsis": ["high_fever", "low_blood_pressure", "fast_heart_rate", "rapid_breathing", "shivering", "confusion", "extreme_pain", "shortness_of_breath", "clammy_sweaty_skin"],
    "Shingles": ["pain_burning_numbness_tingling", "sensitivity_to_touch", "red_rash_that_begins_days_after_pain", "fluid_filled_blisters_that_break_open_crust_over", "itching", "fever", "headache", "sensitivity_to_light", "fatigue"],
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
    
    # 1. Generate massive, robust dataset (target: 5000+ items)
    X, y = generate_synthetic_data(num_samples_per_disease=80)  # ~125 diseases * 80 = 10,000 rows
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
