import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { notificationService } from "../../services/notificationService";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import Button from "../ui/Button";

const NotificationBell = () => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }

    const data = await notificationService.getNotifications();
    setNotifications(data.notifications);
    setUnreadCount(data.unreadCount);
  }, [isAuthenticated]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (!isAuthenticated) {
      return undefined;
    }

    const stream = notificationService.createStream();
    if (!stream) {
      return undefined;
    }

    stream.addEventListener("notification", (event) => {
      const notification = JSON.parse(event.data);
      setNotifications((current) => [notification, ...current].slice(0, 50));
      setUnreadCount((current) => current + 1);
      showToast({ type: "info", title: notification.title, message: notification.body });
    });

    return () => stream.close();
  }, [isAuthenticated, showToast]);

  const markAllAsRead = async () => {
    const data = await notificationService.markAllAsRead();
    setNotifications(data.notifications);
    setUnreadCount(data.unreadCount);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative">
      <Button variant="secondary" size="sm" onClick={() => setIsOpen((current) => !current)}>
        Notif {unreadCount ? `(${unreadCount})` : ""}
      </Button>
      {isOpen ? (
        <div className="absolute right-0 mt-3 w-80 rounded-3xl border border-slate-100 bg-white p-3 shadow-2xl">
          <div className="flex items-center justify-between gap-3 px-2 py-1">
            <p className="font-black text-slate-950">Notification</p>
            <button className="text-xs font-bold text-emerald-700" onClick={markAllAsRead}>
              Tandai dibaca
            </button>
          </div>
          <div className="mt-2 grid max-h-96 gap-2 overflow-y-auto">
            {notifications.length ? (
              notifications.map((notification) => (
                <Link
                  key={notification.id}
                  to={notification.actionUrl || "/dashboard"}
                  className="rounded-2xl bg-slate-50 p-3 text-sm transition hover:bg-emerald-50"
                  onClick={() => setIsOpen(false)}
                >
                  <p className="font-black text-slate-950">{notification.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">{notification.body}</p>
                </Link>
              ))
            ) : (
              <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">Belum ada notifikasi.</p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default NotificationBell;
