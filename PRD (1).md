# PRD.md — AI Document Extraction System

# AI Document Extraction System

## 1. Project Overview

A serverless AI-powered document extraction web application built using AWS cloud services.

Users can:
- Upload documents (PDF/Image)
- Extract text, forms, and tables using AWS Textract
- Store extracted structured data
- View extracted data in dashboard format
- Download extraction JSON

The system uses a fully serverless AWS architecture with no traditional backend server.

---

# 2. Objectives

## Primary Goals
- Build scalable document extraction platform
- Use AWS managed services only
- Minimize backend infrastructure management
- Store extracted data in structured format
- Create responsive frontend dashboard

## Secondary Goals
- Reduce operational cost
- Enable future OCR expansion
- Support invoices/forms/tables
- Maintain modular cloud architecture

---

# 3. Tech Stack

## Frontend
| Technology | Purpose |
|---|---|
| React + Vite | Frontend Framework |
| Tailwind CSS | Styling |
| Axios / Fetch | API Calls |

## AWS Services
| Service | Purpose |
|---|---|
| S3 | File storage + static hosting |
| API Gateway | Public API endpoints |
| Lambda | Serverless compute |
| Textract | OCR/document analysis |
| DynamoDB | Structured data storage |
| IAM | Permissions management |
| CloudWatch | Logging & monitoring |

---

# 4. System Architecture

```text
Frontend (S3 Static Hosting)
        ↓
API Gateway
        ↓
Lambda (Generate Upload URL)
        ↓
S3 Upload Bucket
        ↓
S3 Trigger Event
        ↓
Processing Lambda
        ↓
Textract
        ↓
Data Processing
        ↓
┌───────────────┬────────────────┐
│               │                │
↓               ↓                ↓
DynamoDB        S3               CloudWatch
Structured      Raw JSON         Logs
Data            Storage
```

---

# 5. User Flow

## Upload Flow

1. User opens web application
2. User selects document
3. Frontend requests upload URL
4. Lambda generates S3 presigned URL
5. Frontend uploads file directly to S3
6. S3 upload event triggers processing Lambda
7. Lambda sends document to Textract
8. Textract extracts forms/tables/text
9. Lambda stores:
   - structured data → DynamoDB
   - raw extraction JSON → S3
10. Dashboard displays extracted data

---

# 6. Features

## MVP Features

### Document Upload
- Upload PDF/JPG/PNG
- Drag and drop support
- Upload progress indicator

### Extraction
- OCR text extraction
- Form extraction
- Table extraction

### Dashboard
- View uploaded documents
- View extraction status
- View extracted fields
- View extracted tables

### Storage
- Store original documents
- Store extraction JSON
- Store structured records

---

# 7. Frontend Pages

## 1. Home Page
Purpose:
- Introduction
- Upload section

Components:
- Navbar
- Upload box
- Extract button

---

## 2. Dashboard Page
Purpose:
- List uploaded documents

Components:
- Document cards
- Extraction status
- Search/filter

---

## 3. Document Details Page
Purpose:
- Show extracted data

Components:
- Extracted text
- Table view
- JSON preview

---

# 8. AWS Infrastructure

## S3 Buckets

### Bucket Structure

```text
document-extractor-bucket/
│
├── uploads/
│
├── extracted-json/
│
└── processed/
```

### Purpose
| Folder | Purpose |
|---|---|
| uploads/ | Original files |
| extracted-json/ | Raw Textract JSON |
| processed/ | Final processed output |

---

# 9. Lambda Functions

## 1. GenerateUploadURL Lambda

### Purpose
Generate presigned upload URL.

### Trigger
API Gateway

---

## 2. ProcessDocument Lambda

### Purpose
- Trigger Textract
- Parse extraction results
- Store processed data

### Trigger
S3 upload event

---

## 3. FetchDocuments Lambda

### Purpose
Return dashboard data.

### Trigger
API Gateway

---

# 10. Textract Configuration

## API Used
AnalyzeDocument

## Features
- FORMS
- TABLES

## Supported Files
- PDF
- PNG
- JPG
- JPEG

---

# 11. DynamoDB Design

## Table Name
documents

## Schema

| Field | Type |
|---|---|
| document_id | String |
| filename | String |
| upload_time | String |
| status | String |
| extracted_fields | Map |
| table_data | List |
| raw_json_path | String |

---

# 12. API Endpoints

## Generate Upload URL
POST /upload-url

## Get Documents
GET /documents

## Get Single Document
GET /documents/{id}

---

# 13. Security

## IAM
- Least privilege access
- Separate Lambda roles

## S3
- Private upload bucket
- Presigned upload URLs

## API Gateway
- CORS enabled
- Rate limiting

---

# 14. Logging & Monitoring

## CloudWatch
Used for:
- Lambda logs
- Error tracking
- Request monitoring

---

# 15. Error Handling

| Error | Solution |
|---|---|
| Upload failed | Retry upload |
| Textract timeout | Async processing |
| Invalid file type | Validate frontend |
| IAM permission denied | Update policies |

---

# 16. Deployment Plan

## Phase 1
Frontend Development

## Phase 2
S3 Static Hosting

## Phase 3
API Gateway Setup

## Phase 4
Lambda Integration

## Phase 5
Textract Integration

## Phase 6
Dashboard & Testing

---

# 17. Future Enhancements

- Authentication
- Multi-user support
- AI document classification
- Export to Excel
- Search/filter system
- Analytics dashboard
- Multi-language OCR
- Notification system

---

# 18. Success Metrics

| Metric | Goal |
|---|---|
| Upload Success Rate | >95% |
| Extraction Accuracy | >90% |
| Processing Time | <30 sec |
| Frontend Load Time | <3 sec |

---

# 19. Risks

| Risk | Impact |
|---|---|
| Incorrect IAM policies | System failure |
| Large PDF processing | Timeout |
| Textract cost scaling | Increased billing |
| Public S3 misconfiguration | Security issue |

---

# 20. Final Deliverables

- React frontend
- S3 hosted web app
- Serverless AWS backend
- Textract extraction pipeline
- DynamoDB storage
- Dashboard UI
- CloudWatch monitoring
- Deployment documentation
