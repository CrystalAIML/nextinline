from dotenv import load_dotenv
load_dotenv()
from .firestore import get_instance
from ..models import Appointment, Doctor, Notification, Location, Coordinates
import random
from datetime import datetime, timedelta
from faker import Faker

fake = Faker()

def clear_collection(collection):
    docs = list(collection.stream())
    for doc in docs:
        doc.reference.delete()

def populate_with_dummy_data():
    ds = get_instance()
    # Clear collections first
    clear_collection(ds.client.collection('doctors'))
    clear_collection(ds.client.collection('appointments'))
    clear_collection(ds.client.collection('notifications'))
    # Dummy doctors
    specialties = ["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Dermatology", "Oncology"]
    for i in range(10):
        doctor_id = f"doctor_{i}"
        doc = Doctor(
            id=doctor_id,
            name=fake.name(),
            specialty=random.choice(specialties),
            rating=round(random.uniform(3.0, 5.0), 1),
            location=Location(
                name=fake.company(),
                address=fake.address().replace("\n", ", "),
                coordinates=Coordinates(lat=float(fake.latitude()), lng=float(fake.longitude()))
            ),
            availableSlots=[fake.date_time_between(start_date="now", end_date="+30d").isoformat() for _ in range(3)],
            distance=None
        )
        ds.doctors[doctor_id] = doc
    # Dummy appointments
    for i in range(10):
        appt_id = f"appt_{i}"
        appt_date = fake.date_between(start_date="today", end_date="+30d")
        appt_time = fake.time(pattern="%H:%M")
        appt = Appointment(
            id=appt_id,
            patientName=fake.name(),
            doctorName=random.choice([d.name for d in ds.doctors.values()]),
            specialty=random.choice(specialties),
            date=str(appt_date),
            time=appt_time,
            location=Location(
                name=fake.company(),
                address=fake.address().replace("\n", ", "),
                coordinates=Coordinates(lat=float(fake.latitude()), lng=float(fake.longitude()))
            ),
            status=random.choice(["upcoming", "completed", "cancelled"]),
            type=random.choice(["consultation", "checkup", "procedure", "follow-up"]),
            estimatedDuration=random.choice([30, 45, 60]),
            formsRequired=[fake.word() for _ in range(random.randint(0, 3))] or None,
            notes=fake.sentence() if random.choice([True, False]) else None
        )
        ds.appointments[appt_id] = appt
    # Dummy notifications
    notif_types = ["earlier_slot", "reminder", "forms_required", "cancellation_confirmation"]
    for i in range(5):
        notif_id = f"notif_{i}"
        notif = Notification(
            id=notif_id,
            type=random.choice(notif_types),
            title=fake.sentence(nb_words=6),
            message=fake.paragraph(),
            timestamp=fake.date_time_between(start_date="-10d", end_date="now").isoformat(),
            urgent=bool(random.getrandbits(1)),
            appointmentId=f"appt_{random.randint(0,9)}" if random.choice([True, False]) else None,
            read=bool(random.getrandbits(1))
        )
        ds.notifications[notif_id] = notif

if __name__ == "__main__":
    print("Populating Firestore with realistic dummy data using Faker...")
    populate_with_dummy_data()
    print("Done.") 