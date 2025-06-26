import React from 'react';
import { Appointment } from '@/types/appointment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarCheck, MapPin, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AppointmentCardProps {
  appointment: Appointment;
  onCancel: (id: string) => void;
  onReschedule: (id: string) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ 
  appointment, 
  onCancel, 
  onReschedule 
}) => {
  const { toast } = useToast();

  const handleCancel = () => {
    onCancel(appointment.id);
    toast({
      title: "Appointment Cancelled",
      description: `Your appointment with ${appointment.doctorName} has been cancelled.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'consultation': return 'bg-purple-100 text-purple-800';
      case 'checkup': return 'bg-green-100 text-green-800';
      case 'procedure': return 'bg-orange-100 text-orange-800';
      case 'follow-up': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold text-sky-800">
              {appointment.doctorName}
            </CardTitle>
            <p className="text-sm text-sky-800 mt-1">{appointment.specialty}</p>
          </div>
          <div className="flex gap-2">
            <Badge className={getStatusColor(appointment.status)}>
              {appointment.status}
            </Badge>
            <Badge className={getTypeColor(appointment.type)}>
              {appointment.type}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 text-sm text-sky-800">
          <CalendarCheck className="h-4 w-4 text-blue-600" />
          <span className="font-medium text-sky-800">{appointment.date} at {appointment.time}</span>
          <span className="text-gray-500">({appointment.estimatedDuration} min)</span>
        </div>
        
        <div className="flex items-start gap-3 text-sm text-sky-800">
          <MapPin className="h-4 w-4 text-blue-600 mt-0.5" />
          <div>
            <p className="font-medium text-sky-800">{appointment.location.name}</p>
            <p className="text-gray-600">{appointment.location.address}</p>
          </div>
        </div>

        {appointment.formsRequired && appointment.formsRequired.length > 0 && (
          <div className="bg-[#ccecee] border border-[#ccecee] rounded-lg p-3">
            <p className="text-sm font-medium text-sky-800 mb-1">Forms Required:</p>
            <ul className="text-xs text-sky-800 space-y-1">
              {appointment.formsRequired.map((form, index) => (
                <li key={index}>• {form}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-center pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onReschedule(appointment.id)}
            className="reschedule-btn w-full"
          >
            Reschedule
          </Button>
        </div>
        <div className="flex gap-2 pt-2">
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleCancel}
            className="flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
