"""
Engine Sensor Data Simulator
Generates realistic sensor data for predictive maintenance training
"""

import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import os

# Set random seed for reproducibility
np.random.seed(42)


class EngineSensorSimulator:
    """
    Simulates engine sensor data with realistic patterns for:
    - Temperature
    - Pressure
    - Vibration
    - Oil Quality
    - Operating Hours
    """
    
    def __init__(self, num_engines=100, days=365):
        """
        Initialize the simulator
        
        Args:
            num_engines (int): Number of engines to simulate
            days (int): Number of days of operation to simulate
        """
        self.num_engines = num_engines
        self.days = days
        self.readings_per_day = 24  # Hourly readings
        
    def generate_normal_operation(self, size):
        """Generate sensor data for normal operating conditions"""
        data = {
            'temperature': np.random.normal(75, 5, size),  # Mean 75°C, SD 5
            'pressure': np.random.normal(40, 3, size),     # Mean 40 PSI, SD 3
            'vibration': np.random.normal(2.0, 0.5, size), # Mean 2.0 mm/s, SD 0.5
            'oil_quality': np.clip(100 - np.random.exponential(2, size), 40, 100),  # Degrades slowly
            'failure': 0
        }
        return data
    
    def generate_degrading_operation(self, size):
        """Generate sensor data showing gradual degradation leading to failure"""
        # Create degradation pattern over time
        degradation_factor = np.linspace(0, 1, size)
        
        data = {
            'temperature': 75 + degradation_factor * 40 + np.random.normal(0, 5, size),
            'pressure': 40 + degradation_factor * 20 + np.random.normal(0, 4, size),
            'vibration': 2.0 + degradation_factor * 8 + np.random.normal(0, 1, size),
            'oil_quality': 100 - degradation_factor * 70 - np.random.exponential(5, size),
            'failure': 0
        }
        
        # Mark last 10% of readings as failure imminent
        failure_threshold = int(size * 0.9)
        data['failure'] = np.zeros(size)
        data['failure'][failure_threshold:] = 1
        
        return data
    
    def generate_sudden_failure(self, size):
        """Generate sensor data showing sudden failure patterns"""
        # Normal operation with sudden spike
        failure_point = int(size * 0.8)
        
        data = {
            'temperature': np.concatenate([
                np.random.normal(75, 5, failure_point),
                np.random.normal(120, 10, size - failure_point)
            ]),
            'pressure': np.concatenate([
                np.random.normal(40, 3, failure_point),
                np.random.normal(65, 8, size - failure_point)
            ]),
            'vibration': np.concatenate([
                np.random.normal(2.0, 0.5, failure_point),
                np.random.normal(12, 3, size - failure_point)
            ]),
            'oil_quality': np.concatenate([
                np.clip(100 - np.random.exponential(2, failure_point), 40, 100),
                np.random.uniform(10, 30, size - failure_point)
            ]),
            'failure': 0
        }
        
        data['failure'] = np.zeros(size)
        data['failure'][failure_point:] = 1
        
        return data
    
    def simulate_engine_lifecycle(self, engine_id):
        """
        Simulate complete lifecycle of a single engine
        
        Returns:
            DataFrame with sensor readings for one engine
        """
        total_readings = self.days * self.readings_per_day
        
        # Randomly decide engine fate
        fate = np.random.choice(['normal', 'gradual_degradation', 'sudden_failure'], 
                               p=[0.7, 0.2, 0.1])
        
        if fate == 'normal':
            data = self.generate_normal_operation(total_readings)
        elif fate == 'gradual_degradation':
            data = self.generate_degrading_operation(total_readings)
        else:
            data = self.generate_sudden_failure(total_readings)
        
        # Create DataFrame
        df = pd.DataFrame(data)
        
        # Add metadata
        df['engine_id'] = engine_id
        df['operating_hours'] = np.arange(total_readings)
        
        # Add timestamps
        start_date = datetime.now() - timedelta(days=self.days)
        df['timestamp'] = [start_date + timedelta(hours=i) for i in range(total_readings)]
        
        # Ensure realistic bounds
        df['temperature'] = np.clip(df['temperature'], 50, 150)
        df['pressure'] = np.clip(df['pressure'], 20, 80)
        df['vibration'] = np.clip(df['vibration'], 0, 20)
        df['oil_quality'] = np.clip(df['oil_quality'], 0, 100)
        
        return df
    
    def generate_dataset(self):
        """
        Generate complete dataset for all engines
        
        Returns:
            DataFrame with all engine sensor data
        """
        print(f"Generating sensor data for {self.num_engines} engines over {self.days} days...")
        
        all_data = []
        for engine_id in range(self.num_engines):
            if (engine_id + 1) % 10 == 0:
                print(f"  Generated data for {engine_id + 1}/{self.num_engines} engines")
            
            engine_data = self.simulate_engine_lifecycle(engine_id)
            all_data.append(engine_data)
        
        # Combine all engines
        dataset = pd.concat(all_data, ignore_index=True)
        
        # Reorder columns
        dataset = dataset[['timestamp', 'engine_id', 'operating_hours', 
                          'temperature', 'pressure', 'vibration', 'oil_quality', 'failure']]
        
        print(f"\nDataset generated successfully!")
        print(f"Total records: {len(dataset):,}")
        print(f"Failure records: {dataset['failure'].sum():,} ({dataset['failure'].mean()*100:.2f}%)")
        
        return dataset


def main():
    """Main function to generate and save sensor data"""
    
    # Create data directory if it doesn't exist
    os.makedirs('data', exist_ok=True)
    
    # Initialize simulator
    simulator = EngineSensorSimulator(num_engines=100, days=365)
    
    # Generate dataset
    dataset = simulator.generate_dataset()
    
    # Save to CSV
    output_path = 'data/sensor_data.csv'
    dataset.to_csv(output_path, index=False)
    print(f"\nData saved to: {output_path}")
    
    # Display sample statistics
    print("\n" + "="*60)
    print("DATASET STATISTICS")
    print("="*60)
    print(dataset.describe())
    
    print("\n" + "="*60)
    print("SAMPLE DATA")
    print("="*60)
    print(dataset.head(10))
    
    # Show failure distribution by engine
    failure_by_engine = dataset.groupby('engine_id')['failure'].sum()
    engines_with_failures = (failure_by_engine > 0).sum()
    print(f"\nEngines with predicted failures: {engines_with_failures}/{simulator.num_engines}")


if __name__ == "__main__":
    main()
