import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import axios from "axios";

import socket from "../socket";

import { useAuth }
from "../store/useAuth";

export const NotificationContext =
  createContext();

export const NotificationProvider =
({
  children
}) => {

  const [
    notifications,
    setNotifications
  ] = useState([]);

  // AUTH USER FROM ZUSTAND
  const { currentUser } =
    useAuth();

  // =========================
  // FETCH OLD NOTIFICATIONS
  // =========================

  const fetchNotifications =
    async () => {

      try {

        const res =
          await axios.get(

            "http://localhost:2929/api/notifications",

            {
              withCredentials: true
            }

          );

        setNotifications(
          res.data.notifications
        );

        console.log(
          "Fetched notifications:",
          res.data.notifications
        );

      } catch (err) {

        console.log(
          "Fetch notification error:",
          err
        );

      }

    };

  // =========================
  // SOCKET + REALTIME
  // =========================

  useEffect(() => {

    console.log(
      "Notification useEffect running"
    );

    if (!currentUser?._id) {

      console.log(
        "No current user"
      );

      return;

    }

    console.log(
      "Current user:",
      currentUser
    );

    // FETCH SAVED NOTIFICATIONS
    fetchNotifications();

    console.log(
  "Emitting joinUserRoom:",
  currentUser._id
);

    // JOIN PERSONAL ROOM
    socket.emit(
      "joinUserRoom",
      currentUser._id
    );

    console.log(
      "Joined user room:",
      currentUser._id
    );

    // REALTIME LISTENER
    socket.on(
      "newNotification",
      (notification) => {

        console.log(
          "Realtime notification:",
          notification
        );

        setNotifications((prev) => [

          notification,

          ...prev

        ]);

      }
    );

    return () => {

      socket.off(
        "newNotification"
      );

    };

  }, [currentUser]);

  return (

    <NotificationContext.Provider
      value={{
        notifications,
        setNotifications
      }}
    >

      {children}

    </NotificationContext.Provider>

  );

};


// CUSTOM HOOK
export const useNotifications =
  () => useContext(
    NotificationContext
  );