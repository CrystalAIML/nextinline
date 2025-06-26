import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Clock } from 'lucide-react';
import { Appointment } from '@/types/appointment';

interface AppointmentMapProps {
  appointments: Appointment[];
}

const AppointmentMap: React.FC<AppointmentMapProps> = ({ appointments }) => {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Mock distance calculation - in a real app, this would use a mapping service
  const calculateDistance = (appointment: Appointment) => {
    return Math.round(Math.random() * 10 + 1); // Random distance between 1-11 miles
  };

  const calculateTravelTime = (distance: number) => {
    return Math.round(distance * 3 + Math.random() * 10); // Rough estimate: 3 min per mile + traffic
  };

  const handleGetDirections = (appointment: Appointment) => {
    const address = encodeURIComponent(appointment.location.address);
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${address}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-sky-800">Appointment Locations</h2>
      
      {/* Map Placeholder - In a real app, this would be an actual map */}
      <Card className="h-64 bg-gradient-to-br from-blue-50 to-green-50">
        <CardContent className="h-full flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">Interactive Map View</p>
            <p className="text-sm text-gray-500 mt-1">
              {appointments.length} appointments plotted
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Appointment Location List */}
      <div className="space-y-3">
        {appointments.map((appointment) => {
          const distance = calculateDistance(appointment);
          const travelTime = calculateTravelTime(distance);
          
          return (
            <Card 
              key={appointment.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedAppointment?.id === appointment.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedAppointment(appointment)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base text-sky-800">{appointment.location.name}</CardTitle>
                    <p className="text-sm text-sky-800">{appointment.doctorName}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {appointment.date}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2 text-sky-800">
                  <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                  <p className="text-sm text-sky-800">{appointment.location.address}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Navigation className="h-4 w-4 text-blue-600" />
                      <span>{distance} miles</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-green-600" />
                      <span>{travelTime} min drive</span>
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGetDirections(appointment);
                    }}
                  >
                    Directions
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AppointmentMap;
