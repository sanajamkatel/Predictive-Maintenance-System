# Predictive Maintenance System for Engine Failure Detection

A production-ready machine learning system that predicts industrial engine failures using NASA C-MAPSS dataset (20,000+ sensor cycles). It enables real-time monitoring and prevents costly downtime for fleet operators.

---

### Key Highlights
* **High Performance ML:** Trained a Random Forest classifier achieving **96% accuracy** and **95% failure detection rate** with **<1ms prediction latency**.
* **Full-Stack Architecture:** Flask REST API backend paired with a React (Material-UI, Recharts) dashboard featuring role-based JWT authentication.
* **Business Impact:** Built-in ROI calculator demonstrating an estimated **$850K net annual savings** (340% ROI) for a typical 100-engine fleet.

---

### Tech Stack
* **Backend:** Python 3.13, Flask, scikit-learn, pandas, numpy
* **Frontend:** React 18, Material-UI, Recharts, Framer Motion
* **Data:** NASA C-MAPSS Turbofan Engine Dataset (FD001)

---

### Key Features
* **Real-Time Monitoring:** Live sensor mapping (temperature, pressure, vibration, oil quality) with instant failure risk scores and 7-day trend charts.
* **Fleet Overview:** At-a-glance health status, risk distribution, and fleet-wide statistics.
* **ROI Calculator:** Financial modeling tool projecting cost savings, annual ROI, and payback periods based on custom fleet parameters.
* **Model Insights:** Interactive feature importance rankings, ROC curve analysis, and model performance metrics.

---

### Quick Start

```bash
# 1. Clone repository
git clone [https://github.com/sanajamkatel/Predictive-Maintenance-System.git](https://github.com/sanajamkatel/Predictive-Maintenance-System.git)
cd Predictive-Maintenance-System

# 2. Start Backend
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python api.py

# 3. Start Frontend (New Terminal)
cd frontend
npm install
npm start
