import os
import requests
from typing import List
from datetime import datetime, timedelta
from uuid import uuid4
from ..models import AppointmentSuggestion
from ..datastore.memory import get_instance as get_memory_datastore

GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY", "YOUR_API_KEY_HERE")
GOOGLE_MAPS_DISTANCE_URL = "https://maps.googleapis.com/maps/api/distancematrix/json"

datastore = get_memory_datastore()
# Replace patients, clinics, doctors with datastore.patients, etc.

class GoogleAppointmentSuggester:
    def get_suggestions(self, patient_id: str, specialty: str) -> List[AppointmentSuggestion]:
        relevant_doctors = [d for d in datastore.doctors.values() if d.specialty == specialty]
        suggestions = []
        patient = datastore.patients.get(patient_id)
        if not patient:
            from fastapi import HTTPException
            raise HTTPException(status_code=404, detail="Patient not found")
        patient_location = patient.location
        for doc in relevant_doctors:
            clinic = datastore.clinics[doc.clinic_id]
            clinic_location = clinic.location
            # Google Maps Distance Matrix API call
            params = {
                "origins": patient_location,
                "destinations": clinic_location,
                "key": GOOGLE_MAPS_API_KEY
            }
            try:
                resp = requests.get(GOOGLE_MAPS_DISTANCE_URL, params=params)
                data = resp.json()
                if data["status"] == "OK" and data["rows"] and data["rows"][0]["elements"][0]["status"] == "OK":
                    distance_m = data["rows"][0]["elements"][0]["distance"]["value"]
                    distance_km = distance_m / 1000.0
                else:
                    distance_km = 999.0  # fallback if API fails
            except Exception:
                distance_km = 999.0
            # For now, mock queue and slot, but you could use Google Calendar here
            queue = 2  # TODO: Replace with real queue/slot logic
            soonest = datetime.now() + timedelta(days=queue)
            appt_id = str(uuid4())
            message = f"You can see {doc.name} at {clinic.name} in {queue} days."
            if distance_km < 20 and queue < 3:
                message += " (Recommended: nearby and short wait!)"
            suggestions.append(AppointmentSuggestion(
                appointment_id=appt_id,
                clinic_name=clinic.name,
                doctor_name=doc.name,
                datetime=soonest,
                distance_km=distance_km,
                queue_length=queue,
                message=message
            ))
        suggestions.sort(key=lambda s: (s.queue_length, s.distance_km))
        return suggestions[:3] 