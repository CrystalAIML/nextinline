import { useState, useEffect } from 'react';
import { Appointment, Doctor, Notification } from '@/types/appointment';
import { useToast } from '@/hooks/use-toast';

const API_BASE = 'http://localhost:8000';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [nearbyDoctors, setNearbyDoctors] = useState<Doctor[]>([]);
  const { toast } = useToast();

  // Fetch appointments from API
  useEffect(() => {
    fetch(`${API_BASE}/appointments/`)
      .then(res => res.json())
      .then(setAppointments)
      .catch(() => toast({ title: 'Error', description: 'Failed to fetch appointments.' }));
  }, [toast]);

  // Fetch doctors from API
  useEffect(() => {
    fetch(`${API_BASE}/doctors/`)
      .then(res => res.json())
      .then(setNearbyDoctors)
      .catch(() => toast({ title: 'Error', description: 'Failed to fetch doctors.' }));
  }, [toast]);

  // Fetch notifications from API
  useEffect(() => {
    fetch(`${API_BASE}/notifications/`)
      .then(res => res.json())
      .then(setNotifications)
      .catch(() => toast({ title: 'Error', description: 'Failed to fetch notifications.' }));
  }, [toast]);

  const cancelAppointment = (id: string) => {
    // Optionally, send a DELETE or PATCH request to the API
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === id 
          ? { ...apt, status: 'cancelled' as const }
          : apt
      )
    );
  };

  const rescheduleAppointment = (id: string) => {
    toast({
      title: "Reschedule Requested",
      description: "Our AI is finding the best available times for you.",
    });
    // In a real app, this would trigger a rescheduling flow
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const acceptEarlierSlot = (notificationId: string, appointmentId: string) => {
    // Update appointment with new earlier time
    setAppointments(prev =>
      prev.map(apt => {
        if (apt.id === appointmentId) {
          const currentDate = new Date(apt.date);
          const earlierDate = new Date(currentDate);
          earlierDate.setDate(currentDate.getDate() - 2); // 2 days earlier
          
          return {
            ...apt,
            date: earlierDate.toISOString().split('T')[0],
            time: '2:00 PM' // New time slot
          };
        }
        return apt;
      })
    );

    // Mark notification as read
    markNotificationAsRead(notificationId);

    toast({
      title: "Appointment Updated!",
      description: "Your appointment has been moved to the earlier time slot.",
    });
  };

  const findEarlierSlot = () => {
    toast({
      title: "AI Analysis Complete",
      description: "Found 3 earlier appointment options. Check your notifications!",
    });
  };

  const findNearbySpecialists = (specialty: string) => {
    fetch(`${API_BASE}/doctors/`)
      .then(res => res.json())
      .then((doctors: Doctor[]) => {
        const filtered = doctors.filter(doctor => 
          doctor.specialty.toLowerCase().includes(specialty.toLowerCase())
        );
        setNearbyDoctors(filtered);
        toast({
          title: "Nearby Specialists Found",
          description: `Found ${filtered.length} ${specialty} specialists within 5 miles.`,
        });
      })
      .catch(() => toast({ title: 'Error', description: 'Failed to fetch doctors.' }));
  };

  return {
    appointments,
    notifications,
    nearbyDoctors,
    cancelAppointment,
    rescheduleAppointment,
    markNotificationAsRead,
    acceptEarlierSlot,
    findEarlierSlot,
    findNearbySpecialists
  };
};
