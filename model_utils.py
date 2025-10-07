"""
Model Utilities and Preprocessing
Feature engineering and model evaluation functions
"""

import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score, roc_curve
import matplotlib.pyplot as plt
import seaborn as sns


class FeatureEngineer:
    """
    Feature engineering for sensor data
    Time Complexity: O(n) - linear with number of records
    """
    
    def __init__(self, window_size=24):
        """
        Initialize feature engineer
        
        Args:
            window_size (int): Rolling window size for temporal features (default 24 hours)
        """
        self.window_size = window_size
    
    def create_temporal_features(self, df):
        """
        Create time-based features from sensor data
        
        Args:
            df (DataFrame): Input sensor data
            
        Returns:
            DataFrame: Data with additional temporal features
        """
        print("Creating temporal features...")
        df = df.copy()
        
        # Sort by engine and timestamp
        df = df.sort_values(['engine_id', 'timestamp'])
        
        # Rolling statistics (per engine)
        for col in ['temperature', 'pressure', 'vibration', 'oil_quality']:
            # Rolling mean - captures trends
            df[f'{col}_rolling_mean'] = df.groupby('engine_id')[col].transform(
                lambda x: x.rolling(window=self.window_size, min_periods=1).mean()
            )
            
            # Rolling std - captures variability
            df[f'{col}_rolling_std'] = df.groupby('engine_id')[col].transform(
                lambda x: x.rolling(window=self.window_size, min_periods=1).std()
            ).fillna(0)
            
            # Rate of change - captures degradation speed
            df[f'{col}_rate_of_change'] = df.groupby('engine_id')[col].transform(
                lambda x: x.diff()
            ).fillna(0)
        
        return df
    
    def create_interaction_features(self, df):
        """
        Create feature interactions that capture complex relationships
        
        Args:
            df (DataFrame): Input sensor data
            
        Returns:
            DataFrame: Data with interaction features
        """
        print("Creating interaction features...")
        df = df.copy()
        
        # Temperature-Pressure ratio (high temp + high pressure = danger)
        df['temp_pressure_ratio'] = df['temperature'] / (df['pressure'] + 1)
        
        # Vibration-Temperature interaction
        df['vibration_temp_product'] = df['vibration'] * df['temperature']
        
        # Health score (composite metric)
        df['health_score'] = (
            (150 - df['temperature']) / 100 +  # Lower temp is better
            df['oil_quality'] / 100 +           # Higher quality is better
            (20 - df['vibration']) / 20 +       # Lower vibration is better
            (80 - df['pressure']) / 80          # Lower pressure is better
        ) / 4
        
        # Stress indicator
        df['stress_indicator'] = (
            df['temperature'] / 150 +
            df['pressure'] / 80 +
            df['vibration'] / 20
        ) / 3
        
        return df
    
    def prepare_features(self, df):
        """
        Complete feature engineering pipeline
        
        Args:
            df (DataFrame): Raw sensor data
            
        Returns:
            DataFrame: Engineered features ready for ML
        """
        df = self.create_temporal_features(df)
        df = self.create_interaction_features(df)
        
        # Drop NaN values created by rolling windows
        df = df.dropna()
        
        print(f"Feature engineering complete. Shape: {df.shape}")
        return df


