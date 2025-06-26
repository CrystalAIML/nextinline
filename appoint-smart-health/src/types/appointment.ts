
export interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  location: {
    name: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  status: 'upcoming' | 'completed' | 'cancelled';
  type: 'consultation' | 'checkup' | 'procedure' | 'follow-up';
  notes?: string;
  formsRequired?: string[];
  estimatedDuration: number; // in minutes
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  location: {
    name: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  availableSlots: string[];
  distance?: number; // in miles
}

export interface Notification {
  id: string;
  type: 'earlier_slot' | 'reminder' | 'forms_required' | 'cancellation_confirmation';
  title: string;
  message: string;
  timestamp: string;
  urgent: boolean;
  appointmentId?: string;
  read: boolean;
}
