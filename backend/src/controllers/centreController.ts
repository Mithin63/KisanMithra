import { Request, Response } from 'express';
import { mockStore } from '../store/mockStore';
import { smartQueueService } from '../services/smartQueueService';

export const getAllCentres = (req: Request, res: Response) => {
  const district = req.query.district as string;
  let centresList = mockStore.centres;

  if (district) {
    centresList = centresList.filter(c => c.district.toLowerCase() === district.toLowerCase());
  }

  const enrichedCentres = centresList.map(centre => {
    const centreBookings = mockStore.bookings.filter(b => b.centre_id === centre.id);
    const waitingQueue = centreBookings.filter(b => b.status === 'WAITING' || b.status === 'ARRIVED');
    const load = smartQueueService.calculateCentreLoad(centreBookings.length, centre.daily_capacity);

    return {
      ...centre,
      booked_slots: centreBookings.length,
      available_slots: Math.max(0, centre.daily_capacity - centreBookings.length),
      current_queue: waitingQueue.length,
      utilization_percent: load.utilization,
      status: load.status
    };
  });

  return res.json({ success: true, centres: enrichedCentres });
};

export const getCentreById = (req: Request, res: Response) => {
  const centreId = parseInt(req.params.id);
  const centre = mockStore.centres.find(c => c.id === centreId);

  if (!centre) {
    return res.status(404).json({ success: false, message: 'Centre not found.' });
  }

  const bookings = mockStore.bookings.filter(b => b.centre_id === centreId);
  const waitingQueue = bookings.filter(b => b.status === 'WAITING' || b.status === 'ARRIVED');
  const load = smartQueueService.calculateCentreLoad(bookings.length, centre.daily_capacity);

  return res.json({
    success: true,
    centre: {
      ...centre,
      booked_slots: bookings.length,
      available_slots: Math.max(0, centre.daily_capacity - bookings.length),
      current_queue: waitingQueue.length,
      utilization_percent: load.utilization,
      status: load.status
    }
  });
};

export const getCentreAvailabilityAndRecommendation = (req: Request, res: Response) => {
  const farmerDistrict = (req.query.district as string) || 'Guntur';
  const cropId = parseInt(req.query.cropId as string) || 1;

  const centresWithStats = mockStore.centres.map(centre => {
    const b = mockStore.bookings.filter(bk => bk.centre_id === centre.id);
    const waiting = b.filter(bk => bk.status === 'WAITING' || bk.status === 'ARRIVED');
    return {
      ...centre,
      booked_slots: b.length,
      current_queue: waiting.length
    };
  });

  const recommendations = smartQueueService.recommendCentre(farmerDistrict, centresWithStats);

  return res.json({
    success: true,
    recommendations
  });
};
