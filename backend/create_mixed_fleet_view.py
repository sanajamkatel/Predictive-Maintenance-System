"""
Create a Mixed Fleet View
Shows engines at different lifecycle stages (healthy, warning, critical)
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def create_mixed_fleet_snapshot():
    """
    Create a dataset where we see engines at different lifecycle stages
    This gives a more realistic "fleet monitoring" view
    """
    
    # Load full NASA data
    df = pd.read_csv('data/sensor_data.csv')
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    
    print("="*70)
    print("CREATING MIXED FLEET SNAPSHOT")
    print("="*70)
    
    # For each engine, randomly select a point in its lifecycle
    # This simulates a fleet where engines are at different ages
    
    selected_records = []
    
    for engine_id in df['engine_id'].unique():
        engine_data = df[df['engine_id'] == engine_id].sort_values('operating_hours')
        total_cycles = len(engine_data)
        
        # Randomly choose a lifecycle stage for this engine
        stage = np.random.choice(['early', 'mid', 'late'], p=[0.5, 0.3, 0.2])
        
        if stage == 'early':
            # Select from first 30% of lifecycle (healthy)
            cycle_idx = np.random.randint(0, max(1, int(total_cycles * 0.3)))
        elif stage == 'mid':
            # Select from middle 40% (some degradation)
            start = int(total_cycles * 0.3)
            end = int(total_cycles * 0.7)
            cycle_idx = np.random.randint(start, max(start+1, end))
        else:  # late
            # Select from last 30% (at risk)
            start = int(total_cycles * 0.7)
            cycle_idx = np.random.randint(start, total_cycles)
        
        selected_record = engine_data.iloc[cycle_idx:cycle_idx+1]
        selected_records.append(selected_record)
    
    # Combine all selected records
    mixed_fleet = pd.concat(selected_records, ignore_index=True)
    
    # Update timestamps to be "current"
    now = datetime.now()
    mixed_fleet['timestamp'] = now
    
    # Save as a snapshot
    mixed_fleet.to_csv('data/fleet_snapshot.csv', index=False)
    
    # Statistics
    print(f"\nCreated fleet snapshot with {len(mixed_fleet)} engines")
    print(f"At risk engines: {mixed_fleet['failure'].sum()}")
    print(f"Healthy engines: {len(mixed_fleet) - mixed_fleet['failure'].sum()}")
    print(f"Risk percentage: {mixed_fleet['failure'].mean()*100:.1f}%")
    
    print("\nLifecycle distribution:")
    print(f"  Early stage (healthy): ~50 engines")
    print(f"  Mid stage (warning): ~30 engines")
    print(f"  Late stage (at risk): ~20 engines")
    
    return mixed_fleet

if __name__ == "__main__":
    print("""
    This script creates a "snapshot" view of the fleet where:
    - 50% of engines are in early lifecycle (healthy)
    - 30% are mid-lifecycle (some warnings)
    - 20% are late lifecycle (at risk)
    
    This is more realistic for a "monitoring" dashboard!
    """)
    
    choice = input("\nCreate mixed fleet snapshot? (yes/no): ").lower()
    
    if choice == 'yes':
        mixed_fleet = create_mixed_fleet_snapshot()
        print("\n" + "="*70)
        print("✅ DONE! Restart your backend API to use the new view.")
        print("="*70)
        print("\nTo use this view:")
        print("1. Stop the current API (Ctrl+C in the terminal)")
        print("2. Run: python3 api.py")
        print("3. Refresh your browser")
        print("\nYou'll now see a realistic mix of healthy and at-risk engines!")
    else:
        print("\nNo changes made. Your current NASA data is still active.")

