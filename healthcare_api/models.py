from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime
from uuid import uuid4

class Coordinates(BaseModel):
    lat: float
    lng: float

class Location(BaseModel):
    name: str
    address: str
    coordinates: Coordinates

class Patient(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    name: str
    location: str  # e.g., address or city
    urgency: int  # 1 (low) to 5 (high)

class Clinic(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    name: str
    location: str

class Doctor(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    name: str
    specialty: str
    rating: float
    location: Location
    availableSlots: List[str]
    distance: Optional[float] = None  # miles

class Appointment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    patientName: str
    doctorName: str
    specialty: str
    date: str  # ISO date string
    time: str  # e.g. '14:00'
    location: Location
    status: Literal['upcoming', 'completed', 'cancelled']
    type: Literal['consultation', 'checkup', 'procedure', 'follow-up']
    estimatedDuration: int  # minutes
    formsRequired: Optional[List[str]] = None
    notes: Optional[str] = None

class AppointmentSuggestion(BaseModel):
    appointment_id: str
    clinic_name: str
    doctor_name: str
    datetime: datetime
    distance_km: float
    queue_length: int
    message: str

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

class Notification(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    type: Literal['earlier_slot', 'reminder', 'forms_required', 'cancellation_confirmation']
    title: str
    message: str
    timestamp: str  # ISO date
    urgent: bool
    appointmentId: Optional[str] = None
    read: bool 