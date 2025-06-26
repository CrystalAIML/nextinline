import React from 'react';
import { Notification } from '@/types/notification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Clock, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onAcceptEarlierSlot: (notificationId: string, appointmentId: string) => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  onMarkAsRead,
  onAcceptEarlierSlot
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'earlier_slot': return <Clock className="h-5 w-5 text-green-600" />;
      case 'reminder': return <Bell className="h-5 w-5 text-blue-600" />;
      case 'forms_required': return <FileText className="h-5 w-5 text-orange-600" />;
      case 'cancellation_confirmation': return <CheckCircle className="h-5 w-5 text-gray-600" />;
      default: return <AlertTriangle className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-4 h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">AI Notifications</h2>
        <Badge variant="secondary">
          {notifications.filter(n => !n.read).length} unread
        </Badge>
      </div>
      
      <div className="space-y-3 overflow-y-auto h-full">
        {notifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={`${notification.urgent ? 'notification-urgent border-red-200' : 'notification-info'} 
                       bg-white 
                       transition-all duration-300 hover:shadow-md`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getIcon(notification.type)}
                  <div>
                    <CardTitle className="text-sm font-medium">{notification.title}</CardTitle>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimestamp(notification.timestamp)}
                    </p>
                  </div>
                </div>
                {notification.urgent && (
                  <Badge variant="destructive" className="text-xs">
                    Urgent
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-sm text-sky-800 mb-3">{notification.message}</p>
              
              <div className="flex gap-2">
                {notification.type === 'earlier_slot' && notification.appointmentId && (
                  <Button
                    size="sm"
                    onClick={() => onAcceptEarlierSlot(notification.id, notification.appointmentId!)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Accept Earlier Slot
                  </Button>
                )}
                {!notification.read && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    Mark as Read
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {notifications.length === 0 && (
          <Card className="text-center py-8 h-full">
            <CardContent>
              <Bell className="h-12 w-12 text-sky-800 mx-auto mb-3" />
              <p className="text-sky-800">No notifications at the moment</p>
              <p className="text-sm text-sky-800 mt-1">We'll notify you of any updates</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
