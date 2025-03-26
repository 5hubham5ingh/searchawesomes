import { createContext } from "preact";
import { useContext, useState } from "preact/hooks";

export enum NotificationType {
  Info,
  Error,
  Warning,
  Log,
}

interface INotification {
  message: string;
  type: NotificationType;
}

interface INotificationContext {
  notifications: INotification[];
  notify: (message: string, type: NotificationType) => void;
}

export const NotificationContext = createContext<INotificationContext>({
  notifications: [],
  notify: () => {},
});

export function NotificationProvider(
  { children }: { children: preact.ComponentChildren },
) {
  const [queue, setQueue] = useState<INotification[]>([]);

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

export function useNotification() {
  return useContext(NotificationContext);
}

export function Notification() {
  const { notifications } = useNotification();

  const notificationsJSX = notifications.map((notification, index) => (
    <div key={index} className="notification">
      <b>{NotificationType[notification.type]}:</b> {notification.message}
    </div>
  ));

  return <div id="notifications">{notificationsJSX}</div>;
}
