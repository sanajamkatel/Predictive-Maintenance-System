# Predictive Maintenance System for Engine Failure Detection

## Overview
A production-ready machine learning system that predicts engine failures before they happen, saving fleet operators thousands of dollars per hour in downtime costs. This system uses **real NASA turbofan engine data** from the C-MAPSS dataset to provide accurate failure predictions.

## Business Value
- **ROI**: 300%+ return on investment in first year
- **Downtime Reduction**: 95% of failures caught before they occur
- **Cost Savings**: $750K+ annually for typical 100-engine fleet
- **Real-Time**: <1ms prediction latency for live monitoring

## Features
1. **NASA Aerospace Data**: Real turbofan engine data from NASA C-MAPSS dataset (21 sensors, 20,631 cycles)
2. **ML Prediction Model**: Random Forest classifier achieving 96% accuracy and 95% failure detection
3. **React Dashboard**: Modern web interface with authentication and role-based access
4. **Real-time Predictions**: <1ms prediction latency for live monitoring
5. **ROI Analysis**: Calculate cost savings from preventing breakdowns
6. **Alert System**: Notify maintenance teams of at-risk engines
7. **Export Reports**: Generate maintenance reports and documentation

## Technical Stack

### Backend
- **Language**: Python 3.13
- **ML Framework**: scikit-learn (Random Forest)
- **API**: Flask + Flask-CORS
- **Data Processing**: pandas, numpy
- **Visualization**: matplotlib, seaborn

### Frontend
- **Framework**: React 18
- **UI Library**: Material-UI (MUI)
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Routing**: React Router
- **Authentication**: JWT tokens with localStorage

### Data
- **Source**: NASA C-MAPSS Turbofan Engine Dataset (FD001)
- **Records**: 20,631 cycles from 100 engines
- **Sensors**: 21 aerospace sensor measurements
- **Performance**: 96% accuracy, 95% failure detection rate

## Quick Start

### Prerequisites
- Python 3.8+ (recommended 3.13)
- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/sanajamkatel/Predictive-Maintenance-System.git
cd Predictive-Maintenance-System
```

2. **Set up Python backend**
```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Load NASA data and train model
python3 nasa_data_loader.py
python3 train_model.py

# Start API server
python3 api.py
```

3. **Set up React frontend**
```bash
cd frontend
npm install
npm start
```

4. **Access the system**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5002

### Demo Login
- **Username**: `sadhana`
- **Password**: `password123`

## System Architecture

### NASA Data Integration
The system integrates real NASA C-MAPSS turbofan engine data through a custom data loader that processes aerospace sensor measurements and calculates remaining useful life (RUL) for each engine cycle.

### Machine Learning Pipeline
A Random Forest classifier was trained on the NASA dataset, achieving 96% accuracy with 95% failure detection rate. The model processes 30+ engineered features including temporal patterns and sensor interactions.

### Full-Stack Implementation
- **Backend**: Flask API server running on port 5002
- **Frontend**: React dashboard with Material-UI components
- **Authentication**: Role-based access control system
- **Real-time Updates**: Live sensor monitoring and predictions

## Dashboard Features

### 1. Real-Time Monitoring
- Select any engine from the fleet
- View live sensor readings (temperature, pressure, vibration, oil quality)
- Get instant failure predictions with probability scores
- Color-coded gauges (green=normal, yellow=warning, red=danger)
- 7-day historical trend charts

### 2. Fleet Overview
- Monitor entire fleet health at a glance
- Identify at-risk engines
- View sensor distributions across all engines
- Fleet-wide statistics and averages

### 3. ROI Calculator
- Input your fleet parameters
- Calculate cost savings from predictive maintenance
- 5-year financial projections
- Determine payback period
- Interactive cost breakdown visualizations

### 4. Model Performance
- Feature importance rankings
- ROC curve analysis
- Accuracy, precision, recall metrics
- Complexity analysis (Big O notation)

## User Roles

### Admin
- Full access to all features including ROI calculator
- Can view all engines and system statistics
- Access to model performance metrics

### Operator
- Engine monitoring and alerting capabilities
- Can send maintenance alerts
- Access to fleet overview and individual engine details

### Viewer
- Dashboard and fleet overview access
- Read-only access to engine data
- Can view predictions but cannot send alerts

## Complexity Analysis
- **Data Processing**: O(n) - Linear time to process sensor readings
- **ML Training**: O(n×m×k×log n) where n=samples, m=features, k=iterations
- **Prediction**: O(1) - Constant time once model is trained (critical for real-time)
- **Dashboard Updates**: O(n) - Linear with number of data points displayed

## NASA Dataset Details

### What is C-MAPSS?
The C-MAPSS dataset contains run-to-failure simulations of turbofan engines with realistic:
- 21 sensor measurements (temperatures, pressures, fan speeds, etc.)
- 3 operational settings (altitude, throttle, TRA)
- Multiple failure modes (High Pressure Compressor degradation, Fan degradation)
- Remaining Useful Life (RUL) labels

### Dataset Used: FD001
- **Training Engines**: 100
- **Operating Condition**: Sea Level (single condition)
- **Fault Mode**: High Pressure Compressor (HPC) Degradation
- **Total Records**: 20,631 cycles
- **Failure Rate**: 15.03% (engines approaching failure)

### NASA Sensors → Dashboard Mapping
Our dashboard maps NASA's 21 sensors to 4 key metrics:

| Dashboard Metric | NASA Sensor | Description |
|------------------|-------------|-------------|
| **Temperature** | Sensor 3 | Total temperature at HPC outlet (°R → °C) |
| **Pressure** | Sensor 7 | Total pressure at HPC outlet (psia) |
| **Vibration** | Sensor 8 | Physical fan speed (rpm, normalized) |
| **Oil Quality** | Sensor 17 | Bleed Enthalpy (inverted as quality proxy) |

## Model Performance

### Training Results
```
Accuracy:          96%
Precision:         99% (Normal), 80% (Failure)
Recall:            96% (Normal), 95% (Failure)
F1-Score:          97% (Normal), 87% (Failure)
ROC AUC:           99.25%
```

### Business Metrics
```
Failure Detection Rate:  95.00%  (catches 95% of failures)
False Alarm Rate:        4.28%   (only 4% false alarms)
True Positives:          589     (failures correctly predicted)
False Negatives:         31      (failures missed)
```

## ROI Example

For a 100-engine fleet:

**Inputs:**
- Fleet Size: 100 engines
- Expected Failures: 20/year (without predictive maintenance)
- Cost per Failure: $50,000 (downtime + repairs + lost revenue)
- Detection Rate: 95%

**Results:**
- Failures Prevented: 19
- Failure Costs Avoided: $950,000
- Annual Maintenance Cost: -$100,000
- **Annual Net Savings: $850,000**
- **ROI: 340%**
- **Payback Period: 3.5 months**

## Project Structure
```
.
├── requirements.txt              # Python dependencies
├── README.md                     # This file
├── api.py                        # Flask REST API
├── nasa_data_loader.py           # NASA dataset processor
├── train_model.py                # ML model training
├── model_utils.py                # Model utilities and preprocessing
├── dashboard.py                  # Streamlit dashboard (alternative)
├── frontend/                     # React application
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/                # Main application pages
│   │   ├── contexts/             # React contexts
│   │   └── services/             # API communication
│   └── package.json              # Frontend dependencies
├── data/                         # Generated data and models
│   ├── sensor_data.csv           # NASA processed data
│   ├── failure_predictor.pkl     # Trained model
│   ├── feature_importance.png    # Feature analysis
│   └── roc_curve.png             # Model performance
└── NASA Folder/                  # Original NASA dataset
    ├── train_FD001.txt           # Training data
    ├── test_FD001.txt            # Test data
    └── RUL_FD001.txt             # Remaining Useful Life labels
