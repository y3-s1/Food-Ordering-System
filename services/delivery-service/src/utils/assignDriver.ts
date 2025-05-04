import DeliveryModel, { IDelivery } from '../models/Delivery';
import DriverStatus from '../models/DriverStatus';

function getDistanceInKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function assignDriverToDelivery(delivery: IDelivery): Promise<void> {
  if (!delivery.resLocation) {
    console.warn('Delivery missing restaurant location. Cannot auto-assign.');
    return;
  }

  const availableDrivers = await DriverStatus.find({
    isAvailable: true,
    currentLoad: { $lt: 3 },
  });

  if (availableDrivers.length === 0) {
    console.warn(`No available drivers for delivery ${delivery._id}. Will retry later.`);
    return;
  }

  const scoredDrivers = availableDrivers.map(driver => {
    const distance = getDistanceInKm(
      driver.currentLocation.lat,
      driver.currentLocation.lng,
      delivery.resLocation.lat,
      delivery.resLocation.lng
    );
    const score = driver.currentLoad + distance;
    return { driver, score };
  });

  scoredDrivers.sort((a, b) => a.score - b.score);
  const bestDriver = scoredDrivers[0].driver;

  delivery.driverId = bestDriver.userId;
  delivery.status = 'ASSIGNED';
  await delivery.save();

  bestDriver.currentLoad += 1;
  await bestDriver.save();

  console.log(`Assigned driver ${bestDriver.userId} to delivery ${delivery._id}`);
}
