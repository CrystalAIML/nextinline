import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Sparkles, Clock, MapPin, Star } from 'lucide-react';
import { Doctor } from '@/types/appointment';

interface AIAssistantProps {
  onFindEarlierSlot: () => void;
  onFindNearbySpecialists: (specialty: string) => void;
  nearbyDoctors: Doctor[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({
  onFindEarlierSlot,
  onFindNearbySpecialists,
  nearbyDoctors
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate AI analysis
    setIsAnalyzing(false);
    onFindEarlierSlot();
  };

  const suggestions = [
    {
      title: "Earlier Appointment Available",
      description: "I found 2 earlier slots for your cardiology appointment",
      action: "View",
      urgent: true
    },
    {
      title: "Closer Specialist Found",
      description: "Dr. Parker is 0.8 miles closer with similar ratings",
      action: "Compare",
      urgent: false
    },
    {
      title: "Forms Reminder",
      description: "Complete medical history form to save time at your visit",
      action: "Fill Forms",
      urgent: false
    }
  ];

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Bot className="h-6 w-6" />
            <CardTitle className="text-lg text-white">AI Health Assistant</CardTitle>
            <Sparkles className="h-5 w-5 animate-pulse-soft" />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <p className="text-blue-100 text-sm">
            I'm continuously monitoring your appointments to find better options and keep you informed.
          </p>
          
          <Button
            variant="secondary"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Optimize My Schedule
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-sky-800">Smart Suggestions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {suggestions.map((suggestion, index) => (
            suggestion.title === 'Earlier Appointment Available' ? (
              <div
                key={index}
                className={`p-3 rounded-lg border transition-all duration-200 hover:shadow-sm ${
                  suggestion.urgent ? 'bg-red-50 border-red-200' : 'bg-[#ccecee] border-[#ccecee]'
                } grid grid-rows-[auto_1fr_auto] grid-cols-1 relative`}
              >
                <div className="absolute top-2 right-2">
                  {suggestion.urgent && (
                    <Badge variant="destructive" className="text-xs text-rose-700 bg-transparent hover:bg-transparent">
                      Urgent
                    </Badge>
                  )}
                </div>
                <div className="mb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-sky-800">{suggestion.title}</h4>
                  </div>
                  <p className="text-xs text-gray-600">{suggestion.description}</p>
                </div>
                <div className="flex justify-end">
                  <Button size="sm" variant="outline" className="text-xs min-w-[100px] bg-white hover:bg-white">
                    {suggestion.action}
                  </Button>
                </div>
              </div>
            ) : (
              <div
                key={index}
                className={`p-3 rounded-lg border transition-all duration-200 hover:shadow-sm ${
                  suggestion.urgent ? 'bg-red-50 border-red-200' : 'bg-[#ccecee] border-[#ccecee]'
                } grid grid-rows-[auto_1fr_auto] grid-cols-1 relative`}
              >
                <div className="mb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-sky-800">{suggestion.title}</h4>
                  </div>
                  <p className="text-xs text-gray-600">{suggestion.description}</p>
                </div>
                <div className="flex justify-end">
                  <Button size="sm" variant="outline" className="text-xs min-w-[100px]">
                    {suggestion.action}
                  </Button>
                </div>
              </div>
            )
          ))}
        </CardContent>
      </Card>

      {/* Nearby Specialists */}
      {nearbyDoctors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-sky-800">Recommended Specialists Nearby</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {nearbyDoctors.slice(0, 2).map((doctor) => (
              <div key={doctor.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-medium text-sky-800">{doctor.name}</h4>
                    <p className="text-xs text-gray-600">{doctor.specialty}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span className="text-xs">{doctor.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gray-500" />
                      <span>{doctor.distance} mi</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-green-600" />
                      <span>{doctor.availableSlots.length} slots</span>
                    </div>
                  </div>
                  
                  <Button size="sm" variant="outline" className="text-xs">
                    Book
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIAssistant;
