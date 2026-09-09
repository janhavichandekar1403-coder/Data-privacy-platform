🔐 Data Privacy Platform

A privacy-preserving data anonymization platform that automatically detects sensitive information in CSV datasets, calculates privacy risk, and applies configurable data protection techniques.

📌 Those

The Data Privacy Platform is a Flask-based web application designed to help protect sensitive information before a dataset is shared or processed.

The platform allows users to upload a CSV dataset, scan columns for potentially sensitive information, review detected columns and confidence scores, select an anonymization method, and download the protected dataset along with a compliance report.

✨ Features
📂 Upload CSV datasets
🔍 Automatic sensitive data detection
📊 Privacy risk score calculation
🎯 Confidence scores for detected columns
🔐 Multiple dat
🛡️ Data masking
🔑 Hashing
🔒 Encryption
🎟️ Tokens
📉 Before-and-after privacy risk comparison
📄 PDF compliance report generation
⬇️ Download anonymized CSV
🔑 Encryption key generation
🖥️ Screenshots
Upload Dataset

Upload a CSV file and start the privacy scanning process.

Review Detected Columns

The platform scans the dataset and identifies potentially sensitive columns along with their confidence scores.

Download Results

Of

⚙️ How It Works

1. Upload Dataset

Upload a CSV dataset containing potentially sensitive information.

2. Detect Sensitive Information

The platform analyzes the dataset and identifies columns that may contain sensitive information such as:

Names
Email addresses
Phone numbers
Aadhaar numbers
Salary / financial information

3. Calculate Privacy Risk

A privacy risk score is calculated based on the detected sensitive information.

4. Select Protection Method

Users can choose an appropriate protection technique for each detected column.

5. Anonymize Data

The selected anonymization methods are applied to the sensitive values.

6. Download Results

Users can download the anonymized CSV and generated PDF compliance report.

🔐 Anonymization Techniques
Masking

Masks part of a sensitive value while keeping some information visible.

Example:

9876543210 → 98******10

Hashing

Converts sensitive information into a hash representation.

Example:

9876543210 → Hash Value

Encryption

Encrypts sensitive information using a generated cryptographic key.

Tokenization

Replaces sensitive information with a token.

Example:

janhavi@example.com → TOKEN_001

📊 Privacy Risk Score

The platform uses a 0–100 privacy risk scale to represent the exposure of sensitive information.

Example:

Before Protection: 78/100

After Protection: 12/100

A lower score indicates reduced exposure after anonymization.

🏗️ System Workflow
Upload CSV
     ↓
Scan Dataset
     ↓
Detect Sensitive Information
     ↓
Calculate Privacy Risk
     ↓
Select Protection Method
     ↓
Anonymize Data
     ↓
Generate Compliance Report
     ↓
Download Protected Dataset
🛠️ Tech Stack
Backend
Python
Flask
Data Processing
Pandas
With
Cryptography
Hashing
Encryption
Masking
Tokenization
Report Generation
FPDF
Frontend
HTML
CSS
JavaScript
📄 Compliance Report

The platform generates a PDF compliance report containing information about the privacy analysis and the protection techniques applied to the dataset.

The project is designed around privacy principles relevant to frameworks such as GDPR and India's Digital Personal Data Protection (DPDP) framework.

The generated report is a technical privacy report and should not be considered legal advice or regulatory certification.

📁 Project Structure
Data-privacy-platform/
│
├── app.py
├── requirements.txt
├── templates/
├── static/
├── screenshots/
│   ├── upload.png
│   ├── review.png
│   └── results.png
└── README.md
🚀 Installation
1. Clone the Repository
git clone https://github.com/janhavichandekar1403-coder/Data-privacy-platform.git
2. Navigate to the Project
cd Data-privacy-platform
3. Create a Virtual Environment
python -m venv venv
4. Activate the Virtual Environment

Windows:

venv\Scripts\activate

Linux / macOS:

source venv/bin/activate
5. Install Dependencies
pip install -r requirements.txt
6. Run the Application
python app.py
🎯 Use Cases
Protecting sensitive datasets before sharing
Preparing datasets for analytics
Protecting PII in development environments
Privacy-aware data processing
Research data
Generating documentation for anonymization workflows
🔮 Future Improvements
Machine-learning-based PII detection
NLP-based sensitive information detection
Excel and PDF dataset support
Database integration
User authentication
Cloud deployment
Advanced privacy analytics
Differential privacy techniques
Batch dataset anonymization

👩‍💻 Author

Janhavi Chandekar

⭐ If You Like This Project

Give the repository a ⭐ on GitHub!
