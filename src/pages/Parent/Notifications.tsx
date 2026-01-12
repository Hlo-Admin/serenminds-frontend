import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiBell,
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiX,
  FiChevronRight,
} from "react-icons/fi";

interface Notification {
  id: number;
  icon: string;
  iconBg: string;
  title: string;
  message: string;
  time: string;
  type: "alert" | "achievement" | "info" | "report";
  childName?: string;
  read: boolean;
  link?: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      icon: "⚠️",
      iconBg: "#fef3c7",
      title: "Attention Needed",
      message: "Michael's mood has been in Yellow Zone for 3 days",
      time: "1 hour ago",
      type: "alert",
      childName: "Michael",
      read: false,
      link: "/parent/children/2/mood-tracking",
    },
    {
      id: 2,
      icon: "🎉",
      iconBg: "#dbeafe",
      title: "Great Progress!",
      message: "Emma completed a 15-day mood tracking streak",
      time: "3 hours ago",
      type: "achievement",
      childName: "Emma",
      read: false,
      link: "/parent/children/1/mood-tracking",
    },
    {
      id: 3,
      icon: "📊",
      iconBg: "#e0e7ff",
      title: "Weekly Report Available",
      message: "View your children's weekly mood summary",
      time: "1 day ago",
      type: "report",
      read: false,
      link: "/parent/reports",
    },
    {
      id: 4,
      icon: "ℹ️",
      iconBg: "#f0fdf4",
      title: "System Update",
      message: "New features added to the parent dashboard",
      time: "2 days ago",
      type: "info",
      read: true,
    },
    {
      id: 5,
      icon: "✅",
      iconBg: "#ecfdf5",
      title: "Profile Updated",
      message: "Your profile information has been updated successfully",
      time: "3 days ago",
      type: "info",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Notifications</h1>
            <p className="text-slate-600">
              Stay updated on your children's wellbeing and activities
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-[#1ecab8] text-white rounded-lg font-medium hover:bg-[#1bb8a6] transition-colors"
            >
              Mark All as Read
            </button>
          )}
        </div>
        {unreadCount > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
            You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center">
            <FiBell size={48} className="mx-auto text-slate-400 mb-4" />
            <p className="text-slate-600">No notifications yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-6 hover:bg-slate-50 transition-colors ${
                  !notif.read ? "bg-blue-50/50" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: notif.iconBg }}
                  >
                    {notif.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-900">{notif.title}</h3>
                          {!notif.read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{notif.message}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>{notif.time}</span>
                          {notif.childName && (
                            <>
                              <span>•</span>
                              <span>Child: {notif.childName}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {notif.link && (
                          <Link
                            to={notif.link}
                            onClick={() => markAsRead(notif.id)}
                            className="text-[#1ecab8] hover:text-[#1bb8a6] transition-colors"
                          >
                            <FiChevronRight size={20} />
                          </Link>
                        )}
                        <button
                          onClick={() => deleteNotification(notif.id)}
                          className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <FiX size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;

