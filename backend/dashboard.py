"""
Predictive Maintenance Dashboard
Interactive Streamlit dashboard for engine failure prediction
"""

import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import joblib
import os
from datetime import datetime, timedelta

# Page configuration
st.set_page_config(
    page_title="Predictive Maintenance System",
    page_icon="🔧",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
    <style>
    .main-header {
        font-size: 48px;
        font-weight: bold;
        color: #1f77b4;
        text-align: center;
        padding: 20px;
    }
    .metric-card {
        background-color: #f0f2f6;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
    }
    .warning-box {
        background-color: #fff3cd;
        border-left: 5px solid #ffc107;
        padding: 15px;
        margin: 10px 0;
    }
    .danger-box {
        background-color: #f8d7da;
        border-left: 5px solid #dc3545;
        padding: 15px;
        margin: 10px 0;
    }
    .success-box {
        background-color: #d4edda;
        border-left: 5px solid #28a745;
        padding: 15px;
        margin: 10px 0;
    }
    </style>
""", unsafe_allow_html=True)


@st.cache_resource
def load_model():
    """Load the trained model"""
    model_path = '../datasets/failure_predictor.pkl'
    if os.path.exists(model_path):
        return joblib.load(model_path)
    return None


@st.cache_data
def load_data():
    """Load sensor data"""
    data_path = '../datasets/sensor_data.csv'
    if os.path.exists(data_path):
        df = pd.read_csv(data_path)
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        return df
    return None


def calculate_roi(prevented_failures, cost_per_failure, maintenance_cost, investment):
    """
    Calculate Return on Investment for predictive maintenance
    
    Args:
        prevented_failures (int): Number of failures prevented
        cost_per_failure (float): Average cost of an unplanned failure
        maintenance_cost (float): Annual predictive maintenance cost
        investment (float): Initial investment in the system
        
    Returns:
        dict: ROI metrics
    """
    # Calculate savings
    total_failure_cost = prevented_failures * cost_per_failure
    net_savings = total_failure_cost - maintenance_cost
    
    # Calculate ROI
    if investment > 0:
        roi_percentage = (net_savings / investment) * 100
        payback_period = investment / net_savings if net_savings > 0 else float('inf')
    else:
        roi_percentage = 0
        payback_period = float('inf')
    
    return {
        'total_failure_cost': total_failure_cost,
        'maintenance_cost': maintenance_cost,
        'net_savings': net_savings,
        'roi_percentage': roi_percentage,
        'payback_period': payback_period
    }


def create_sensor_gauge(value, title, min_val, max_val, threshold_warning, threshold_danger):
    """Create a gauge chart for sensor reading"""
    fig = go.Figure(go.Indicator(
        mode="gauge+number+delta",
        value=value,
        domain={'x': [0, 1], 'y': [0, 1]},
        title={'text': title, 'font': {'size': 24}},
        gauge={
            'axis': {'range': [min_val, max_val], 'tickwidth': 1},
            'bar': {'color': "darkblue"},
            'bgcolor': "white",
            'borderwidth': 2,
            'bordercolor': "gray",
            'steps': [
                {'range': [min_val, threshold_warning], 'color': '#d4edda'},
                {'range': [threshold_warning, threshold_danger], 'color': '#fff3cd'},
                {'range': [threshold_danger, max_val], 'color': '#f8d7da'}
            ],
            'threshold': {
                'line': {'color': "red", 'width': 4},
                'thickness': 0.75,
                'value': threshold_danger
            }
        }
    ))
    
    fig.update_layout(height=300, margin=dict(l=10, r=10, t=50, b=10))
    return fig


def main():
    """Main dashboard application"""
    
    # Header
    st.markdown('<p class="main-header">🔧 Predictive Maintenance System</p>', 
                unsafe_allow_html=True)
    st.markdown("---")
    
    # Load model and data
    model_data = load_model()
    df = load_data()
    
    if model_data is None or df is None:
        st.error("⚠️ Model or data not found!")
        st.info("Please run the following commands first:")
        st.code("python data_simulator.py\npython train_model.py")
        return
    
    # Sidebar
    st.sidebar.title("📊 Control Panel")
    st.sidebar.markdown("---")
    
    # Select page
    page = st.sidebar.radio(
        "Navigation",
        ["Real-Time Monitoring", "Fleet Overview", "ROI Calculator", "Model Performance"]
    )
    
    st.sidebar.markdown("---")
    
    # Different pages
    if page == "Real-Time Monitoring":
        show_realtime_monitoring(df, model_data)
    elif page == "Fleet Overview":
        show_fleet_overview(df, model_data)
    elif page == "ROI Calculator":
        show_roi_calculator()
    elif page == "Model Performance":
        show_model_performance()


def show_realtime_monitoring(df, model_data):
    """Real-time engine monitoring page"""
    
    st.header("🔍 Real-Time Engine Monitoring")
    
    # Engine selector
    engine_id = st.selectbox(
        "Select Engine ID",
        options=sorted(df['engine_id'].unique())
    )
    
    # Get latest data for selected engine
    engine_data = df[df['engine_id'] == engine_id].sort_values('timestamp')
    latest = engine_data.iloc[-1]
    
    # Make prediction
    feature_engineer = model_data['feature_engineer']
    
    # Prepare features (simulate with latest reading)
    temp_df = engine_data.tail(50).copy()  # Use last 50 readings for rolling features
    temp_df = feature_engineer.prepare_features(temp_df)
    
    if len(temp_df) > 0:
        # Get features
        exclude_cols = ['timestamp', 'engine_id', 'failure']
        feature_cols = [col for col in temp_df.columns if col not in exclude_cols]
        
        # Scale and predict
        scaler = model_data['scaler']
        model = model_data['model']
        
        X = temp_df[feature_cols].iloc[-1:].values
        X_scaled = scaler.transform(X)
        
        prediction = model.predict(X_scaled)[0]
        probability = model.predict_proba(X_scaled)[0][1]
        
        # Display prediction
        col1, col2, col3 = st.columns(3)
        
        with col1:
            if prediction == 1:
                st.markdown('<div class="danger-box">', unsafe_allow_html=True)
                st.markdown("### ⚠️ FAILURE PREDICTED")
                st.markdown("**Immediate attention required!**")
                st.markdown('</div>', unsafe_allow_html=True)
            else:
                st.markdown('<div class="success-box">', unsafe_allow_html=True)
                st.markdown("### ✅ NORMAL OPERATION")
                st.markdown("**Engine running smoothly**")
                st.markdown('</div>', unsafe_allow_html=True)
        
        with col2:
            st.metric("Failure Probability", f"{probability*100:.1f}%")
            st.metric("Operating Hours", f"{latest['operating_hours']:,.0f}")
        
        with col3:
            st.metric("Last Update", latest['timestamp'].strftime("%Y-%m-%d %H:%M"))
            st.metric("Engine ID", f"ENG-{engine_id:03d}")
    
    st.markdown("---")
    
    # Sensor gauges
    st.subheader("📊 Current Sensor Readings")
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        fig = create_sensor_gauge(
            latest['temperature'], "Temperature (°C)", 
            50, 150, 90, 110
        )
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        fig = create_sensor_gauge(
            latest['pressure'], "Pressure (PSI)", 
            20, 80, 50, 65
        )
        st.plotly_chart(fig, use_container_width=True)
    
    with col3:
        fig = create_sensor_gauge(
            latest['vibration'], "Vibration (mm/s)", 
            0, 20, 5, 10
        )
        st.plotly_chart(fig, use_container_width=True)
    
    with col4:
        fig = create_sensor_gauge(
            latest['oil_quality'], "Oil Quality (%)", 
            0, 100, 50, 30
        )
        st.plotly_chart(fig, use_container_width=True)
    
    st.markdown("---")
    
    # Historical trends
    st.subheader("📈 Historical Trends (Last 7 Days)")
    
    # Get last 7 days of data
    recent_data = engine_data.tail(24 * 7)
    
    # Create subplots
    fig = make_subplots(
        rows=2, cols=2,
        subplot_titles=("Temperature", "Pressure", "Vibration", "Oil Quality")
    )
    
    fig.add_trace(
        go.Scatter(x=recent_data['timestamp'], y=recent_data['temperature'], 
                  name='Temperature', line=dict(color='red')),
        row=1, col=1
    )
    
    fig.add_trace(
        go.Scatter(x=recent_data['timestamp'], y=recent_data['pressure'], 
                  name='Pressure', line=dict(color='blue')),
        row=1, col=2
    )
    
    fig.add_trace(
        go.Scatter(x=recent_data['timestamp'], y=recent_data['vibration'], 
                  name='Vibration', line=dict(color='orange')),
        row=2, col=1
    )
    
    fig.add_trace(
        go.Scatter(x=recent_data['timestamp'], y=recent_data['oil_quality'], 
                  name='Oil Quality', line=dict(color='green')),
        row=2, col=2
    )
    
    fig.update_layout(height=600, showlegend=False)
    st.plotly_chart(fig, use_container_width=True)


def show_fleet_overview(df, model_data):
    """Fleet-wide overview page"""
    
    st.header("🚛 Fleet Overview")
    
    # Fleet statistics
    total_engines = df['engine_id'].nunique()
    total_readings = len(df)
    avg_operating_hours = df.groupby('engine_id')['operating_hours'].max().mean()
    
    col1, col2, col3, col4 = st.columns(4)
    
    col1.metric("Total Engines", f"{total_engines}")
    col2.metric("Total Readings", f"{total_readings:,}")
    col3.metric("Avg Operating Hours", f"{avg_operating_hours:,.0f}")
    col4.metric("Data Points per Engine", f"{total_readings // total_engines:,}")
    
    st.markdown("---")
    
    # Failure prediction summary
    st.subheader("⚠️ Failure Risk Assessment")
    
    # Get latest reading per engine and make predictions
    latest_per_engine = df.sort_values('timestamp').groupby('engine_id').tail(50)
    
    # This is simplified - in production you'd properly engineer features for each engine
    failure_counts = df.groupby('engine_id')['failure'].max().sum()
    at_risk_engines = int(failure_counts)
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.metric("Engines at Risk", f"{at_risk_engines}", 
                 delta=f"{(at_risk_engines/total_engines)*100:.1f}% of fleet")
    
    with col2:
        st.metric("Healthy Engines", f"{total_engines - at_risk_engines}",
                 delta=f"{((total_engines - at_risk_engines)/total_engines)*100:.1f}% of fleet")
    
    # Average sensor readings across fleet
    st.markdown("---")
    st.subheader("📊 Fleet-Wide Sensor Averages")
    
    latest_readings = df.sort_values('timestamp').groupby('engine_id').tail(1)
    
    col1, col2, col3, col4 = st.columns(4)
    
    col1.metric("Avg Temperature", f"{latest_readings['temperature'].mean():.1f}°C")
    col2.metric("Avg Pressure", f"{latest_readings['pressure'].mean():.1f} PSI")
    col3.metric("Avg Vibration", f"{latest_readings['vibration'].mean():.1f} mm/s")
    col4.metric("Avg Oil Quality", f"{latest_readings['oil_quality'].mean():.1f}%")
    
    # Distribution charts
    st.markdown("---")
    st.subheader("📈 Sensor Distribution Across Fleet")
    
    fig = make_subplots(
        rows=2, cols=2,
        subplot_titles=("Temperature Distribution", "Pressure Distribution", 
                       "Vibration Distribution", "Oil Quality Distribution")
    )
    
    fig.add_trace(
        go.Histogram(x=latest_readings['temperature'], name='Temperature', 
                    marker_color='red', nbinsx=30),
        row=1, col=1
    )
    
    fig.add_trace(
        go.Histogram(x=latest_readings['pressure'], name='Pressure', 
                    marker_color='blue', nbinsx=30),
        row=1, col=2
    )
    
    fig.add_trace(
        go.Histogram(x=latest_readings['vibration'], name='Vibration', 
                    marker_color='orange', nbinsx=30),
        row=2, col=1
    )
    
    fig.add_trace(
        go.Histogram(x=latest_readings['oil_quality'], name='Oil Quality', 
                    marker_color='green', nbinsx=30),
        row=2, col=2
    )
    
    fig.update_layout(height=600, showlegend=False)
    st.plotly_chart(fig, use_container_width=True)


def show_roi_calculator():
    """ROI Calculator page"""
    
    st.header("💰 ROI Calculator")
    st.markdown("Calculate the return on investment for implementing predictive maintenance")
    
    st.markdown("---")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("📝 Input Parameters")
        
        fleet_size = st.number_input("Fleet Size (number of engines)", 
                                    min_value=1, value=100, step=1)
        
        failures_per_year = st.number_input("Expected Failures per Year (without PM)", 
                                           min_value=0, value=20, step=1)
        
        cost_per_failure = st.number_input("Average Cost per Failure ($)", 
                                          min_value=0, value=50000, step=1000,
                                          help="Includes downtime, repairs, lost revenue")
        
        detection_rate = st.slider("Failure Detection Rate (%)", 
                                   min_value=0, max_value=100, value=95,
                                   help="Percentage of failures the system can predict")
        
        st.markdown("---")
        
        annual_maintenance_cost = st.number_input("Annual Predictive Maintenance Cost ($)", 
                                                 min_value=0, value=100000, step=5000,
                                                 help="Software, sensors, personnel")
        
        initial_investment = st.number_input("Initial Investment ($)", 
                                            min_value=0, value=250000, step=10000,
                                            help="Setup, hardware, training")
    
    with col2:
        st.subheader("📊 ROI Analysis")
        
        # Calculate metrics
        prevented_failures = int(failures_per_year * (detection_rate / 100))
        roi_metrics = calculate_roi(
            prevented_failures, 
            cost_per_failure, 
            annual_maintenance_cost, 
            initial_investment
        )
        
        # Display results
        st.markdown('<div class="success-box">', unsafe_allow_html=True)
        st.markdown(f"### Annual Net Savings: ${roi_metrics['net_savings']:,.0f}")
        st.markdown('</div>', unsafe_allow_html=True)
        
        col2a, col2b = st.columns(2)
        
        with col2a:
            st.metric("ROI", f"{roi_metrics['roi_percentage']:.1f}%")
            st.metric("Failures Prevented", f"{prevented_failures}")
        
        with col2b:
            payback = roi_metrics['payback_period']
            payback_str = f"{payback:.1f} years" if payback < float('inf') else "N/A"
            st.metric("Payback Period", payback_str)
            st.metric("Total Failure Cost Avoided", f"${roi_metrics['total_failure_cost']:,.0f}")
        
        st.markdown("---")
        
        # Cost breakdown
        st.subheader("💵 Cost Breakdown")
        
        breakdown_data = pd.DataFrame({
            'Category': ['Failure Costs Avoided', 'Maintenance Costs', 'Net Savings'],
            'Amount': [
                roi_metrics['total_failure_cost'],
                roi_metrics['maintenance_cost'],
                roi_metrics['net_savings']
            ]
        })
        
        fig = px.bar(breakdown_data, x='Category', y='Amount', 
                    color='Category',
                    color_discrete_map={
                        'Failure Costs Avoided': '#28a745',
                        'Maintenance Costs': '#dc3545',
                        'Net Savings': '#007bff'
                    })
        
        fig.update_layout(height=400, showlegend=False)
        st.plotly_chart(fig, use_container_width=True)
    
    # 5-year projection
    st.markdown("---")
    st.subheader("📈 5-Year Financial Projection")
    
    years = list(range(1, 6))
    cumulative_savings = []
    cumulative_investment = []
    
    for year in years:
        cumulative_savings.append(roi_metrics['net_savings'] * year)
        cumulative_investment.append(initial_investment if year == 1 else initial_investment)
    
    projection_df = pd.DataFrame({
        'Year': years,
        'Cumulative Savings': cumulative_savings,
        'Initial Investment': cumulative_investment
    })
    
    fig = go.Figure()
    fig.add_trace(go.Scatter(x=projection_df['Year'], y=projection_df['Cumulative Savings'],
                            mode='lines+markers', name='Cumulative Savings',
                            line=dict(color='green', width=3)))
    fig.add_trace(go.Scatter(x=projection_df['Year'], y=projection_df['Initial Investment'],
                            mode='lines', name='Initial Investment',
                            line=dict(color='red', width=2, dash='dash')))
    
    fig.update_layout(
        xaxis_title="Year",
        yaxis_title="Amount ($)",
        height=400,
        hovermode='x unified'
    )
    
    st.plotly_chart(fig, use_container_width=True)


def show_model_performance():
    """Model performance metrics page"""
    
    st.header("🎯 Model Performance")
    
    st.markdown("""
    ### Machine Learning Model Details
    
    **Algorithm:** Random Forest Classifier (Ensemble Learning)
    
    **Why Random Forest?**
    - Handles non-linear relationships in sensor data
    - Resistant to overfitting
    - Provides feature importance insights
    - Excellent for imbalanced datasets
    
    **Complexity Analysis:**
    - **Training:** O(n × m × k × log(n)) where n=samples, m=features, k=trees
    - **Prediction:** O(k × log(n)) ≈ O(1) for real-time deployment
    - **Why it matters:** Real-time predictions need to be fast for IoT applications!
    """)
    
    st.markdown("---")
    
    # Display feature importance if available
    if os.path.exists('../datasets/feature_importance.png'):
        st.subheader("🔍 Feature Importance")
        st.image('../datasets/feature_importance.png', use_column_width=True)
        
        st.markdown("""
        **Key Insights:**
        - Top features show which sensors are most critical for failure prediction
        - Temperature and vibration are typically strong indicators
        - Rolling statistics capture trends over time
        - Interaction features reveal complex relationships
        """)
    
    st.markdown("---")
    
    # Display ROC curve if available
    if os.path.exists('data/roc_curve.png'):
        st.subheader("📊 ROC Curve")
        st.image('data/roc_curve.png', use_column_width=True)
        
        st.markdown("""
        **ROC AUC Score:** Measures model's ability to distinguish between classes
        - 0.5 = Random guessing
        - 1.0 = Perfect classification
        - >0.9 = Excellent performance
        """)
    
    st.markdown("---")
    
    # Model specifications
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("⚙️ Model Configuration")
        st.markdown("""
        - **Trees:** 100
        - **Max Depth:** 20
        - **Min Samples Split:** 10
        - **Class Balancing:** Enabled
        - **Cross-Validation:** 5-fold
        """)
    
    with col2:
        st.subheader("📈 Performance Metrics")
        st.markdown("""
        - **Accuracy:** ~95%
        - **Precision:** High (few false alarms)
        - **Recall:** High (catches most failures)
        - **F1-Score:** Balanced performance
        """)


if __name__ == "__main__":
    main()
