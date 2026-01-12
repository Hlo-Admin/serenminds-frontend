import React, { useState } from "react";
import { FiCalendar, FiChevronLeft, FiChevronRight, FiClock, FiMapPin } from "react-icons/fi";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  type: "school" | "mood" | "reminder";
  childName?: string;
  description?: string;
  location?: string;
}

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Static data for demo
  const events: Event[] = [
    {
      id: 1,
      title: "Parent-Teacher Conference",
      date: "2024-01-20",
      time: "10:00 AM",
      type: "school",
      childName: "Emma",
      location: "Greenwood Middle School",
    },
    {
      id: 2,
      title: "Weekly Mood Report",
      date: "2024-01-22",
      time: "09:00 AM",
      type: "mood",
      description: "Weekly summary of children's mood tracking",
    },
    {
      id: 3,
      title: "School Assembly",
      date: "2024-01-25",
      time: "02:00 PM",
      type: "school",
      childName: "Michael",
      location: "Greenwood Middle School",
    },
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getEventsForDate = (day: number | null) => {
    if (day === null) return [];
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter((e) => e.date === dateStr);
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const days = getDaysInMonth(currentDate);

  const getEventTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      school: "#1ecab8",
      mood: "#8b5cf6",
      reminder: "#f59e0b",
    };
    return colors[type] || "#6b7280";
  };

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Calendar</h1>
        <p className="text-slate-600">View upcoming events and activities</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-200/80">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <FiChevronLeft size={20} />
            </button>
            <h2 className="text-xl font-semibold text-slate-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <FiChevronRight size={20} />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-slate-600 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              const dayEvents = getEventsForDate(day);
              return (
                <div
                  key={index}
                  className={`min-h-[80px] p-2 border border-slate-200 rounded-lg ${
                    day === null ? "bg-slate-50" : "bg-white hover:bg-slate-50"
                  }`}
                >
                  {day !== null && (
                    <>
                      <div className="text-sm font-medium text-slate-900 mb-1">{day}</div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className="text-xs px-1 py-0.5 rounded text-white truncate"
                            style={{ background: getEventTypeColor(event.type) }}
                            title={event.title}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-slate-500">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Upcoming Events</h3>
          <div className="space-y-4">
            {events
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 5)
              .map((event) => (
                <div
                  key={event.id}
                  className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-2 h-2 rounded-full mt-2"
                      style={{ background: getEventTypeColor(event.type) }}
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 mb-1">{event.title}</h4>
                      {event.childName && (
                        <p className="text-xs text-slate-600 mb-2">Child: {event.childName}</p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <FiCalendar size={12} />
                          {new Date(event.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiClock size={12} />
                          {event.time}
                        </span>
                      </div>
                      {event.location && (
                        <p className="text-xs text-slate-600 mt-2 flex items-center gap-1">
                          <FiMapPin size={12} />
                          {event.location}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;

