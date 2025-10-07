"""
Setup Verification Script
Checks if all dependencies are installed and the system is ready to run
"""

import sys

def check_dependencies():
    """Check if all required packages are installed"""
    print("=" * 60)
    print("CHECKING DEPENDENCIES")
    print("=" * 60)
    
    required_packages = {
        'numpy': 'numpy',
        'pandas': 'pandas',
        'sklearn': 'scikit-learn',
        'streamlit': 'streamlit',
        'plotly': 'plotly',
        'matplotlib': 'matplotlib',
        'seaborn': 'seaborn',
        'imblearn': 'imbalanced-learn',
        'joblib': 'joblib'
    }
    
    missing_packages = []
    
    for import_name, package_name in required_packages.items():
        try:
            __import__(import_name)
            print(f" {package_name:25s} - Installed")
        except ImportError:
            print(f" {package_name:25s} - Missing")
            missing_packages.append(package_name)
    
    print("\n" + "=" * 60)
    
    if missing_packages:
        print("  MISSING PACKAGES")
        print("=" * 60)
        print("\nThe following packages need to be installed:")
        for pkg in missing_packages:
            print(f"  - {pkg}")
        print("\nInstall them with:")
        print("  pip install -r requirements.txt")
        print("\n" + "=" * 60)
        return False
    else:
        print("✅ ALL DEPENDENCIES INSTALLED")
        print("=" * 60)
        return True


def check_python_version():
    """Check Python version"""
    print("\n" + "=" * 60)
    print("CHECKING PYTHON VERSION")
    print("=" * 60)
    
    version = sys.version_info
    print(f"Python version: {version.major}.{version.minor}.{version.micro}")
    
    if version.major >= 3 and version.minor >= 8:
        print("✅ Python version is compatible (3.8+)")
        print("=" * 60)
        return True
    else:
        print("⚠️  Python 3.8 or higher is required")
        print(f"Current version: {version.major}.{version.minor}.{version.micro}")
        print("=" * 60)
        return False


def verify_modules():
    """Verify project modules can be imported"""
    print("\n" + "=" * 60)
    print("VERIFYING PROJECT MODULES")
    print("=" * 60)
    
    modules = [
        'data_simulator',
        'model_utils',
        'train_model',
        'dashboard'
    ]
    
    all_ok = True
    
    for module in modules:
        try:
            __import__(module)
            print(f"✅ {module:25s} - OK")
        except Exception as e:
            print(f"❌ {module:25s} - Error: {str(e)[:40]}")
            all_ok = False
    
    print("=" * 60)
    return all_ok


def main():
    """Run all verification checks"""
    print("\n")
    print("╔" + "=" * 58 + "╗")
    print("║" + " " * 10 + "PREDICTIVE MAINTENANCE SYSTEM" + " " * 19 + "║")
    print("║" + " " * 17 + "Setup Verification" + " " * 23 + "║")
    print("╚" + "=" * 58 + "╝")
    print("\n")
    
    # Check Python version
    python_ok = check_python_version()
    
    # Check dependencies
    deps_ok = check_dependencies()
    
    # Verify modules
    modules_ok = verify_modules()
    
    # Final status
    print("\n" + "=" * 60)
    print("VERIFICATION SUMMARY")
    print("=" * 60)
    
    print(f"Python Version:  {'✅ Pass' if python_ok else '❌ Fail'}")
    print(f"Dependencies:    {'✅ Pass' if deps_ok else '❌ Fail'}")
    print(f"Project Modules: {'✅ Pass' if modules_ok else '❌ Fail'}")
    
    print("\n" + "=" * 60)
    
    if python_ok and deps_ok and modules_ok:
        print("✅ SYSTEM READY")
        print("=" * 60)
        print("\nYou can now run:")
        print("  python run_pipeline.py")
        print("\nOr step-by-step:")
        print("  1. python data_simulator.py")
        print("  2. python train_model.py")
        print("  3. streamlit run dashboard.py")
        print("\n" + "=" * 60)
        return 0
    else:
        print("❌ SETUP INCOMPLETE")
        print("=" * 60)
        print("\nPlease address the issues above.")
        print("Most common fix:")
        print("  pip install -r requirements.txt")
        print("\n" + "=" * 60)
        return 1


if __name__ == "__main__":
    sys.exit(main())
