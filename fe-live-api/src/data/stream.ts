export const modalTexts = {
  stream: {
    successStart: {
      title: 'Go Live: Live Started Successfully!',
      description:
        "You're live now! Engage with viewers and share your passion. Keep an eye on chat and stats—you're doing great!",
    },
    successEnd: {
      title: 'Live Ended Successfully!',
      description: 'You have ended live stream successfully.',
    },
    // ended because of connection lost or end by admin (trigger when stream end ws event)
    forceEnd: {
      title: 'Live Ended!',
      description: 'Live has been ended.',
    },
    confirmToEnd: {
      title: 'End Live Stream: Are You Sure?',
      description:
        "Ending your live stream will immediately stop your broadcast, and your viewer count and live status will reset. Make sure you're ready to wrap up before confirming.",
    },
    successUpdate: {
      title: 'Stream Details Updated Successfully!',
      description:
        "You have successfully updated your content's details information.",
    },
  },
};
