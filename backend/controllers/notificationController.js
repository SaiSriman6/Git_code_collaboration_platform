import Notification from "../models/Notifications.js";

// GET USER NOTIFICATIONS
export const getNotifications =
  async (req, res) => {

    try {

      const notifications =
        await Notification.find({

          receiver: req.user.userId

        })
        .populate(
          "sender",
          "username profileImage"
        )
        .sort({
          createdAt: -1
        });

      res.status(200).json({

        success: true,

        notifications

      });

    } catch (err) {

      console.log(err);

      res.status(500).json({

        success: false,

        message: err.message

      });

    }

};


// MARK SINGLE NOTIFICATION AS READ
export const markAsRead =
  async (req, res) => {

    try {

      const notification =
        await Notification.findByIdAndUpdate(

          req.params.id,

          {
            isRead: true
          },

          {
            new: true
          }

        );

      res.status(200).json({

        success: true,

        notification

      });

    } catch (err) {

      console.log(err);

      res.status(500).json({

        success: false,

        message: err.message

      });

    }

};