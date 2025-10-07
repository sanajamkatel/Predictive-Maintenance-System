"""
Complete Pipeline Runner
Runs the entire predictive maintenance pipeline from start to finish
"""

import os
import sys
import subprocess


def print_header(text):
    """Print formatted header"""
    print("\n" + "="*70)
    print(f"  {text}")
    print("="*70 + "\n")


def run_command(description, command):
    """Run a command and handle errors"""
    print_header(description)
    
    try:
        result = subprocess.run(command, shell=True, check=True, 
                              capture_output=False, text=True)
        print(f"\n✅ {description} - SUCCESS\n")
        return True
    except subprocess.CalledProcessError as e:
        print(f"\n❌ {description} - FAILED")
        print(f"Error: {e}\n")
        return False


def main():
    """Run complete pipeline"""
    
    print_header("PREDICTIVE MAINTENANCE SYSTEM - COMPLETE PIPELINE")
    
    print("""
    This script will:
    1. Generate synthetic sensor data
    2. Train the machine learning model
    3. Launch the interactive dashboard
    
    Press Enter to continue or Ctrl+C to cancel...
    """)
    
    try:
        input()
    except KeyboardInterrupt:
        print("\n\nCancelled by user.")
        sys.exit(0)
    
    # Step 1: Generate data
    if not run_command("STEP 1: Generating Sensor Data", "python data_simulator.py"):
        print("Pipeline failed at data generation step.")
        sys.exit(1)
    
    # Step 2: Train model
    if not run_command("STEP 2: Training ML Model", "python train_model.py"):
        print("Pipeline failed at model training step.")
        sys.exit(1)
    
    # Step 3: Launch dashboard
    print_header("STEP 3: Launching Dashboard")
    print("""
    The dashboard will open in your web browser.
    
    To stop the dashboard, press Ctrl+C in this terminal.
    
    Dashboard URL: http://localhost:8501
    """)
    
    input("Press Enter to launch dashboard...")
    
    try:
        subprocess.run("streamlit run dashboard.py", shell=True, check=True)
    except KeyboardInterrupt:
        print("\n\n✅ Dashboard stopped by user.")
    except Exception as e:
        print(f"\n❌ Dashboard error: {e}")
        sys.exit(1)
    
    print_header("PIPELINE COMPLETE")
    print("Thank you for using the Predictive Maintenance System!")


if __name__ == "__main__":
    main()
