import joblib
import pandas as pd
from sklearn.metrics import accuracy_score

# Get number of classes
model = joblib.load('model.pkl')
num_classes = len(model.classes_)
num_estimators = model.n_estimators

# Get the medical matrix count
from train_model import medical_matrix
num_matrix_diseases = len(medical_matrix)
num_data_points = num_matrix_diseases * 80 # as per default config in train_model.py logic

print(f"ACTUAL_CLASSES: {num_classes}")
print(f"ESTIMATORS: {num_estimators}")
print(f"MATRIX_DISEASES: {num_matrix_diseases}")
print(f"NUM_DATA_POINTS: {num_data_points}")

# To get the actual model accuracy from a fresh split if we can:
# But we can't reliably train due to DLL errors on the user's environment in `train_model.py`.
# Wait, I CAN just run train_model's generate_synthetic_data to evaluate `model.pkl` on fresh test data!
from train_model import generate_synthetic_data
X, y = generate_synthetic_data(num_samples_per_disease=20)
preds = model.predict(X)
acc = accuracy_score(y, preds)
print(f"ACTUAL_ACCURACY: {acc * 100:.2f}%")
