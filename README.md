# Healthcare API

## Why It Was Built

Modern healthcare systems often struggle with fragmented appointment management, leading to inefficiencies, long wait times, and suboptimal patient experiences. This project was built to address these challenges by providing a centralized, intelligent backend API for managing and optimizing appointment slots across multiple clinics and hospitals.

By leveraging AI-driven suggestions, real-time data from Google Maps, and scalable cloud storage with Firestore, the system enables:
- **Dynamic allocation of appointments** based on urgency, location, and real-time availability.
- **Reduced patient wait times** by suggesting earlier slots at nearby clinics.
- **Improved resource utilization** for healthcare providers.
- **Seamless integration** with modern frontend applications and third-party services.

The goal is to empower healthcare organizations to deliver faster, smarter, and more patient-centric care through technology.

## Project Structure

This repository contains both the backend API and a modern React frontend:

### 1. Backend API (`healthcare_api`)
- See details below (Features, Endpoints, Setup, etc.)

### 2. React Frontend (`appoint-smart-health`)
A user-friendly web application for patients and staff to interact with the healthcare system.

**Key Features:**
- **Appointment Booking:** Patients can view, book, and manage appointments across multiple clinics.
- **AI-Powered Suggestions:** Users receive real-time suggestions for earlier or more convenient slots.
- **Doctor & Clinic Search:** Search and filter doctors by specialty, rating, and location.
- **Notifications:** View reminders, forms required, and cancellation confirmations.
- **Integrated Maps:** See clinic locations and distances using Google Maps.
- **Chat Assistant:** Interact with an AI assistant for help and guidance.
- **Responsive Design:** Works on desktop and mobile devices.

**Frontend Setup:**
```sh
cd appoint-smart-health
npm install  # or bun install, or yarn install
npm run dev  # or bun dev, or yarn dev
```
The frontend runs on `http://localhost:8080` and communicates with the backend API (CORS is enabled).

---

## Features (Backend API)
- **Centralized Appointment Management**: Manage appointments, doctors, notifications, and more across multiple clinics/hospitals.
- **AI-Powered Suggestions**: Use a mock or real (Google Maps-powered) suggester to recommend optimal appointment slots based on urgency, location, and availability.
- **Google Maps Integration**: Calculate real distances between patients and clinics for smarter suggestions.
- **Google Firestore Support**: Store and retrieve data from Google Firestore, or use an in-memory datastore for development/testing.
- **Notifications**: Manage and deliver notifications for reminders, earlier slots, forms, and cancellations.
- **RESTful API with Swagger UI**: Interactive API documentation and testing at `/docs`.
- **CORS Enabled**: Ready for frontend integration (e.g., with a React or Vue app on `localhost:8080`).

## Endpoints
- `/appointments/` — Manage appointments
- `/doctors/` — Manage doctors
- `/notifications/` — Manage notifications
- `/patients/` — Manage patients (basic demo)
- `/appointments/suggestions/` — Get AI-powered appointment suggestions
- `/chat/` — Chat endpoint for assistant interaction

## Setup

### 1. Clone the Repository
```sh
git clone https://github.com/CrystalAIML/nextinline.git
cd nextinline/healthcare_api
```

### 2. Install Dependencies
```sh
python3 -m pip install -r requirements.txt
```

### 3. Environment Variables
Create a `.env` file in the `healthcare_api` directory:
```
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/your/service-account.json
SUGGESTER_TYPE=google  # or 'mock' for demo
DATASTORE_TYPE=firestore  # or 'memory' for demo
```

### 4. Populate Firestore with Dummy Data (optional)
```sh
python3 -m healthcare_api.datastore.populate_firestore
```

### 5. Run the API
```sh
python3 -m uvicorn healthcare_api.main:app --reload
```

Visit [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) for Swagger UI.

## Notes
- The API supports both in-memory and Firestore datastores.
- The suggester can be switched between a mock (random) and a real (Google Maps-powered) version via environment variables.
- All sensitive data (e.g., `.env`, credentials) is excluded from version control via `.gitignore`.

## License
MIT