"""
Backend ML Service for Behavioural Biometric Authentication using Artificial Intelligence
Frameworks: Flask, Scikit-Learn (RandomForestClassifier, IsolationForest), Pandas, NumPy
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)
CORS(app)

# Global Models and Scalers
scaler = StandardScaler()
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
iso_forest = IsolationForest(contamination=0.1, random_state=42)

# Synthetic training baseline generation for demonstration
def initialize_models():
    # 8 features: [wpm, hold_time, flight_time, consistency, mouse_speed, mouse_accel, click_int, scroll_speed]
    legitimate_samples = np.random.normal(
        loc=[65, 118, 95, 92, 280, 1100, 420, 150],
        scale=[5, 8, 7, 3, 20, 80, 25, 15],
        size=(200, 8)
    )
    
    anomalous_samples = np.random.normal(
        loc=[130, 30, 20, 40, 1500, 6000, 50, 600],
        scale=[20, 10, 10, 10, 300, 1000, 15, 80],
        size=(50, 8)
    )

    X = np.vstack([legitimate_samples, anomalous_samples])
    y = np.hstack([np.ones(200), np.zeros(50)]) # 1: Legitimate, 0: Impostor

    X_scaled = scaler.fit_transform(X)
    rf_model.fit(X_scaled, y)
    iso_forest.fit(legitimate_samples)

initialize_models()

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "service": "AI Behavioural Biometrics ML Engine",
        "models": ["RandomForestClassifier", "IsolationForest"]
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.json
    feature_vector = data.get('featureVector', [])

    if len(feature_vector) < 8:
        return jsonify({"error": "Feature vector must contain at least 8 numerical parameters."}), 400

    scaled_vec = scaler.transform([feature_vector[:8]])
    prob = rf_model.predict_proba(scaled_vec)[0][1] # Probability of legitimate user
    confidence_score = int(round(prob * 100))

    # Isolation forest anomaly score (-1 for anomaly, 1 for normal)
    iso_score = iso_forest.score_samples([feature_vector[:8]])[0]
    # Convert isolation depth score to percentage anomaly index (0-100%)
    anomaly_score = int(round(max(0, min(100, (0.5 - iso_score) * 100))))

    status = "VERIFIED"
    risk_level = "LOW"

    if confidence_score < 50 or anomaly_score > 60:
        status = "BLOCKED"
        risk_level = "HIGH"
    elif confidence_score < 75 or anomaly_score > 30:
        status = "SUSPICIOUS"
        risk_level = "MEDIUM"

    return jsonify({
        "confidenceScore": confidence_score,
        "anomalyScore": anomaly_score,
        "status": status,
        "riskLevel": risk_level,
        "modelUsed": "Random Forest + Isolation Forest"
    })

if __name__ == '__main__':
    print("Starting AI Behavioural Biometrics Flask Backend on port 5000...")
    app.run(host='0.0.0.0', port=5000, debug=True)
