import {
  useContext,
  useState
} from "react";
import axios from "axios";
import {
  NotificationContext
} from "../context/NotificationContext";
const NotificationBell = () => {
  const {
    notifications,
    setNotifications
  } = useContext(
    NotificationContext
  );
  const [open, setOpen] =
    useState(false);
  // =========================
  // UNREAD COUNT
  // =========================
  const unreadCount =
    notifications.filter(
      (item) => !item.isRead
    ).length;
  // =========================
  // MARK AS READ
  // =========================
  const markAsRead =
    async (id) => {
      try {
        await axios.put(
          `http://localhost:2929/api/notifications/${id}/read`,
          {},
          {
            withCredentials: true
          }
        );
        setNotifications((prev) =>
          prev.map((item) =>
            item._id === id
              ? {
                  ...item,
                  isRead: true
                }
              : item
          )
        );
      } catch (err) {
        console.log(err);
      }
    };
  return (
    <div
      className="
        relative
      "
    >
      {/* =========================
          BELL BUTTON
      ========================== */}
      <button
        onClick={() =>
          setOpen(!open)
        }
        className="
          relative
          text-2xl
        "
      >
        🔔
        {
          unreadCount > 0 && (
            <span
              className="
                absolute
                -top-2
                -right-2
                bg-red-500
                text-white
                text-xs
                rounded-full
                px-1.5
                py-0.5
                font-semibold
              "
            >
              {unreadCount}
            </span>
          )
        }
      </button>
      {/* =========================
          DROPDOWN
      ========================== */}
      {
        open && (
          <div
            className="
              absolute
              right-0
              mt-3
              w-80
              bg-white
              shadow-xl
              rounded-xl
              border
              z-50
              max-h-96
              overflow-y-auto
            "
          >
            {/* HEADER */}

            <div
              className="
                p-4
                border-b
                font-semibold
                text-gray-800
                sticky
                top-0
                bg-white
              "
            >
              Notifications
            </div>
            {/* EMPTY STATE */}
            {
              notifications.length === 0 ? (
                <p
                  className="
                    p-4
                    text-gray-500
                    text-sm
                    text-center
                  "
                >
                  No notifications
                </p>
              ) : (
                notifications.map(
                  (item) => (
                    <div
                      key={item._id}
                      onClick={() =>
                        markAsRead(
                          item._id
                        )
                      }
                      className={`
                        p-4
                        border-b
                        cursor-pointer
                        transition-all
                        duration-200
                        ${
                          item.isRead
                            ? `
                                bg-white
                                hover:bg-gray-50
                                opacity-80
                              `
                            : `
                                bg-blue-50
                                border-l-4
                                border-blue-500
                                shadow-sm
                                hover:bg-blue-100
                              `
                        }
                      `}
                    >
                      {/* MESSAGE */}
                      <p
                        className={`
                          text-sm
                          ${
                            item.isRead
                              ? `
                                  text-gray-600
                                `
                              : `
                                  text-gray-900
                                  font-semibold
                                `
                          }
                        `}
                      >
                        {item.message}
                      </p>
                      {/* TIME */}
                      <span
                        className="
                          text-xs
                          text-gray-500
                          mt-2
                          block
                        "
                      >
                        {
                          new Date(
                            item.createdAt
                          ).toLocaleString()
                        }
                      </span>
                    </div>
                 )
                )
              )
            }
          </div>
        )
      }
    </div>
  );
};
export default NotificationBell;