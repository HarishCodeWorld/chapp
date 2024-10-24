import { useEffect } from "react";

export const useNotification = () => {
  const showNotification = (title, options) => {
    console.log(typeof window !== "undefined" && "Notification" in window);
    if (typeof window !== "undefined" && "Notification" in window) {
      console.log("inside....", { Notification });
      if (Notification.permission === "granted") {
        new Notification(title, options);
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification(title, options);
          }
        });
      }
    } else {
      console.log("Notifications are not supported in this environment.");
    }
  };

  useEffect(() => {
    console.log("here", { window });
    if (typeof window !== "undefined" && "Notification" in window) {
      // console.log({Notification})
      // if (Notification.permission === "default") {
      //   Notification.requestPermission();
      // }
      Notification.requestPermission();
    }
  }, []);

  return { showNotification };
};
