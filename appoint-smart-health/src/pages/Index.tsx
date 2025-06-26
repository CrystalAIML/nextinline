import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CalendarCheck, Bell, MapPin, Bot, Menu } from 'lucide-react';
import AppointmentCard from '@/components/AppointmentCard';
import NotificationPanel from '@/components/NotificationPanel';
import AppointmentMap from '@/components/AppointmentMap';
import AIAssistant from '@/components/AIAssistant';
import { useAppointments } from '@/hooks/useAppointments';

const Index = () => {
  const {
    appointments,
    notifications,
    nearbyDoctors,
    cancelAppointment,
    rescheduleAppointment,
    markNotificationAsRead,
    acceptEarlierSlot,
    findEarlierSlot,
    findNearbySpecialists
  } = useAppointments();

  const [activeTab, setActiveTab] = useState('appointments');
  const upcomingAppointments = appointments.filter(apt => apt.status === 'upcoming');
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const navigationItems = [
    { id: 'appointments', label: 'Appointments', icon: CalendarCheck },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifications },
    { id: 'map', label: 'Locations', icon: MapPin },
    { id: 'ai', label: 'AI Assistant', icon: Bot }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Header */}
      <div className="nav-enhanced">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <div className="health-gradient p-3 rounded-xl shadow-lg">
                <CalendarCheck className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">NextInLine</h1>
                <p className="text-sm text-white font-medium">Smart appointment management</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-health-pastel-green text-gray-800 border-health-success font-semibold px-3 py-1">
                {upcomingAppointments.length} upcoming
              </Badge>
              {unreadNotifications > 0 && (
                <Badge className="bg-health-danger text-white animate-pulse-soft font-semibold px-3 py-1">
                  {unreadNotifications} alerts
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4 bg-white/80 backdrop-blur-sm border-2 border-health-tertiary shadow-lg text-sky-800 h-20">
            <TabsTrigger 
              value="appointments" 
              className="flex items-center gap-2 data-[state=active]:bg-health-tertiary data-[state=active]:text-gray-900 font-medium h-full"
            >
              <CalendarCheck className="h-4 w-4" />
              Appointments
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="flex items-center gap-2 data-[state=active]:bg-health-tertiary data-[state=active]:text-gray-900 font-medium h-full"
            >
              <Bell className="h-4 w-4" />
              Notifications
              {unreadNotifications > 0 && (
                <Badge className="ml-1 bg-health-danger text-white text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
                  {unreadNotifications}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="map" 
              className="flex items-center gap-2 data-[state=active]:bg-health-tertiary data-[state=active]:text-gray-900 font-medium h-full"
            >
              <MapPin className="h-4 w-4" />
              Locations
            </TabsTrigger>
            <TabsTrigger 
              value="ai" 
              className="flex items-center gap-2 data-[state=active]:bg-health-tertiary data-[state=active]:text-gray-900 font-medium h-full"
            >
              <Bot className="h-4 w-4" />
              AI Assistant
            </TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <TabsContent value="appointments" className="mt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-sky-800">Your Appointments</h2>
                    <Badge variant="outline" className="bg-white/80 border-health-secondary">
                      {appointments.length} total
                    </Badge>
                  </div>
                  
                  {upcomingAppointments.length > 0 ? (
                    <div className="grid gap-4">
                      {upcomingAppointments.map((appointment) => (
                        <AppointmentCard
                          key={appointment.id}
                          appointment={appointment}
                          onCancel={cancelAppointment}
                          onReschedule={rescheduleAppointment}
                        />
                      ))}
                    </div>
                  ) : (
                    <Card className="text-center py-12 bg-white/80 backdrop-blur-sm border-health-tertiary">
                      <CardContent>
                        <CalendarCheck className="h-12 w-12 text-health-secondary mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-sky-800 mb-2">No upcoming appointments</h3>
                        <p className="text-sky-800">Schedule your next appointment to get started</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="notifications" className="mt-0 h-full">
                <NotificationPanel
                  notifications={notifications}
                  onMarkAsRead={markNotificationAsRead}
                  onAcceptEarlierSlot={acceptEarlierSlot}
                />
              </TabsContent>

              <TabsContent value="map" className="mt-0">
                <AppointmentMap appointments={upcomingAppointments} />
              </TabsContent>

              <TabsContent value="ai" className="mt-0">
                <AIAssistant
                  onFindEarlierSlot={findEarlierSlot}
                  onFindNearbySpecialists={findNearbySpecialists}
                  nearbyDoctors={nearbyDoctors}
                />
              </TabsContent>
            </div>

            {/* Sidebar - AI Assistant (always visible) */}
            <div className="lg:col-span-1">
              {activeTab !== 'ai' && (
                <div className="sticky top-8">
                  <AIAssistant
                    onFindEarlierSlot={findEarlierSlot}
                    onFindNearbySpecialists={findNearbySpecialists}
                    nearbyDoctors={nearbyDoctors}
                  />
                </div>
              )}
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
