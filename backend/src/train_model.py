import kagglehub
import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib

print("Downloading dataset...")
path = kagglehub.dataset_download("blastchar/telco-customer-churn")

csv_file = os.path.join(path, "WA_Fn-UseC_-Telco-Customer-Churn.csv")

print(f"Loading data from: {csv_file}")
df = pd.read_csv(csv_file)

df.drop('customerID', axis=1, inplace=True)
df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
df.fillna({'TotalCharges': 0}, inplace=True)

contract_mapping = {'Month-to-month': 0, 'One year': 1, 'Two year': 2}
df['Contract'] = df['Contract'].map(contract_mapping)

df['Churn'] = df['Churn'].map({'Yes': 1, 'No': 0})

selected_features = ['tenure', 'MonthlyCharges', 'TotalCharges', 'Contract']
X = df[selected_features]
y = df['Churn']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

print(f"Real Data Accuracy: {model.score(X_test, y_test) * 100:.2f}%")

joblib.dump(model, 'churn_model.pkl')
print("Model trained on real Telco data and saved!")