export const addHoursToDate = (date: Date | string, hours: number): Date => {
    const result = new Date(date);
    result.setTime(result.getTime() + hours * 3600000);
    return result;
  };