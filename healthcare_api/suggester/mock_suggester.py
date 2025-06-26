from typing import List
from datetime import datetime, timedelta
from uuid import uuid4
from ..models import AppointmentSuggestion
from ..datastore.memory import get_instance as get_memory_datastore

datastore = get_memory_datastore()

class MockAppointmentSuggester:
    def get_suggestions(self, patient_id: str, specialty: str) -> List[AppointmentSuggestion]:
        relevant_doctors = [d for d in datastore.doctors.values() if d.specialty == specialty]
        suggestions = []
        patient = datastore.patients.get(patient_id)
        if not patient:
            from fastapi import HTTPException
            raise HTTPException(status_code=404, detail="Patient not found")
        for doc in relevant_doctors:
            clinic = datastore.clinics[doc.clinic_id]
            import random
            distance = random.uniform(2, 50)  # km
            queue = random.randint(0, 10)
            soonest = datetime.now() + timedelta(days=queue)
            appt_id = str(uuid4())
            message = f"You can see {doc.name} at {clinic.name} in {queue} days."
            if distance < 20 and queue < 3:
                message += " (Recommended: nearby and short wait!)"
            suggestions.append(AppointmentSuggestion(
                appointment_id=appt_id,
                clinic_name=clinic.name,
                doctor_name=doc.name,
                datetime=soonest,
                distance_km=distance,
                queue_length=queue,
                message=message
            ))
        suggestions.sort(key=lambda s: (s.queue_length, s.distance_km))
        return suggestions[:3] 