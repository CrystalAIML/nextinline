import { Appointment, Doctor, Notification } from '@/types/appointment';

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientName: 'John Doe',
    doctorName: 'Dr. Sarah Wilson',
    specialty: 'Cardiology',
    date: '2024-01-15',
    time: '10:00 AM',
    location: {
      name: 'Heart Care Center',
      address: '123 Medical Plaza, Downtown',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    status: 'upcoming',
    type: 'consultation',
    formsRequired: ['Medical History Form', 'Insurance Verification'],
    estimatedDuration: 60
  },
  {
    id: '2',
    patientName: 'John Doe',
    doctorName: 'Dr. Michael Chen',
    specialty: 'Dermatology',
    date: '2024-01-20',
    time: '2:30 PM',
    location: {
      name: 'Skin Health Clinic',
      address: '456 Health Avenue, Midtown',
      coordinates: { lat: 40.7505, lng: -73.9934 }
    },
    status: 'upcoming',
    type: 'checkup',
    estimatedDuration: 30
  },
  {
    id: '3',
    patientName: 'John Doe',
    doctorName: 'Dr. Emily Rodriguez',
    specialty: 'Orthopedics',
    date: '2024-01-25',
    time: '11:15 AM',
    location: {
      name: 'Bone & Joint Institute',
      address: '789 Wellness Street, Uptown',
      coordinates: { lat: 40.7831, lng: -73.9712 }
    },
    status: 'upcoming',
    type: 'follow-up',
    estimatedDuration: 45
  }
];

export const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. James Parker',
    specialty: 'Cardiology',
    rating: 4.8,
    location: {
      name: 'Advanced Heart Center',
      address: '321 Cardiac Lane, Downtown',
      coordinates: { lat: 40.7180, lng: -74.0100 }
    },
    availableSlots: ['9:00 AM', '11:30 AM', '3:00 PM'],
    distance: 1.2
  },
  {
    id: '2',
    name: 'Dr. Lisa Thompson',
    specialty: 'Dermatology',
    rating: 4.9,
    location: {
      name: 'Clear Skin Dermatology',
      address: '654 Beauty Boulevard, Midtown',
      coordinates: { lat: 40.7580, lng: -73.9855 }
    },
    availableSlots: ['10:00 AM', '1:00 PM', '4:30 PM'],
    distance: 0.8
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'earlier_slot',
    title: 'Earlier Appointment Available!',
    message: 'Dr. Sarah Wilson has an opening tomorrow at 2:00 PM - 3 days earlier than your current appointment.',
    timestamp: '2024-01-10T09:00:00Z',
    urgent: true,
    appointmentId: '1',
    read: false
  },
  {
    id: '2',
    type: 'forms_required',
    title: 'Forms Required',
    message: 'Please complete your Medical History Form before your appointment with Dr. Sarah Wilson on Jan 15.',
    timestamp: '2024-01-12T14:30:00Z',
    urgent: false,
    appointmentId: '1',
    read: false
  },
  {
    id: '3',
    type: 'reminder',
    title: 'Appointment Reminder',
    message: 'Your appointment with Dr. Michael Chen is tomorrow at 2:30 PM. Location: Skin Health Clinic.',
    timestamp: '2024-01-19T18:00:00Z',
    urgent: false,
    appointmentId: '2',
    read: true
  },
  {
    id: '4',
    type: 'reminder',
    title: 'Lab Results Ready',
    message: 'Your blood test results are now available. Please check your patient portal.',
    timestamp: '2024-01-21T10:00:00Z',
    urgent: false,
    read: false
  },
  {
    id: '5',
    type: 'cancellation_confirmation',
    title: 'Appointment Cancelled',
    message: 'Your appointment with Dr. Emily Rodriguez on Jan 25 has been cancelled as per your request.',
    timestamp: '2024-01-22T15:45:00Z',
    urgent: false,
    appointmentId: '3',
    read: false
  },
  {
    id: '6',
    type: 'earlier_slot',
    title: 'New Earlier Slot Found!',
    message: 'Dr. Lisa Thompson has a slot available on Jan 13 at 10:00 AM.',
    timestamp: '2024-01-11T08:00:00Z',
    urgent: true,
    appointmentId: '2',
    read: false
  },
  {
    id: '7',
    type: 'forms_required',
    title: 'Insurance Update Needed',
    message: 'Please update your insurance information before your next appointment.',
    timestamp: '2024-01-18T12:00:00Z',
    urgent: false,
    read: false
  }
];
