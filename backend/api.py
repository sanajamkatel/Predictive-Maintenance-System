"""
Flask REST API for Predictive Maintenance System
Provides endpoints for engine predictions and data retrieval
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Load model and data
model_data = None
df = None

def load_resources():
    """Load model and data on startup"""
    global model_data, df
    
    # Load model
    model_path = '../datasets/failure_predictor.pkl'
    if os.path.exists(model_path):
        model_data = joblib.load(model_path)
        print(" Model loaded successfully")
    else:
        print("  Model not found. Please run train_model.py first")
    
    # Load data
    data_path = '../datasets/sensor_data.csv'
    if os.path.exists(data_path):
        df = pd.read_csv(data_path)
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        print(f" Data loaded: {len(df):,} records")
    else:
        print("  Data not found. Please run data_simulator.py first")

@app.route('/', methods=['GET'])
def root():
    """Root endpoint for Render health checks"""
    return jsonify({
        'message': 'Predictive Maintenance System API',
        'status': 'running',
        'version': '1.0.0'
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model_data is not None,
        'data_loaded': df is not None,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/engines', methods=['GET'])
def get_engines():
    """Get list of all engines"""
    if df is None:
        return jsonify({'error': 'Data not loaded'}), 500
    
    engines = df['engine_id'].unique().tolist()
    engines.sort()
    
    # Get latest status for each engine
    engine_list = []
    for engine_id in engines:
        engine_data = df[df['engine_id'] == engine_id].sort_values('timestamp')
        latest = engine_data.iloc[-1]
        
        # Determine health status based on sensor readings and failure flag
        has_failure_flag = latest['failure'] == 1
        
        # Sensor-based health assessment
        temp_normal = 580 <= latest['temperature'] <= 640
        pressure_normal = 54.5 <= latest['pressure'] <= 55.5
        vibration_normal = latest['vibration'] <= 15
        oil_good = latest['oil_quality'] >= 20
        
        # Warning thresholds (degrading zone)
        temp_warning = 630 <= latest['temperature'] <= 650 or latest['temperature'] < 570
        pressure_warning = 55.3 <= latest['pressure'] <= 55.7 or latest['pressure'] < 54.3
        vibration_warning = 12 <= latest['vibration'] <= 18
        oil_warning = 15 <= latest['oil_quality'] < 25
        
        healthy_indicators = sum([temp_normal, pressure_normal, vibration_normal, oil_good])
        warning_indicators = sum([temp_warning, pressure_warning, vibration_warning, oil_warning])
        
        # Determine status: Critical > Warning > Normal
        if has_failure_flag:
            status = 'critical'
        elif warning_indicators >= 2 or healthy_indicators < 3:
            status = 'warning'  # Degrading
        else:
            status = 'normal'   # Healthy
        
        engine_list.append({
            'id': int(engine_id),
            'name': f'ENG-{engine_id:03d}',
            'status': status,
            'operating_hours': int(latest['operating_hours']),
            'temperature': float(latest['temperature']),
            'pressure': float(latest['pressure']),
            'vibration': float(latest['vibration']),
            'oil_quality': float(latest['oil_quality'])
        })
    
    return jsonify({
        'engines': engine_list,
        'total': len(engine_list)
    })

@app.route('/api/engine/<int:engine_id>', methods=['GET'])
def get_engine(engine_id):
    """Get detailed information for a specific engine"""
    if df is None:
        return jsonify({'error': 'Data not loaded'}), 500
    
    engine_data = df[df['engine_id'] == engine_id].sort_values('timestamp')
    
    if len(engine_data) == 0:
        return jsonify({'error': 'Engine not found'}), 404
    
    latest = engine_data.iloc[-1]
    
    return jsonify({
        'id': int(engine_id),
        'name': f'ENG-{engine_id:03d}',
        'current_status': {
            'temperature': float(latest['temperature']),
            'pressure': float(latest['pressure']),
            'vibration': float(latest['vibration']),
            'oil_quality': float(latest['oil_quality']),
            'operating_hours': int(latest['operating_hours']),
            'failure': bool(latest['failure']),
            'timestamp': latest['timestamp'].isoformat()
        }
    })

@app.route('/api/engine/<int:engine_id>/history', methods=['GET'])
def get_engine_history(engine_id):
    """Get historical sensor data for an engine"""
    if df is None:
        return jsonify({'error': 'Data not loaded'}), 500
    
    # Get query parameters
    hours = int(request.args.get('hours', 168))  # Default: 7 days
    
    engine_data = df[df['engine_id'] == engine_id].sort_values('timestamp').tail(hours)
    
    if len(engine_data) == 0:
        return jsonify({'error': 'Engine not found'}), 404
    
    history = []
    for _, row in engine_data.iterrows():
        history.append({
            'timestamp': row['timestamp'].isoformat(),
            'temperature': float(row['temperature']),
            'pressure': float(row['pressure']),
            'vibration': float(row['vibration']),
            'oil_quality': float(row['oil_quality']),
            'failure': bool(row['failure'])
        })
    
    return jsonify({
        'engine_id': engine_id,
        'history': history,
        'count': len(history)
    })

@app.route('/api/predict/<int:engine_id>', methods=['GET'])
def predict_failure(engine_id):
    """Predict failure for a specific engine"""
    if df is None or model_data is None:
        return jsonify({'error': 'Resources not loaded'}), 500
    
    # Get engine data
    engine_data = df[df['engine_id'] == engine_id].sort_values('timestamp')
    
    if len(engine_data) == 0:
        return jsonify({'error': 'Engine not found'}), 404
    
    # Get last 50 readings for feature engineering
    temp_df = engine_data.tail(50).copy()
    
    # Feature engineering
    feature_engineer = model_data['feature_engineer']
    temp_df = feature_engineer.prepare_features(temp_df)
    
    if len(temp_df) == 0:
        return jsonify({'error': 'Insufficient data for prediction'}), 400
    
    # Get features
    exclude_cols = ['timestamp', 'engine_id', 'failure']
    feature_cols = [col for col in temp_df.columns if col not in exclude_cols]
    
    # Scale and predict
    scaler = model_data['scaler']
    model = model_data['model']
    
    X = temp_df[feature_cols].iloc[-1:].values
    X_scaled = scaler.transform(X)
    
    prediction = int(model.predict(X_scaled)[0])
    probability = float(model.predict_proba(X_scaled)[0][1])
    
    # Get current sensor readings
    latest = engine_data.iloc[-1]
    
    return jsonify({
        'engine_id': engine_id,
        'prediction': {
            'failure_predicted': prediction == 1,
            'probability': probability,
            'confidence': probability if prediction == 1 else (1 - probability)
        },
        'current_readings': {
            'temperature': float(latest['temperature']),
            'pressure': float(latest['pressure']),
            'vibration': float(latest['vibration']),
            'oil_quality': float(latest['oil_quality']),
            'operating_hours': int(latest['operating_hours'])
        },
        'recommendation': get_recommendation(prediction, probability, latest)
    })

def get_recommendation(prediction, probability, sensor_data):
    """Generate maintenance recommendation"""
    if prediction == 1:
        if probability > 0.9:
            return {
                'priority': 'critical',
                'action': 'Schedule immediate maintenance',
                'message': 'Critical failure imminent. Stop operation and inspect immediately.'
            }
        elif probability > 0.7:
            return {
                'priority': 'high',
                'action': 'Schedule maintenance within 24 hours',
                'message': 'High failure probability detected. Reduce load and schedule inspection.'
            }
        else:
            return {
                'priority': 'medium',
                'action': 'Schedule maintenance within week',
                'message': 'Elevated failure risk. Monitor closely and plan maintenance.'
            }
    else:
        # Check individual sensors
        warnings = []
        if sensor_data['temperature'] > 100:
            warnings.append('High temperature detected')
        if sensor_data['vibration'] > 8:
            warnings.append('Excessive vibration detected')
        if sensor_data['oil_quality'] < 40:
            warnings.append('Low oil quality')
        
        if warnings:
            return {
                'priority': 'low',
                'action': 'Monitor sensors',
                'message': f'Normal operation with warnings: {", ".join(warnings)}'
            }
        
        return {
            'priority': 'normal',
            'action': 'Continue normal operation',
            'message': 'All systems operating within normal parameters.'
        }

@app.route('/api/fleet/stats', methods=['GET'])
def get_fleet_stats():
    """Get fleet-wide statistics"""
    if df is None:
        return jsonify({'error': 'Data not loaded'}), 500
    
    # Get latest reading per engine
    latest_per_engine = df.sort_values('timestamp').groupby('engine_id').tail(1)
    
    total_engines = df['engine_id'].nunique()
    
    # Calculate health status based on sensor readings and failure flags
    has_failure_flag = latest_per_engine['failure'] == 1
    
    # Sensor-based health assessment
    temp_normal = (latest_per_engine['temperature'] >= 580) & (latest_per_engine['temperature'] <= 640)
    pressure_normal = (latest_per_engine['pressure'] >= 54.5) & (latest_per_engine['pressure'] <= 55.5)
    vibration_normal = latest_per_engine['vibration'] <= 15
    oil_good = latest_per_engine['oil_quality'] >= 20
    
    # Warning thresholds (degrading zone)
    temp_warning = ((latest_per_engine['temperature'] >= 630) & (latest_per_engine['temperature'] <= 650)) | (latest_per_engine['temperature'] < 570)
    pressure_warning = ((latest_per_engine['pressure'] >= 55.3) & (latest_per_engine['pressure'] <= 55.7)) | (latest_per_engine['pressure'] < 54.3)
    vibration_warning = (latest_per_engine['vibration'] >= 12) & (latest_per_engine['vibration'] <= 18)
    oil_warning = (latest_per_engine['oil_quality'] >= 15) & (latest_per_engine['oil_quality'] < 25)
    
    healthy_indicators = temp_normal.astype(int) + pressure_normal.astype(int) + vibration_normal.astype(int) + oil_good.astype(int)
    warning_indicators = temp_warning.astype(int) + pressure_warning.astype(int) + vibration_warning.astype(int) + oil_warning.astype(int)
    
    # Count engines by category
    critical_engines = int(has_failure_flag.sum())
    warning_engines = int(((~has_failure_flag) & ((warning_indicators >= 2) | (healthy_indicators < 3))).sum())
    healthy_engines = total_engines - critical_engines - warning_engines
    
    avg_metrics = {
        'temperature': float(latest_per_engine['temperature'].mean()),
        'pressure': float(latest_per_engine['pressure'].mean()),
        'vibration': float(latest_per_engine['vibration'].mean()),
        'oil_quality': float(latest_per_engine['oil_quality'].mean()),
        'operating_hours': float(latest_per_engine['operating_hours'].mean())
    }
    
    return jsonify({
        'total_engines': total_engines,
        'healthy_engines': healthy_engines,
        'warning_engines': warning_engines,
        'critical_engines': critical_engines,
        'health_percentage': round((healthy_engines / total_engines) * 100, 1),
        'warning_percentage': round((warning_engines / total_engines) * 100, 1),
        'critical_percentage': round((critical_engines / total_engines) * 100, 1),
        'average_metrics': avg_metrics,
        'total_readings': len(df)
    })

@app.route('/api/roi/calculate', methods=['POST'])
def calculate_roi():
    """Calculate ROI based on input parameters"""
    data = request.get_json()
    
    fleet_size = data.get('fleet_size', 100)
    failures_per_year = data.get('failures_per_year', 20)
    cost_per_failure = data.get('cost_per_failure', 50000)
    detection_rate = data.get('detection_rate', 95) / 100
    maintenance_cost = data.get('maintenance_cost', 100000)
    initial_investment = data.get('initial_investment', 250000)
    
    # Calculate metrics
    prevented_failures = int(failures_per_year * detection_rate)
    total_failure_cost = prevented_failures * cost_per_failure
    net_savings = total_failure_cost - maintenance_cost
    roi_percentage = (net_savings / initial_investment) * 100 if initial_investment > 0 else 0
    payback_period = initial_investment / net_savings if net_savings > 0 else float('inf')
    
    # 5-year projection
    projections = []
    for year in range(1, 6):
        projections.append({
            'year': year,
            'savings': net_savings * year,
            'roi': ((net_savings * year) / initial_investment) * 100 if initial_investment > 0 else 0
        })
    
    return jsonify({
        'input_parameters': {
            'fleet_size': fleet_size,
            'failures_per_year': failures_per_year,
            'cost_per_failure': cost_per_failure,
            'detection_rate': round(detection_rate * 100, 1)
        },
        'results': {
            'prevented_failures': prevented_failures,
            'failure_costs_avoided': total_failure_cost,
            'maintenance_cost': maintenance_cost,
            'net_savings': net_savings,
            'roi_percentage': round(roi_percentage, 1),
            'payback_period_years': round(payback_period, 1) if payback_period < float('inf') else None,
            'payback_period_months': round(payback_period * 12, 0) if payback_period < float('inf') else None
        },
        'projections': projections
    })

if __name__ == '__main__':
    print("\n" + "="*60)
    print("PREDICTIVE MAINTENANCE API SERVER")
    print("="*60)
    
    # Load resources
    load_resources()
    
    print("\n" + "="*60)
    print("Starting Flask server...")
    print("API will be available at: http://localhost:5001")
    print("="*60)
    print("\nAvailable endpoints:")
    print("  GET  /api/health              - Health check")
    print("  GET  /api/engines             - List all engines")
    print("  GET  /api/engine/<id>         - Get engine details")
    print("  GET  /api/engine/<id>/history - Get engine history")
    print("  GET  /api/predict/<id>        - Predict engine failure")
    print("  GET  /api/fleet/stats         - Fleet statistics")
    print("  POST /api/roi/calculate       - Calculate ROI")
    print("\n" + "="*60 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5002)