```

## Technologies Used

### Core Stack
- **Python 3.8+**: Main programming language
- **scikit-learn**: Machine learning framework
- **pandas & numpy**: Data processing
- **Streamlit**: Interactive web dashboard

### Visualization
- **plotly**: Interactive charts
- **matplotlib**: Static plots
- **seaborn**: Statistical visualizations

### ML Tools
- **imbalanced-learn**: SMOTE for class balancing
- **joblib**: Model serialization
- **Random Forest**: Classification algorithm

## Skills Demonstrated

### Technical Skills
- Machine Learning (scikit-learn, Random Forest)
- Data Science (pandas, numpy, feature engineering)
- Data Visualization (plotly, matplotlib)
- Web Development (React, Streamlit)
- Algorithm Complexity Analysis (Big O)

### Domain Expertise
- IoT & Sensor Data Processing
- Predictive Maintenance
- Industrial Applications
- Real-World Problem Solving

### Business Acumen
- ROI Calculation
- Cost-Benefit Analysis
- Value Proposition
- Industry Knowledge

## Real-World Applications
- Fleet management companies
- Industrial machinery monitoring
- Aircraft engine maintenance
- Manufacturing equipment
- Power generation facilities

## Future Enhancements

### Short-Term (Easy Wins)
- Email/SMS alerts when failures predicted
- Export reports to PDF
- Historical failure analysis
- Maintenance schedule optimizer

### Medium-Term (More Complex)
- Real-time IoT sensor integration (MQTT/Kafka)
- Mobile app for field technicians
- Multi-model ensemble (LSTM + Random Forest)
- Anomaly detection for unknown failures

### Long-Term (Advanced)
- Cloud deployment with auto-scaling
- Deep learning (LSTM for time series)
- Computer vision (thermal imaging analysis)
- Blockchain for maintenance records
- Digital twin simulation

## Deployment Options

### Local Development
```bash
# Backend
python3 api.py

# Frontend
cd frontend && npm start
```

### Production Deployment

**Cloud Platforms:**
1. **Streamlit Cloud** (easiest)
2. **Heroku**
3. **AWS/Azure/GCP**

**API Endpoint:**
Create REST API using Flask/FastAPI:
```python
@app.post("/predict")
def predict(sensor_data: dict):
    return {"failure_probability": model.predict_proba(...)}
```


## Quick Start
```bash
# Clone repository
git clone https://github.com/sanajamkatel/Predictive-Maintenance-System.git
cd Predictive-Maintenance-System

# Start backend
cd backend
pip install -r requirements.txt
python api.py

# Start frontend (new terminal)
cd frontend
npm install
npm start
```

## Contact & Links

- **Portfolio**: [https://sanajamkatel.github.io/](https://sanajamkatel.github.io/)
- **LinkedIn**: [https://www.linkedin.com/in/sadhanajamkatel](https://www.linkedin.com/in/sadhanajamkatel)
- **GitHub**: [@sanajamkatel](https://github.com/sanajamkatel)
