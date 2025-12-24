import React, { useState, useEffect } from "react";
import { FiCalendar, FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import API_BASE_URL from "../../config/api";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  type: "holiday" | "exam" | "event" | "meeting";
  description: string;
}

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/events`, { params: { status: true } });
        if (response.data) {
          const transformedEvents: Event[] = response.data.map((e: any) => ({
            id: e.id,
            title: e.title,
            date: e.date,
            time: e.time || "All Day",
            type: e.type || "event",
            description: e.description || "",
          }));
          setEvents(transformedEvents);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "holiday":
        return "bg-red-100 text-red-800";
      case "exam":
        return "bg-blue-100 text-blue-800";
      case "event":
        return "bg-green-100 text-green-800";
      case "meeting":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendar & Events</h1>
          <p className="text-gray-600">Manage school calendar and events</p>
        </div>
        <button className="px-4 py-2 bg-[#1ecab8] text-white rounded-lg hover:bg-[#1bb8a6] flex items-center gap-2">
          <FiPlus size={18} />
          Add Event
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1ecab8] mx-auto mb-4"></div>
          Loading events...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h2>
            <div className="space-y-4">
              {events.map((event) => (
              <div key={event.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#1ecab8] bg-opacity-10 flex items-center justify-center">
                      <FiCalendar className="text-[#1ecab8]" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-500">{event.date} at {event.time}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(event.type)}`}>
                    {event.type.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 ml-16">{event.description}</p>
                <div className="flex gap-2 mt-3 ml-16">
                  <button className="p-2 text-[#1ecab8] hover:bg-[#1ecab8] hover:bg-opacity-10 rounded-lg">
                    <FiEdit size={16} />
                  </button>
                  <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Upcoming Events</div>
                <div className="text-2xl font-bold text-blue-600">{events.length}</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">This Month</div>
                <div className="text-2xl font-bold text-green-600">5</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;