class ModelEvaluator:
    """
    Model evaluation and visualization utilities
    """
    
    @staticmethod
    def print_metrics(y_true, y_pred, y_pred_proba):
        """
        Print comprehensive evaluation metrics
        
        Args:
            y_true: True labels
            y_pred: Predicted labels
            y_pred_proba: Prediction probabilities
        """
        print("\n" + "="*60)
        print("MODEL PERFORMANCE METRICS")
        print("="*60)
        
        # Classification report
        print("\nClassification Report:")
        print(classification_report(y_true, y_pred, 
                                   target_names=['Normal', 'Failure']))
        
        # Confusion Matrix
        cm = confusion_matrix(y_true, y_pred)
        print("\nConfusion Matrix:")
        print(f"{'':>15} {'Predicted Normal':>20} {'Predicted Failure':>20}")
        print(f"{'Actual Normal':<15} {cm[0][0]:>20} {cm[0][1]:>20}")
        print(f"{'Actual Failure':<15} {cm[1][0]:>20} {cm[1][1]:>20}")
        
        # ROC AUC
        try:
            roc_auc = roc_auc_score(y_true, y_pred_proba)
            print(f"\nROC AUC Score: {roc_auc:.4f}")
        except:
            print("\nROC AUC Score: N/A")
        
        # Business metrics
        tn, fp, fn, tp = cm.ravel()
        
        print("\n" + "="*60)
        print("BUSINESS IMPACT METRICS")
        print("="*60)
        print(f"True Positives (Failures Caught): {tp}")
        print(f"False Negatives (Failures Missed): {fn}")
        print(f"False Positives (False Alarms): {fp}")
        print(f"True Negatives (Normal Operations): {tn}")
        
        if (tp + fn) > 0:
            failure_detection_rate = tp / (tp + fn) * 100
            print(f"\nFailure Detection Rate: {failure_detection_rate:.2f}%")
        
        if (fp + tn) > 0:
            false_alarm_rate = fp / (fp + tn) * 100
            print(f"False Alarm Rate: {false_alarm_rate:.2f}%")
    
    @staticmethod
    def plot_feature_importance(model, feature_names, top_n=15):
        """
        Plot feature importance
        
        Args:
            model: Trained model with feature_importances_
            feature_names: List of feature names
            top_n: Number of top features to display
        """
        if not hasattr(model, 'feature_importances_'):
            print("Model does not have feature_importances_ attribute")
            return
        
        # Get feature importances
        importances = model.feature_importances_
        indices = np.argsort(importances)[::-1][:top_n]
        
        # Create plot
        plt.figure(figsize=(12, 8))
        plt.title(f"Top {top_n} Feature Importances", fontsize=16, fontweight='bold')
        plt.barh(range(top_n), importances[indices])
        plt.yticks(range(top_n), [feature_names[i] for i in indices])
        plt.xlabel('Importance Score', fontsize=12)
        plt.ylabel('Features', fontsize=12)
        plt.gca().invert_yaxis()
        plt.tight_layout()
        
        # Save plot
        plt.savefig('data/feature_importance.png', dpi=150, bbox_inches='tight')
        print("\nFeature importance plot saved to: data/feature_importance.png")
        plt.close()
    
    @staticmethod
    def plot_roc_curve(y_true, y_pred_proba):
        """
        Plot ROC curve
        
        Args:
            y_true: True labels
            y_pred_proba: Prediction probabilities
        """
        try:
            fpr, tpr, thresholds = roc_curve(y_true, y_pred_proba)
            roc_auc = roc_auc_score(y_true, y_pred_proba)
            
            plt.figure(figsize=(10, 8))
            plt.plot(fpr, tpr, color='darkorange', lw=2, 
                    label=f'ROC curve (AUC = {roc_auc:.3f})')
            plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--', 
                    label='Random Classifier')
            plt.xlim([0.0, 1.0])
            plt.ylim([0.0, 1.05])
            plt.xlabel('False Positive Rate', fontsize=12)
            plt.ylabel('True Positive Rate', fontsize=12)
            plt.title('Receiver Operating Characteristic (ROC) Curve', 
                     fontsize=16, fontweight='bold')
            plt.legend(loc="lower right", fontsize=12)
            plt.grid(alpha=0.3)
            plt.tight_layout()
            
            # Save plot
            plt.savefig('data/roc_curve.png', dpi=150, bbox_inches='tight')
            print("ROC curve plot saved to: data/roc_curve.png")
            plt.close()
        except Exception as e:
            print(f"Could not plot ROC curve: {e}")


def prepare_data_for_training(df, test_size=0.2):
    """
    Prepare data for ML training
    Time Complexity: O(n) - linear with dataset size
    
    Args:
        df (DataFrame): Engineered features dataset
        test_size (float): Proportion of data for testing
        
    Returns:
        tuple: X_train, X_test, y_train, y_test, feature_names, scaler
    """
    print("\nPreparing data for training...")
    
    # Define feature columns (exclude metadata and target)
    exclude_cols = ['timestamp', 'engine_id', 'failure']
    feature_cols = [col for col in df.columns if col not in exclude_cols]
    
    # Separate features and target
    X = df[feature_cols].values
    y = df['failure'].values
    
    print(f"Features: {len(feature_cols)}")
    print(f"Samples: {len(X):,}")
    print(f"Failure rate: {y.mean()*100:.2f}%")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=42, stratify=y
    )
    
    # Scale features (important for some algorithms)
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    print(f"Training samples: {len(X_train):,}")
    print(f"Testing samples: {len(X_test):,}")
    
    return X_train_scaled, X_test_scaled, y_train, y_test, feature_cols, scaler
