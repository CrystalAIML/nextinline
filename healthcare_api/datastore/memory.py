from ..models import Appointment, Doctor, Notification
from typing import List

class MemoryDatastore:
    def __init__(self):
        self.patients: List[str] = []  # Just store patient names for now
        self.doctors: List[Doctor] = []
        self.appointments: List[Appointment] = []
        self.notifications: List[Notification] = []

    # Patients (for demo, just names)
    def add_patient(self, name: str):
        self.patients.append(name)
        return name

    def list_patients(self):
        return self.patients

    # Doctors
    def add_doctor(self, doctor: Doctor):
        self.doctors.append(doctor)
        return doctor

    def list_doctors(self):
        return self.doctors

    # Appointments
    def add_appointment(self, appt: Appointment):
        self.appointments.append(appt)
        return appt

    def list_appointments(self):
        return self.appointments

    # Notifications
    def add_notification(self, notif: Notification):
        self.notifications.append(notif)
        return notif

    def list_notifications(self):
        return self.notifications

def get_instance():
    # Singleton pattern for the in-memory datastore
    if not hasattr(get_instance, "_instance"):
        get_instance._instance = MemoryDatastore()
    return get_instance._instance 