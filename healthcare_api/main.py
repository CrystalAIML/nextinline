from dotenv import load_dotenv
load_dotenv()
import os
print("DEBUG: DATASTORE_TYPE from env:", os.getenv("DATASTORE_TYPE"))
# FastAPI provides Swagger UI at /docs
from fastapi import FastAPI, HTTPException, Depends
from typing import List
from datetime import datetime, timedelta
from uuid import uuid4
from .models import Patient, Clinic, Doctor, Appointment, AppointmentSuggestion, ChatRequest, ChatResponse, Notification
from .suggester.mock_suggester import MockAppointmentSuggester
from .suggester.google_suggester import GoogleAppointmentSuggester
from . import settings
from .datastore.memory import get_instance as get_memory_datastore
from .datastore.firestore import get_instance as get_firestore_datastore
import logging
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware for http://localhost:8080
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"] ,
    allow_headers=["*"]
)

def get_datastore():
    if settings.DATASTORE_TYPE == "firestore":
        print("Using Firestore Datastore")
        return get_firestore_datastore()
    print("Using Memory Datastore")
    return get_memory_datastore()

datastore = get_datastore()

def get_appointment_suggester():
    if settings.SUGGESTER_TYPE == "google":
        print("Using GoogleAppointmentSuggester")
        return GoogleAppointmentSuggester()
    print("Using MockAppointmentSuggester")
    return MockAppointmentSuggester()

print("DEBUG: SUGGESTER_TYPE from env:", settings.SUGGESTER_TYPE)

# --- CRUD Endpoints ---
@app.get("/patients/", response_model=List[Patient])
def list_patients():
    return list(datastore.patients.values())

@app.get("/patients/{patient_id}", response_model=Patient)
def get_patient(patient_id: str):
    patient = datastore.patients.get(patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

@app.get("/clinics/", response_model=List[Clinic])
def list_clinics():
    return list(datastore.clinics.values())

@app.get("/clinics/{clinic_id}", response_model=Clinic)
def get_clinic(clinic_id: str):
    clinic = datastore.clinics.get(clinic_id)
    if not clinic:
        raise HTTPException(status_code=404, detail="Clinic not found")
    return clinic

@app.get("/doctors/", response_model=List[Doctor])
def list_doctors():
    doctors_list = list(datastore.doctors.values())
    logging.info(f"Doctors from datastore: {doctors_list}")
    print(f"Doctors from datastore: {doctors_list}")  # Also print to stdout for server feed
    return doctors_list

@app.get("/doctors/{doctor_id}", response_model=Doctor)
def get_doctor(doctor_id: str):
    doctor = datastore.doctors.get(doctor_id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doctor

@app.get("/appointments/", response_model=List[Appointment])
def list_appointments():
    return list(datastore.appointments.values())

@app.get("/appointments/{appointment_id}", response_model=Appointment)
def get_appointment(appointment_id: str):
    appt = datastore.appointments.get(appointment_id)
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appt

@app.get("/notifications/", response_model=List[Notification])
def list_notifications():
    return list(datastore.notifications.values())

# --- Endpoints ---
@app.post("/patients/", response_model=Patient)
def register_patient(patient: Patient):
    datastore.patients[patient.id] = patient
    return patient

@app.post("/clinics/", response_model=Clinic)
def register_clinic(clinic: Clinic):
    datastore.clinics[clinic.id] = clinic
    return clinic

@app.post("/doctors/", response_model=Doctor)
def register_doctor(doctor: Doctor):
    if doctor.clinic_id not in datastore.clinics:
        raise HTTPException(status_code=404, detail="Clinic not found")
    datastore.doctors[doctor.id] = doctor
    return doctor

@app.post("/appointments/", response_model=Appointment)
def book_appointment(appt: Appointment):
    if appt.patient_id not in datastore.patients:
        raise HTTPException(status_code=404, detail="Patient not found")
    if appt.doctor_id not in datastore.doctors:
        raise HTTPException(status_code=404, detail="Doctor not found")
    if appt.clinic_id not in datastore.clinics:
        raise HTTPException(status_code=404, detail="Clinic not found")
    datastore.appointments[appt.id] = appt
    return appt

@app.get("/appointments/suggestions/", response_model=List[AppointmentSuggestion])
def get_appointment_suggestions(patient_id: str, specialty: str, suggester=Depends(get_appointment_suggester)):
    return suggester.get_suggestions(patient_id, specialty)

@app.post("/appointments/confirm/", response_model=Appointment)
def confirm_appointment(appointment_id: str, patient_id: str):
    for appt in datastore.appointments.values():
        if appt.id == appointment_id and appt.patient_id == patient_id:
            appt.status = "confirmed"
            return appt
    appt = Appointment(
        id=appointment_id,
        patient_id=patient_id,
        doctor_id=list(datastore.doctors.keys())[0],
        clinic_id=list(datastore.clinics.keys())[0],
        datetime=datetime.now() + timedelta(days=1),
        status="confirmed"
    )
    datastore.appointments[appt.id] = appt
    return appt

@app.post("/chat/", response_model=ChatResponse)
def chat_with_assistant(request: ChatRequest):
    user_message = request.message
    response = f"Assistant: You said '{user_message}'. How can I help you with your appointments today?"
    return ChatResponse(response=response)

@app.post("/notifications/", response_model=Notification)
def create_notification(notification: Notification):
    datastore.notifications[notification.id] = notification
    return notification 