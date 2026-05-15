import Notification from "../models/Notifications.js";


// PERSONAL NOTIFICATION
export const sendNotification = async (
  io,
  {
    receiver,
    sender,
    type,
    message,
    repoId = null,
    data = {}
  }
) => {

  try {

    // SAVE IN DATABASE
    const notification =
      await Notification.create({

        receiver,

        sender,

        type,

        message,

        repoId

      });

    // POPULATE SENDER DETAILS
    const populatedNotification =
      await Notification.findById(
        notification._id
      ).populate(
        "sender",
        "username profileImage"
      );

    // DEBUG
    console.log(
      "Sending personal notification:",
      {
        room: receiver,
        type,
        message
      }
    );
    console.log(
    "EMITTING TO ROOM:",
    receiver.toString()
   );

    // REALTIME SOCKET EMIT
    io.to(receiver.toString()).emit(
      "newNotification",
      populatedNotification
    );

    return populatedNotification;

  } catch (err) {

    console.error(
      "Personal notification error:",
      err
    );

  }

};


// REPOSITORY NOTIFICATION
export const sendRepoNotification = async (
  io,
  {
    users = [],
    sender,
    repoId,
    type,
    message,
    data = {}
  }
) => {

  try {

    // SAVE NOTIFICATIONS FOR ALL USERS
    const notifications =
      await Promise.all(

        users.map(async (userId) => {

          const notification =
            await Notification.create({

              receiver: userId,

              sender,

              repoId,

              type,

              message

            });

          return await Notification
            .findById(notification._id)
            .populate(
              "sender",
              "username profileImage"
            );

        })

      );

    // DEBUG
    console.log(
      "Sending repo notification:",
      {
        room: repoId,
        type,
        message
      }
    );

    // REALTIME REPO EMIT
    io.to(repoId.toString()).emit(
      type,
      {
        message,
        repoId,
        sender,
        data
      }
    );

    return notifications;

  } catch (err) {

    console.error(
      "Repo notification error:",
      err
    );

  }

};