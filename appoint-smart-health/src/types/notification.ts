
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
