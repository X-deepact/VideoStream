export const within72Hours = (theDate: Date) => {
  const currentDay = new Date();
  currentDay.setDate(currentDay.getDate() - 1)
  const threeDaysAfter = new Date();
  threeDaysAfter.setDate(threeDaysAfter.getDate() + 3);

  return theDate < currentDay || theDate > threeDaysAfter;
};
