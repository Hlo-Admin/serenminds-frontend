import React, { useState, useEffect } from "react";
import { FiBell, FiCheck, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import API_BASE_URL from "../../config/api";

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "warning" | "success" | "error";
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/notifications`, { params: { status: true } });
        if (response.data) {
          const transformedNotifications: Notification[] = response.data.map((n: any) => ({
            id: n.id,
            title: n.title,
            message: n.message,
            time: new Date(n.createdAt).toLocaleString(),
            read: n.read || false,
            type: n.type || "info",
          }));
          setNotifications(transformedNotifications);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getTypeColor = (type: string) => {
    switch (type) {
      case "info":
        return "bg-blue-100 text-blue-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "success":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
          <p className="text-gray-600">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1ecab8] mx-auto mb-4"></div>
          Loading notifications...
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="space-y-4">
            {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border-l-4 ${
                !notification.read ? "bg-gray-50 border-[#1ecab8]" : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FiBell className="text-[#1ecab8]" />
                    <h3 className={`font-medium ${!notification.read ? "font-bold" : ""} text-gray-900`}>
                      {notification.title}
                    </h3>
                    <span className={`px-2 py-1 rounded text-xs ${getTypeColor(notification.type)}`}>
                      {notification.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{notification.message}</p>
                  <p className="text-xs text-gray-400">{notification.time}</p>
                </div>
                <div className="flex gap-2">
                  {!notification.read && (
                    <button className="p-2 text-[#1ecab8] hover:bg-[#1ecab8] hover:bg-opacity-10 rounded-lg">
                      <FiCheck size={16} />
                    </button>
                  )}
                  <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;



