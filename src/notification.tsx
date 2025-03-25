import { createContext } from "preact";
import { useContext, useState } from "preact/hooks";

export enum NotificationType {
  Info,
  Error,
  Warning,
  Log,
}

// Define the shape of the notification
interface Notification {
  message: string;
  type: NotificationType;
}

// Define the context type
interface NotificationContextType {
  notifications: Notification[];
  notify: (message: string, type: NotificationType) => void;
}

// Create context with a default value that matches the type
export const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  notify: () => {},
});

// Provider component
export function NotificationProvider(
  { children }: { children: preact.ComponentChildren },
) {
  const [queue, setQueue] = useState<Notification[]>([]);

  const addNotification = (message: string, type: NotificationType) => {
    setQueue((prev) => [...prev, { message, type }]);

    setTimeout(() => {
      setQueue((prev) => prev.slice(1));
    }, 5000);
  };

  return (
    <NotificationContext.Provider
      value={{ notifications: queue, notify: addNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

// Custom hook for using notifications
export function useNotification() {
  return useContext(NotificationContext);
}

// Notification display component
export function Notification() {
  const { notifications } = useNotification();

  const notificationsJSX = notifications.map((notification, index) => (
    <div key={index} className="notification">
      <b>{NotificationType[notification.type]}:</b> {notification.message}
    </div>
  ));

  return <div id="notifications">{notificationsJSX}</div>;
}
