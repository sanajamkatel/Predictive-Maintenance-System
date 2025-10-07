"""
Machine Learning Model Training
Trains a Random Forest classifier for engine failure prediction
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from imblearn.over_sampling import SMOTE
import joblib
import os
import time

from model_utils import FeatureEngineer, ModelEvaluator, prepare_data_for_training


class FailurePredictionModel:
    """
    Random Forest model for predicting engine failures
    
    Time Complexity Analysis:
    - Training: O(n × m × k × log(n))
      where n = samples, m = features, k = trees
    - Prediction: O(k × log(n)) per sample
    - Real-time prediction: Effectively O(1) for deployed model
    """
    
    def __init__(self, n_estimators=100, max_depth=20):
        """
        Initialize the model
        
        Args:
            n_estimators (int): Number of trees in the forest
            max_depth (int): Maximum depth of trees
        """
        self.model = RandomForestClassifier(
            n_estimators=n_estimators,
            max_depth=max_depth,
            min_samples_split=10,
            min_samples_leaf=4,
            max_features='sqrt',
            random_state=42,
            n_jobs=-1,  # Use all CPU cores
            class_weight='balanced'  # Handle class imbalance
        )
        self.feature_engineer = FeatureEngineer(window_size=24)
        self.scaler = None
        self.feature_names = None
    
    def train(self, X_train, y_train, use_smote=True):
        """
        Train the model
        
        Args:
            X_train: Training features
            y_train: Training labels
            use_smote (bool): Whether to use SMOTE for handling class imbalance
        """
        print("\n" + "="*60)
        print("TRAINING MODEL")
        print("="*60)
        
        # Handle class imbalance with SMOTE if needed
        if use_smote and y_train.mean() < 0.3:
            print("\nApplying SMOTE to balance classes...")
            smote = SMOTE(random_state=42)
            X_train, y_train = smote.fit_resample(X_train, y_train)
            print(f"After SMOTE - Samples: {len(X_train):,}, Failure rate: {y_train.mean()*100:.2f}%")
        
        # Train model
        print("\nTraining Random Forest Classifier...")
        start_time = time.time()
        
        self.model.fit(X_train, y_train)
        
        training_time = time.time() - start_time
        print(f"Training completed in {training_time:.2f} seconds")
        
        # Feature importance
        print(f"\nModel uses {len(self.feature_names)} features")
        print(f"Number of trees: {self.model.n_estimators}")
        
    def predict(self, X):
        """
        Make predictions
        Time Complexity: O(k × log(n)) ≈ O(1) for fixed model
        
        Args:
            X: Features to predict
            
        Returns:
            tuple: (predictions, probabilities)
        """
        predictions = self.model.predict(X)
        probabilities = self.model.predict_proba(X)[:, 1]
        return predictions, probabilities
    
    def evaluate(self, X_test, y_test):
        """
        Evaluate model performance
        
        Args:
            X_test: Test features
            y_test: Test labels
        """
        print("\n" + "="*60)
        print("EVALUATING MODEL ON TEST SET")
        print("="*60)
        
        # Make predictions
        y_pred, y_pred_proba = self.predict(X_test)
        
        # Print metrics
        ModelEvaluator.print_metrics(y_test, y_pred, y_pred_proba)
        
        # Plot visualizations
        ModelEvaluator.plot_feature_importance(self.model, self.feature_names)
        ModelEvaluator.plot_roc_curve(y_test, y_pred_proba)
    
    def save(self, model_path='data/failure_predictor.pkl'):
        """
        Save trained model and metadata
        
        Args:
            model_path (str): Path to save the model
        """
        model_data = {
            'model': self.model,
            'scaler': self.scaler,
            'feature_names': self.feature_names,
            'feature_engineer': self.feature_engineer
        }
        
        joblib.dump(model_data, model_path)
        print(f"\nModel saved to: {model_path}")
    
    @staticmethod
    def load(model_path='data/failure_predictor.pkl'):
        """
        Load trained model
        
        Args:
            model_path (str): Path to the saved model
            
        Returns:
            FailurePredictionModel: Loaded model instance
        """
        model_data = joblib.load(model_path)
        
        instance = FailurePredictionModel()
        instance.model = model_data['model']
        instance.scaler = model_data['scaler']
        instance.feature_names = model_data['feature_names']
        instance.feature_engineer = model_data['feature_engineer']
        
        return instance


def main():
    """Main training pipeline"""
    
    print("="*60)
    print("PREDICTIVE MAINTENANCE MODEL TRAINING")
    print("="*60)
    
    # Check if data exists
    data_path = 'data/sensor_data.csv'
    if not os.path.exists(data_path):
        print(f"\nError: {data_path} not found!")
        print("Please run 'python data_simulator.py' first to generate training data.")
        return
    
    # Load data
    print(f"\nLoading data from {data_path}...")
    df = pd.read_csv(data_path)
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    print(f"Loaded {len(df):,} records from {df['engine_id'].nunique()} engines")
    
    # Feature engineering
    print("\n" + "="*60)
    print("FEATURE ENGINEERING")
    print("="*60)
    feature_engineer = FeatureEngineer(window_size=24)
    df_engineered = feature_engineer.prepare_features(df)
    
    # Prepare data for training
    X_train, X_test, y_train, y_test, feature_names, scaler = prepare_data_for_training(
        df_engineered, test_size=0.2
    )
    
    # Initialize and train model
    model = FailurePredictionModel(n_estimators=100, max_depth=20)
    model.feature_names = feature_names
    model.scaler = scaler
    
    model.train(X_train, y_train, use_smote=True)
    
    # Evaluate model
    model.evaluate(X_test, y_test)
    
    # Save model
    model.save('data/failure_predictor.pkl')
    
    # Summary
    print("\n" + "="*60)
    print("TRAINING COMPLETE")
    print("="*60)
    print("\nNext steps:")
    print("1. Review model performance metrics above")
    print("2. Check feature importance: data/feature_importance.png")
    print("3. Check ROC curve: data/roc_curve.png")
    print("4. Launch dashboard: streamlit run dashboard.py")
    print("\n" + "="*60)


if __name__ == "__main__":
    main()
